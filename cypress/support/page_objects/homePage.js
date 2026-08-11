const selectors = require('../config/selectors');

class HomePage {
  elements = {
    body: () => cy.getByTag(selectors.common.body),
    logo: () => cy.getByHref('/').find(selectors.home.logo),
  };
}

module.exports = new HomePage();
