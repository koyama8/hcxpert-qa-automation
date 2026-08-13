# Automação de Testes — HCXpert

<p>
  <a href="https://github.com/koyama8/hcxpert-qa-automation/actions/workflows/main.yml"><img alt="Pipeline de qualidade" src="https://img.shields.io/github/actions/workflow/status/koyama8/hcxpert-qa-automation/main.yml?branch=main&amp;style=for-the-badge&amp;logo=githubactions&amp;logoColor=white&amp;label=Quality%20Gate"></a>
  <a href="https://koyama8.github.io/hcxpert-qa-automation/"><img alt="Relatório Cucumber" src="https://img.shields.io/badge/Relatório-Cucumber-23D96C?style=for-the-badge&amp;logo=cucumber&amp;logoColor=white"></a>
  <a href="https://koyama8.github.io/hcxpert-qa-automation/performance.html"><img alt="Relatório k6" src="https://img.shields.io/badge/Performance-k6-F46800?style=for-the-badge&amp;logo=k6&amp;logoColor=white"></a>
  <a href="https://koyama8.github.io/hcxpert-qa-automation/lighthouse.html"><img alt="Relatório Lighthouse" src="https://img.shields.io/badge/Performance-Lighthouse-F44B21?style=for-the-badge&amp;logo=lighthouse&amp;logoColor=white"></a>
  <a href="https://github.com/koyama8/hcxpert-qa-automation/archive/refs/heads/main.zip"><img alt="Baixar projeto" src="https://img.shields.io/badge/Download-ZIP-0969DA?style=for-the-badge&amp;logo=github&amp;logoColor=white"></a>
</p>

Framework de automação Web e API desenvolvido para o desafio técnico de Engenharia de Qualidade da HCXpert. O projeto combina Cypress, Cucumber, Page Objects, JSON Schema, k6, Lighthouse, OWASP ZAP e GitHub Actions para validar comportamento funcional, contratos, segurança básica e regressões de performance.

## Cobertura automatizada

A suíte possui **24 cenários BDD**:

| Área | Cenários | Cobertura principal | Feature |
| --- | ---: | --- | --- |
| Autenticação | 3 | Login válido, senha incorreta e usuário inexistente | `01_login.feature` |
| Busca | 5 | Nome exato, parcial, caracteres especiais, busca vazia e produto inexistente | `02_search.feature` |
| Carrinho | 5 | Inclusão, quantidade, remoção, persistência e cálculo do total | `03_cart.feature` |
| Checkout | 4 | Compra válida, campos incompletos, HTTP 503 e erro real de rede | `04_checkout.feature` |
| API | 3 | GET do Trello, criação de conta e rejeição de e-mail duplicado | `05_api_trello.feature` |
| Segurança | 4 | SQL Injection e XSS em autenticação e busca | `06_security_perf.feature` |

No checkout, indisponibilidade HTTP (`503` com `Retry-After`) e interrupção de transporte (`forceNetworkError`) são comportamentos distintos. Os testes de API usam dados dinâmicos, validam contratos e removem as contas temporárias ao final de cada cenário.

## Arquitetura

As responsabilidades são separadas por camada:

- **Features:** comportamento declarativo em Gherkin.
- **Steps:** tradução dos passos de negócio para as abstrações do framework.
- **Page Objects:** elementos e ações de interface, sem regras de negócio globais.
- **Assertions:** resultados esperados e contratos.
- **Tasks/Contexts:** preparação e isolamento do estado dos cenários.
- **API:** cliente HTTP e serviços reutilizáveis, sem chamadas diretas nos steps.
- **Services:** cálculos independentes da interface.
- **Fixtures/Data/Config:** massas, schemas, fábricas, seletores, rotas e endpoints.

```text
cypress/
|-- e2e/
|   |-- features/                  # Cenários Gherkin
|   `-- step_definitions/          # Implementação dos passos
|-- fixtures/
|   |-- schemas/                   # Contratos JSON
|   |-- users.json                 # Massas negativas de autenticação
|   `-- *.json                     # Produtos, checkout, API e segurança
|-- support/
|   |-- api/                       # ApiClient e serviços por domínio
|   |-- assertions/                # Validações Web e API
|   |-- config/                    # Endpoints, rotas, seletores e mensagens
|   |-- data/                      # Fábricas de dados dinâmicos
|   |-- page_objects/              # homePage, Login, Products, Cart e Checkout
|   |-- services/                  # Regras e cálculos
|   `-- tasks/                     # Contextos e preparação de estado
`-- evidencias/                    # Saídas Cucumber e evidências de API
docs/
|-- postman/HCXpert_API.json       # Coleção Postman
`-- security/                      # Registro de risco de dependências
performance/                       # k6 e resultados Lighthouse
scripts/
|-- capture-api-evidencias.mjs
|-- upload-xray.mjs
|-- generate-report.js
|-- generate-execution-metadata.js
|-- run-lighthouse.js
`-- templates/                     # Templates de API e Xray
security/                          # Configuração do ZAP Baseline
.github/workflows/main.yml         # Pipeline de qualidade
```

