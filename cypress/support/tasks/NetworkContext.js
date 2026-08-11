const checkoutPage = require('../page_objects/CheckoutPage');
const routes = require('../config/routes');

class NetworkContext {
  aliasConfirmacaoIndisponivel = 'confirmacaoPedidoIndisponivel';

  simularIndisponibilidadeNaConfirmacao() {
    cy.intercept(
      {
        method: 'POST',
        pathname: routes.payment,
      },
      {
        statusCode: 503,
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'retry-after': '60',
        },
        body: 'Payment service temporarily unavailable',
      },
    ).as(this.aliasConfirmacaoIndisponivel);

    checkoutPage.confirmarPedido();
  }
}

module.exports = new NetworkContext();
