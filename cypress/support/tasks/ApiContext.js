const automationExerciseApi = require('../api/AutomationExerciseApi');
const trelloApi = require('../api/TrelloApi');
const endpoints = require('../config/endpoints');
const apiTestData = require('../../fixtures/api_test_data.json');
const userFactory = require('../data/UserFactory');
const apiAssertions = require('../assertions/ApiAssertions');

class ApiContext {
  iniciarCenario() {
    this.respostas = {};
    this.contasCriadas = [];
  }

  validarEndpointConfigurado(endpoint, nome) {
    expect(endpoint, `endpoint ${nome}`)
      .to.be.a('string')
      .and.match(/^https:\/\//);
  }

  validarEndpointTrello() {
    this.validarEndpointConfigurado(endpoints.trelloActions, 'acoes do Trello');
  }

  validarEndpointCriacaoConta() {
    this.validarEndpointConfigurado(endpoints.createAccount, 'criacao de conta');
    this.validarEndpointConfigurado(endpoints.deleteAccount, 'remocao de conta');
  }

  consultarAcao(idAcao) {
    this.idAcaoConsultada = idAcao;

    return trelloApi.consultarAcao(idAcao).then((response) => {
      this.respostas.trello = response;
    });
  }

  criarContaValida() {
    return this.criarDadosConta('prefixoContaValida').then((dadosConta) =>
      automationExerciseApi.criarConta(dadosConta).then((response) => {
        this.registrarContaCriada(dadosConta, response);
        this.respostas.criacao = response;
      }),
    );
  }

  criarContaDuplicada() {
    return this.criarDadosConta('prefixoContaDuplicada').then((dadosConta) =>
      automationExerciseApi.criarConta(dadosConta).then((firstResponse) => {
        this.registrarContaCriada(dadosConta, firstResponse);
        this.respostas.primeiraDuplicidade = firstResponse;

        return automationExerciseApi.criarConta(dadosConta)
          .then((duplicateResponse) => {
            this.respostas.segundaDuplicidade = duplicateResponse;
          });
      }),
    );
  }

  criarDadosConta(prefixKey) {
    return cy.fixture('payload_account').then(({ dadosConta }) => {
      const { dominio, [prefixKey]: prefixo } = apiTestData.email;

      return {
        ...dadosConta,
        email: userFactory.gerarEmailUnico(prefixo, dominio),
        password: userFactory.gerarSenhaTemporaria(),
      };
    });
  }

  registrarContaCriada(dadosConta, response) {
    if (response.body?.responseCode === 201) {
      this.contasCriadas.push({
        email: dadosConta.email,
        password: dadosConta.password,
      });
    }
  }

  limparContasCriadas() {
    const contas = [...(this.contasCriadas || [])];
    this.contasCriadas = [];

    return contas.reduce(
      (chain, conta) => chain.then(() =>
        automationExerciseApi.removerConta(conta).then((response) => {
          apiAssertions.validarContaRemovida(response);
        })),
      cy.wrap(null, { log: false }),
    );
  }
}

module.exports = new ApiContext();
