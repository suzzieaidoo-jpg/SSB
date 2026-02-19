'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useIdToken } from '@/lib/clientAuth';

export default function ResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const token = useIdToken();
  const [a, setA] = useState<any>();
  const load = async () => {
    const d = await fetch(`/api/attempts/get?attemptId=${attemptId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json());
    setA(d.attempt);
  };
  useEffect(() => { if (token) load(); }, [token]);
  const personalize = async () => { await fetch('/api/personalize', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({attemptId}) }); load(); };
  const pdf = async () => { const d = await fetch('/api/report/pdf', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({attemptId}) }).then(r=>r.json()); window.open(d.url, '_blank'); load(); };
  const email = async () => { await fetch('/api/email/send', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({attemptId}) }); load(); };
  if (!a) return <p>Loading...</p>;
  return <div className="space-y-3"><h1 className="text-2xl">Results</h1><p>Readiness: {a.readinessLevel} ({Math.round(a.totalScore || 0)})</p><p>Band: {a.outcomeBand} • Pattern: {a.patternLabel}</p><p>Stewardship {Math.round(a.stewardshipScore||0)} Learning {Math.round(a.learningScore||0)} Integrity {Math.round(a.integrityScore||0)}</p><button className="btn mr-2" onClick={personalize}>Generate personalization</button><button className="btn mr-2" onClick={pdf}>Generate/download PDF</button><button className="btn" onClick={email}>Email dossier</button><p>{a.personalisedParagraph}</p><ul>{(a.next14DaysBullets||[]).map((b:string)=><li key={b}>• {b}</li>)}</ul><p>{a.shareSummary}</p></div>;
}
