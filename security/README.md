# Segurança e DAST

Esta pasta contém a configuração de regras do OWASP ZAP para uma auditoria
baseline. O baseline utiliza spider e análise passiva; não executa ataques
ativos contra a aplicação alvo.

## Pré-requisito

- Docker em execução.

## Execução local

No PowerShell, a partir da raiz do projeto:

```powershell
docker run --rm -v "${PWD}/security:/zap/wrk/:rw" -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t https://www.automationexercise.com -c owasp_zap_config.conf -r zap-report.html -J zap-report.json
```

Os relatórios são gerados em `security/` e ignorados pelo Git. Antes de
executar qualquer varredura ativa, obtenha autorização explícita do responsável
pelo ambiente alvo.

Referência: https://www.zaproxy.org/docs/docker/baseline-scan/
