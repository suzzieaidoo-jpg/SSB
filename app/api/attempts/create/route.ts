import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { requireAuth } from '@/lib/authServer';

export async function POST(req: NextRequest) {
  try {
    const { uid, email } = await requireAuth(req);
    const body = await req.json();
    const ref = adminDb.collection('attempts').doc();
    const now = new Date().toISOString();
    await ref.set({
      attemptId: ref.id,
      uid,
      email,
      dreamOneLiner: body.dreamOneLiner,
      businessType: body.businessType,
      stage: body.stage,
      constraint: body.constraint,
      status: 'unpaid',
      createdAt: now,
      updatedAt: now
    });
    return NextResponse.json({ attemptId: ref.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
