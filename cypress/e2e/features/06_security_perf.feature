# language: en

@security
Feature: Segurança de entradas
  Como profissional de qualidade
  Quero validar entradas potencialmente maliciosas
  Para comprovar que a aplicação não executa scripts nem expõe erros técnicos

  Scenario: Rejeitar SQL Injection no campo de autenticação
    Given que o usuário está na página de autenticação
    When o usuário inserir uma expressão de SQL Injection no campo de senha
    And solicitar a autenticação
    Then o sistema deverá rejeitar a tentativa sem autenticar o usuário

  Scenario: Impedir XSS no campo de autenticação
    Given que o usuário está na página de autenticação
    When o usuário inserir um script malicioso no campo de senha
    And solicitar a autenticação
    Then o sistema deverá impedir a execução do script sem autenticar o usuário

  Scenario: Tratar SQL Injection como texto na busca
    Given que o usuário está na página de produtos
    When o usuário inserir uma expressão de SQL Injection na busca
    And solicitar a busca
    Then a entrada SQL deverá ser tratada como texto sem expor erros técnicos

  Scenario: Impedir XSS no campo de busca
    Given que o usuário está na página de produtos
    When o usuário inserir um script malicioso na busca
    And solicitar a busca
    Then o script não deverá ser executado e a entrada deverá ser tratada como texto
