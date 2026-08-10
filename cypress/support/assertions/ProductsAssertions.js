const productsPage = require('../page_objects/ProductsPage');
const routes = require('../config/routes');
const uiMessages = require('../config/uiMessages');

class ProductsAssertions {
  validarPaginaCarregada() {
    productsPage.elements.tituloProdutos()
      .should('be.visible')
      .and('contain.text', uiMessages.products.listaCompleta);
  }

  validarSomenteProduto(nomeProduto) {
    this.validarTituloBusca();
    productsPage.elements.nomesProdutos()
      .should('have.length', 1)
      .and('have.text', nomeProduto);
  }

  validarProdutosComTermo(termo) {
    this.validarTituloBusca();
    productsPage.elements.nomesProdutos()
      .should('have.length.greaterThan', 0)
      .each(($produto) => {
        expect($produto.text().toLowerCase()).to.include(termo.toLowerCase());
      });
  }

  validarNenhumProduto() {
    this.validarTituloBusca();
    productsPage.elements.produtos().should('not.exist');
  }

  validarListaCompleta() {
    productsPage.elements.tituloProdutos()
      .should('be.visible')
      .and('contain.text', uiMessages.products.listaCompleta);
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
    this.validarTituloBusca();
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

  validarTituloBusca() {
    productsPage.elements.tituloProdutos()
      .should('be.visible')
      .and('contain.text', uiMessages.products.resultadoBusca);
  }
}

module.exports = new ProductsAssertions();
