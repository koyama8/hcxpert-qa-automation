# Automação de Testes — HCXpert

<p>
  <a href="https://github.com/koyama8/hcxpert-qa-automation/actions/workflows/main.yml"><img alt="Testes E2E - Cypress" src="https://img.shields.io/github/actions/workflow/status/koyama8/hcxpert-qa-automation/main.yml?branch=main&amp;style=for-the-badge&amp;logo=githubactions&amp;logoColor=white&amp;label=Testes%20E2E"></a>
  <a href="https://koyama8.github.io/hcxpert-qa-automation/"><img alt="Ver relatório Cucumber" src="https://img.shields.io/badge/Relatório-Cucumber-23D96C?style=for-the-badge&amp;logo=cucumber&amp;logoColor=white"></a>
  <a href="https://koyama8.github.io/hcxpert-qa-automation/performance.html"><img alt="Ver relatório de performance k6" src="https://img.shields.io/badge/Performance-k6-F46800?style=for-the-badge&amp;logo=k6&amp;logoColor=white"></a>
  <a href="https://koyama8.github.io/hcxpert-qa-automation/lighthouse.html"><img alt="Ver relatório Lighthouse" src="https://img.shields.io/badge/Performance-Lighthouse-F44B21?style=for-the-badge&amp;logo=lighthouse&amp;logoColor=white"></a>
</p>

Projeto desenvolvido para o desafio técnico de Engenharia de Qualidade da HCXpert. A solução automatiza testes Web e de API com Cypress, BDD com Cucumber, Page Objects, validação de contrato JSON, testes de carga com k6, auditoria Web com Lighthouse e execução contínua no GitHub Actions.

## Cobertura implementada

A suíte possui **23 cenários BDD** distribuídos entre:

- autenticação: login válido, senha incorreta, usuário inexistente e entradas maliciosas;
- busca: nome exato, parcial, caracteres especiais, busca vazia, produto inexistente e entradas maliciosas;
- carrinho: inclusão, quantidade, remoção, persistência e composição do valor;
- checkout: compra válida, formulário incompleto e perda de conectividade;
- APIs: consulta GET do Trello, criação POST de conta e rejeição de e-mail duplicado;
- performance: carga de API com k6 e auditoria Web com Lighthouse.

## Tecnologias e arquitetura

- Node.js 22.23.2 e JavaScript;
- Cypress 15.20.0;
- Cucumber/Gherkin com `@badeball/cypress-cucumber-preprocessor`;
- Page Objects restritos a elementos e ações de interface em `cypress/support/page_objects`;
- validações isoladas em `cypress/support/assertions` e regras de cálculo em `cypress/support/services`;
- contextos reutilizáveis em `cypress/support/tasks`, responsáveis pela preparação dos estados iniciais;
- configuração centralizada de endpoints e rotas em `cypress/support/config`;
- massas de produtos, checkout, API e segurança isoladas em fixtures;
- fábrica reutilizável para geração de usuários em `cypress/support/data`;
- AJV e JSON Schema para validação de contrato;
- k6 para carga e thresholds de API;
- Lighthouse para FCP, LCP e score de performance;
- GitHub Actions, artefatos e GitHub Pages.

```text
cypress/
├── e2e/features/          # Features declarativas em Gherkin
├── e2e/step_definitions/  # Implementação dos passos
├── fixtures/              # Massa fictícia e schemas
├── support/config/        # URLs e configurações centralizadas
├── support/data/          # Fábricas de dados dinâmicos reutilizáveis
├── support/assertions/    # Validações de estado e resultados esperados
├── support/page_objects/  # Elementos e ações de interface
├── support/services/      # Regras e cálculos independentes da interface
├── support/tasks/         # Contextos e preparação reutilizável dos cenários
└── evidencias/            # Relatório Cucumber e evidências
performance/               # Scripts e resultados de k6/Lighthouse
scripts/                   # Geração dos relatórios
security/                  # Configuração opcional do ZAP Baseline
.github/workflows/         # Pipeline de CI/CD
```

### Estratégia de seletores

Os seletores seguem uma ordem de prioridade única: `data-qa`, IDs funcionais,
atributos semânticos (`href`, `name` e `action`) e, somente quando a aplicação
externa não oferece alternativa, seletores estruturais escopados ao componente.
Os comandos `getByQa`, `getById` e `getByHref` ficam centralizados em
`cypress/support/commands.js`. Texto visível é usado como resultado esperado,
nunca para localizar botões ou links, e as mensagens ficam concentradas em
`cypress/support/config/uiMessages.js`.

## Pré-requisitos

- Node.js 22.23.2 (registrado em `.nvmrc`); versões anteriores a 22.19 não são compatíveis com o Lighthouse utilizado;
- npm;
- Google Chrome para a auditoria Lighthouse local;
- k6 2 ou superior para executar o teste de carga localmente;
- conta exclusiva de testes no Automation Exercise para login e checkout.

O Docker é necessário apenas para a execução opcional do ZAP Baseline descrita em `security/README.md`.

## Instalação e configuração local

Clone o projeto e instale as versões registradas no lockfile:

