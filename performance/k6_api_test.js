import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',

  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate==1'],
  },
};

export default function () {
  const response = http.get(
    'https://api.trello.com/1/actions/592f11060f95a3d3d46a987a',
  );

  check(response, {
    'status deve ser 200': (res) => res.status === 200,
    'resposta deve ter conteúdo': (res) => res.body.length > 0,
  });

  sleep(1);
}
