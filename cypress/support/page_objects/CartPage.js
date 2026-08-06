class CartPage {
  elements = {
    nomeProdutoDetalhes: () => cy.get('.product-information h2'),
    precoProdutoDetalhes: () => cy.get('.product-information span span'),
    campoQuantidade: () => cy.get('#quantity'),
    botaoAdicionarCarrinho: () => cy.get('.product-information button.cart'),
    modalProdutoAdicionado: () => cy.get('#cartModal'),
    linkVisualizarCarrinho: () => cy.get('#cartModal a[href="/view_cart"]'),
    tabelaCarrinho: () => cy.get('#cart_info_table'),
    produtosCarrinho: () => cy.get('#cart_info_table tbody tr'),
    nomeProdutoCarrinho: () => cy.get('.cart_description h4 a'),
    precoProdutoCarrinho: () => cy.get('.cart_price p'),
    quantidadeProdutoCarrinho: () => cy.get('.cart_quantity button'),
    totalProdutoCarrinho: () => cy.get('.cart_total_price'),
    botaoRemoverProduto: () => cy.get('.cart_quantity_delete'),
    mensagemCarrinhoVazio: () => cy.get('#empty_cart'),
  };

  acessarDetalhesProduto() {
    cy.visit('/product_details/1');
    this.elements.nomeProdutoDetalhes()
      .should('be.visible')
      .and('not.be.empty');
  }

  alterarQuantidade(quantidade) {
    this.elements.campoQuantidade()
      .should('be.visible')
      .clear()
      .type(String(quantidade))
      .should('have.value', String(quantidade));
  }

  adicionarProdutoAoCarrinho() {
    this.elements.botaoAdicionarCarrinho()
      .should('be.visible')
      .click();

    this.elements.modalProdutoAdicionado()
      .should('be.visible')
      .and('contain.text', 'Added!');
  }

  acessarCarrinhoPeloModal() {
    this.elements.linkVisualizarCarrinho()
      .should('be.visible')
      .click();

    cy.url().should('include', '/view_cart');
  }

  acessarCarrinho() {
    cy.visit('/view_cart');
    cy.url().should('include', '/view_cart');
  }

  validarPaginaCarrinho() {
    cy.url().should('include', '/view_cart');
    cy.get('body').should('be.visible');
  }

  validarProdutoNoCarrinho() {
    this.elements.tabelaCarrinho().should('be.visible');
    this.elements.produtosCarrinho().should('have.length.greaterThan', 0);
    this.elements.nomeProdutoCarrinho().should('be.visible').and('not.be.empty');
    this.elements.precoProdutoCarrinho().should('be.visible').and('not.be.empty');
    this.elements.quantidadeProdutoCarrinho().should('be.visible').and('not.be.empty');
    this.elements.totalProdutoCarrinho().should('be.visible').and('not.be.empty');
  }

  validarQuantidadeETotal(quantidadeEsperada) {
    this.elements.quantidadeProdutoCarrinho()
      .should('have.text', String(quantidadeEsperada));

    this.elements.precoProdutoCarrinho().invoke('text').then((precoTexto) => {
      const preco = this.converterValorMonetario(precoTexto);

      this.elements.totalProdutoCarrinho().invoke('text').then((totalTexto) => {
        const total = this.converterValorMonetario(totalTexto);
        expect(total).to.equal(preco * quantidadeEsperada);
      });
    });
  }

  removerProduto() {
    this.elements.produtosCarrinho().then(($produtos) => {
      const quantidadeAntes = $produtos.length;

      this.elements.botaoRemoverProduto()
        .first()
        .should('be.visible')
        .click();

      cy.get('#cart_info_table tbody tr')
        .should('have.length.lessThan', quantidadeAntes);
    });
  }

  validarCarrinhoVazio() {
    this.elements.produtosCarrinho().should('not.exist');
    this.elements.mensagemCarrinhoVazio()
      .should('be.visible')
      .and('contain.text', 'Cart is empty!');
  }

  guardarDadosDoCarrinho() {
    this.elements.quantidadeProdutoCarrinho().invoke('text').then((quantidade) => {
      this.quantidadeAntesDeAtualizar = quantidade.trim();
    });

    this.elements.totalProdutoCarrinho().invoke('text').then((total) => {
      this.totalAntesDeAtualizar = total.trim();
    });
  }

  atualizarPaginaCarrinho() {
    cy.reload();
    this.elements.tabelaCarrinho().should('be.visible');
  }

  validarPersistenciaDosDados() {
    this.elements.quantidadeProdutoCarrinho()
      .should('have.text', this.quantidadeAntesDeAtualizar);

    this.elements.totalProdutoCarrinho()
      .should('have.text', this.totalAntesDeAtualizar);
  }

  validarValoresSemTaxasOuFreteNaoIdentificados() {
    this.elements.produtosCarrinho().each(($produto) => {
      const preco = this.converterValorMonetario(
        $produto.find('.cart_price p').text(),
      );
      const quantidade = Number(
        $produto.find('.cart_quantity button').text().trim(),
      );
      const total = this.converterValorMonetario(
        $produto.find('.cart_total_price').text(),
      );

      expect(total).to.equal(preco * quantidade);
    });

    this.elements.tabelaCarrinho()
      .should('not.contain.text', 'Tax')
      .and('not.contain.text', 'Shipping')
      .and('not.contain.text', 'Freight')
      .and('not.contain.text', 'Imposto')
      .and('not.contain.text', 'Frete');
  }

  converterValorMonetario(valor) {
    const valorEncontrado = valor.match(/-?\d[\d.,]*/);

    expect(valorEncontrado, `valor monetário encontrado em "${valor}"`)
      .not.to.be.null;

    return Number(valorEncontrado[0].replace(',', '.'));
  }
}

module.exports = new CartPage();
