class HomePage {
  routes = {
    autenticacao: '/login',
    produtos: '/products',
  };

  abrirPaginaAutenticacao() {
    cy.visit(this.routes.autenticacao);
    cy.url().should('include', '/login');
  }

  abrirPaginaProdutos() {
    cy.visit(this.routes.produtos);
    cy.url().should('include', '/products');
  }
}

module.exports = new HomePage();
