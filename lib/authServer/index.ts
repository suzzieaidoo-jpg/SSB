import { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';

export async function requireAuth(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) throw new Error('Unauthorized');
  const token = auth.replace('Bearer ', '');
  const decoded = await getAuth().verifyIdToken(token);
  return { uid: decoded.uid, email: decoded.email ?? '' };
}
