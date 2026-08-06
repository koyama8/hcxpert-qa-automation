# Automação de Testes - HCXpert

Projeto desenvolvido para o desafio técnico de Engenharia de Qualidade, utilizando Cypress, Cucumber e JavaScript.

## Parecer Crítico de Testabilidade

Durante a análise do Automation Exercise, identifiquei que alguns elementos possuem seletores estáveis, como `data-qa` e `id`, mas esse padrão não é aplicado de forma consistente em todas as páginas. Alguns botões, produtos e elementos do carrinho dependem de classes CSS, textos ou da estrutura do DOM, o que pode tornar a automação mais frágil.

Também foram identificados os seguintes pontos:

- A busca vazia ou sem resultados não apresenta uma mensagem clara ao usuário.
- A quantidade do produto não pode ser alterada diretamente no carrinho.
- Impostos e frete não são apresentados separadamente no resumo dos valores.
- Algumas validações do pagamento dependem apenas dos recursos nativos do navegador.
- Anúncios e elementos carregados dinamicamente podem interferir na estabilidade da automação.

Como melhorias, sugiro:

- Padronizar o uso de `data-qa` ou `data-testid` nos elementos dos fluxos principais.
- Adicionar nomes acessíveis aos botões representados apenas por ícones.
- Apresentar mensagens objetivas para busca vazia e produto inexistente.
- Permitir a alteração da quantidade diretamente no carrinho.
- Detalhar subtotal, impostos, frete e valor total da compra.
- Implementar tratamento visual para falhas de conexão, permitindo uma nova tentativa segura.

As respostas HTTP e os contratos das APIs serão analisados na etapa de testes de serviços. Este parecer será atualizado caso sejam encontrados status codes inadequados ou mensagens de erro inconsistentes.
