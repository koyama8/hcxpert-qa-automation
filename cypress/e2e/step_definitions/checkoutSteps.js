const {
  Given,
  When,
  Then,
} = require('@badeball/cypress-cucumber-preprocessor');

const checkoutPage = require('../../support/page_objects/CheckoutPage');

const dadosPagamento = {
  nome: 'Teste QA',
  numero: '4111111111111111',
  cvc: '123',
  mes: '12',
  ano: '2030',
};

Given('que o usuário está autenticado e possui um produto no carrinho', () => {
  cy.env(['email', 'senha']).then(({ email, senha }) => {
    checkoutPage.prepararCarrinho(email, senha);
  });
});

When('o usuário revisar o endereço e prosseguir para o pagamento', () => {
  checkoutPage.acessarCheckout();
  checkoutPage.prosseguirParaPagamento();
});

When('informar dados fictícios válidos e confirmar o pedido', () => {
  checkoutPage.preencherPagamento(dadosPagamento);
  checkoutPage.confirmarPedido();
});

Then('uma mensagem de pedido realizado com sucesso deverá ser apresentada', () => {
  checkoutPage.validarPedidoRealizado();
});

Given('que o usuário está autenticado e está na página de pagamento', () => {
  cy.env(['email', 'senha']).then(({ email, senha }) => {
    checkoutPage.prepararPaginaPagamento(email, senha);
  });
});

When('o usuário deixar campos obrigatórios do pagamento sem preenchimento',() => {
    checkoutPage.deixarPagamentoIncompleto();
  },
);

When('tentar confirmar o pedido', () => {
  checkoutPage.confirmarPedido();
});

Then('o pedido não deverá ser finalizado e o usuário deverá permanecer na página de pagamento',() => {
    checkoutPage.validarFormularioIncompleto();
  },
);

When('o usuário informar dados fictícios válidos para o pagamento', () => {
  checkoutPage.preencherPagamento(dadosPagamento);
});

When('a conectividade for interrompida durante a confirmação do pedido', () => {
  checkoutPage.simularPerdaDeConectividade();
});

Then('o pedido não deverá ser confirmado e nenhuma mensagem de sucesso deverá ser apresentada',() => {
    checkoutPage.validarPedidoNaoConfirmado();
  },
);
