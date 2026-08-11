const cartContext = require('./CartContext');
const checkoutPage = require('../page_objects/CheckoutPage');
const loginPage = require('../page_objects/LoginPage');
const navigationContext = require('./NavigationContext');
const checkoutData = require('../../fixtures/checkout.json');
const produtos = require('../../fixtures/products.json');
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
    cartContext.prepararCarrinhoVazio();
    cartContext.prepararComUmProduto();
  }

  prepararPaginaPagamento() {
    this.prepararCarrinhoAutenticado();
    checkoutPage.acessarCheckout();
    checkoutAssertions.validarEnderecoEResumo(
      produtos.principal,
      produtos.quantidades.padrao,
    );
    checkoutPage.prosseguirParaPagamento(checkoutData.comentarioPedido);
    checkoutAssertions.validarPaginaPagamento();
  }
}

module.exports = new CheckoutContext();
