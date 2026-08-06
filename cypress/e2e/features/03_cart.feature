# language: en

Feature: Carrinho e persistência
  Como usuário da plataforma
  Quero gerenciar os produtos do meu carrinho
  Para conferir os itens e valores antes da compra

  Scenario: Adicionar um produto ao carrinho
    Given que o usuário está na página de detalhes de um produto
    When o usuário adicionar o produto ao carrinho
    And acessar a página do carrinho
    Then o produto deverá ser apresentado com preço, quantidade e valor total

  Scenario: Alterar a quantidade de um produto antes de adicioná-lo
    Given que o usuário está na página de detalhes de um produto
    When o usuário alterar a quantidade padrão do produto
    And adicionar o produto ao carrinho
    Then a quantidade informada deverá ser apresentada e o total deverá corresponder ao preço multiplicado pela quantidade

  Scenario: Remover o único produto do carrinho
    Given que o usuário possui somente um produto no carrinho
    When o usuário remover o produto
    And permanecer na página do carrinho
    Then o carrinho deverá ficar vazio e uma mensagem informativa deverá ser apresentada

  Scenario: Manter quantidade e valor total após atualizar o carrinho
    Given que o usuário possui um produto com quantidade alterada no carrinho
    When o usuário atualizar a página do carrinho
    And consultar novamente os dados do produto
    Then a quantidade e o valor total deverão permanecer inalterados

  Scenario: Validar o valor total e a transparência de impostos e frete
    Given que o usuário possui produtos no carrinho
    When o usuário consultar o resumo dos valores
    And conferir o preço, a quantidade e o valor total
    Then o total deverá corresponder aos itens adicionados sem inclusão de impostos ou frete não identificados
