import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { requireAuth } from '@/lib/authServer';

export async function GET(req: NextRequest) {
  const { uid } = await requireAuth(req);
  const id = req.nextUrl.searchParams.get('attemptId');
  if (!id) return NextResponse.json({ error: 'attemptId required' }, { status: 400 });
  const snap = await adminDb.collection('attempts').doc(id).get();
  if (!snap.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const data = snap.data()!;
  if (data.uid !== uid) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return NextResponse.json({ attempt: data });
}
