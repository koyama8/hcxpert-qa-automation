class CheckoutPage {
  elements = {
    emailLogin: () => cy.get('[data-qa="login-email"]'),
    senhaLogin: () => cy.get('[data-qa="login-password"]'),
    botaoLogin: () => cy.get('[data-qa="login-button"]'),
    usuarioAutenticado: () => cy.contains('a', 'Logged in as'),
    botaoAdicionarProduto: () => cy.get('.product-information button.cart'),
    modalCarrinho: () => cy.get('#cartModal'),
    linkVisualizarCarrinho: () => cy.get('#cartModal a[href="/view_cart"]'),
    botaoCheckout: () => cy.contains('a', 'Proceed To Checkout'),
    tituloEndereco: () => cy.contains('h2', 'Address Details'),
    tituloRevisao: () => cy.contains('h2', 'Review Your Order'),
    comentario: () => cy.get('textarea[name="message"]'),
    botaoFazerPedido: () => cy.contains('a', 'Place Order'),
    nomeCartao: () => cy.get('[data-qa="name-on-card"]'),
    numeroCartao: () => cy.get('[data-qa="card-number"]'),
    cvc: () => cy.get('[data-qa="cvc"]'),
    mesExpiracao: () => cy.get('[data-qa="expiry-month"]'),
    anoExpiracao: () => cy.get('[data-qa="expiry-year"]'),
    botaoConfirmarPagamento: () => cy.get('[data-qa="pay-button"]'),
    pedidoRealizado: () => cy.get('[data-qa="order-placed"]'),
  };

  autenticar(email, senha) {
    cy.visit('/login');
    this.elements.emailLogin().should('be.visible').clear().type(email);
    this.elements.senhaLogin().should('be.visible').clear().type(senha, {
      log: false,
    });
    this.elements.botaoLogin().should('be.visible').click();
    this.elements.usuarioAutenticado().should('be.visible');
  }

  adicionarProdutoAoCarrinho() {
    cy.visit('/product_details/1');
    this.elements.botaoAdicionarProduto().should('be.visible').click();
    this.elements.modalCarrinho().should('be.visible');
    this.elements.linkVisualizarCarrinho().should('be.visible').click();
    cy.url().should('include', '/view_cart');
    cy.get('#cart_info_table tbody tr').should('have.length.at.least', 1);
  }

  acessarCheckout() {
    this.elements.botaoCheckout().should('be.visible').click();
    cy.url().should('include', '/checkout');
    this.elements.tituloEndereco().should('be.visible');
    this.elements.tituloRevisao().should('be.visible');
  }

  prosseguirParaPagamento() {
    this.elements.comentario()
      .should('be.visible')
      .clear()
      .type('Pedido realizado por automação de teste.');
    this.elements.botaoFazerPedido().should('be.visible').click();
    cy.url().should('include', '/payment');
    this.elements.botaoConfirmarPagamento().should('be.visible');
  }

  prepararCarrinho(email, senha) {
    this.autenticar(email, senha);
    this.adicionarProdutoAoCarrinho();
  }

  prepararPaginaPagamento(email, senha) {
    this.prepararCarrinho(email, senha);
    this.acessarCheckout();
    this.prosseguirParaPagamento();
  }

  preencherPagamento(dados) {
    this.elements.nomeCartao().should('be.visible').clear().type(dados.nome);
    this.elements.numeroCartao().clear().type(dados.numero, { log: false });
    this.elements.cvc().clear().type(dados.cvc, { log: false });
    this.elements.mesExpiracao().clear().type(dados.mes);
    this.elements.anoExpiracao().clear().type(dados.ano);
  }

  deixarPagamentoIncompleto() {
    this.elements.nomeCartao().should('be.visible').clear().type('Teste QA');
    this.elements.numeroCartao().clear();
    this.elements.cvc().clear();
    this.elements.mesExpiracao().clear();
    this.elements.anoExpiracao().clear();
  }

  confirmarPedido() {
    this.elements.botaoConfirmarPagamento().should('be.visible').click();
  }

  simularPerdaDeConectividade() {
    cy.window().then((janela) => {
      Object.defineProperty(janela.navigator, 'onLine', {
        configurable: true,
        value: false,
      });
      janela.dispatchEvent(new janela.Event('offline'));
    });

    this.elements.botaoConfirmarPagamento().then(($botao) => {
      const formulario = $botao.closest('form')[0];

      formulario.addEventListener(
        'submit',
        (evento) => evento.preventDefault(),
        { once: true },
      );
    });

    this.confirmarPedido();
  }

  validarPedidoRealizado() {
    cy.url().should('include', '/payment_done');
    this.elements.pedidoRealizado().should('be.visible');
  }

  validarFormularioIncompleto() {
    cy.url().should('include', '/payment');
    this.elements.pedidoRealizado().should('not.exist');
  }

  validarPedidoNaoConfirmado() {
    cy.url().should('include', '/payment');
    this.elements.pedidoRealizado().should('not.exist');
    cy.contains('Congratulations! Your order has been confirmed!').should(
      'not.exist',
    );
  }
}

module.exports = new CheckoutPage();
