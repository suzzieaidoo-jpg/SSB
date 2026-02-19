import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authServer';
import { adminDb } from '@/lib/firebaseAdmin';
import { scoreAttempt } from '@/lib/scoring';
import { transitionAttempt } from '@/lib/attempts';

export async function POST(req: NextRequest) {
  const { uid } = await requireAuth(req);
  const { attemptId } = await req.json();
  const ref = adminDb.collection('attempts').doc(attemptId);
  const snap = await ref.get();
  const a = snap.data();
  if (!a || a.uid !== uid) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (a.status === 'scored' || a.status === 'pdf_generated' || a.status === 'emailed') return NextResponse.json({ attempt: a });
  if (!a.allocationMemo || !a.decisionMemo || !a.dreamStatement) return NextResponse.json({ error: 'Evidence required' }, { status: 400 });
  const choices = [a.phase1Choice, a.phase2Choice, a.phase3Choice, a.phase4Choice];
  const result = scoreAttempt(choices, a.state?.trust ?? 1);
  await ref.set({ ...result, status: transitionAttempt(a.status, 'score'), updatedAt: new Date().toISOString() }, { merge: true });
  return NextResponse.json({ ...a, ...result });
}
