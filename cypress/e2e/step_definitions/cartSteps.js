const {
  Given,
  When,
  Then,
} = require('@badeball/cypress-cucumber-preprocessor');

const cartPage = require('../../support/page_objects/CartPage');
const cartContext = require('../../support/tasks/CartContext');
const produtos = require('../../fixtures/products.json');
const cartAssertions = require('../../support/assertions/CartAssertions');

const { alterada: quantidadeAlterada } = produtos.quantidades;

Given('que o usuário está na página de detalhes de um produto', () => {
  cartContext.prepararPaginaDetalhesProduto();
});

When('o usuário adicionar o produto ao carrinho', () => {
  cartPage.adicionarProdutoAoCarrinho();
});

When('acessar a página do carrinho', () => {
  cartPage.acessarCarrinhoPeloModal();
});

Then('o produto deverá ser apresentado com preço, quantidade e valor total', () => {
  cartAssertions.validarProdutoNoCarrinho();
});

When('o usuário alterar a quantidade padrão do produto', () => {
  cartPage.alterarQuantidade(quantidadeAlterada);
});

When('adicionar o produto ao carrinho', () => {
  cartPage.adicionarProdutoAoCarrinho();
});

Then('a quantidade informada deverá ser apresentada e o total deverá corresponder ao preço multiplicado pela quantidade', () => {
  cartAssertions.validarQuantidadeETotal(quantidadeAlterada);
});

Given('que o usuário possui somente um produto no carrinho', () => {
  cartContext.prepararComUmProduto();
});

When('o usuário remover o produto', () => {
  cartPage.removerProduto();
});

Then('o carrinho deverá ficar vazio e uma mensagem informativa deverá ser apresentada', () => {
  cartAssertions.validarCarrinhoVazio();
});

Given('que o usuário possui um produto com quantidade alterada no carrinho', () => {
  cartContext.prepararComQuantidade(quantidadeAlterada, {
    guardarEstado: true,
  });
});

When('o usuário atualizar a página do carrinho', () => {
  cartPage.atualizarPaginaCarrinho();
});

Then('a quantidade e o valor total deverão permanecer inalterados', () => {
  cartAssertions.validarPersistenciaDosDados();
});

Given('que o usuário possui produtos no carrinho', () => {
  cartContext.prepararComUmProduto();
});

When('o usuário consultar o resumo dos valores', () => {
  cartPage.consultarResumoValores();
});

Then('o total deverá corresponder aos itens adicionados sem inclusão de impostos ou frete não identificados', () => {
  cartAssertions.validarValoresSemTaxasOuFreteNaoIdentificados();
});
