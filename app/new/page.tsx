'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIdToken } from '@/lib/clientAuth';

export default function NewAttempt() {
  const token = useIdToken();
  const router = useRouter();
  const [form, setForm] = useState({ dreamOneLiner: '', businessType: '', stage: '', constraint: '' });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/attempts/create', { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    const data = await res.json();
    router.push(`/pay/${data.attemptId}`);
  };
  return <form onSubmit={submit} className="space-y-3"><h1 className="text-2xl">Dream Intake</h1>{Object.keys(form).map((k)=><input key={k} className="input" placeholder={k} value={(form as any)[k]} onChange={(e)=>setForm({...form,[k]:e.target.value})} />)}<button className="btn">Create attempt</button></form>;
}
