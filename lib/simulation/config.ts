import { ChoiceId, State } from '@/lib/types';

export const INITIAL_STATE: State = { cash: 10000, time: 30, trust: 1 };

export const TRUST_BANDS = ['Low', 'Medium', 'High'] as const;

export const PHASES = [
  {
    phase: 1,
    prompt: 'You receive £10,000… You have 7 days to make your first serious move. What do you do first?',
    choices: [
      { id: 'C01', label: 'Validation sprint first', delta: { cash: -500, time: -7, trust: 0 } },
      { id: 'C02', label: 'Branding first', delta: { cash: -1500, time: -7, trust: 1 } },
      { id: 'C03', label: 'Build first', delta: { cash: -2000, time: -7, trust: 0 } },
      { id: 'C04', label: 'Announce momentum first', delta: { cash: -250, time: -7, trust: 1 } }
    ]
  },
  {
    phase: 2,
    prompt: 'You must decide how to deploy the remaining money. How do you allocate your capital?',
    choices: [
      { id: 'C05', label: 'Balanced configuration', delta: { cash: -4500, time: -11, trust: 1 } },
      { id: 'C06', label: 'Marketing-heavy allocation', delta: { cash: -6500, time: -11, trust: 1 } },
      { id: 'C07', label: 'Build-heavy allocation', delta: { cash: -6000, time: -11, trust: 0 } },
      { id: 'C08', label: 'Ego/lifestyle spending', delta: { cash: -7000, time: -11, trust: -1 } }
    ]
  },
  {
    phase: 3,
    prompt: 'Signals are mixed… A friend says ‘frame it as strong traction’. How do you communicate progress?',
    choices: [
      { id: 'C13', label: 'Honest transparency', delta: { cash: -250, time: -7, trust: 1 } },
      { id: 'C14', label: 'Inflate traction', delta: { cash: 0, time: -7, trust: 1 } },
      { id: 'C15', label: 'Manipulative scarcity', delta: { cash: 0, time: -7, trust: 1 } },
      { id: 'C16', label: 'Hide negatives', delta: { cash: 0, time: -7, trust: 0 } }
    ]
  },
  {
    phase: 4,
    prompt: 'Final week… What do you put in place for the next month?',
    choices: [
      { id: 'C17', label: 'Governance + stop rules', delta: { cash: -250, time: -5, trust: 1 } },
      { id: 'C18', label: 'No system', delta: { cash: 0, time: -5, trust: -1 } },
      { id: 'C19', label: 'Spend aggressively', delta: { cash: -1500, time: -5, trust: 0 } },
      { id: 'C20', label: 'Give away control', delta: { cash: 0, time: -5, trust: -1 } }
    ]
  }
] as const;

