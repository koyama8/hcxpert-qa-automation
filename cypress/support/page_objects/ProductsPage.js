class ProductsPage {
  elements = {
    campoBusca: () => cy.get('#search_product'),
    botaoBuscar: () => cy.get('#submit_search'),
    tituloProdutos: () => cy.get('.features_items h2.title'),
    produtos: () => cy.get('.features_items > .col-sm-4'),
    nomesProdutos: () => cy.get('.features_items > .col-sm-4 .productinfo p:visible'),
  };

  acessarPagina() {
    cy.visit('/products');
    this.elements.tituloProdutos()
      .should('be.visible')
      .and('contain.text', 'All Products');
  }

  informarTermo(termo) {
    this.elements.campoBusca()
      .should('be.visible')
      .clear()
      .type(termo);
  }

  deixarCampoVazio() {
    this.elements.campoBusca()
      .should('be.visible')
      .clear()
      .should('have.value', '');
  }

  solicitarBusca() {
    this.elements.botaoBuscar()
      .should('be.visible')
      .click();
  }

  validarSomenteProduto(nomeProduto) {
    this.elements.tituloProdutos()
      .should('be.visible')
      .and('contain.text', 'Searched Products');

    this.elements.nomesProdutos()
      .should('have.length', 1)
      .and('have.text', nomeProduto);
  }

  validarProdutosComTermo(termo) {
    this.elements.tituloProdutos()
      .should('be.visible')
      .and('contain.text', 'Searched Products');

    this.elements.nomesProdutos()
      .should('have.length.greaterThan', 0)
      .each(($produto) => {
        expect($produto.text().toLowerCase()).to.include(termo.toLowerCase());
      });
  }

  validarNenhumProduto() {
    this.elements.tituloProdutos()
      .should('be.visible')
      .and('contain.text', 'Searched Products');

    cy.get('.features_items > .col-sm-4')
      .should('not.exist');
  }

  validarListaCompleta() {
    this.elements.tituloProdutos()
      .should('be.visible')
      .and('contain.text', 'All Products');

    this.elements.produtos()
      .should('have.length.greaterThan', 0);
  }

  validarPaginaDisponivel() {
    cy.url().should('include', '/products');
    cy.get('body').should('be.visible');
  }
}

module.exports = new ProductsPage();
