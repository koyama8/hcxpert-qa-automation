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

  abrirCarrinho() {
    cy.visit(routes.cart);
  }
}

module.exports = new NavigationContext();
