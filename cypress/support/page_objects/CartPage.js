class CartPage {
  elements = {
    nomeProdutoDetalhes: () => cy.getById('product_id').parent().siblings('h2'),
    precoProdutoDetalhes: () => cy.getById('quantity').siblings('span').first(),
    campoQuantidade: () => cy.getById('quantity'),
    botaoAdicionarCarrinho: () => cy.getById('quantity').siblings('button[type="button"]'),
    modalProdutoAdicionado: () => cy.getById('cartModal'),
    linkVisualizarCarrinho: () => cy.getById('cartModal').find('[href="/view_cart"]'),
    tabelaCarrinho: () => cy.getById('cart_info_table'),
    produtosCarrinho: () => cy.getById('cart_info_table').find('tbody tr'),
    nomeProdutoCarrinho: () => cy.getById('cart_info_table').find('.cart_description h4 a'),
    precoProdutoCarrinho: () => cy.getById('cart_info_table').find('.cart_price p'),
    quantidadeProdutoCarrinho: () => cy.getById('cart_info_table').find('.cart_quantity button'),
    totalProdutoCarrinho: () => cy.getById('cart_info_table').find('.cart_total_price'),
    botaoRemoverProduto: () => cy.getById('cart_info_table').find('.cart_quantity_delete'),
    mensagemCarrinhoVazio: () => cy.getById('empty_cart'),
    body: () => cy.get('body'),
  };

  rowSelectors = {
    preco: '.cart_price p',
    quantidade: '.cart_quantity button',
    total: '.cart_total_price',
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
}

module.exports = new CartPage();