export const CONSEQUENCES: Record<ChoiceId, { consequence: string; hiddenAssumption: string; mechanism: string; tradeOff: string; tool: string }> = {
  C01: { consequence: 'You speak to real potential customers. Some are interested. Some are indifferent. You feel the discomfort of reality — but you also feel clarity rising.', hiddenAssumption: 'Truth is more valuable than comfort.', mechanism: 'Early-stage businesses win by reducing uncertainty, not by looking impressive.', tradeOff: 'You sacrificed short-term momentum for long-term direction.', tool: 'Have 15 conversations and ask: ‘What would make you pay for this today?’' },
  C02: { consequence: 'Your brand looks clean. Your website looks credible. People take you slightly more seriously. But you still don’t know if your offer truly converts.', hiddenAssumption: 'Looking credible creates demand.', mechanism: 'Brand increases trust — but trust without demand is still failure.', tradeOff: 'You gained perception but delayed learning.', tool: 'Before branding, test willingness-to-pay with 5 prospects. If nobody pays, branding won’t save it.' },
  C03: { consequence: 'You build quickly. You feel productive. But the closer you get to ‘launch,’ the more you realise: you still don’t know what customers truly want.', hiddenAssumption: 'Building creates clarity.', mechanism: 'Building without evidence creates sunk cost.', tradeOff: 'You gained progress but increased the risk of building the wrong thing.', tool: 'Build the smallest testable version: landing page + pricing + ‘buy now’ button.' },
  C04: { consequence: 'People congratulate you. Some ask what you’re building. You feel momentum — and pressure. Now you must live up to expectations you haven’t earned yet.', hiddenAssumption: 'Attention creates traction.', mechanism: 'Hype increases pressure. Pressure reduces learning.', tradeOff: 'You gained visibility but increased the cost of being wrong.', tool: 'Announce evidence, not momentum: ‘5 customers asked for this. I’m testing it.’' },
  C05: { consequence: 'You invest in learning and delivery, not just appearance. You keep a buffer. You feel less glamorous — but more stable.', hiddenAssumption: 'Survival requires configuration, not intensity.', mechanism: 'Businesses succeed by building repeatable capability under constraint.', tradeOff: 'You sacrificed speed for resilience.', tool: 'Use 4 buckets: Learn (validation), Build (prototype), Deliver (ops), Protect (buffer).' },
  C06: { consequence: 'Your reach increases quickly. Some people click. Some inquire. Your money burns fast — and you still don’t know if conversion will hold.', hiddenAssumption: 'Marketing can replace product truth.', mechanism: 'Marketing amplifies what already converts. It does not create conversion.', tradeOff: 'You gained speed but destroyed runway.', tool: 'Set a burn ceiling: if you can’t explain your funnel in 3 steps, pause ads.' },
  C07: { consequence: 'You build something strong. But you delay exposure to the market. You may be building quality — but not necessarily demand.', hiddenAssumption: 'Quality guarantees customers.', mechanism: 'Customers don’t buy quality. They buy relief from a problem.', tradeOff: 'You improved capability but weakened learning velocity.', tool: 'Ship in slices: prototype → sell → improve → sell again.' },
  C08: { consequence: 'Your setup looks impressive. But your runway collapses. You feel good today — and exposed tomorrow.', hiddenAssumption: 'Feeling like a founder improves outcomes.', mechanism: 'Capital is for uncertainty reduction — not comfort.', tradeOff: 'You gained identity reinforcement and lost survival.', tool: 'Before any spend, ask: ‘Does this reduce uncertainty or increase delivery capability?’' },
  C13: { consequence: 'Some people respect you more. Some people lose interest. But the right people lean in. Trust becomes durable.', hiddenAssumption: 'Trust compounds more than hype.', mechanism: 'Long-term credibility increases optionality.', tradeOff: 'You sacrificed short-term persuasion for long-term trust.', tool: 'Use a truth sandwich: what’s working, what’s not, what you will do next.' },
  C14: { consequence: 'Doors open faster. People respond to momentum. You feel relief. But now you must maintain a story that isn’t real.', hiddenAssumption: 'Ends justify means.', mechanism: 'Deception increases short-term access and destroys long-term survival.', tradeOff: 'You gained speed and sacrificed your trust horizon.', tool: 'If you can’t show proof, don’t claim it. Show process instead.' },
  C15: { consequence: 'You create urgency. People move faster. You get short-term wins. But you are training yourself to manipulate rather than build.', hiddenAssumption: 'Pressure is the same as demand.', mechanism: 'Manipulation creates compliance, not loyalty.', tradeOff: 'You gained conversion and sacrificed trust durability.', tool: 'Replace false scarcity with real scarcity: ‘Limited because delivery capacity is limited.’' },
  C16: { consequence: 'You avoid discomfort. You protect your image. But you also delay feedback — and you stay alone with uncertainty.', hiddenAssumption: 'If I hide weakness, I stay safe.', mechanism: 'Avoidance blocks learning and increases fragility.', tradeOff: 'You protected your ego and weakened your growth loop.', tool: 'Choose one accountability person; weekly report: 1 metric, 1 learning, 1 next action.' },
  C17: { consequence: 'You create stability. You become more predictable. You reduce panic decisions. Even if the business struggles, you now have a way to learn.', hiddenAssumption: 'Systems increase speed, not slow it.', mechanism: 'Governance prevents waste and protects learning.', tradeOff: 'You sacrificed spontaneity for compounding progress.', tool: 'Weekly Founder Review: cash runway, 1 metric, 1 experiment, 1 risk, 1 next move.' },
  C18: { consequence: 'You feel free. But you drift. You repeat emotional decisions. Progress becomes inconsistent.', hiddenAssumption: 'Intensity replaces discipline.', mechanism: 'Without review, you cannot detect waste.', tradeOff: 'You gained freedom and lost compounding.', tool: 'Every Friday write: ‘What did I learn, and what will I do next?’' },
  C19: { consequence: 'You push hard. You may create a spike. But you increase fragility. If results don’t convert, you now have no buffer.', hiddenAssumption: 'More spending equals faster success.', mechanism: 'Speed without learning is accelerated failure.', tradeOff: 'You gained intensity and sacrificed optionality.', tool: 'Before spending, ask: ‘What would I need to believe for this to work?’' },
  C20: { consequence: 'You reduce your stress. But you also reduce your agency. If you outsource thinking, you don’t develop as a founder.', hiddenAssumption: 'Someone else can carry your responsibility.', mechanism: 'Founders must own decisions to build capability.', tradeOff: 'You gained comfort and lost development.', tool: 'Delegate execution, not judgement. Keep ownership of priorities, metrics, trade-offs.' }
};

export function applyChoice(state: State, choiceId: ChoiceId): State {
  const choice = PHASES.flatMap((p) => p.choices).find((c) => c.id === choiceId);
  if (!choice) return state;
  return {
    cash: state.cash + choice.delta.cash,
    time: state.time + choice.delta.time,
    trust: Math.max(0, Math.min(2, state.trust + choice.delta.trust))
  };
}

export function trustBand(trust: number) {
  return TRUST_BANDS[Math.max(0, Math.min(2, trust))];
}
