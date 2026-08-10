const selectors = require('../config/selectors');

class CartPage {
  elements = {
    idProdutoDetalhes: () => cy.getById('product_id'),
    campoQuantidade: () => cy.getById('quantity'),
    botaoAdicionarCarrinho: () => cy.getById('quantity').siblings('button[type="button"]'),
    modalProdutoAdicionado: () => cy.getById('cartModal'),
    linkVisualizarCarrinho: () => cy.getById('cartModal')
      .find(selectors.cart.viewCartLink),
    tabelaCarrinho: () => cy.getById('cart_info_table'),
    produtosCarrinho: () => cy.getById('cart_info_table').find(selectors.cart.rows),
    nomeProdutoCarrinho: () => cy.getById('cart_info_table')
      .find(selectors.cart.productName),
    precoProdutoCarrinho: () => cy.getById('cart_info_table')
      .find(selectors.cart.price),
    quantidadeProdutoCarrinho: () => cy.getById('cart_info_table')
      .find(selectors.cart.quantity),
    totalProdutoCarrinho: () => cy.getById('cart_info_table')
      .find(selectors.cart.total),
    botaoRemoverProduto: () => cy.getById('cart_info_table')
      .find(selectors.cart.removeButton),
    mensagemCarrinhoVazio: () => cy.getById('empty_cart'),
    body: () => cy.getByTag(selectors.common.body),
  };

  rowSelectors = {
    preco: selectors.cart.price,
    quantidade: selectors.cart.quantity,
    total: selectors.cart.total,
  };

  alterarQuantidade(quantidade) {
    this.elements.campoQuantidade().clear().type(String(quantidade));
  }

  adicionarProdutoAoCarrinho() {
    this.elements.botaoAdicionarCarrinho().click();
  }

  acessarCarrinhoPeloModal() {
    this.elements.linkVisualizarCarrinho().click();
  }

  removerProduto() {
    this.elements.botaoRemoverProduto().first().click();
  }

  atualizarPaginaCarrinho() {
    cy.reload();
  }

  consultarResumoValores() {
    this.elements.tabelaCarrinho().scrollIntoView();
  }
}

module.exports = new CartPage();
