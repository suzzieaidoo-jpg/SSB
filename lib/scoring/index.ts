import { ChoiceId } from '@/lib/types';

const MAP: Record<ChoiceId, { S: number; L: number; I: number }> = {
  C01: { S: 4, L: 5, I: 4 }, C02: { S: 2, L: 2, I: 3 }, C03: { S: 3, L: 1, I: 4 }, C04: { S: 1, L: 1, I: 2 },
  C05: { S: 5, L: 4, I: 4 }, C06: { S: 2, L: 2, I: 3 }, C07: { S: 3, L: 1, I: 4 }, C08: { S: 0, L: 0, I: 0 },
  C13: { S: 4, L: 3, I: 5 }, C14: { S: 1, L: 1, I: 0 }, C15: { S: 1, L: 1, I: 0 }, C16: { S: 2, L: 2, I: 2 },
  C17: { S: 5, L: 3, I: 5 }, C18: { S: 1, L: 1, I: 2 }, C19: { S: 2, L: 1, I: 3 }, C20: { S: 2, L: 2, I: 2 }
};

const hardFlags: Partial<Record<ChoiceId, string>> = { C08: 'MISUSE', C14: 'DECEPTION_INFLATE', C15: 'DECEPTION_SCARCITY' };

export function scoreAttempt(choices: ChoiceId[], trust: number) {
  const sum = choices.reduce((a, c) => ({ S: a.S + MAP[c].S, L: a.L + MAP[c].L, I: a.I + MAP[c].I }), { S: 0, L: 0, I: 0 });
  const stewardshipScore = (sum.S / 20) * 100;
  const learningScore = (sum.L / 20) * 100;
  const integrityScore = (sum.I / 20) * 100;
  const totalScore = 0.4 * stewardshipScore + 0.3 * learningScore + 0.3 * integrityScore;

  let readinessLevel: 'L1'|'L2'|'L3'|'L4'|'L5' = totalScore < 40 ? 'L1' : totalScore < 55 ? 'L2' : totalScore < 70 ? 'L3' : totalScore < 85 ? 'L4' : 'L5';

  const hardChoice = choices.find((c) => hardFlags[c]);
  const hardRedFlag = Boolean(hardChoice);
  const hardRedFlagType = hardChoice ? hardFlags[hardChoice] : undefined;
  if (hardRedFlag && ['L3', 'L4', 'L5'].includes(readinessLevel)) readinessLevel = 'L2';

  const outcomeBand = trust === 2 && stewardshipScore >= 75 && integrityScore >= 75 ? 'Green' : trust === 0 || integrityScore <= 25 ? 'Red' : 'Amber';

  const patternLabel =
    choices.includes('C08') ? 'Misuse Risk' :
    choices.includes('C14') || choices.includes('C15') ? 'Trust Horizon Risk' :
    ['C01', 'C05', 'C13', 'C17'].every((c) => choices.includes(c as ChoiceId)) ? 'Disciplined Experimenter' :
    ((choices.includes('C02') || choices.includes('C04')) && choices.includes('C06')) ? 'Momentum-First Builder' :
    (choices.includes('C03') && choices.includes('C07')) ? 'Builder Without Market Loop' :
    (choices.includes('C16') && choices.includes('C18')) ? 'Reactive Operator' : 'Developing Operator';

  const strengths: string[] = [];
  const risks: string[] = [];
  const dims = [{ n: 'Stewardship', v: stewardshipScore }, { n: 'Learning', v: learningScore }, { n: 'Integrity', v: integrityScore }];
  const high = [...dims].sort((a,b)=>b.v-a.v)[0];
  const low = [...dims].sort((a,b)=>a.v-b.v)[0];
  if (high.v >= 70) strengths.push(`Strong ${high.n.toLowerCase()} orientation under constraint.`);
  if (choices.includes('C17')) strengths.push('You established governance and stop rules.');
  if (choices.includes('C01')) strengths.push('You prioritized validation and customer truth early.');
  if (!strengths.length) strengths.push('You completed the full cycle under pressure.');

  if (low.v <= 60) risks.push(`${low.n} is currently limiting your readiness.`);
  if (trust === 0) risks.push('Trust fragility is reducing long-term optionality.');
  if (hardRedFlag) risks.push('Trust horizon risk detected from high-risk decision behavior.');
  if (choices.includes('C18')) risks.push('Lack of review cadence may create decision drift.');
  if (!risks.length) risks.push('Keep tightening execution quality and learning loops.');

  return { stewardshipScore, learningScore, integrityScore, totalScore, readinessLevel, outcomeBand, patternLabel, hardRedFlag, hardRedFlagType, strengths: strengths.slice(0,3), risks: risks.slice(0,3) };
}

export { MAP as SCORE_MAP, hardFlags as HARD_RED_FLAGS };
