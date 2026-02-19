'use client';
import { FormEvent, useState } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await sendSignInLinkToEmail(auth, email, { url: `${window.location.origin}/auth/callback`, handleCodeInApp: true });
    localStorage.setItem('emailForSignIn', email);
    setMsg('Magic link sent.');
  };
  return <form onSubmit={submit} className="space-y-4"><h1 className="text-2xl">Login</h1><input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" /><button className="btn">Send magic link</button><p>{msg}</p></form>;
}
