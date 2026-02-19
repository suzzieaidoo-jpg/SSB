import OpenAI from 'openai';

export function fallbackPersonalization(dream: string, lowest: string, pattern: string) {
  return {
    personalisedParagraph: `Your dream is clear: ${dream}. Your next growth edge is ${lowest.toLowerCase()}. As a ${pattern}, focus on tighter weekly decisions and honest signal tracking over the next 30 days.`,
    next14DaysBullets: [
      'Set one measurable weekly founder metric.',
      'Run one experiment tied to customer evidence.',
      'Cut one spend item without learning value.',
      'Share one honest update with stakeholders.',
      'Review runway, trust, and next trade-off Friday.'
    ],
    shareSummary: `I completed a founder readiness simulation for ${dream}. I’m focused on improving ${lowest.toLowerCase()} while building consistent governance and learning habits.`
  };
}

export async function generatePersonalization(input: { dream: string; lowest: string; pattern: string; readiness: string }) {
  if (!process.env.OPENAI_API_KEY) return fallbackPersonalization(input.dream, input.lowest, input.pattern);
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const rsp = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: `Return JSON with personalisedParagraph <=80 words, next14DaysBullets exactly 5 items <=14 words each, shareSummary <=60 words. Dream:${input.dream}. Lowest:${input.lowest}. Pattern:${input.pattern}. Readiness:${input.readiness}.`
  });
  const text = rsp.output_text;
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed.next14DaysBullets) || parsed.next14DaysBullets.length !== 5) throw new Error('invalid');
    return parsed;
  } catch {
    return fallbackPersonalization(input.dream, input.lowest, input.pattern);
  }
}
