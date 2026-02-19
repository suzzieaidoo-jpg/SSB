import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebaseAdmin';

export async function enforceAttemptLimit(attemptId: string, countField: string, dateField: string, limit: number, scope: 'day'|'total'='day') {
  const ref = adminDb.collection('attempts').doc(attemptId);
  const snap = await ref.get();
  const data = snap.data() ?? {};
  const today = new Date().toISOString().slice(0,10);
  let count = data[countField] ?? 0;
  const last = data[dateField] ?? today;
  if (scope === 'day' && last !== today) count = 0;
  if (count >= limit) return false;
  await ref.set({ [countField]: FieldValue.increment(1), [dateField]: today }, { merge: true });
  return true;
}
