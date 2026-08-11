# language: en

Feature: Checkout e validações
  Como usuário autenticado
  Quero finalizar a compra dos produtos do carrinho
  Para concluir meu pedido com segurança

  Scenario: Finalizar uma compra com dados válidos
    Given que o usuário está autenticado e possui um produto no carrinho
    When o usuário acessar a página de checkout
    Then o endereço e o resumo do pedido deverão corresponder à compra
    When o usuário prosseguir para o pagamento
    And informar dados fictícios válidos e confirmar o pedido
    Then uma mensagem de pedido realizado com sucesso deverá ser apresentada

  Scenario: Impedir checkout com formulário de pagamento incompleto
    Given que o usuário está autenticado e está na página de pagamento
    When o usuário deixar campos obrigatórios do pagamento sem preenchimento
    And tentar confirmar o pedido
    Then o pedido não deverá ser finalizado e o usuário deverá permanecer na página de pagamento

  Scenario: Interromper a confirmação do pedido sob perda de conectividade
    Given que o usuário está autenticado e está na página de pagamento
    When o usuário informar dados fictícios válidos para o pagamento
    And a conectividade for interrompida durante a confirmação do pedido
    Then o pedido não deverá ser confirmado e nenhuma mensagem de sucesso deverá ser apresentada
