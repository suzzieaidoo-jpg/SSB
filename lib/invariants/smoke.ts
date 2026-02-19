import { PHASES, INITIAL_STATE, CONSEQUENCES } from '@/lib/simulation/config';
import { SCORE_MAP, HARD_RED_FLAGS } from '@/lib/scoring';

function assert(cond: boolean, msg: string) { if (!cond) throw new Error(msg); }

const choices = PHASES.flatMap((p) => p.choices);
assert(PHASES.length === 4, 'Must have exactly 4 phases');
assert(choices.length === 16, 'Must have exactly 16 choices');
for (const c of choices) {
  assert(Boolean(c.label), `${c.id} label missing`);
  assert(Boolean(c.delta), `${c.id} delta missing`);
  const block = (CONSEQUENCES as any)[c.id];
  assert(Boolean(block?.consequence && block?.hiddenAssumption && block?.mechanism && block?.tradeOff && block?.tool), `${c.id} consequence block missing lines`);
  assert(Boolean((SCORE_MAP as any)[c.id]), `${c.id} missing score map`);
}
const phaseTime = PHASES.reduce((a, p) => a + p.choices[0].delta.time, 0);
assert(phaseTime === -30, 'Phase timeline must sum to -30');
assert(INITIAL_STATE.time === 30 && INITIAL_STATE.cash === 10000, 'Initial state missing');
assert(HARD_RED_FLAGS.C08 && HARD_RED_FLAGS.C14 && HARD_RED_FLAGS.C15, 'Hard red flags mismatch');
console.log('Smoke invariants passed');
