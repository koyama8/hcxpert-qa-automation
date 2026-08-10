const {
  Given,
  When,
  Then,
} = require('@badeball/cypress-cucumber-preprocessor');

const checkoutPage = require('../../support/page_objects/CheckoutPage');
const checkoutContext = require('../../support/tasks/CheckoutContext');
const checkoutData = require('../../fixtures/checkout.json');
const checkoutAssertions = require('../../support/assertions/CheckoutAssertions');
const networkContext = require('../../support/tasks/NetworkContext');

Given('que o usuário está autenticado e possui um produto no carrinho', () => {
  checkoutContext.prepararCarrinhoAutenticado();
});

When('o usuário revisar o endereço e prosseguir para o pagamento', () => {
  checkoutPage.acessarCheckout();
  checkoutPage.prosseguirParaPagamento(checkoutData.comentarioPedido);
});

When('informar dados fictícios válidos e confirmar o pedido', () => {
  checkoutPage.preencherPagamento(checkoutData.pagamentoValido);
  checkoutPage.confirmarPedido();
});

Then('uma mensagem de pedido realizado com sucesso deverá ser apresentada', () => {
  checkoutAssertions.validarPedidoRealizado();
});

Given('que o usuário está autenticado e está na página de pagamento', () => {
  checkoutContext.prepararPaginaPagamento();
});

When('o usuário deixar campos obrigatórios do pagamento sem preenchimento',() => {
    checkoutPage.deixarPagamentoIncompleto(checkoutData.pagamentoIncompleto);
  },
);

When('tentar confirmar o pedido', () => {
  checkoutPage.confirmarPedido();
});

Then('o pedido não deverá ser finalizado e o usuário deverá permanecer na página de pagamento',() => {
    checkoutAssertions.validarPedidoNaoFinalizado();
  },
);

When('o usuário informar dados fictícios válidos para o pagamento', () => {
  checkoutPage.preencherPagamento(checkoutData.pagamentoValido);
});

When('a conectividade for interrompida durante a confirmação do pedido', () => {
  networkContext.interromperConfirmacaoDoPedido();
});

Then('o pedido não deverá ser confirmado e nenhuma mensagem de sucesso deverá ser apresentada',() => {
    checkoutAssertions.validarPedidoNaoConfirmado();
  },
);
