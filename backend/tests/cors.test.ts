import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import express from 'express';
import { createCorsMiddleware } from '../src/config/cors';

function setEnvironment(
  t: { after: (callback: () => void) => void },
  values: Record<string, string | undefined>,
) {
  const previousValues = new Map(
    Object.keys(values).map((key) => [key, process.env[key]]),
  );

  t.after(() => {
    for (const [key, value] of previousValues) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

async function withCorsApp(run: (baseUrl: string) => Promise<void>) {
  const app = express();
  app.use(createCorsMiddleware());
  app.options('/api/resource', (_req, res) => res.sendStatus(200));
  app.patch('/api/resource', (_req, res) => res.sendStatus(200));
  const server = app.listen(0);
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await run(baseUrl);
  } finally {
    server.close();
    await once(server, 'close');
  }
}

test('development allows the local frontend and denies other origins', async (t) => {
  setEnvironment(t, {
    NODE_ENV: 'development',
    FRONTEND_URL: undefined,
  });

  await withCorsApp(async (baseUrl) => {
    const allowedPreflight = await fetch(`${baseUrl}/api/resource`, {
      method: 'OPTIONS',
      headers: {
        origin: 'http://localhost:3001',
        'access-control-request-method': 'PATCH',
        'access-control-request-headers': 'content-type,authorization',
      },
    });
    assert.equal(allowedPreflight.status, 204);
    assert.equal(
      allowedPreflight.headers.get('access-control-allow-origin'),
      'http://localhost:3001',
    );
    assert.match(
      allowedPreflight.headers.get('access-control-allow-headers') ?? '',
      /authorization/i,
    );
    assert.match(
      allowedPreflight.headers.get('access-control-allow-methods') ?? '',
      /OPTIONS/i,
    );
    assert.equal(
      allowedPreflight.headers.get('access-control-allow-credentials'),
      null,
    );

    const blockedPreflight = await fetch(`${baseUrl}/api/resource`, {
      method: 'OPTIONS',
      headers: {
        origin: 'https://unapproved.example.com',
        'access-control-request-method': 'GET',
      },
    });
    assert.equal(
      blockedPreflight.headers.get('access-control-allow-origin'),
      null,
    );
  });
});

test('production reflects only the configured Vercel origin', async (t) => {
  setEnvironment(t, {
    NODE_ENV: 'production',
    FRONTEND_URL: 'https://school-site.vercel.app',
  });

  await withCorsApp(async (baseUrl) => {
    const allowed = await fetch(`${baseUrl}/api/resource`, {
      method: 'OPTIONS',
      headers: {
        origin: 'https://school-site.vercel.app',
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'authorization,content-type',
      },
    });
    assert.equal(allowed.status, 204);
    assert.equal(
      allowed.headers.get('access-control-allow-origin'),
      'https://school-site.vercel.app',
    );
    assert.notEqual(allowed.headers.get('access-control-allow-origin'), '*');

    const denied = await fetch(`${baseUrl}/api/resource`, {
      method: 'OPTIONS',
      headers: {
        origin: 'https://another-site.vercel.app',
        'access-control-request-method': 'POST',
      },
    });
    assert.equal(denied.headers.get('access-control-allow-origin'), null);
  });
});

test('production requires a valid HTTPS frontend origin', (t) => {
  setEnvironment(t, { NODE_ENV: 'production', FRONTEND_URL: undefined });
  assert.throws(() => createCorsMiddleware(), /FRONTEND_URL must be set/);

  process.env.FRONTEND_URL = 'not-a-url';
  assert.throws(() => createCorsMiddleware(), /valid frontend origin/);

  process.env.FRONTEND_URL = 'http://school-site.example';
  assert.throws(() => createCorsMiddleware(), /HTTPS origin/);

  process.env.FRONTEND_URL = 'https://school-site.example/blogs';
  assert.throws(() => createCorsMiddleware(), /without a path/);
});
