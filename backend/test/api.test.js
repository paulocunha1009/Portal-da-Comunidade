import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

process.env.VERCEL = '1';
process.env.RATE_LIMIT_GLOBAL_MIN = '50';
process.env.RATE_LIMIT_GLOBAL_DAY = '200';
process.env.REQUIRE_PERSISTENT_RATE_LIMIT = 'false';

const { default: app } = await import('../server.js');
let server;
let baseUrl;

before(async () => {
  await new Promise(resolve => {
    server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('health informa serviço, modelo e limites sem expor segredos', async () => {
  const response = await fetch(`${baseUrl}/health`, {
    headers: { Origin: 'https://fabcampo.com.br' },
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://fabcampo.com.br');
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.service, 'portal-comunidade-api');
  assert.equal(body.limits.globalDay, 200);
  assert.equal('apiKey' in body, false);
});

test('CORS bloqueia origem não autorizada', async () => {
  const response = await fetch(`${baseUrl}/health`, {
    headers: { Origin: 'https://origem-invalida.test' },
  });
  assert.equal(response.status, 403);
  assert.equal((await response.json()).code, 'ORIGIN_BLOCKED');
});

test('rota de IA orienta contingência quando não há chave', async () => {
  const response = await fetch(`${baseUrl}/api/assistente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://fabcampo.com.br' },
    body: JSON.stringify({ message: 'Olá', history: [] }),
  });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, 'AI_NOT_CONFIGURED');
});

test('corpo acima do limite é rejeitado', async () => {
  const response = await fetch(`${baseUrl}/api/assistente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'x'.repeat(25_000) }),
  });
  assert.equal(response.status, 413);
  assert.equal((await response.json()).code, 'PAYLOAD_TOO_LARGE');
});
