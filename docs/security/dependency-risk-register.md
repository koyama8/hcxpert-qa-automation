# Registro de risco de dependências

## Auditoria de 11/08/2026

### Resultado atual

- `npm audit`: nenhuma vulnerabilidade conhecida nas dependências de produção ou desenvolvimento.
- `npm audit --omit=dev`: nenhuma vulnerabilidade conhecida nas dependências de produção.
- O CI executa `npm audit --audit-level=high` e reprova quando encontra vulnerabilidade alta ou crítica.
- O relatório JSON da auditoria é preservado por 30 dias no artefato `evidencias-dependencias`.

### Tratamento da cadeia transitiva

O `@badeball/cypress-cucumber-preprocessor@26.0.0` instala o Mocha 11.8.0, que declarava versões vulneráveis de `diff` e `serialize-javascript`. Como não havia versão mais recente compatível do preprocessor, o tratamento foi limitado ao escopo interno do Mocha:

```text
@badeball/cypress-cucumber-preprocessor@26.0.0
└── mocha@11.8.0
    ├── diff@8.0.3 (override)
    └── serialize-javascript@7.1.0 (override)
```

O override não é global: outras dependências continuam usando as versões declaradas por seus próprios mantenedores. Após a alteração foram validados o carregamento do preprocessor e a suíte Cypress completa.

### Controles de manutenção

- O lockfile permanece versionado e o CI instala as dependências com `npm ci`.
- O gate de auditoria roda antes dos testes funcionais.
- A suíte completa deve ser executada após qualquer atualização do preprocessor, Mocha ou dos overrides.
- Os overrides devem ser removidos quando o upstream adotar versões corrigidas oficialmente.
- Responsável: mantenedor do projeto.
- Próxima revisão: 11/09/2026 ou antes, se houver alerta novo.

### Migração de variáveis sensíveis do Cypress

Os steps do projeto usam a API assíncrona `cy.env()` para valores sensíveis. Entretanto, o `@badeball/cypress-cucumber-preprocessor@26.0.0` ainda usa `Cypress.env()` internamente para transportar metadados das features. Por esse motivo, ativar `allowCypressEnv: false` impede a criação dos testes antes da execução dos cenários.

O bloqueio global permanece desativado temporariamente até que o preprocessor seja compatível com a nova API. Não são aceitas novas chamadas diretas a `Cypress.env()` no código do projeto. Esse item deve ser revisado na próxima atualização do preprocessor.
