'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';

export function useIdToken() {
  const [token, setToken] = useState<string>('');
  useEffect(() => onAuthStateChanged(auth, async (u) => setToken(u ? await u.getIdToken() : '')), []);
  return token;
}
