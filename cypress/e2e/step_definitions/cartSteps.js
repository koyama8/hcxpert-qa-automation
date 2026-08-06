const {
  Given,
  When,
  Then,
} = require('@badeball/cypress-cucumber-preprocessor');

const cartPage = require('../../support/page_objects/CartPage');

const quantidadeAlterada = 3;

Given('que o usuário está na página de detalhes de um produto', () => {
  cartPage.acessarDetalhesProduto();
});

When('o usuário adicionar o produto ao carrinho', () => {
  cartPage.adicionarProdutoAoCarrinho();
});

When('acessar a página do carrinho', () => {
  cartPage.acessarCarrinhoPeloModal();
});

Then('o produto deverá ser apresentado com preço, quantidade e valor total', () => {
  cartPage.validarProdutoNoCarrinho();
});

When('o usuário alterar a quantidade padrão do produto', () => {
  cartPage.alterarQuantidade(quantidadeAlterada);
});

When('adicionar o produto ao carrinho', () => {
  cartPage.adicionarProdutoAoCarrinho();
  cartPage.acessarCarrinhoPeloModal();
});

Then('a quantidade informada deverá ser apresentada e o total deverá corresponder ao preço multiplicado pela quantidade', () => {
  cartPage.validarQuantidadeETotal(quantidadeAlterada);
});

Given('que o usuário possui somente um produto no carrinho', () => {
  cartPage.acessarDetalhesProduto();
  cartPage.adicionarProdutoAoCarrinho();
  cartPage.acessarCarrinhoPeloModal();
});

When('o usuário remover o produto', () => {
  cartPage.removerProduto();
});

When('permanecer na página do carrinho', () => {
  cartPage.validarPaginaCarrinho();
});

Then('o carrinho deverá ficar vazio e uma mensagem informativa deverá ser apresentada', () => {
  cartPage.validarCarrinhoVazio();
});

Given('que o usuário possui um produto com quantidade alterada no carrinho', () => {
  cartPage.acessarDetalhesProduto();
  cartPage.alterarQuantidade(quantidadeAlterada);
  cartPage.adicionarProdutoAoCarrinho();
  cartPage.acessarCarrinhoPeloModal();
  cartPage.guardarDadosDoCarrinho();
});

When('o usuário atualizar a página do carrinho', () => {
  cartPage.atualizarPaginaCarrinho();
});

When('consultar novamente os dados do produto', () => {
  cartPage.validarProdutoNoCarrinho();
});

Then('a quantidade e o valor total deverão permanecer inalterados', () => {
  cartPage.validarPersistenciaDosDados();
});

Given('que o usuário possui produtos no carrinho', () => {
  cartPage.acessarDetalhesProduto();
  cartPage.adicionarProdutoAoCarrinho();
  cartPage.acessarCarrinhoPeloModal();
});

When('o usuário consultar o resumo dos valores', () => {
  cartPage.validarProdutoNoCarrinho();
});

When('conferir o preço, a quantidade e o valor total', () => {
  cartPage.validarQuantidadeETotal(1);
});

Then('o total deverá corresponder aos itens adicionados sem inclusão de impostos ou frete não identificados', () => {
  cartPage.validarValoresSemTaxasOuFreteNaoIdentificados();
});
