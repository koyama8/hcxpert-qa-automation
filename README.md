# Automação de Testes - HCXpert

<p>
  <a href="https://github.com/koyama8/hcxpert-qa-automation/actions/workflows/main.yml"><img alt="Testes E2E - Cypress" src="https://img.shields.io/github/actions/workflow/status/koyama8/hcxpert-qa-automation/main.yml?branch=main&amp;style=for-the-badge&amp;logo=githubactions&amp;logoColor=white&amp;label=Testes%20E2E"></a>
  <a href="https://koyama8.github.io/hcxpert-qa-automation/"><img alt="Ver Relatório Cucumber" src="https://img.shields.io/badge/Relatório-Cucumber-23D96C?style=for-the-badge&amp;logo=cucumber&amp;logoColor=white"></a>
  <a href="https://koyama8.github.io/hcxpert-qa-automation/performance.html"><img alt="Ver Relatório de Performance" src="https://img.shields.io/badge/Performance-k6-F46800?style=for-the-badge&amp;logo=k6&amp;logoColor=white"></a>
  <a href="https://koyama8.github.io/hcxpert-qa-automation/lighthouse.html"><img alt="Ver Relatório Lighthouse" src="https://img.shields.io/badge/Performance-Lighthouse-F44B21?style=for-the-badge&amp;logo=lighthouse&amp;logoColor=white"></a>
</p>

Projeto desenvolvido para o desafio técnico de Engenharia de Qualidade, utilizando Cypress, Cucumber e JavaScript.

## Pré-requisitos

- Node.js 22 ou superior;
- npm;
- k6 2 ou superior para a execução local dos testes de performance;
- Google Chrome para a auditoria Lighthouse local;
- credenciais de uma conta exclusiva de testes no Automation Exercise.

## Instalação

```bash
npm ci
```

Crie um arquivo local `cypress.env.json` na raiz do projeto. Esse arquivo é
ignorado pelo Git e não deve ser enviado ao repositório:

```json
{
  "email": "usuario.de.teste@example.com",
  "senha": "substitua-pela-senha-da-conta-de-teste"
}
```

## Execução dos Testes

| Comando | Escopo |
| --- | --- |
| `npm test` | Executa toda a suíte Web e API |
| `npm run test:all` | Executa login, busca, carrinho, checkout e API |
| `npm run test:e2e` | Executa somente os fluxos Web |
| `npm run test:api` | Executa somente os cenários de API |
| `npm run test:perf` | Executa 10 usuários virtuais durante 30 segundos na API alvo |
| `npm run test:lighthouse` | Executa três auditorias Lighthouse na aplicação Web |
| `npm run cy:open` | Abre a interface interativa do Cypress |
| `npm run report` | Regenera o HTML a partir do NDJSON existente |

A suíte completa utiliza a conta de testes nos fluxos de login e checkout e
cria uma conta fictícia pelo endpoint de API. Utilize somente ambientes e
credenciais destinados à automação.

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

## Relatórios e Evidências

As execuções das features geram automaticamente os seguintes artefatos em
`cypress/evidencias`:

- `cucumber-report.html`: relatório gráfico navegável;
- `cucumber-report.json`: resultado estruturado dos cenários;
- `cucumber-messages.ndjson`: mensagens utilizadas pelo formatador oficial.

Para regenerar o HTML a partir do arquivo NDJSON existente, execute:

```bash
npm run report
```

No GitHub Actions, os relatórios, screenshots e vídeos são publicados como
artefatos mesmo quando algum cenário falha.

### Teste de performance com k6

O teste em `performance/k6_api_test.js` simula 10 usuários virtuais durante 30
segundos contra a API alvo. A execução é aprovada somente quando:

- 100% dos checks funcionais passam;
- a taxa de falhas HTTP permanece abaixo de 1%;
- o percentil 95 do tempo de resposta permanece abaixo de 800 ms.

Para executar localmente:

```bash
npm run test:perf
```

No GitHub Actions, o k6 gera automaticamente `k6-report.html` e
`k6-summary.json`. Os arquivos são disponibilizados no artefato
`evidencias-performance`, e o relatório HTML também é publicado no GitHub
Pages pelo botão **Ver Relatório de Performance** no início deste README.

### Performance Web com Lighthouse

A auditoria Lighthouse no pipeline executa três medições em modo desktop e utiliza a mediana
para reduzir variações de rede e infraestrutura. São acompanhados os limites
recomendados de FCP menor ou igual a 1,8 segundo e LCP menor ou igual a 2,5
segundos.

Como a aplicação auditada é um ambiente público de terceiros, violações desses
limites são registradas como alertas e evidências, sem bloquear toda a suíte
funcional. Para executar localmente:

```bash
npm run test:lighthouse
```

O pipeline publica os relatórios HTML/JSON no artefato
`evidencias-lighthouse`. O relatório representativo também fica disponível no
GitHub Pages pelo botão **Ver Relatório Lighthouse** no início deste README.

### Consultar o relatório no GitHub Actions

1. Acesse a aba **Actions** do repositório;
2. abra a execução desejada do workflow **Testes E2E - Cypress**;
3. na seção **Artifacts**, baixe `evidencias-e2e`;
4. extraia o arquivo e abra `cypress/evidencias/cucumber-report.html` no
   navegador.

O badge no início deste README permite consultar rapidamente o estado da última
execução do pipeline na branch `main`.
