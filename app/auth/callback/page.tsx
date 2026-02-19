'use client';
import { useEffect } from 'react';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    const run = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = localStorage.getItem('emailForSignIn') || window.prompt('Email') || '';
        await signInWithEmailLink(auth, email, window.location.href);
        router.push('/new');
      }
    };
    run();
  }, [router]);
  return <p>Completing sign-in...</p>;
}
