import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { requireAuth } from '@/lib/authServer';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  const { uid } = await requireAuth(req);
  const { attemptId } = await req.json();
  const ref = adminDb.collection('attempts').doc(attemptId);
  const snap = await ref.get();
  const data = snap.data();
  if (!data || data.uid !== uid) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${process.env.APP_URL}/play/${attemptId}?paid=1`,
    cancel_url: `${process.env.APP_URL}/pay/${attemptId}?canceled=1`,
    metadata: { attemptId, uid }
  });
  return NextResponse.json({ url: session.url });
}
