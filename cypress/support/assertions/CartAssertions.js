const cartPage = require('../page_objects/CartPage');
const cartCalculator = require('../services/CartCalculator');
const routes = require('../config/routes');
const uiMessages = require('../config/uiMessages');

class CartAssertions {
  validarPaginaDetalhesProduto(productId) {
    cartPage.elements.idProdutoDetalhes()
      .should('have.value', String(productId));
    cartPage.elements.campoQuantidade().should('be.visible');
  }

  validarProdutoAdicionado() {
    cartPage.elements.modalProdutoAdicionado()
      .should('be.visible')
      .and('contain.text', uiMessages.cart.produtoAdicionado);
  }

  validarPaginaCarrinho() {
    cy.url().should('include', routes.cart);
    cartPage.elements.body().should('be.visible');
  }

  validarProdutoNoCarrinho(produtoEsperado, quantidadeEsperada) {
    cartPage.elements.tabelaCarrinho().should('be.visible');
    cartPage.elements.produtosCarrinho().should('have.length', 1);
    cartPage.elements.nomeProdutoCarrinho()
      .should('be.visible')
      .and('have.attr', 'href', routes.productDetails(produtoEsperado.id))
      .invoke('text')
      .then((nomeProduto) => {
        expect(nomeProduto.trim()).to.equal(produtoEsperado.nome);
      });
    this.validarQuantidadeETotal(quantidadeEsperada);
  }

  validarQuantidadeInformada(quantidade) {
    cartPage.elements.campoQuantidade().should('have.value', String(quantidade));
  }

  validarQuantidadeETotal(quantidadeEsperada) {
    cartPage.elements.quantidadeProdutoCarrinho()
      .should('have.text', String(quantidadeEsperada));
    cartPage.elements.precoProdutoCarrinho().invoke('text').then((precoTexto) => {
      const preco = cartCalculator.converterValorMonetario(precoTexto);
      cartPage.elements.totalProdutoCarrinho().invoke('text').then((totalTexto) => {
        const total = cartCalculator.converterValorMonetario(totalTexto);
        expect(total).to.equal(
          cartCalculator.calcularTotal(preco, quantidadeEsperada),
        );
      });
    });
  }

  validarCarrinhoVazio() {
    cartPage.elements.body().should(($body) => {
      expect($body.find(cartPage.rowSelectors.produtos)).to.have.length(0);
    });
    cartPage.elements.mensagemCarrinhoVazio()
      .should('be.visible')
      .and('contain.text', uiMessages.cart.carrinhoVazio);
  }

  guardarEstadoAtual() {
    cartPage.elements.quantidadeProdutoCarrinho().invoke('text').then((quantidade) => {
      this.quantidadeAntesDeAtualizar = quantidade.trim();
    });
    cartPage.elements.totalProdutoCarrinho().invoke('text').then((total) => {
      this.totalAntesDeAtualizar = total.trim();
    });
  }

  validarPersistenciaDosDados(quantidadeEsperada) {
    cartPage.elements.quantidadeProdutoCarrinho()
      .should('have.text', this.quantidadeAntesDeAtualizar);
    cartPage.elements.totalProdutoCarrinho()
      .should('have.text', this.totalAntesDeAtualizar);
    this.validarQuantidadeETotal(quantidadeEsperada);
  }

  validarValoresSemTaxasOuFreteNaoIdentificados() {
    cartPage.elements.produtosCarrinho()
      .should('have.length.greaterThan', 0)
      .each(($produto) => {
        const preco = cartCalculator.converterValorMonetario(
          $produto.find(cartPage.rowSelectors.preco).text(),
        );
        const quantidade = Number(
          $produto.find(cartPage.rowSelectors.quantidade).text().trim(),
        );
        const total = cartCalculator.converterValorMonetario(
          $produto.find(cartPage.rowSelectors.total).text(),
        );
        expect(total).to.equal(cartCalculator.calcularTotal(preco, quantidade));
      });
    uiMessages.cart.labelsTaxasOuFrete.forEach((label) => {
      cartPage.elements.tabelaCarrinho().should('not.contain.text', label);
    });
  }
}

module.exports = new CartAssertions();