Os seletores priorizam `data-qa`, `id`, `name`, `href`, `action` e atributos funcionais. Quando a aplicação externa não oferece um identificador estável, o fallback por classe ou estrutura é centralizado e limitado ao componente.

Os nomes de arquivos e imports preservam exatamente maiúsculas e minúsculas, inclusive `homePage.js`, para manter compatibilidade com Linux.

## Pré-requisitos

| Ferramenta | Uso | Obrigatória para |
| --- | --- | --- |
| Node.js 22.23.2 | Runtime definido em `.nvmrc` | Instalação, Cypress, relatórios e Lighthouse |
| npm | Instalação reproduzível pelo lockfile | Todos os comandos Node.js |
| Google Chrome | Navegador controlado pelo script | Lighthouse local |
| k6 | Gerador de carga | Testes de performance locais |
| Docker | Execução da imagem oficial do ZAP | DAST local opcional |
| Git | Clone e controle de versão | Forma recomendada de download |

O CI usa Ubuntu 24.04 e Node 22.23.2. A faixa aceita pelo projeto é Node `>=22.19.0 <23`; usar Node 24 pode gerar `EBADENGINE` e não reproduz o ambiente oficial.

## Download e instalação manual

### Opção 1 — Git

```bash
git clone https://github.com/koyama8/hcxpert-qa-automation.git
cd hcxpert-qa-automation
```

### Opção 2 — ZIP

Use o botão **Download ZIP** no início deste documento, extraia o arquivo e abra o PowerShell ou terminal dentro da pasta extraída.

### Preparar o ambiente

Com um gerenciador de versões Node compatível:

```bash
nvm install 22.23.2
nvm use 22.23.2
node --version
npm --version
npm ci
npm run cy:verify
```

O comando `npm ci` instala exatamente as versões do `package-lock.json`. Não substitua por `npm install` durante uma validação de reprodutibilidade.

## Configuração de credenciais

Crie `cypress.env.json` na raiz do projeto com uma conta exclusiva do Automation Exercise:

```json
{
  "email": "usuario.de.teste@example.com",
  "senha": "substitua-pela-senha-da-conta-de-teste"
}
```

O arquivo está ignorado pelo Git e não deve ser versionado. Como alternativa, configure:

```text
CYPRESS_email=usuario.de.teste@example.com
CYPRESS_senha=substitua-pela-senha-da-conta-de-teste
```

No GitHub Actions, os secrets esperados são `TEST_USER_EMAIL` e `TEST_USER_PASSWORD`. Credenciais válidas não ficam em fixtures; dados negativos e payloads fictícios permanecem versionados para garantir rastreabilidade.

## Execução manual

### Validação funcional rápida

```bash
npm run lint
npm audit --audit-level=high
npm run test:all
npm run report
```

Resultado funcional esperado: 24 cenários executados, sem falhas ou pendências. O relatório será gerado em `cypress/evidencias/cucumber-report.html`.

### Validação completa antes de uma release

Execute um comando por vez e interrompa no primeiro erro:

```bash
npm ci
npm run cy:verify
npm run lint
npm audit --audit-level=high
npm run test:all
npm run report
npm run test:perf
npm run test:perf:challenge
npm run test:lighthouse
```

Os cenários usam serviços públicos. Uma indisponibilidade, bloqueio ou alteração do Automation Exercise/Trello pode causar falha externa ao framework; nesse caso, registre a evidência e confirme a disponibilidade do alvo antes de reexecutar.

