const productsPage = require('../page_objects/ProductsPage');
const routes = require('../config/routes');

class ProductsAssertions {
  validarPaginaCarregada() {
    productsPage.elements.campoBusca().should('be.visible');
    productsPage.elements.botaoBuscar().should('be.visible');
    productsPage.elements.produtos().should('have.length.greaterThan', 0);
  }

  validarSomenteProduto(nomeProduto) {
    productsPage.elements.nomesProdutos()
      .should('have.length', 1)
      .and('have.text', nomeProduto);
  }

  validarProdutosComTermo(termo) {
    productsPage.elements.nomesProdutos()
      .should('have.length.greaterThan', 0)
      .each(($produto) => {
        expect($produto.text().toLowerCase()).to.include(termo.toLowerCase());
      });
  }

  validarNenhumProduto() {
    productsPage.elements.produtos().should('not.exist');
  }

  validarListaCompleta() {
    productsPage.elements.produtos().should('have.length.greaterThan', 0);
  }

  validarPaginaDisponivel() {
    cy.url().should('include', routes.products);
    productsPage.elements.body().should('be.visible');
  }

  validarEntradaTratadaComoTexto(entrada) {
    productsPage.elements.campoBusca()
      .should('be.visible')
      .and('have.value', entrada);
    this.validarPaginaDisponivel();
  }

  validarAusenciaDeErroTecnico() {
    productsPage.elements.body()
      .should('not.contain.text', 'SQL syntax')
      .and('not.contain.text', 'Database error')
      .and('not.contain.text', 'Stack trace')
      .and('not.contain.text', 'Traceback');
  }

  validarPayloadNaoConvertidoEmScript(conteudoMalicioso) {
    productsPage.elements.scripts().then(($scripts) => {
      const scriptsInjetados = $scripts.toArray().filter(
        (script) => script.textContent.trim() === conteudoMalicioso,
      );
      expect(
        scriptsInjetados,
        'o payload nao deve criar um elemento script executavel',
      ).to.be.empty;
    });
  }
}

module.exports = new ProductsAssertions();
