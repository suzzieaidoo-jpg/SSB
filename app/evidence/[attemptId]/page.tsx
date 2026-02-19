'use client';
import { FormEvent, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useIdToken } from '@/lib/clientAuth';

export default function EvidencePage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const token = useIdToken();
  const router = useRouter();
  const [form, setForm] = useState({ allocationMemo: '', decisionMemo: '', dreamStatement: '', consentEmail: true, consentMarketing: false });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/attempts/submitEvidence', { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ attemptId, ...form }) });
    await fetch('/api/score', { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ attemptId }) });
    router.push(`/result/${attemptId}`);
  };
  return <form onSubmit={submit} className="space-y-3"><h1 className="text-2xl">Evidence</h1><textarea className="input" rows={4} placeholder="Allocation memo" onChange={(e)=>setForm({...form, allocationMemo:e.target.value})}/><textarea className="input" rows={4} placeholder="Decision memo" onChange={(e)=>setForm({...form, decisionMemo:e.target.value})}/><textarea className="input" rows={6} placeholder="Dream statement (6 lines)" onChange={(e)=>setForm({...form, dreamStatement:e.target.value})}/><label><input type="checkbox" checked={form.consentEmail} onChange={(e)=>setForm({...form,consentEmail:e.target.checked})}/> Email me my 1-page dossier</label><label><input type="checkbox" checked={form.consentMarketing} onChange={(e)=>setForm({...form,consentMarketing:e.target.checked})}/> Email me future founder simulations</label><button className="btn">Submit evidence</button></form>;
}
