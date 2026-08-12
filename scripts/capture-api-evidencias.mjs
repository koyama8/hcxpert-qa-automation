import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const defaultTemplate = path.join(
  scriptDirectory,
  'templates',
  'api-evidence-template.json',
);
const defaultOutput = path.join(
  projectRoot,
  'cypress',
  'evidencias',
  'api',
  'api-evidencias.json',
);
const trelloActionUrl =
  'https://api.trello.com/1/actions/592f11060f95a3d3d46a987a';
const accountUrl =
  'https://www.automationexercise.com/api/createAccount';
const deleteAccountUrl =
  'https://www.automationexercise.com/api/deleteAccount';

const parseArguments = (argumentsList) => {
  const options = {
    dryRun: false,
    output: defaultOutput,
    template: defaultTemplate,
    timeoutMs: 15000,
  };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];

    if (argument === '--dry-run') {
      options.dryRun = true;
    } else if (argument === '--output') {
      options.output = path.resolve(argumentsList[++index] || '');
    } else if (argument === '--template') {
      options.template = path.resolve(argumentsList[++index] || '');
    } else if (argument === '--timeout') {
      options.timeoutMs = Number(argumentsList[++index]);
    } else if (argument === '--help') {
      options.help = true;
    } else {
      throw new Error(`Argumento desconhecido: ${argument}`);
    }
  }

  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 1000) {
    throw new Error('--timeout deve ser um numero inteiro de ao menos 1000 ms.');
  }

  return options;
};

const printHelp = () => {
  console.log(`Uso: node scripts/capture-api-evidencias.mjs [opcoes]

Opcoes:
  --dry-run             Valida configuracao e template sem chamar APIs ou gravar arquivos
  --output <arquivo>    Destino da evidencia JSON
  --template <arquivo>  Template JSON de evidencia
  --timeout <ms>        Timeout por requisicao (padrao: 15000)
  --help                Exibe esta ajuda`);
};

const parseJsonResponse = (text) => {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_error) {
    return text;
  }
};

const selectedHeaders = (headers) => ({
  'content-type': headers.get('content-type'),
  'cache-control': headers.get('cache-control'),
  'x-content-type-options': headers.get('x-content-type-options'),
});

const executeRequest = async ({ body, headers, method, timeoutMs, url }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = performance.now();

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
      signal: controller.signal,
    });
    const responseText = await response.text();

    return {
      status: response.status,
      durationMs: Math.round(performance.now() - startedAt),
      headers: selectedHeaders(response.headers),
      body: parseJsonResponse(responseText),
    };
  } finally {
    clearTimeout(timeout);
  }
};

const check = (name, passed, actual, expected, severity = 'error') => ({
  name,
  passed: Boolean(passed),
  actual,
  expected,
  severity,
});

const contentTypeIsJson = (headers) =>
  headers['content-type']?.toLowerCase().includes('application/json') === true;

const buildAccountData = () => {
  const suffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;

  return {
    name: 'Usuario Teste HCXpert',
    email: `hcxpert.evidencia.${suffix}@example.com`,
    password: `Qa@${crypto.randomBytes(12).toString('base64url')}`,
    title: 'Mr',
    birth_date: '10',
    birth_month: '5',
    birth_year: '1999',
    firstname: 'Usuario',
    lastname: 'Teste',
    company: 'Empresa Ficticia',
    address1: 'Rua Ficticia, 100',
    address2: 'Bairro Teste',
    country: 'Canada',
    zipcode: '10001',
    state: 'Ontario',
    city: 'Toronto',
    mobile_number: '00000000000',
  };
};

const sanitizeAccountData = (accountData) => ({
  ...accountData,
  email: '<dynamic-email-redacted>',
  password: '<redacted>',
});

const toFormBody = (data) => new URLSearchParams(data).toString();

const createInteraction = ({ checks, name, request, response }) => ({
  name,
  request,
  response,
  checks,
  passed: checks
    .filter((item) => item.severity === 'error')
    .every((item) => item.passed),
});

const captureTrello = async (timeoutMs) => {
  const response = await executeRequest({
    method: 'GET',
    url: trelloActionUrl,
    timeoutMs,
    headers: { accept: 'application/json' },
  });
  const checks = [
    check('status HTTP', response.status === 200, response.status, 200),
    check(
      'content-type JSON',
      contentTypeIsJson(response.headers),
      response.headers['content-type'],
      'application/json',
      'warning',
    ),
    check(
      'identificador da acao',
      response.body?.id === '592f11060f95a3d3d46a987a',
      response.body?.id,
      '592f11060f95a3d3d46a987a',
    ),
    check(
      'nome da lista preenchido',
      typeof response.body?.data?.list?.name === 'string' &&
        response.body.data.list.name.length > 0,
      response.body?.data?.list?.name ?? null,
      'string nao vazia',
    ),
  ];

  return createInteraction({
    name: 'GET Trello - consultar acao existente',
    request: {
      method: 'GET',
      url: trelloActionUrl,
      headers: { accept: 'application/json' },
    },
    response,
    checks,
  });
};

