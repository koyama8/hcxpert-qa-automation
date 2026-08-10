const routes = require('../config/routes');
const loginAssertions = require('../assertions/LoginAssertions');
const productsAssertions = require('../assertions/ProductsAssertions');

class NavigationContext {
  abrirAutenticacao() {
    cy.visit(routes.login);
    loginAssertions.validarPaginaCarregada();
  }

  abrirProdutos() {
    cy.visit(routes.products);
    productsAssertions.validarPaginaCarregada();
  }

  abrirDetalhesProduto(productId) {
    cy.visit(routes.productDetails(productId));
  }
}

module.exports = new NavigationContext();
