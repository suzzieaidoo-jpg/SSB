import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authServer';
import { adminDb, adminStorage } from '@/lib/firebaseAdmin';
import { reportHtml, renderPdf } from '@/lib/pdf';
import { transitionAttempt } from '@/lib/attempts';
import { enforceAttemptLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const { uid } = await requireAuth(req);
  const { attemptId } = await req.json();
  const ref = adminDb.collection('attempts').doc(attemptId);
  const snap = await ref.get();
  const a = snap.data();
  if (!a || a.uid !== uid) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!['scored','pdf_generated','emailed'].includes(a.status)) return NextResponse.json({ error: 'Must be scored first' }, { status: 400 });
  const path = `reports/${attemptId}.pdf`;
  const file = adminStorage.file(path);
  if (a.pdfStoragePath) {
    const [url] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 1000 * 60 * 30 });
    return NextResponse.json({ path, url, reused: true });
  }
  const allowed = await enforceAttemptLimit(attemptId, 'pdfGenCountDay', 'pdfCountDate', 3, 'day');
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  const pdf = await renderPdf(reportHtml(a));
  await file.save(pdf, { contentType: 'application/pdf' });
  await ref.set({ pdfStoragePath: path, status: transitionAttempt(a.status, 'pdf') }, { merge: true });
  const [url] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 1000 * 60 * 30 });
  return NextResponse.json({ path, url, reused: false });
}
