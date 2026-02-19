import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authServer';
import { adminDb } from '@/lib/firebaseAdmin';
import { enforceAttemptLimit } from '@/lib/rateLimit';
import { generatePersonalization } from '@/lib/personalize';

export async function POST(req: NextRequest) {
  const { uid } = await requireAuth(req);
  const { attemptId } = await req.json();
  const allowed = await enforceAttemptLimit(attemptId, 'personalizationCount', 'personalizationDate', 2, 'total');
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  const ref = adminDb.collection('attempts').doc(attemptId);
  const snap = await ref.get();
  const a = snap.data();
  if (!a || a.uid !== uid) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const dims = [{ n: 'Stewardship', v: a.stewardshipScore }, { n: 'Learning', v: a.learningScore }, { n: 'Integrity', v: a.integrityScore }].sort((x,y)=>x.v-y.v);
  const p = await generatePersonalization({ dream: a.dreamOneLiner, lowest: dims[0].n, pattern: a.patternLabel, readiness: a.readinessLevel });
  await ref.set(p, { merge: true });
  return NextResponse.json(p);
}