const captureAccountLifecycle = async (timeoutMs) => {
  const accountData = buildAccountData();
  const headers = {
    accept: 'application/json',
    'content-type': 'application/x-www-form-urlencoded',
  };
  let creationResponse;
  let creationInteraction;
  let cleanupInteraction;

  try {
    creationResponse = await executeRequest({
      method: 'POST',
      url: accountUrl,
      timeoutMs,
      headers,
      body: toFormBody(accountData),
    });
    const checks = [
      check('status HTTP', creationResponse.status === 200, creationResponse.status, 200),
      check(
        'content-type JSON',
        contentTypeIsJson(creationResponse.headers),
        creationResponse.headers['content-type'],
        'application/json',
        'warning',
      ),
      check(
        'codigo de negocio',
        creationResponse.body?.responseCode === 201,
        creationResponse.body?.responseCode,
        201,
      ),
      check(
        'mensagem de criacao',
        creationResponse.body?.message === 'User created!',
        creationResponse.body?.message,
        'User created!',
      ),
      check(
        'tempo de resposta',
        creationResponse.durationMs < 2000,
        creationResponse.durationMs,
        '< 2000 ms',
      ),
    ];

    creationInteraction = createInteraction({
      name: 'POST Automation Exercise - criar conta',
      request: {
        method: 'POST',
        url: accountUrl,
        headers,
        body: sanitizeAccountData(accountData),
      },
      response: creationResponse,
      checks,
    });
  } finally {
    if (creationResponse?.body?.responseCode === 201) {
      const cleanupResponse = await executeRequest({
        method: 'DELETE',
        url: deleteAccountUrl,
        timeoutMs,
        headers,
        body: toFormBody({
          email: accountData.email,
          password: accountData.password,
        }),
      });
      const cleanupChecks = [
        check('status HTTP', cleanupResponse.status === 200, cleanupResponse.status, 200),
        check(
          'content-type JSON',
          contentTypeIsJson(cleanupResponse.headers),
          cleanupResponse.headers['content-type'],
          'application/json',
          'warning',
        ),
        check(
          'codigo de negocio',
          cleanupResponse.body?.responseCode === 200,
          cleanupResponse.body?.responseCode,
          200,
        ),
        check(
          'mensagem de remocao',
          cleanupResponse.body?.message === 'Account deleted!',
          cleanupResponse.body?.message,
          'Account deleted!',
        ),
      ];

      cleanupInteraction = createInteraction({
        name: 'DELETE Automation Exercise - remover conta temporaria',
        request: {
          method: 'DELETE',
          url: deleteAccountUrl,
          headers,
          body: {
            email: '<dynamic-email-redacted>',
            password: '<redacted>',
          },
        },
        response: cleanupResponse,
        checks: cleanupChecks,
      });

      if (!cleanupInteraction.passed) {
        throw new Error('Cleanup da conta temporaria falhou.');
      }
    }
  }

  return [creationInteraction, cleanupInteraction].filter(Boolean);
};

const loadTemplate = async (templatePath) => {
  const template = JSON.parse(await fs.readFile(templatePath, 'utf8'));

  if (
    template.schemaVersion !== 1 ||
    !Array.isArray(template.interactions) ||
    typeof template.summary !== 'object'
  ) {
    throw new Error('Template de evidencia possui estrutura invalida.');
  }

  return template;
};

const main = async () => {
  const options = parseArguments(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const evidence = await loadTemplate(options.template);

  if (options.dryRun) {
    console.log('Validacao concluida: template e argumentos estao validos.');
    return;
  }

  evidence.generatedAt = new Date().toISOString();
  evidence.executionId = crypto.randomUUID();
  evidence.environment = {
    node: process.version,
    platform: process.platform,
    architecture: process.arch,
    hostnameHash: crypto
      .createHash('sha256')
      .update(os.hostname())
      .digest('hex')
      .slice(0, 12),
  };
  evidence.interactions = [await captureTrello(options.timeoutMs)];
  evidence.interactions.push(
    ...(await captureAccountLifecycle(options.timeoutMs)),
  );

  const checks = evidence.interactions.flatMap((item) => item.checks);
  const failedErrors = checks.filter(
    (item) => !item.passed && item.severity === 'error',
  );
  evidence.summary = {
    passed: failedErrors.length === 0,
    checks: checks.length,
    failures: failedErrors.length,
    warnings: checks.filter(
      (item) => !item.passed && item.severity === 'warning',
    ).length,
  };

  await fs.mkdir(path.dirname(options.output), { recursive: true });
  await fs.writeFile(options.output, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Evidencia de API gerada em ${path.relative(projectRoot, options.output)}`);

  if (!evidence.summary.passed) {
    throw new Error('Uma ou mais validacoes de API falharam.');
  }
};

main().catch((error) => {
  const message = error.name === 'AbortError'
    ? 'Uma requisicao excedeu o timeout configurado.'
    : error.message;
  console.error(`Falha ao capturar evidencias: ${message}`);
  process.exitCode = 1;
});
