import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authServer';
import { adminDb, adminStorage } from '@/lib/firebaseAdmin';
import { sendDossierEmail } from '@/lib/email';
import { transitionAttempt } from '@/lib/attempts';
import { enforceAttemptLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const { uid, email } = await requireAuth(req);
  const { attemptId } = await req.json();
  const ref = adminDb.collection('attempts').doc(attemptId);
  const snap = await ref.get();
  const a = snap.data();
  if (!a || a.uid !== uid) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (a.emailedAt) return NextResponse.json({ ok: true, idempotent: true });
  if (!a.pdfStoragePath) return NextResponse.json({ error: 'Generate PDF first' }, { status: 400 });
  const allowed = await enforceAttemptLimit(attemptId, 'emailSendCountDay', 'emailCountDate', 2, 'day');
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  const file = adminStorage.file(a.pdfStoragePath);
  const [url] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 1000 * 60 * 30 });
  const [buf] = await file.download();
  const attachment = buf.length < 5 * 1024 * 1024 ? buf.toString('base64') : undefined;
  await sendDossierEmail(email, url, attachment);
  await ref.set({ emailedAt: new Date().toISOString(), status: transitionAttempt(a.status, 'email') }, { merge: true });
  return NextResponse.json({ ok: true });
}
