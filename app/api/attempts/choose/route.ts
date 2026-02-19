import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { requireAuth } from '@/lib/authServer';
import { applyChoice, INITIAL_STATE } from '@/lib/simulation/config';
import { transitionAttempt } from '@/lib/attempts';

export async function POST(req: NextRequest) {
  const { uid } = await requireAuth(req);
  const { attemptId, phase, choiceId } = await req.json();
  const ref = adminDb.collection('attempts').doc(attemptId);
  const snap = await ref.get();
  const a = snap.data();
  if (!a || a.uid !== uid) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!['unlocked','in_progress'].includes(a.status)) return NextResponse.json({ error: 'Locked' }, { status: 400 });
  const field = `phase${phase}Choice`;
  if (a[field]) return NextResponse.json({ error: 'Phase already set' }, { status: 400 });
  const choices = [a.phase1Choice, a.phase2Choice, a.phase3Choice, a.phase4Choice].filter(Boolean);
  let state = { ...INITIAL_STATE };
  for (const c of choices) state = applyChoice(state, c);
  state = applyChoice(state, choiceId);
  await ref.set({ [field]: choiceId, status: transitionAttempt(a.status, 'start'), state, updatedAt: new Date().toISOString() }, { merge: true });
  return NextResponse.json({ state });
}