```bash
git clone https://github.com/koyama8/hcxpert-qa-automation.git
cd hcxpert-qa-automation
npm ci
```

Crie `cypress.env.json` na raiz do projeto com credenciais exclusivas para testes. Esse arquivo está ignorado pelo Git e não deve ser commitado:

```json
{
  "email": "usuario.de.teste@example.com",
  "senha": "substitua-pela-senha-da-conta-de-teste"
}
```

Como alternativa, configure `CYPRESS_email` e `CYPRESS_senha` como variáveis de ambiente. No GitHub Actions, os secrets esperados são `TEST_USER_EMAIL` e `TEST_USER_PASSWORD`.

Todos os dados de criação presentes em `cypress/fixtures` são fictícios. Os testes de API geram um e-mail único durante cada execução.

O arquivo `cypress/fixtures/users.json` centraliza as massas negativas e os payloads de segurança do login. Credenciais válidas não são armazenadas em fixtures: continuam sendo fornecidas por variáveis de ambiente ou GitHub Secrets.

## Comandos de execução

| Comando | Escopo |
| --- | --- |
| `npm test` | Executa toda a suíte Web e API em modo headless |
| `npm run test:all` | Executa login, busca, carrinho, checkout e API |
| `npm run test:e2e` | Executa somente os 20 cenários Web |
| `npm run test:api` | Executa somente os 3 cenários de API |
| `npm run test:perf` | Executa 10 usuários virtuais durante 30 segundos |
| `npm run test:lighthouse` | Executa três auditorias Lighthouse e usa a mediana |
| `npm run cy:open` | Abre a interface interativa do Cypress |
| `npm run cy:verify` | Confirma que o binário Cypress correspondente ao pacote está instalado |
| `npm run report` | Regenera o relatório Cucumber a partir do NDJSON |

Sequência recomendada para validação local completa:

```bash
npm ci
npm run cy:verify
npm run test:all
npm run test:perf
npm run test:lighthouse
npm run report
```

Os cenários dependem de serviços públicos de terceiros. Uma indisponibilidade ou página de manutenção do Automation Exercise/Trello pode causar falhas externas à automação; nesses casos, confirme a disponibilidade do alvo antes de reexecutar.

## APIs e validações

### GET Trello

O cenário consulta `GET /1/actions/592f11060f95a3d3d46a987a` e valida:

- status HTTP 200;
- contrato com JSON Schema;
- presença de `data.list.name`;
- registro do nome da lista no log como evidência.

### POST Automation Exercise

Os cenários de criação de conta validam:

- transporte HTTP 200 e código de negócio 201 na criação;
- mensagem de sucesso `User created!`;
- rejeição da segunda criação com o mesmo e-mail;
- código de negócio 400 e mensagem `Email already exists!`;
- tempo de resposta inferior a 2.000 ms.

## Performance

Os testes não funcionais são mantidos em scripts próprios de k6, Lighthouse e ZAP. Eles não são representados por uma feature Gherkin vazia, evitando contabilizar como cenário automatizado um artefato sem implementação.

### Carga de API com k6

O script `performance/k6_api_test.js` simula **10 usuários virtuais durante 30 segundos** contra a API do Trello. A execução é aprovada quando:

- 100% dos checks funcionais passam;
- a taxa de falhas HTTP é inferior a 1%;
- o percentil 95 do tempo de resposta é inferior a 800 ms.

O pipeline gera `k6-report.html` e `k6-summary.json`, publica o artefato `evidencias-performance` e disponibiliza o HTML pelo botão **Performance — k6**.

### Performance Web com Lighthouse

São executadas três medições desktop. A mediana reduz variações de rede e infraestrutura, com os seguintes limites de referência:

- FCP menor ou igual a 1,8 segundo;
- LCP menor ou igual a 2,5 segundos.

Como o alvo é um ambiente público de terceiros, violações são registradas como alertas e evidências sem bloquear toda a suíte funcional. O pipeline publica `evidencias-lighthouse` e o relatório representativo pelo botão **Performance — Lighthouse**.

## Relatórios, evidências e CI/CD

Cada execução das features gera em `cypress/evidencias`:

- `cucumber-report.html`: relatório gráfico navegável;
- `cucumber-report.json`: resultado estruturado;
- `cucumber-messages.ndjson`: mensagens do formatador Cucumber.

O workflow `.github/workflows/main.yml` realiza:

1. checkout, configuração do Node.js pela `.nvmrc` e instalação reproduzível com `npm ci`;
2. restauração do cache do binário Cypress e validação explícita com `cypress verify`;
3. execução headless da suíte Web/API em Ubuntu 24.04;
4. geração do relatório Cucumber;
5. execução de k6 e Lighthouse em push para `main`;
6. upload de HTML, JSON, screenshots e vídeos como artefatos;
7. publicação dos relatórios no GitHub Pages.

Para consultar uma execução, abra **Actions → Testes E2E - Cypress**, selecione o workflow e baixe `evidencias-e2e`, `evidencias-performance` ou `evidencias-lighthouse`. Os botões no início deste README abrem os relatórios publicados.

