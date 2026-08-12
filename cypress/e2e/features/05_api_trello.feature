# language: en

@api
Feature: Validação de APIs
  Como profissional de qualidade
  Quero validar integrações por API
  Para garantir contratos, regras de negócio e desempenho

  @ci-independent
  Scenario: Consultar uma ação existente
    Given que o endpoint de ações do Trello está configurado
    When o usuário consultar a ação "592f11060f95a3d3d46a987a"
    Then a resposta deverá possuir status 200, respeitar o contrato JSON e registrar o nome da lista como evidência

  Scenario: Criar uma conta com dados válidos
    Given que o endpoint de criação de conta está configurado
    When o usuário enviar os dados válidos para criação da conta
    Then a API deverá confirmar a criação da conta e responder em menos de 2000 milissegundos

  Scenario: Rejeitar criação de conta com e-mail já cadastrado
    Given que o endpoint de criação de conta está configurado
    When o usuário tentar criar duas contas com o mesmo e-mail
    Then a API deverá rejeitar a duplicidade com uma mensagem de regra de negócio
