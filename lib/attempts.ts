import { AttemptStatus } from '@/lib/types';

const allowed: Record<string, AttemptStatus[]> = {
  create: ['created'],
  markUnpaid: ['unpaid'],
  unlock: ['unlocked'],
  start: ['in_progress'],
  complete: ['completed'],
  score: ['scored'],
  pdf: ['pdf_generated'],
  email: ['emailed']
};

export function transitionAttempt(current: AttemptStatus, action: keyof typeof allowed): AttemptStatus {
  const next = allowed[action][0];
  const valid = (
    (action === 'markUnpaid' && current === 'created') ||
    (action === 'unlock' && ['created','unpaid'].includes(current)) ||
    (action === 'start' && ['unlocked','in_progress'].includes(current)) ||
    (action === 'complete' && ['in_progress','completed'].includes(current)) ||
    (action === 'score' && ['completed','scored'].includes(current)) ||
    (action === 'pdf' && ['scored','pdf_generated'].includes(current)) ||
    (action === 'email' && ['pdf_generated','emailed'].includes(current))
  );
  if (!valid) throw new Error(`Invalid transition ${current} -> ${action}`);
  return next;
}
