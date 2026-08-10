# Registro de risco de dependências

## Auditoria de 10/08/2026

### Resultado

- Dependências de produção: nenhuma vulnerabilidade conhecida (`npm audit --omit=dev`).
- Dependências de desenvolvimento: 3 vulnerabilidades transitivas (1 alta, 1 moderada e 1 baixa).
- Vulnerabilidades removidas nesta etapa: 4, por meio da atualização do Cypress 14.1.0 para 15.20.0.

### Risco transitivo aceito temporariamente

As vulnerabilidades restantes estão na cadeia de desenvolvimento abaixo:

```text
@badeball/cypress-cucumber-preprocessor@26.0.0
└── mocha@11.8.0
    ├── serialize-javascript@6.0.2
    └── diff@7.0.0
```

Essa cadeia é usada na preparação e geração dos testes BDD; ela não é embarcada em uma aplicação de produção. O `npm audit fix` não encontrou uma atualização compatível. Forçar versões principais por `overrides` poderia quebrar o preprocessor e foi rejeitado sem uma validação oficial do upstream.

### Controles compensatórios

- O projeto não processa features ou configurações provenientes de usuários não confiáveis no CI.
- Pull requests externos não recebem os secrets de autenticação do ambiente.
- O lockfile permanece versionado e a instalação do CI usa `npm ci`.
- A auditoria de produção deve continuar bloqueando qualquer vulnerabilidade alta ou crítica.

### Tratamento

- Responsável: mantenedor do projeto.
- Prazo para revisão: 10/09/2026.
- Ação: atualizar o preprocessor/Mocha assim que houver uma versão compatível que incorpore `serialize-javascript` e `diff` corrigidos; em seguida, executar novamente `npm audit` e toda a suíte.
- Alternativa: avaliar a substituição do preprocessor caso não exista correção upstream até a data de revisão.

### Migração de variáveis sensíveis do Cypress

Os steps do projeto foram migrados de `Cypress.env()` para a API assíncrona `cy.env()`. Entretanto, o `@badeball/cypress-cucumber-preprocessor@26.0.0` ainda usa `Cypress.env()` internamente para transportar metadados das features. Por esse motivo, ativar `allowCypressEnv: false` impede a criação dos testes antes da execução dos cenários.

O bloqueio global permanecerá desativado temporariamente até que o preprocessor seja compatível com a nova API. Não serão aceitas novas chamadas diretas a `Cypress.env()` no código do projeto. Esse item deve ser revisado juntamente com as vulnerabilidades transitivas até 10/09/2026.
