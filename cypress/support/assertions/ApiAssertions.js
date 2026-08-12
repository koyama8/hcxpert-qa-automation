const Ajv = require('ajv');
const trelloActionSchema = require('../../fixtures/schemas/trelloActionSchema.json');
const accountCreatedSchema = require('../../fixtures/schemas/accountCreatedSchema.json');
const accountDuplicateErrorSchema = require('../../fixtures/schemas/accountDuplicateErrorSchema.json');
const accountDeletedSchema = require('../../fixtures/schemas/accountDeletedSchema.json');

const ajv = new Ajv({ allErrors: true });

class ApiAssertions {
  validators = {
    trelloAction: ajv.compile(trelloActionSchema),
    accountCreated: ajv.compile(accountCreatedSchema),
    accountDuplicate: ajv.compile(accountDuplicateErrorSchema),
    accountDeleted: ajv.compile(accountDeletedSchema),
  };

  validarTransporte(response, { contentTypeJson = false } = {}) {
    expect(response.status, 'status HTTP').to.equal(200);

    const contentType = response.headers['content-type'];
    expect(contentType, 'header Content-Type').to.be.a('string').and.not.be.empty;

    if (contentTypeJson) {
      expect(contentType.toLowerCase(), 'Content-Type JSON')
        .to.include('application/json');
    } else if (!contentType.toLowerCase().includes('application/json')) {
      cy.log(`Aviso: API retornou JSON com Content-Type ${contentType}`);
    }
  }

  validarContrato(validatorName, body) {
    const validator = this.validators[validatorName];
    const valid = validator(body);

    expect(valid, JSON.stringify(validator.errors, null, 2)).to.be.true;
  }

  validarTrello(response, idEsperado) {
    this.validarTransporte(response, { contentTypeJson: true });
    this.validarContrato('trelloAction', response.body);
    expect(response.body.id, 'identificador da acao').to.equal(idEsperado);
    expect(response.body.data.list.name, 'nome da lista')
      .to.be.a('string').and.not.be.empty;

    cy.log(`Nome da lista: ${response.body.data.list.name}`);
  }

  validarContaCriada(response) {
    this.validarTransporte(response);
    this.validarContrato('accountCreated', response.body);
    expect(response.duration, 'tempo de resposta').to.be.lessThan(2000);

    cy.log(`Regra de negocio: ${response.body.message}`);
    cy.log(`Tempo de resposta: ${response.duration} ms`);
  }

  validarContaDuplicada(primeiraResposta, respostaDuplicada) {
    this.validarContaCriada(primeiraResposta);
    this.validarTransporte(respostaDuplicada);
    this.validarContrato('accountDuplicate', respostaDuplicada.body);
    expect(respostaDuplicada.duration, 'tempo de resposta').to.be.lessThan(2000);

    cy.log(`Regra de negocio: ${respostaDuplicada.body.message}`);
    cy.log(`Tempo de resposta: ${respostaDuplicada.duration} ms`);
  }

  validarContaRemovida(response) {
    this.validarTransporte(response);
    this.validarContrato('accountDeleted', response.body);
  }
}

module.exports = new ApiAssertions();
