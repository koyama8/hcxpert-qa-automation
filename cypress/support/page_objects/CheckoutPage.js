class CheckoutPage {
  elements = {
    botaoCheckout: () => cy.getById('cart_items').find('a.check_out'),
    enderecoEntrega: () => cy.getById('address_delivery'),
    resumoPedido: () => cy.getById('cart_info'),
    comentario: () => cy.get('textarea[name="message"]'),
    botaoFazerPedido: () => cy.getByHref('/payment'),
    nomeCartao: () => cy.getByQa('name-on-card'),
    numeroCartao: () => cy.getByQa('card-number'),
    cvc: () => cy.getByQa('cvc'),
    mesExpiracao: () => cy.getByQa('expiry-month'),
    anoExpiracao: () => cy.getByQa('expiry-year'),
    botaoConfirmarPagamento: () => cy.getByQa('pay-button'),
    pedidoRealizado: () => cy.getByQa('order-placed'),
    body: () => cy.get('body'),
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
