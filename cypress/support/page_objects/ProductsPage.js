class ProductsPage {
  acessarPagina() {
    cy.visit('/products');
  }
}

module.exports = new ProductsPage();
