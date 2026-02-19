import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  const sig = (await headers()).get('stripe-signature') || '';
  const payload = await req.text();
  const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const attemptId = session.metadata?.attemptId;
    if (attemptId) {
      const ref = adminDb.collection('attempts').doc(attemptId);
      const snap = await ref.get();
      const data = snap.data();
      if (!data?.stripeSessionId) {
        await ref.set({ stripeSessionId: session.id, paymentStatus: session.amount_total === 0 ? 'free' : 'paid', status: 'unlocked', updatedAt: new Date().toISOString() }, { merge: true });
      }
    }
  }
  return NextResponse.json({ received: true });
}
