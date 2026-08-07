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
let endpointApi

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
