import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { requireAuth } from '@/lib/authServer';
import { transitionAttempt } from '@/lib/attempts';

export async function POST(req: NextRequest) {
  const { uid } = await requireAuth(req);
  const { attemptId, allocationMemo, decisionMemo, dreamStatement, consentEmail, consentMarketing } = await req.json();
  const ref = adminDb.collection('attempts').doc(attemptId);
  const snap = await ref.get();
  const a = snap.data();
  if (!a || a.uid !== uid) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!(a.phase1Choice && a.phase2Choice && a.phase3Choice && a.phase4Choice)) return NextResponse.json({ error: 'Missing choices' }, { status: 400 });
  await ref.set({ allocationMemo, decisionMemo, dreamStatement, consentEmail: !!consentEmail, consentMarketing: !!consentMarketing, status: transitionAttempt(a.status, 'complete'), updatedAt: new Date().toISOString() }, { merge: true });
  return NextResponse.json({ ok: true });
}