## Segurança e privacidade

- credenciais locais e arquivos de ambiente não são versionados;
- o pipeline recebe credenciais por GitHub Secrets;
- a auditoria das dependências de produção não possui vulnerabilidades conhecidas; riscos transitivos de desenvolvimento estão registrados em `docs/security/dependency-risk-register.md`;
- fixtures usam dados fictícios e e-mails gerados dinamicamente;
- os cenários tratam XSS e SQL Injection como entradas não confiáveis em login e busca;
- existe configuração documentada para ZAP Baseline passivo, mas o scan DAST não faz parte do pipeline atual.

Nenhuma varredura ativa deve ser executada contra um ambiente sem autorização explícita do responsável.

## Parecer crítico de testabilidade

O Automation Exercise possui seletores estáveis como `data-qa` e `id`, porém esse padrão não é consistente em todas as páginas. Alguns botões, produtos e elementos do carrinho dependem de classes CSS, textos ou da estrutura do DOM, aumentando o risco de manutenção e falsos negativos.

Outros pontos observados:

- buscas vazias ou sem resultado não apresentam feedback suficientemente claro;
- a quantidade não pode ser alterada diretamente no carrinho;
- impostos e frete não aparecem separadamente no resumo;
- algumas validações de pagamento dependem apenas dos recursos nativos do navegador;
- anúncios, recursos dinâmicos e indisponibilidades do ambiente público afetam a estabilidade;
- algumas APIs retornam HTTP 200 mesmo quando o código de negócio representa erro, exigindo validação das duas camadas.

Recomendações:

- padronizar `data-qa` ou `data-testid` nos fluxos principais;
- adicionar nomes acessíveis a botões representados somente por ícones;
- oferecer mensagens objetivas para busca vazia e produto inexistente;
- detalhar subtotal, impostos, frete e total;
- permitir alteração de quantidade diretamente no carrinho;
- padronizar status HTTP e corpo de erro das APIs;
- disponibilizar um ambiente de testes controlado, com dados isolados e menor interferência externa.

## Matriz de rastreabilidade

| Requisito do desafio | Evidência no projeto | Status |
| --- | --- | --- |
| Login válido, senha incorreta e usuário inexistente | `01_login.feature` e `LoginPage.js` | Atendido |
| Busca exata, parcial, vazia, especial e inexistente | `02_search.feature` e `ProductsPage.js` | Atendido |
| Carrinho: inclusão, quantidade, remoção e persistência | `03_cart.feature` e `CartPage.js` | Atendido |
| Checkout válido, campos incompletos e falha de conexão | `04_checkout.feature` e `CheckoutPage.js` | Atendido |
| GET Trello com status, log e JSON Schema | `05_api_trello.feature`, `apiSteps.js` e `trelloActionSchema.json` | Atendido |
| POST de conta com fixture, regra de negócio e resposta menor que 2 s | `05_api_trello.feature`, `apiSteps.js` e `payload_account.json` | Atendido |
| Cenário negativo de API | Rejeição de e-mail duplicado em `05_api_trello.feature` | Atendido |
| POM, DRY e Gherkin declarativo | `page_objects`, `support/assertions`, `support/services`, `support/tasks`, steps enxutos e features | Atendido — interação, validação, regras e preparação de estado possuem responsabilidades separadas |
| Seletores estáveis e padronizados | `support/commands.js`, Page Objects e `support/config/uiMessages.js` | Atendido — prioridade para `data-qa`, IDs funcionais e atributos semânticos; fallback estrutural fica escopado |
| Execução headless sem `cy.wait()` fixo | scripts do `package.json` e workflow | Atendido |
| Dados fictícios e tratamento de segredos | fixtures, e-mail dinâmico, `.env.example` e GitHub Secrets | Atendido |
| XSS e SQL Injection em login e busca | `01_login.feature` e `02_search.feature` | Atendido |
| DAST básico | configuração e instruções do ZAP Baseline em `security/` | Parcialmente atendido — fora do pipeline |
| k6 com 10 VUs/30 s e p95 menor que 800 ms | `performance/k6_api_test.js` e relatório publicado | Atendido |
| Lighthouse com FCP e LCP | `scripts/run-lighthouse.js` e relatório publicado | Atendido |
| Pipeline headless, relatórios e artefatos | `.github/workflows/main.yml` | Atendido |
| Relatório gráfico Cucumber/HTML | `cypress/evidencias` e GitHub Pages | Atendido |
| README com pré-requisitos, comandos e parecer | este documento | Atendido |
| Execução da suíte em container | não implementada; execução documentada localmente e no GitHub Actions | Não atendido |

## Limitações conhecidas

- O projeto depende de ambientes públicos sem controle de disponibilidade ou massa de dados.
- O ZAP Baseline está documentado, mas não é executado automaticamente no CI.
- A suíte funcional não possui imagem Docker própria; a execução reproduzível ocorre localmente com Node.js 22.23.2 ou no GitHub Actions em Ubuntu 24.04.
- Alertas do Lighthouse podem variar conforme rede, anúncios e carga do servidor externo.
