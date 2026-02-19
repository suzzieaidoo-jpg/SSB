import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreAttempt } from '../lib/scoring/index.ts';
import { applyChoice, INITIAL_STATE } from '../lib/simulation/config.ts';

test('Disciplined Experimenter path is high and coherent', () => {
  const r = scoreAttempt(['C01','C05','C13','C17'], 2);
  assert.equal(r.patternLabel, 'Disciplined Experimenter');
  assert.ok(['L4','L5'].includes(r.readinessLevel));
  assert.equal(r.outcomeBand, 'Green');
});

test('Misuse path hard red flag caps at L2', () => {
  const r = scoreAttempt(['C08','C06','C16','C20'], 0);
  assert.equal(r.hardRedFlag, true);
  assert.equal(r.readinessLevel, 'L2');
});

test('Trust clamping is 0..2', () => {
  let s = { ...INITIAL_STATE };
  s = applyChoice(s, 'C02');
  s = applyChoice(s, 'C13');
  s = applyChoice(s, 'C17');
  assert.equal(s.trust, 2);
  s = applyChoice({ cash: 1, time: 1, trust: 0 }, 'C08');
  assert.equal(s.trust, 0);
});
