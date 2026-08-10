class ProductsPage {
  elements = {
    campoBusca: () => cy.getById('search_product'),
    botaoBuscar: () => cy.getById('submit_search'),
    tituloProdutos: () => cy.get('.features_items > h2.title'),
    produtos: () => cy.get('a[data-product-id]:visible'),
    nomesProdutos: () => cy.get('a[data-product-id]:visible').siblings('p'),
    body: () => cy.get('body'),
    scripts: () => cy.get('script'),
  };

  informarTermo(termo) {
    this.elements.campoBusca().clear().type(termo);
  }

  deixarCampoVazio() {
    this.elements.campoBusca().clear();
  }

  solicitarBusca() {
    this.elements.botaoBuscar().click();
  }
}

module.exports = new ProductsPage();
