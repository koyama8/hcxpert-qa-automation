const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const raizProjeto = path.resolve(__dirname, '..');
const diretorioEvidencias = path.join(
  raizProjeto,
  'cypress',
  'evidencias',
);
const arquivoMensagens = path.join(
  diretorioEvidencias,
  'cucumber-messages.ndjson',
);
const arquivoHtml = path.join(
  diretorioEvidencias,
  'cucumber-report.html',
);

if (!fs.existsSync(arquivoMensagens)) {
  console.error(
    'Relatório NDJSON não encontrado. Execute uma suíte Cypress antes de gerar o HTML.',
  );
  process.exit(1);
}

const entradaPreprocessor = require.resolve(
  '@badeball/cypress-cucumber-preprocessor',
);
const formatadorHtml = path.join(
  path.dirname(entradaPreprocessor),
  'bin',
  'cucumber-html-formatter.js',
);
const mensagens = fs.readFileSync(arquivoMensagens, 'utf8');
const resultado = spawnSync(process.execPath, [formatadorHtml], {
  input: mensagens,
  encoding: 'utf8',
  maxBuffer: 50 * 1024 * 1024,
});

if (resultado.error) {
  throw resultado.error;
}

if (resultado.status !== 0) {
  console.error(resultado.stderr || 'Falha ao gerar relatório Cucumber HTML.');
  process.exit(resultado.status || 1);
}

fs.mkdirSync(diretorioEvidencias, { recursive: true });
fs.writeFileSync(arquivoHtml, resultado.stdout, 'utf8');

console.log(`Relatório Cucumber HTML gerado em: ${arquivoHtml}`);
