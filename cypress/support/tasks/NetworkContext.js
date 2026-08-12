const checkoutPage = require('../page_objects/CheckoutPage');
const routes = require('../config/routes');

class NetworkContext {
  aliasConfirmacaoIndisponivel = 'confirmacaoPedidoIndisponivel';
  aliasErroRedeConfirmacao = 'confirmacaoPedidoErroRede';

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

  simularPerdaConectividadeNaConfirmacao() {
    cy.intercept(
      {
        method: 'POST',
        pathname: routes.payment,
      },
      {
        forceNetworkError: true,
      },
    ).as(this.aliasErroRedeConfirmacao);

    checkoutPage.elements.botaoConfirmarPagamento().then(($botao) => {
      const formulario = $botao[0].form;
      const janela = formulario.ownerDocument.defaultView;
      const dadosFormulario = new janela.FormData(formulario);
      const corpo = new janela.URLSearchParams(dadosFormulario);

      return janela.fetch(formulario.action, {
        method: formulario.method.toUpperCase(),
        body: corpo,
      }).catch(() => undefined);
    });
  }
}

module.exports = new NetworkContext();
