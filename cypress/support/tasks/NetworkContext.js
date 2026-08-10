const checkoutPage = require('../page_objects/CheckoutPage');

class NetworkContext {
  interromperConfirmacaoDoPedido() {
    cy.window().then((janela) => {
      Object.defineProperty(janela.navigator, 'onLine', {
        configurable: true,
        value: false,
      });
      janela.dispatchEvent(new janela.Event('offline'));
    });

    checkoutPage.elements.botaoConfirmarPagamento().then(($botao) => {
      const formulario = $botao.closest('form')[0];
      formulario.addEventListener(
        'submit',
        (evento) => evento.preventDefault(),
        { once: true },
      );
    });

    checkoutPage.confirmarPedido();
  }
}

module.exports = new NetworkContext();
