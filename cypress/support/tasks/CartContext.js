const cartPage = require('../page_objects/CartPage');
const produtos = require('../../fixtures/products.json');
const navigationContext = require('./NavigationContext');
const cartAssertions = require('../assertions/CartAssertions');

class CartContext {
  prepararPaginaDetalhesProduto() {
    navigationContext.abrirDetalhesProduto(produtos.principal.id);
    cartAssertions.validarPaginaDetalhesProduto(produtos.principal.id);
  }

  prepararComUmProduto() {
    this.prepararComQuantidade(produtos.quantidades.padrao);
  }

  prepararComQuantidade(quantidade, { guardarEstado = false } = {}) {
    navigationContext.abrirDetalhesProduto(produtos.principal.id);
    cartAssertions.validarPaginaDetalhesProduto(produtos.principal.id);

    if (quantidade !== produtos.quantidades.padrao) {
      cartPage.alterarQuantidade(quantidade);
    }

    cartPage.adicionarProdutoAoCarrinho();
    cartAssertions.validarProdutoAdicionado();
    cartPage.acessarCarrinhoPeloModal();
    cartAssertions.validarPaginaCarrinho();

    if (guardarEstado) {
      cartAssertions.guardarEstadoAtual();
    }
  }
}

module.exports = new CartContext();
