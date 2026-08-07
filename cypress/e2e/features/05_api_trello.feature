# language: en

@api
Feature: Consulta de ação na API do Trello
  Como profissional de qualidade
  Quero consultar uma ação pela API do Trello
  Para validar a resposta e registrar informações relevantes

  Scenario: Consultar uma ação existente
    Given que o endpoint de ações do Trello está disponível
    When o usuário consultar a ação "592f11060f95a3d3d46a987a"
    Then a resposta deverá possuir status 200, respeitar o contrato JSON e registrar o nome da lista como evidência
