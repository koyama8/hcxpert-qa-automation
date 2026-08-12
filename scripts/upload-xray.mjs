import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const defaultResults = path.join(
  projectRoot,
  'cypress',
  'evidencias',
  'cucumber-report.json',
);
const defaultInfo = path.join(
  scriptDirectory,
  'templates',
  'xray-execution-info.json',
);
const defaultBaseUrl = 'https://xray.cloud.getxray.app/api/v2';

const parseArguments = (argumentsList) => {
  const options = {
    baseUrl: process.env.XRAY_BASE_URL || defaultBaseUrl,
    dryRun: false,
    info: defaultInfo,
    results: defaultResults,
  };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];

    if (argument === '--dry-run') {
      options.dryRun = true;
    } else if (argument === '--results') {
      options.results = path.resolve(argumentsList[++index] || '');
    } else if (argument === '--info') {
      options.info = path.resolve(argumentsList[++index] || '');
    } else if (argument === '--base-url') {
      options.baseUrl = argumentsList[++index] || '';
    } else if (argument === '--help') {
      options.help = true;
    } else {
      throw new Error(`Argumento desconhecido: ${argument}`);
    }
  }

  if (!/^https:\/\//.test(options.baseUrl)) {
    throw new Error('--base-url deve utilizar HTTPS.');
  }

  return options;
};

const printHelp = () => {
  console.log(`Uso: node scripts/upload-xray.mjs [opcoes]

Variaveis obrigatorias para upload:
  XRAY_CLIENT_ID       Client ID da API Xray Cloud
  XRAY_CLIENT_SECRET   Client secret da API Xray Cloud
  XRAY_PROJECT_KEY     Chave do projeto Jira/Xray

Opcoes:
  --dry-run            Valida resultados e template sem autenticar ou enviar
  --results <arquivo>  Relatorio Cucumber JSON
  --info <arquivo>     Template de Test Execution do Xray
  --base-url <url>     Base da API Xray Cloud
  --help               Exibe esta ajuda`);
};

const readJson = async (filePath, label) => {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`${label} invalido em ${filePath}: ${error.message}`);
  }
};

const validateCucumberResults = (results) => {
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('O relatorio Cucumber deve ser um array nao vazio.');
  }

  const scenarios = results.flatMap((feature) => feature.elements || []);
  if (scenarios.length === 0) {
    throw new Error('O relatorio Cucumber nao contem cenarios.');
  }

  return scenarios.length;
};

const materializeInfo = (template, projectKey) => {
  const timestamp = new Date().toISOString();
  const serialized = JSON.stringify(template)
    .replaceAll('{{XRAY_PROJECT_KEY}}', projectKey)
    .replaceAll('{{EXECUTION_TIMESTAMP}}', timestamp);

  if (/{{[^{}]+}}/.test(serialized)) {
    throw new Error('O template Xray contem placeholders nao resolvidos.');
  }

  const info = JSON.parse(serialized);
  if (info.fields?.project?.key !== projectKey || !info.fields?.summary) {
    throw new Error('O template Xray nao define projeto e resumo validos.');
  }

  return info;
};

const authenticate = async (baseUrl, clientId, clientSecret) => {
  const response = await fetch(`${baseUrl}/authenticate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Autenticacao Xray falhou com HTTP ${response.status}.`);
  }

  const token = responseText.replace(/^"|"$/g, '').trim();
  if (!token) throw new Error('A autenticacao Xray nao retornou um token.');

  return token;
};

const uploadResults = async ({ baseUrl, info, results, token }) => {
  const form = new FormData();
  form.append(
    'results',
    new Blob([JSON.stringify(results)], { type: 'application/json' }),
    'cucumber-report.json',
  );
  form.append(
    'info',
    new Blob([JSON.stringify(info)], { type: 'application/json' }),
    'xray-execution-info.json',
  );

  const response = await fetch(`${baseUrl}/import/execution/cucumber/multipart`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
    body: form,
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Upload Xray falhou com HTTP ${response.status}: ${responseText}`);
  }

  return responseText ? JSON.parse(responseText) : {};
};

const main = async () => {
  const options = parseArguments(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const [results, infoTemplate] = await Promise.all([
    readJson(options.results, 'Relatorio Cucumber'),
    readJson(options.info, 'Template Xray'),
  ]);
  const scenarioCount = validateCucumberResults(results);
  const projectKey = process.env.XRAY_PROJECT_KEY || 'HCX';
  const info = materializeInfo(infoTemplate, projectKey);

  if (options.dryRun) {
    console.log(
      `Validacao concluida: ${scenarioCount} cenarios prontos para o projeto ${projectKey}.`,
    );
    return;
  }

  const clientId = process.env.XRAY_CLIENT_ID;
  const clientSecret = process.env.XRAY_CLIENT_SECRET;

  if (!clientId || !clientSecret || !process.env.XRAY_PROJECT_KEY) {
    throw new Error(
      'Defina XRAY_CLIENT_ID, XRAY_CLIENT_SECRET e XRAY_PROJECT_KEY para realizar o upload.',
    );
  }

  const token = await authenticate(options.baseUrl, clientId, clientSecret);
  const result = await uploadResults({
    baseUrl: options.baseUrl,
    info,
    results,
    token,
  });
  const executionKey = result.key || result.testExecIssue?.key || 'nao informado';

  console.log(`Upload Xray concluido. Test Execution: ${executionKey}`);
};

main().catch((error) => {
  console.error(`Falha no upload para o Xray: ${error.message}`);
  process.exitCode = 1;
});
