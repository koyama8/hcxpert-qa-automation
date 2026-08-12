const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const outputDirectory = path.resolve('cypress/evidencias');
const outputPath = path.join(outputDirectory, 'execution-metadata.json');

const readCommand = (command, args) => {
  const executable =
    process.platform === 'win32' && ['npm', 'npx'].includes(command)
      ? `${command}.cmd`
      : command;

  try {
    return execFileSync(executable, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch (_error) {
    return null;
  }
};

const hashFile = (filePath) => {
  if (!fs.existsSync(filePath)) return null;

  return crypto
    .createHash('sha256')
    .update(fs.readFileSync(filePath))
    .digest('hex');
};

const startedAt = process.env.EXECUTION_STARTED_AT || null;
const finishedAt = new Date();
const startedTimestamp = startedAt ? Date.parse(startedAt) : Number.NaN;
const gitSafeDirectory = `safe.directory=${process.cwd().replace(/\\/g, '/')}`;
const readGit = (args) =>
  readCommand('git', ['-c', gitSafeDirectory, ...args]);
const npmUserAgent = process.env.npm_config_user_agent || '';
const npmVersion = npmUserAgent.match(/npm\/([^\s]+)/)?.[1] || null;
const cypressVersion = require('cypress/package.json').version;

const metadata = {
  generatedAt: finishedAt.toISOString(),
  execution: {
    startedAt,
    finishedAt: finishedAt.toISOString(),
    durationSeconds: Number.isNaN(startedTimestamp)
      ? null
      : Math.max(0, Math.round((finishedAt.getTime() - startedTimestamp) / 1000)),
    commit: process.env.GITHUB_SHA || readGit(['rev-parse', 'HEAD']),
    branch: process.env.GITHUB_REF_NAME || readGit(['branch', '--show-current']),
    event: process.env.GITHUB_EVENT_NAME || 'local',
    runId: process.env.GITHUB_RUN_ID || null,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
  },
  environment: {
    runnerOs: process.env.RUNNER_OS || os.platform(),
    platform: os.platform(),
    architecture: os.arch(),
    node: process.version,
    npm: npmVersion,
    cypress: cypressVersion,
    browser: process.env.CYPRESS_BROWSER || 'electron',
  },
  testPolicy: {
    retriesRunMode: 0,
    retriesOpenMode: 0,
    note: 'Retries desativados para que instabilidades permaneçam visíveis.',
  },
  configurationHashes: {
    nodeVersion: hashFile(path.resolve('.nvmrc')),
    packageLock: hashFile(path.resolve('package-lock.json')),
    cypressConfig: hashFile(path.resolve('cypress.config.js')),
    workflow: hashFile(path.resolve('.github/workflows/main.yml')),
  },
};

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(metadata, null, 2)}\n`);
console.log(`Metadados de execução gerados em ${outputPath}`);