## Comandos disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm test` | Atalho para a suíte completa de 24 cenários |
| `npm run cy:open` | Abre a interface interativa do Cypress |
| `npm run cy:verify` | Verifica o binário do Cypress 15.20.0 |
| `npm run lint` | Executa a análise estática JavaScript |
| `npm run test:all` | Executa Web, API e segurança |
| `npm run test:e2e` | Executa os 21 cenários sem a feature de API |
| `npm run test:api` | Executa os 3 cenários de API |
| `npm run test:security` | Executa os 4 cenários de SQLi/XSS |
| `npm run test:perf` | Executa o perfil completo do k6 |
| `npm run test:perf:challenge` | Executa 10 VUs por 30 segundos no Trello |
| `npm run test:lighthouse` | Executa três medições e aplica o gate pela mediana |
| `npm run report` | Gera o relatório HTML do Cucumber |
| `npm run metadata` | Gera metadados reproduzíveis da execução |
| `npm run evidence:api` | Executa GET, POST e cleanup e grava evidência JSON |
| `npm run evidence:api:check` | Valida o gerador de evidências sem gravar saída |
| `npm run xray:check` | Valida a carga Cucumber para o Xray sem enviar |
| `npm run xray:upload` | Envia resultados ao Xray com credenciais configuradas |

## Testes de API

### Trello

O cenário consulta uma ação pública e valida:

- status HTTP 200;
- `Content-Type` JSON;
- identificador e campos essenciais;
- estrutura pelo `trelloActionSchema.json`;
- nome da lista registrado como evidência.

### Automation Exercise

Os cenários validam:

- criação de conta com e-mail e senha dinâmicos;
- transporte HTTP 200 e regra de negócio 201;
- schema e mensagem de criação;
- rejeição da segunda conta com o mesmo e-mail;
- regra de negócio 400 e schema de erro;
- tempo de resposta inferior a 2 segundos;
- remoção da conta em hook de cleanup, também validada por schema.

A coleção `docs/postman/HCXpert_API.json` contém GET do Trello, POST de criação e DELETE de cleanup. O cliente `ApiClient` normaliza headers, parsing e tratamento de status, enquanto os serviços mantêm os endpoints fora dos steps.

### Evidências e Xray

```bash
npm run evidence:api
npm run xray:check
```

A evidência de API é gravada em `cypress/evidencias/api/api-evidencias.json`. Execute `npm run test:all` antes do dry-run do Xray para gerar o JSON Cucumber utilizado na validação. Para envio real, configure `XRAY_CLIENT_ID`, `XRAY_CLIENT_SECRET`, `XRAY_PROJECT_KEY` e, opcionalmente, `XRAY_BASE_URL`, conforme `.env.example`.

## Performance

### k6

O script `performance/k6_api_test.js` oferece três perfis:

- **smoke:** duas iterações por endpoint para pull requests;
- **full:** ramp-up, carga sustentada e ramp-down em dois endpoints;
- **challenge:** 10 VUs constantes durante 30 segundos no Trello.

Critérios bloqueantes:

- 100% dos checks funcionais;
- taxa de falha HTTP inferior a 1%;
- p95 inferior a 800 ms no Trello;
- p95 inferior a 3.000 ms no Automation Exercise.

### Lighthouse

O Lighthouse realiza três medições desktop e usa a mediana para reduzir variações. O gate exige:

- FCP menor ou igual a 3 segundos;
- LCP menor ou igual a 5 segundos.

Os limites são gates de regressão sobre um ambiente público, não uma certificação de capacidade do fornecedor.

## Segurança

- SQL Injection e XSS são exercitados em login e busca.
- Os testes verificam ausência de autenticação indevida, alerta executado, erro SQL e stack trace.
- `npm audit --audit-level=high` bloqueia vulnerabilidades altas ou críticas.
- Segredos locais e do CI não são versionados.
- O OWASP ZAP Baseline executa spider e análise passiva no pipeline após a suíte funcional.

Para executar o baseline localmente no PowerShell, com Docker ativo:

```powershell
docker run --rm -v "${PWD}/security:/zap/wrk/:rw" -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t https://www.automationexercise.com -c owasp_zap_config.conf -r zap-report.html -J zap-report.json
```

O baseline passivo não substitui SAST ou pentest. Nenhuma varredura ativa deve ser executada sem autorização explícita do responsável pelo ambiente.

## Relatórios e evidências

| Evidência | Local ou artefato |
| --- | --- |
| Cucumber HTML/JSON/NDJSON | `cypress/evidencias/` e GitHub Pages |
| Screenshots e vídeos Cypress | `cypress/screenshots/`, `cypress/videos/` e `evidencias-e2e` |
| Metadados de execução | `cypress/evidencias/execution-metadata.json` |
| Modo e elegibilidade | `cypress/evidencias/execution-mode.json` |
| Evidência de API | `cypress/evidencias/api/api-evidencias.json` |
| Auditoria de dependências | `evidencias-dependencias` |
| k6 full/challenge | `evidencias-performance` e `evidencias-performance-challenge` |
| Lighthouse | `evidencias-lighthouse` e GitHub Pages |
| OWASP ZAP | `evidencias-seguranca-zap` |

