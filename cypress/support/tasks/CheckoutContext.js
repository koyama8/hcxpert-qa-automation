const cartContext = require('./CartContext');
const checkoutPage = require('../page_objects/CheckoutPage');
const loginPage = require('../page_objects/LoginPage');
const navigationContext = require('./NavigationContext');
const checkoutData = require('../../fixtures/checkout.json');
const loginAssertions = require('../assertions/LoginAssertions');
const checkoutAssertions = require('../assertions/CheckoutAssertions');

class CheckoutContext {
  autenticarUsuario() {
    cy.env(['email', 'senha']).then(({ email, senha }) => {
      navigationContext.abrirAutenticacao();
      loginPage.preencherEmail(email);
      loginPage.preencherSenha(senha);
      loginPage.solicitarLogin();
      loginAssertions.validarUsuarioAutenticado();
    });
  }

  prepararCarrinhoAutenticado() {
    this.autenticarUsuario();
    cartContext.prepararComUmProduto();
  }

  prepararPaginaPagamento() {
    this.prepararCarrinhoAutenticado();
    checkoutPage.acessarCheckout();
    checkoutAssertions.validarPaginaCheckout();
    checkoutPage.prosseguirParaPagamento(checkoutData.comentarioPedido);
    checkoutAssertions.validarPaginaPagamento();
  }
}

module.exports = new CheckoutContext();
