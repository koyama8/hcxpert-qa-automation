const selectors = require('../config/selectors');

class ProductsPage {
  elements = {
    campoBusca: () => cy.getById('search_product'),
    botaoBuscar: () => cy.getById('submit_search'),
    produtos: () => cy.getVisibleByAttribute('data-product-id'),
    nomesProdutos: () => cy.getVisibleByAttribute('data-product-id')
      .siblings(selectors.products.nameRelativeToControl),
    body: () => cy.getByTag(selectors.common.body),
    scripts: () => cy.getByTag(selectors.common.scripts),
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
