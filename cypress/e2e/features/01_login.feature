# language: en

Feature: Autenticação e sessão
  Como usuário da plataforma
  Quero autenticar minha conta com segurança
  Para acessar as funcionalidades disponíveis

  Scenario: Login com credenciais válidas
    Given que o usuário está na página de autenticação
    When o usuário informar um e-mail e uma senha válidos
    And solicitar a autenticação
    Then o usuário deverá ser autenticado e seu nome deverá ser exibido

  Scenario: Login com senha incorreta
    Given que o usuário está na página de autenticação
    When o usuário informar um e-mail cadastrado e uma senha incorreta
    And solicitar a autenticação
    Then uma mensagem de credenciais inválidas deverá ser exibida sem autenticar o usuário

  Scenario: Login com usuário inexistente
    Given que o usuário está na página de autenticação
    When o usuário informar um e-mail não cadastrado e uma senha
    And solicitar a autenticação
    Then uma mensagem de credenciais inválidas deverá ser exibida sem autenticar o usuário

  Scenario: Tentativa de SQL Injection no campo de autenticação
    Given que o usuário está na página de autenticação
    When o usuário inserir uma expressão de SQL Injection no campo de senha
    And solicitar a autenticação
    Then o sistema deverá rejeitar a tentativa sem autenticar o usuário

  Scenario: Tentativa de XSS no campo de autenticação
    Given que o usuário está na página de autenticação
    When o usuário inserir um script malicioso no campo de senha
    And solicitar a autenticação
    Then o sistema deverá impedir a execução do script sem autenticar o usuário