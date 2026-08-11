const selectors = require('../config/selectors');

class CheckoutPage {
  elements = {
    botaoCheckout: () => cy.getById('cart_items')
      .find(selectors.checkout.proceedButton),
    enderecoEntrega: () => cy.getById('address_delivery'),
    detalhesEnderecoEntrega: () => cy.getById('address_delivery')
      .find(selectors.checkout.addressDetails),
    enderecoCobranca: () => cy.getById('address_invoice'),
    detalhesEnderecoCobranca: () => cy.getById('address_invoice')
      .find(selectors.checkout.addressDetails),
    resumoPedido: () => cy.getById('cart_info'),
    produtosResumo: () => cy.getById('cart_info').find(selectors.cart.rows),
    nomeProdutoResumo: () => cy.getById('cart_info')
      .find(selectors.cart.rows)
      .find(selectors.cart.productName),
    precoProdutoResumo: () => cy.getById('cart_info')
      .find(selectors.cart.rows)
      .find(selectors.cart.price),
    quantidadeProdutoResumo: () => cy.getById('cart_info')
      .find(selectors.cart.rows)
      .find(selectors.cart.quantity),
    totalProdutoResumo: () => cy.getById('cart_info')
      .find(selectors.cart.rows)
      .find(selectors.cart.total),
    comentario: () => cy.getByAttribute('name', 'message'),
    botaoFazerPedido: () => cy.getByHref('/payment'),
    nomeCartao: () => cy.getByQa('name-on-card'),
    numeroCartao: () => cy.getByQa('card-number'),
    cvc: () => cy.getByQa('cvc'),
    mesExpiracao: () => cy.getByQa('expiry-month'),
    anoExpiracao: () => cy.getByQa('expiry-year'),
    botaoConfirmarPagamento: () => cy.getByQa('pay-button'),
    camposPagamentoInvalidos: () => cy.getByQa('pay-button')
      .closest('form')
      .find(':invalid'),
    pedidoRealizado: () => cy.getByQa('order-placed'),
    body: () => cy.getByTag(selectors.common.body),
  };

  acessarCheckout() {
    this.elements.botaoCheckout().click();
  }

  prosseguirParaPagamento(comentarioPedido) {
    this.elements.comentario().clear().type(comentarioPedido);
    this.elements.botaoFazerPedido().click();
  }

  preencherPagamento(dados) {
    this.elements.nomeCartao().clear().type(dados.nome);
    this.elements.numeroCartao().clear().type(dados.numero, { log: false });
    this.elements.cvc().clear().type(dados.cvc, { log: false });
    this.elements.mesExpiracao().clear().type(dados.mes);
    this.elements.anoExpiracao().clear().type(dados.ano);
  }

  deixarPagamentoIncompleto(dados) {
    this.elements.nomeCartao().clear().type(dados.nome);
    this.elements.numeroCartao().clear();
    this.elements.cvc().clear();
    this.elements.mesExpiracao().clear();
    this.elements.anoExpiracao().clear();
  }

  confirmarPedido() {
    this.elements.botaoConfirmarPagamento().click();
  }
}

module.exports = new CheckoutPage();
