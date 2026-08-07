const {
  Given,
  When,
  Then,
} = require('@badeball/cypress-cucumber-preprocessor')

const Ajv = require('ajv')
const trelloActionSchema = require('../../fixtures/schemas/trelloActionSchema.json')

const ajv = new Ajv({ allErrors: true })
const validarContratoTrello = ajv.compile(trelloActionSchema)

let respostaApi
let respostaCriacaoConta
let primeiraRespostaDuplicidade
let segundaRespostaDuplicidade
let endpointApi
let endpointCriacaoConta

const obterCorpoResposta = (response) =>
  typeof response.body === 'string' ? JSON.parse(response.body) : response.body

Given('que o endpoint de criação de conta está disponível', () => {
  endpointCriacaoConta = 'https://www.automationexercise.com/api/createAccount'
})

Given('que o endpoint de ações do Trello está disponível', () => {
  endpointApi = 'https://api.trello.com/1/actions'
})

When('o usuário consultar a ação {string}', (idAcao) => {
  cy.api({
    method: 'GET',
    url: `${endpointApi}/${idAcao}`,
    failOnStatusCode: false,
  }).then((response) => {
    respostaApi = response
  })
})

When('o usuário enviar os dados válidos para criação da conta', () => {
  cy.fixture('payload_account').then(({ dadosConta }) => {
    const dadosContaValida = {
      ...dadosConta,
      email: `usuario.teste.${Date.now()}@example.com`,
    }

    cy.api({
      method: 'POST',
      url: endpointCriacaoConta,
      form: true,
      body: dadosContaValida,
      failOnStatusCode: false,
    }).then((response) => {
      respostaCriacaoConta = response
      cy.log(`E-mail criado: ${dadosContaValida.email}`)
    })
  })
})

When('o usuário tentar criar duas contas com o mesmo e-mail', () => {
  cy.fixture('payload_account').then(({ dadosConta }) => {
    const dadosDuplicados = {
      ...dadosConta,
      email: `usuario.duplicado.${Date.now()}@example.com`,
    }

    cy.api({
      method: 'POST',
      url: endpointCriacaoConta,
      form: true,
      body: dadosDuplicados,
      failOnStatusCode: false,
    }).then((response) => {
      primeiraRespostaDuplicidade = response

      cy.api({
        method: 'POST',
        url: endpointCriacaoConta,
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
