import test from 'node:test';
import assert from 'node:assert/strict';
import type { Context } from '@netlify/functions';
import handler from '../netlify/functions/notes.mts';

const context = { cookies: { get: () => undefined } } as unknown as Context;
function request(method: string, body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://seans.ie/api/notes', {
    method, headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body),
  });
}

test('rejects cross-origin writes before accessing storage', async () => {
  const response = await handler(request('POST', {}, { origin: 'https://elsewhere.example' }), context);
  assert.equal(response.status, 403);
});

test('rejects non-JSON writes', async () => {
  const response = await handler(request('POST', {}, { 'Content-Type': 'text/plain' }), context);
  assert.equal(response.status, 415);
});

test('rejects malformed and null JSON', async () => {
  for (const body of ['{', 'null', '[]']) {
    const response = await handler(new Request('https://seans.ie/api/notes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
    }), context);
    assert.equal(response.status, 400);
  }
});

test('validates public note fields and enforces the Sean name rule', async () => {
  const valid = { authorName: 'Sean Ryan', content: 'Hello Seans!', color: 'yellow' };
  for (const invalid of [
    { ...valid, content: ' ' }, { ...valid, content: 'x'.repeat(1001) },
    { ...valid, authorName: 'Sean ' + 'x'.repeat(80) }, { ...valid, authorName: 'Simon' },
    { ...valid, color: 'invalid' }, { ...valid, content: 42 },
  ]) {
    assert.equal((await handler(request('POST', invalid), context)).status, 400);
  }
});

test('rejects oversized bodies', async () => {
  assert.equal((await handler(request('POST', { content: 'x'.repeat(9000) }), context)).status, 413);
});

test('does not allow deletion based on a claimed name', async () => {
  const response = await handler(request('DELETE', {
    id: '3c888376-b962-4ad2-ad72-9fdfb9315aec', authorName: 'Sean Ryan',
  }), context);
  assert.equal(response.status, 403);
});

test('rejects invalid IDs for likes and deletions', async () => {
  for (const method of ['PATCH', 'DELETE']) {
    assert.equal((await handler(request(method, { id: 'not-a-uuid' }), context)).status, 400);
  }
});

test('rejects unsupported methods', async () => {
  const response = await handler(new Request('https://seans.ie/api/notes', { method: 'PUT' }), context);
  assert.equal(response.status, 405);
});
