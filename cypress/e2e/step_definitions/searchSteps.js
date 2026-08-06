const {
  Given,
  When,
  Then,
} = require('@badeball/cypress-cucumber-preprocessor');

const productsPage = require('../../support/page_objects/ProductsPage');

const produtoExato = 'Blue Top';
const termoParcial = 'Blue';
const caracteresEspeciais = '@@@';
const produtoInexistente = 'Produto Inexistente 987654321';

Given('que o usuário está na página de produtos', () => {
  productsPage.acessarPagina();
});

When('o usuário informar o nome exato de um produto existente', () => {
  productsPage.informarTermo(produtoExato);
});

When('o usuário informar parte do nome de um produto', () => {
  productsPage.informarTermo(termoParcial);
});

When('o usuário informar somente caracteres especiais', () => {
  productsPage.informarTermo(caracteresEspeciais);
});

When('o usuário deixar o campo de busca vazio', () => {
  productsPage.deixarCampoVazio();
});

When('o usuário informar o nome de um produto inexistente', () => {
  productsPage.informarTermo(produtoInexistente);
});

When('solicitar a busca', () => {
  productsPage.solicitarBusca();
});

Then('somente o produto correspondente ao nome informado deverá ser apresentado', () => {
  productsPage.validarSomenteProduto(produtoExato);
});

Then('deverão ser apresentados produtos que contenham o termo informado', () => {
  productsPage.validarProdutosComTermo(termoParcial);
});

Then('nenhum produto deverá ser apresentado e a página deverá permanecer disponível', () => {
  productsPage.validarNenhumProduto();
  productsPage.validarPaginaDisponivel();
});

Then('a busca não deverá ser realizada e a lista completa de produtos deverá permanecer disponível', () => {
  productsPage.validarListaCompleta();
  productsPage.validarPaginaDisponivel();
});
