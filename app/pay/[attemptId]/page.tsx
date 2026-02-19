'use client';
import { useParams } from 'next/navigation';
import { useIdToken } from '@/lib/clientAuth';

export default function PayPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const token = useIdToken();
  const go = async () => {
    const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ attemptId }) });
    const data = await res.json();
    window.location.href = data.url;
  };
  return <div className="space-y-3"><h1 className="text-2xl">Payment gate</h1><button className="btn" onClick={go}>Checkout</button></div>;
}
