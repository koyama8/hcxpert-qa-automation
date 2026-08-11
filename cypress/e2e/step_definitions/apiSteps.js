const {
  Given,
  When,
  Then,
} = require('@badeball/cypress-cucumber-preprocessor')

const Ajv = require('ajv')
const trelloActionSchema = require('../../fixtures/schemas/trelloActionSchema.json')
const endpoints = require('../../support/config/endpoints')
const apiContext = require('../../support/tasks/ApiContext')
const apiTestData = require('../../fixtures/api_test_data.json')
const userFactory = require('../../support/data/UserFactory')

const ajv = new Ajv({ allErrors: true })
const validarContratoTrello = ajv.compile(trelloActionSchema)

let respostaApi
let respostaCriacaoConta
let primeiraRespostaDuplicidade
let segundaRespostaDuplicidade
const obterCorpoResposta = (response) =>
  typeof response.body === 'string' ? JSON.parse(response.body) : response.body

Given('que o endpoint de criação de conta está configurado', () => {
  apiContext.validarEndpointConfigurado(endpoints.createAccount, 'criação de conta')
})

Given('que o endpoint de ações do Trello está configurado', () => {
  apiContext.validarEndpointConfigurado(endpoints.trelloActions, 'ações do Trello')
})

When('o usuário consultar a ação {string}', (idAcao) => {
  cy.api({
    method: 'GET',
    url: `${endpoints.trelloActions}/${idAcao}`,
    failOnStatusCode: false,
  }).then((response) => {
    respostaApi = response
  })
})

When('o usuário enviar os dados válidos para criação da conta', () => {
  cy.fixture('payload_account').then(({ dadosConta }) => {
    const { prefixoContaValida, dominio } = apiTestData.email
    const dadosContaValida = {
      ...dadosConta,
      email: userFactory.gerarEmailUnico(prefixoContaValida, dominio),
      password: userFactory.gerarSenhaTemporaria(),
    }

    cy.api({
      method: 'POST',
      url: endpoints.createAccount,
      form: true,
      body: dadosContaValida,
      failOnStatusCode: false,
    }).then((response) => {
      respostaCriacaoConta = response
    })
  })
})

When('o usuário tentar criar duas contas com o mesmo e-mail', () => {
  cy.fixture('payload_account').then(({ dadosConta }) => {
    const { prefixoContaDuplicada, dominio } = apiTestData.email
    const dadosDuplicados = {
      ...dadosConta,
      email: userFactory.gerarEmailUnico(prefixoContaDuplicada, dominio),
      password: userFactory.gerarSenhaTemporaria(),
    }

    cy.api({
      method: 'POST',
      url: endpoints.createAccount,
      form: true,
      body: dadosDuplicados,
      failOnStatusCode: false,
    }).then((response) => {
      primeiraRespostaDuplicidade = response

      cy.api({
        method: 'POST',
        url: endpoints.createAccount,
        form: true,
        body: dadosDuplicados,
        failOnStatusCode: false,
      }).then((duplicateResponse) => {
        segundaRespostaDuplicidade = duplicateResponse
      })
    })
  })
})

Then('a resposta deverá possuir status 200, respeitar o contrato JSON e registrar o nome da lista como evidência',() => {
    expect(respostaApi.status).to.eq(200)

    const contratoValido = validarContratoTrello(respostaApi.body)

    expect(
      contratoValido,
      JSON.stringify(validarContratoTrello.errors, null, 2),
    ).to.be.true

    expect(respostaApi.body).to.have.property('id')
    expect(respostaApi.body).to.have.property('data')
    expect(respostaApi.body.data).to.have.property('list')
    expect(respostaApi.body.data.list).to.have.property('name')
    expect(respostaApi.body.data.list.name).to.be.a('string').and.not.be.empty

    cy.log(`Nome da lista: ${respostaApi.body.data.list.name}`)
  },
)

Then('a API deverá confirmar a criação da conta e responder em menos de 2000 milissegundos', () => {
  const corpoResposta = obterCorpoResposta(respostaCriacaoConta)

  expect(respostaCriacaoConta.status).to.eq(200)
  expect(corpoResposta.responseCode).to.eq(201)
  expect(corpoResposta.message).to.eq('User created!')
  expect(respostaCriacaoConta.duration).to.be.lessThan(2000)

  cy.log(`Regra de negócio: ${corpoResposta.message}`)
  cy.log(`Tempo de resposta: ${respostaCriacaoConta.duration} ms`)
})

Then('a API deverá rejeitar a duplicidade com uma mensagem de regra de negócio', () => {
  const primeiraResposta = obterCorpoResposta(primeiraRespostaDuplicidade)
  const respostaDuplicada = obterCorpoResposta(segundaRespostaDuplicidade)

  expect(primeiraRespostaDuplicidade.status).to.eq(200)
  expect(primeiraResposta.responseCode).to.eq(201)
  expect(segundaRespostaDuplicidade.status).to.eq(200)
  expect(respostaDuplicada.responseCode).to.eq(400)
  expect(respostaDuplicada.message).to.eq('Email already exists!')
  expect(segundaRespostaDuplicidade.duration).to.be.lessThan(2000)

  cy.log(`Regra de negócio: ${respostaDuplicada.message}`)
  cy.log(`Tempo de resposta: ${segundaRespostaDuplicidade.duration} ms`)
})
