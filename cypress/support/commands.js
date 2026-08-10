Cypress.Commands.add('getByQa', (valor, options = {}) => {
  return cy.get(`[data-qa="${valor}"]`, options);
});

Cypress.Commands.add('getById', (id, options = {}) => {
  return cy.get(`#${id}`, options);
});

Cypress.Commands.add('getByHref', (href, options = {}) => {
  return cy.get(`[href="${href}"]`, options);
});
