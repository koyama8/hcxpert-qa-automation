# language: en

Feature: Busca de produtos
  Como usuário da plataforma
  Quero pesquisar produtos pelo nome
  Para encontrar os itens que desejo comprar

  Scenario: Buscar produto pelo nome exato
    Given que o usuário está na página de produtos
    When o usuário informar o nome exato de um produto existente
    And solicitar a busca
    Then somente o produto correspondente ao nome informado deverá ser apresentado

  Scenario: Buscar produtos utilizando parte do nome
    Given que o usuário está na página de produtos
    When o usuário informar parte do nome de um produto
    And solicitar a busca
    Then deverão ser apresentados produtos que contenham o termo informado

  Scenario: Buscar produto utilizando caracteres especiais
    Given que o usuário está na página de produtos
    When o usuário informar somente caracteres especiais
    And solicitar a busca
    Then nenhum produto deverá ser apresentado e a página deverá permanecer disponível

  Scenario: Solicitar busca sem informar um produto
    Given que o usuário está na página de produtos
    When o usuário deixar o campo de busca vazio
    And solicitar a busca
    Then a busca não deverá ser realizada e a lista completa de produtos deverá permanecer disponível

  Scenario: Buscar produto inexistente
    Given que o usuário está na página de produtos
    When o usuário informar o nome de um produto inexistente
    And solicitar a busca
    Then nenhum produto deverá ser apresentado e a página deverá permanecer disponível

  Scenario: Tratar SQL Injection como texto na busca
    Given que o usuário está na página de produtos
    When o usuário inserir uma expressão de SQL Injection na busca
    And solicitar a busca
    Then a entrada SQL deverá ser tratada como texto sem expor erros técnicos

  Scenario: Impedir execução de XSS na busca
    Given que o usuário está na página de produtos
    When o usuário inserir um script malicioso na busca
    And solicitar a busca
    Then o script não deverá ser executado e a entrada deverá ser tratada como texto
