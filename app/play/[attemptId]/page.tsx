'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PHASES, CONSEQUENCES, trustBand } from '@/lib/simulation/config';
import { useIdToken } from '@/lib/clientAuth';

export default function PlayPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const token = useIdToken();
  const router = useRouter();
  const [attempt, setAttempt] = useState<any>();
  useEffect(() => { if (token) fetch(`/api/attempts/get?attemptId=${attemptId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()).then(d=>setAttempt(d.attempt)); }, [attemptId, token]);
  if (!attempt) return <p>Loading...</p>;
  if (!['unlocked','in_progress'].includes(attempt.status)) return <p>Attempt locked until webhook unlocks payment.</p>;
  const choices = [attempt.phase1Choice, attempt.phase2Choice, attempt.phase3Choice, attempt.phase4Choice].filter(Boolean);
  const phaseIndex = choices.length;
  const state = attempt.state ?? { cash: 10000, time: 30, trust: 1 };
  const choose = async (choiceId: string) => {
    await fetch('/api/attempts/choose', { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ attemptId, phase: phaseIndex + 1, choiceId }) });
    const d = await fetch(`/api/attempts/get?attemptId=${attemptId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json());
    setAttempt(d.attempt);
  };
  if (phaseIndex >= 4) return <button className="btn" onClick={()=>router.push(`/evidence/${attemptId}`)}>Continue to evidence</button>;
  const phase = PHASES[phaseIndex];
  const last = choices[choices.length-1] as keyof typeof CONSEQUENCES;
  return <div className="space-y-4"><h1 className="text-2xl">Simulation chat</h1><div className="card"><p>Cash £{state.cash} • Time {state.time} • Trust {trustBand(state.trust)}</p></div><div className="card"><p>{phase.prompt}</p><div className="mt-2 space-y-2">{phase.choices.map((c)=><button key={c.id} className="btn block" onClick={()=>choose(c.id)}>{c.label}</button>)}</div></div>{last && <div className="card"><p>{CONSEQUENCES[last].consequence}</p><p><b>Hidden assumption:</b> {CONSEQUENCES[last].hiddenAssumption}</p><p><b>Mechanism:</b> {CONSEQUENCES[last].mechanism}</p><p><b>Trade-off:</b> {CONSEQUENCES[last].tradeOff}</p><p><b>Tool:</b> {CONSEQUENCES[last].tool}</p></div>}</div>;
}
