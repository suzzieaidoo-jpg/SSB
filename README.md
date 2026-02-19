# Founder Readiness Dossier App

Next.js App Router + TypeScript application implementing the full flow:
magic-link auth, paid unlock, deterministic simulation/scoring, PDF dossier, email delivery.

## Setup

1. `npm install`
2. Copy `.env.local` and set variables:

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_APP_ID
- FIREBASE_ADMIN_PROJECT_ID
- FIREBASE_ADMIN_CLIENT_EMAIL
- FIREBASE_ADMIN_PRIVATE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_ID
- SENDGRID_API_KEY
- SENDGRID_FROM_EMAIL
- OPENAI_API_KEY
- APP_URL

3. Run dev: `npm run dev`

## Scripts

- `npm run smoke` validates simulation/scoring invariants.
- `npm run test` runs scoring tests.

## Deploy (Vercel)

- Add all env vars to Vercel project settings.
- Set Stripe webhook endpoint to `/api/stripe/webhook`.
- Configure Firebase authorized domain for Vercel URL.
- Ensure Firestore rules (`firestore.rules`) are deployed.

