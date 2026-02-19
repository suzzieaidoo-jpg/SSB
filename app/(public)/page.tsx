import Link from 'next/link';

export default function Landing() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">The First 30 Days: Stewardship Under Constraint</h1>
      <p>Founder readiness simulation with deterministic scoring and 1-page dossier.</p>
      <Link href="/login" className="btn inline-block">Start</Link>
    </div>
  );
}
