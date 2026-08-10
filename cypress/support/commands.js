Cypress.Commands.add('getByQa', (valor, options = {}) => {
  return cy.getByAttribute('data-qa', valor, options);
});

Cypress.Commands.add('getById', (id, options = {}) => {
  return cy.get(`#${id}`, options);
});

Cypress.Commands.add('getByHref', (href, options = {}) => {
  return cy.getByAttribute('href', href, options);
});

Cypress.Commands.add('getByAttribute', (atributo, valor, options = {}) => {
  const seletor = valor === undefined
    ? `[${atributo}]`
    : `[${atributo}="${valor}"]`;

  return cy.get(seletor, options);
});

Cypress.Commands.add('getByTag', (tag, options = {}) => {
  return cy.get(tag, options);
});

Cypress.Commands.add('getVisibleByAttribute', (atributo, options = {}) => {
  return cy.get(`[${atributo}]:visible`, options);
});
