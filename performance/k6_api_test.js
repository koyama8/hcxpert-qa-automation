import http from 'k6/http';
import { check, sleep } from 'k6';

const TRELLO_ACTION_URL =
  'https://api.trello.com/1/actions/592f11060f95a3d3d46a987a';
const AUTOMATION_EXERCISE_PRODUCTS_URL =
  'https://www.automationexercise.com/api/productsList';
const isSmokeProfile = __ENV.K6_PROFILE === 'smoke';
const isAutomationExerciseAvailable =
  __ENV.K6_AUTOMATION_EXERCISE_AVAILABLE !== 'false';

const smokeScenarios = {
  trello_action: {
    executor: 'per-vu-iterations',
    exec: 'consultarAcaoTrello',
    vus: 1,
    iterations: 2,
    maxDuration: '20s',
    tags: { endpoint: 'trello_action', profile: 'smoke' },
  },
  automation_exercise_products: {
    executor: 'per-vu-iterations',
    exec: 'consultarProdutosAutomationExercise',
    vus: 1,
    iterations: 2,
    maxDuration: '20s',
    tags: { endpoint: 'automation_exercise_products', profile: 'smoke' },
  },
};

const fullScenarios = {
  trello_action: {
    executor: 'ramping-vus',
    exec: 'consultarAcaoTrello',
    startVUs: 0,
    stages: [
      { duration: '10s', target: 3 },
      { duration: '20s', target: 3 },
      { duration: '10s', target: 5 },
      { duration: '20s', target: 5 },
      { duration: '10s', target: 0 },
    ],
    gracefulRampDown: '5s',
    tags: { endpoint: 'trello_action', profile: 'full' },
  },
  automation_exercise_products: {
    executor: 'ramping-vus',
    exec: 'consultarProdutosAutomationExercise',
    startVUs: 0,
    stages: [
      { duration: '10s', target: 2 },
      { duration: '40s', target: 2 },
      { duration: '10s', target: 0 },
    ],
    gracefulRampDown: '5s',
    tags: { endpoint: 'automation_exercise_products', profile: 'full' },
  },
};

const selectedScenarios = isSmokeProfile ? smokeScenarios : fullScenarios;

export const options = {
  scenarios: isAutomationExerciseAvailable
    ? selectedScenarios
    : { trello_action: selectedScenarios.trello_action },
  thresholds: {
    'http_req_duration{endpoint:trello_action}': ['p(95)<800'],
    'http_req_failed{endpoint:trello_action}': ['rate<0.01'],
    'checks{endpoint:trello_action}': ['rate==1'],
    ...(isAutomationExerciseAvailable
      ? {
          'http_req_duration{endpoint:automation_exercise_products}': [
            'p(95)<3000',
          ],
          'http_req_failed{endpoint:automation_exercise_products}': [
            'rate<0.01',
          ],
          'checks{endpoint:automation_exercise_products}': ['rate==1'],
        }
      : {}),
  },
};

const parseJson = (response) => {
  if (!response.body) return null;

  try {
    return response.json();
  } catch (_error) {
    return null;
  }
};

export function consultarAcaoTrello() {
  const response = http.get(TRELLO_ACTION_URL, {
    tags: { endpoint: 'trello_action' },
  });
  const payload = parseJson(response);

  check(
    response,
    {
      'Trello retorna status 200': (res) => res.status === 200,
      'Trello retorna JSON': (res) =>
        res.headers['Content-Type']?.includes('application/json'),
      'Trello retorna identificador da ação': () =>
        payload?.id === '592f11060f95a3d3d46a987a',
    },
    { endpoint: 'trello_action' },
  );

  sleep(1);
}

export function consultarProdutosAutomationExercise() {
  const response = http.get(AUTOMATION_EXERCISE_PRODUCTS_URL, {
    tags: { endpoint: 'automation_exercise_products' },
  });
  const payload = parseJson(response);

  check(
    response,
    {
      'Automation Exercise retorna status 200': (res) => res.status === 200,
      'Automation Exercise retorna produtos': () =>
        Array.isArray(payload?.products) && payload.products.length > 0,
    },
    { endpoint: 'automation_exercise_products' },
  );

  sleep(1);
}