Os artefatos do GitHub Actions têm retenção de 30 dias. Os botões no início deste documento apontam para o workflow e para os relatórios públicos mais recentes.

## CI/CD e critério de release

O workflow `.github/workflows/main.yml` é executado em push, pull request e acionamento manual. Ele configura Node pela `.nvmrc`, usa `npm ci`, cacheia e verifica o Cypress, executa lint, auditoria de dependências, testes, k6, Lighthouse, metadados e publicação de artefatos.

O resultado é classificado como:

- **FULL:** ambiente externo disponível e suíte completa executada.
- **DEGRADED:** dependência externa indisponível; apenas verificações independentes são executadas e registradas.

Um push na `main` somente é elegível para release quando estiver em modo **FULL** e a suíte funcional, k6 full, k6 challenge, Lighthouse e relatório Cucumber estiverem aprovados. Uma execução `DEGRADED` nunca autoriza release. O ZAP Baseline roda após a suíte funcional e não é executado em pull requests.

## Matriz de rastreabilidade

| Capacidade | Evidência principal | Situação |
| --- | --- | --- |
| JavaScript e Cypress 15.20.0 | `package.json`, lockfile e `cypress.config.js` | Implementado |
| Gherkin declarativo e separação Given/When/Then | Features, steps e contexts em `support/tasks` | Implementado |
| Page Objects e responsabilidades separadas | `page_objects`, `assertions`, `services` e `tasks` | Implementado |
| `homePage.js` e fixture de usuários | `support/page_objects/homePage.js` e `fixtures/users.json` | Implementado |
| Dados centralizados e dinâmicos | Fixtures, `UserFactory.js` e config | Implementado |
| Seletores padronizados | `selectors.js`, comandos e Page Objects | Parcial: há fallbacks do site externo |
| Login, busca, carrinho e checkout | Features 01 a 04 | Implementado |
| Validação detalhada do pedido | Endereço, item, quantidade, preço e total antes do pagamento | Parcial: a tela final não possui recibo detalhado |
| Falha HTTP e erro real de rede | `NetworkContext.js` e cenários de checkout | Implementado |
| API positiva, negativa, schemas e cleanup | Feature 05, `support/api` e schemas | Implementado |
| Postman, evidência de API e Xray | `docs/postman` e `scripts` | Implementado |
| SQLi/XSS nos fluxos cobertos | Feature 06 e payloads de segurança | Implementado |
| Auditoria de dependências e ZAP Baseline | Workflow e `security/` | Implementado |
| k6 com cenários, estágios, tags e thresholds | `performance/k6_api_test.js` | Implementado |
| Lighthouse com FCP/LCP bloqueantes | `scripts/run-lighthouse.js` | Implementado |
| Execução headless sem esperas fixas | Scripts npm, interceptações e sincronização por estado | Implementado |
| Relatório Cucumber HTML/JSON/NDJSON | Configuração Cucumber e `generate-report.js` | Implementado |
| CI reproduzível, metadados e artefatos | Workflow, `.nvmrc` e lockfile | Implementado |
| Imagem Docker própria para a suíte | Não disponível | Não implementado |

## Limitações conhecidas

- Automation Exercise e Trello são serviços públicos sem controle de disponibilidade ou massa.
- Alguns elementos exigem fallback por classe ou estrutura do DOM.
- A tela final confirma o pedido, mas não apresenta um recibo detalhado.
- k6 e Lighthouse variam conforme rede, anúncios e carga externa.
- O ZAP Baseline é passivo e não substitui SAST ou pentest.
- A suíte não possui imagem Docker própria, SBOM, verificação de licenças, secret scanning ou SAST dedicados no workflow.
- As GitHub Actions usam versões por tag, não hashes SHA imutáveis.
- No Windows, o Lighthouse pode emitir aviso `EPERM` ao limpar perfis temporários sem reprovar as métricas.

## Uso responsável

As massas versionadas são fictícias. Utilize uma conta exclusiva para testes, não publique segredos em logs ou artefatos e obtenha autorização antes de executar qualquer teste ativo de segurança contra ambientes que não estejam sob seu controle.
