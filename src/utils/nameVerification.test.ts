import test from 'node:test';
import assert from 'node:assert/strict';
import { verifySeanAccess, normalizeName } from './nameVerification';

test('normalizeName correctly strips accents and lowercases', () => {
  assert.equal(normalizeName('Seán'), 'sean');
  assert.equal(normalizeName('  SHAUN  '), 'shaun');
  assert.equal(normalizeName('Séan'), 'sean');
});

test('identifies Simon variants and flags them as isSimon', () => {
  const result1 = verifySeanAccess('Simon');
  assert.equal(result1.isSimon, true);
  assert.equal(result1.allowed, false);

  const result2 = verifySeanAccess('simon cowell');
  assert.equal(result2.isSimon, true);
  assert.equal(result2.allowed, false);

  const result3 = verifySeanAccess('Symon');
  assert.equal(result3.isSimon, true);
  assert.equal(result3.allowed, false);

  const result4 = verifySeanAccess('Simone');
  assert.equal(result4.isSimon, true);
  assert.equal(result4.allowed, false);
});

test('accepts all Sean spelling variations', () => {
  const seans = [
    { input: 'Sean', expected: 'Sean' },
    { input: 'Sean Ryan', expected: 'Sean' },
    { input: 'Shaun', expected: 'Shaun' },
    { input: 'Shaun White', expected: 'Shaun' },
    { input: 'Shawn', expected: 'Shawn' },
    { input: 'Shawn Mendes', expected: 'Shawn' },
    { input: 'Seán', expected: 'Seán' },
    { input: 'Seán O\'Connor', expected: 'Seán' },
    { input: 'Sion', expected: 'Sion' },
    { input: 'Shon', expected: 'Shon' },
    { input: 'Shane', expected: 'Shane' },
  ];

  for (const { input, expected } of seans) {
    const res = verifySeanAccess(input);
    assert.equal(res.allowed, true, `Expected "${input}" to be allowed`);
    assert.equal(res.isSimon, false);
    assert.equal(res.matchedSpelling, expected, `Expected spelling "${expected}" for "${input}"`);
  }
});

test('rejects non-Sean non-Simon names without triggering Simon error', () => {
  const imposters = ['David', 'Bob', 'Alice', 'Michael', 'Chris'];
  for (const name of imposters) {
    const res = verifySeanAccess(name);
    assert.equal(res.allowed, false);
    assert.equal(res.isSimon, false);
  }
});

test('handles empty and whitespace input', () => {
  const res = verifySeanAccess('   ');
  assert.equal(res.allowed, false);
  assert.equal(res.isSimon, false);
});
