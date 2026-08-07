const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://www.automationexercise.com/';
const NUMBER_OF_RUNS = 3;
const FCP_THRESHOLD_MS = 1800;
const LCP_THRESHOLD_MS = 2500;
const outputDir = path.resolve('performance/lighthouse');

const median = (values) => {
  const ordered = [...values].sort((first, second) => first - second);
  return ordered[Math.floor(ordered.length / 2)];
};

const getMetric = (report, auditId) => {
  const audit = report.audits[auditId];

  return {
    value: Math.round(audit.numericValue),
    displayValue: audit.displayValue,
    score: audit.score,
  };
};

const closeChrome = async (chrome) => {
  if (!chrome) return;

  try {
    await chrome.kill();
  } catch (error) {
    // O Chrome pode manter sua pasta temporária bloqueada por alguns instantes no Windows.
    // O relatório já foi coletado neste ponto, portanto preservamos a evidência gerada.
    console.warn(`Aviso ao encerrar o Chrome: ${error.message}`);
  }
};

const run = async () => {
  const [{ default: lighthouse }, chromeLauncher, { default: desktopConfig }] =
    await Promise.all([
      import('lighthouse'),
      import('chrome-launcher'),
      import('lighthouse/core/config/desktop-config.js'),
    ]);

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const runs = [];

  for (let index = 1; index <= NUMBER_OF_RUNS; index += 1) {
    console.log(`Executando Lighthouse (${index}/${NUMBER_OF_RUNS})...`);
    let chrome;

    try {
      chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
      });

      const result = await lighthouse(
        TARGET_URL,
        {
          port: chrome.port,
          logLevel: 'error',
          output: 'html',
          onlyCategories: ['performance'],
        },
        desktopConfig,
      );

      if (!result) {
        throw new Error('O Lighthouse não retornou um resultado.');
      }

      const report = result.lhr;
      const html = Array.isArray(result.report)
        ? result.report[0]
        : result.report;
      const baseName = `lighthouse-run-${index}`;
      const htmlPath = path.join(outputDir, `${baseName}.html`);
      const jsonPath = path.join(outputDir, `${baseName}.json`);

      fs.writeFileSync(htmlPath, html);
      fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);

      runs.push({
        index,
        htmlPath,
        jsonPath,
        report,
        performanceScore: Math.round(report.categories.performance.score * 100),
        firstContentfulPaint: getMetric(report, 'first-contentful-paint'),
        largestContentfulPaint: getMetric(report, 'largest-contentful-paint'),
      });
    } finally {
      await closeChrome(chrome);
    }
  }

  const representativeRun = [...runs].sort(
    (first, second) => first.performanceScore - second.performanceScore,
  )[Math.floor(runs.length / 2)];
  const fcpMedian = median(runs.map((item) => item.firstContentfulPaint.value));
  const lcpMedian = median(runs.map((item) => item.largestContentfulPaint.value));

  fs.copyFileSync(
    representativeRun.htmlPath,
    path.join(outputDir, 'lighthouse-report.html'),
  );

  const summary = {
    url: representativeRun.report.finalDisplayedUrl,
    generatedAt: new Date().toISOString(),
    numberOfRuns: NUMBER_OF_RUNS,
    representativeRun: representativeRun.index,
    performanceScore: representativeRun.performanceScore,
    firstContentfulPaint: {
      median: fcpMedian,
      threshold: FCP_THRESHOLD_MS,
      passed: fcpMedian <= FCP_THRESHOLD_MS,
    },
    largestContentfulPaint: {
      median: lcpMedian,
      threshold: LCP_THRESHOLD_MS,
      passed: lcpMedian <= LCP_THRESHOLD_MS,
    },
  };

  fs.writeFileSync(
    path.join(outputDir, 'lighthouse-summary.json'),
    `${JSON.stringify(summary, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    `${JSON.stringify(
      runs.map((item) => ({
        run: item.index,
        representative: item.index === representativeRun.index,
        performanceScore: item.performanceScore,
        firstContentfulPaint: item.firstContentfulPaint.value,
        largestContentfulPaint: item.largestContentfulPaint.value,
      })),
      null,
      2,
    )}\n`,
  );

  console.log('Resumo da auditoria Lighthouse:');
  console.log(JSON.stringify(summary, null, 2));

  if (!summary.firstContentfulPaint.passed) {
    console.warn(`FCP acima do limite de ${FCP_THRESHOLD_MS} ms.`);
  }
  if (!summary.largestContentfulPaint.passed) {
    console.warn(`LCP acima do limite de ${LCP_THRESHOLD_MS} ms.`);
  }
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
