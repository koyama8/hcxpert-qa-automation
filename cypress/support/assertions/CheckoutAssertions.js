const checkoutPage = require('../page_objects/CheckoutPage');
const routes = require('../config/routes');
const uiMessages = require('../config/uiMessages');

class CheckoutAssertions {
  validarPaginaCheckout() {
    cy.url().should('include', routes.checkout);
    checkoutPage.elements.enderecoEntrega().should('be.visible');
    checkoutPage.elements.resumoPedido().should('be.visible');
  }

  validarPaginaPagamento() {
    cy.url().should('include', routes.payment);
    checkoutPage.elements.botaoConfirmarPagamento().should('be.visible');
  }

  validarPedidoRealizado() {
    cy.url().should('include', routes.paymentDone);
    checkoutPage.elements.pedidoRealizado().should('be.visible');
  }

  validarPedidoNaoFinalizado() {
    cy.url().should('include', routes.payment);
    checkoutPage.elements.pedidoRealizado().should('not.exist');
  }

  validarPedidoNaoConfirmado() {
    this.validarPedidoNaoFinalizado();
    checkoutPage.elements.body().should(
      'not.contain.text',
      uiMessages.checkout.pedidoConfirmado,
    );
  }
}

module.exports = new CheckoutAssertions();
