const {
  Given,
  When,
  Then,
} = require('@badeball/cypress-cucumber-preprocessor');

const productsPage = require('../../support/page_objects/ProductsPage');
const navigationContext = require('../../support/tasks/NavigationContext');
const produtos = require('../../fixtures/products.json');
const payloadsSeguranca = require('../../fixtures/security_payloads.json');
const productsAssertions = require('../../support/assertions/ProductsAssertions');

const { nome: produtoExato, termoParcial } = produtos.principal;
const { caracteresEspeciais, produtoInexistente } = produtos.buscas;
const { sqlInjection, xss: payloadXss, conteudoXss } = payloadsSeguranca;

let alertaXssExecutado = false;

Given('que o usuário está na página de produtos', () => {
  navigationContext.abrirProdutos();
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

When('o usuário inserir uma expressão de SQL Injection na busca', () => {
  productsPage.informarTermo(sqlInjection);
});

When('o usuário inserir um script malicioso na busca', () => {
  alertaXssExecutado = false;

  cy.on('window:alert', () => {
    alertaXssExecutado = true;
  });

  productsPage.informarTermo(payloadXss);
});

When('solicitar a busca', () => {
  productsPage.solicitarBusca();
});

Then('somente o produto correspondente ao nome informado deverá ser apresentado', () => {
  productsAssertions.validarSomenteProduto(produtoExato);
});

Then('deverão ser apresentados produtos que contenham o termo informado', () => {
  productsAssertions.validarProdutosComTermo(termoParcial);
});

Then('nenhum produto deverá ser apresentado e a página deverá permanecer disponível', () => {
  productsAssertions.validarNenhumProduto();
  productsAssertions.validarPaginaDisponivel();
});

Then('a busca não deverá ser realizada e a lista completa de produtos deverá permanecer disponível', () => {
  productsAssertions.validarListaCompleta();
  productsAssertions.validarPaginaDisponivel();
});

Then('a entrada SQL deverá ser tratada como texto sem expor erros técnicos', () => {
  productsAssertions.validarEntradaTratadaComoTexto(sqlInjection);
  productsAssertions.validarAusenciaDeErroTecnico();
});

Then('o script não deverá ser executado e a entrada deverá ser tratada como texto', () => {
  cy.then(() => {
    expect(
      alertaXssExecutado,
      'o payload XSS não deve executar um alerta',
    ).to.be.false;
  });

  productsAssertions.validarEntradaTratadaComoTexto(payloadXss);
  productsAssertions.validarPayloadNaoConvertidoEmScript(conteudoXss);
});
