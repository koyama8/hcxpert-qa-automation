const {
  After,
  Before,
  Given,
  When,
  Then,
} = require('@badeball/cypress-cucumber-preprocessor');

const apiContext = require('../../support/tasks/ApiContext');
const apiAssertions = require('../../support/assertions/ApiAssertions');

Before({ tags: '@api' }, () => {
  apiContext.iniciarCenario();
});

After({ tags: '@api' }, () => apiContext.limparContasCriadas());

Given('que o endpoint de criação de conta está configurado', () => {
  apiContext.validarEndpointCriacaoConta();
});

Given('que o endpoint de ações do Trello está configurado', () => {
  apiContext.validarEndpointTrello();
});

When('o usuário consultar a ação {string}', (idAcao) => {
  apiContext.consultarAcao(idAcao);
});

When('o usuário enviar os dados válidos para criação da conta', () => {
  apiContext.criarContaValida();
});

When('o usuário tentar criar duas contas com o mesmo e-mail', () => {
  apiContext.criarContaDuplicada();
});

Then('a resposta deverá possuir status 200, respeitar o contrato JSON e registrar o nome da lista como evidência', () => {
  apiAssertions.validarTrello(
    apiContext.respostas.trello,
    apiContext.idAcaoConsultada,
  );
});

Then('a API deverá confirmar a criação da conta e responder em menos de 2000 milissegundos', () => {
  apiAssertions.validarContaCriada(apiContext.respostas.criacao);
});

Then('a API deverá rejeitar a duplicidade com uma mensagem de regra de negócio', () => {
  apiAssertions.validarContaDuplicada(
    apiContext.respostas.primeiraDuplicidade,
    apiContext.respostas.segundaDuplicidade,
  );
});
