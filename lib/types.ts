export type TrustBand = 'Low' | 'Medium' | 'High';
export type AttemptStatus = 'created' | 'unpaid' | 'unlocked' | 'in_progress' | 'completed' | 'scored' | 'pdf_generated' | 'emailed';

export type ChoiceId =
  | 'C01' | 'C02' | 'C03' | 'C04'
  | 'C05' | 'C06' | 'C07' | 'C08'
  | 'C13' | 'C14' | 'C15' | 'C16'
  | 'C17' | 'C18' | 'C19' | 'C20';

export type State = { cash: number; time: number; trust: number };

export type AttemptDoc = {
  uid: string;
  email: string;
  attemptId: string;
  dreamOneLiner: string;
  businessType: string;
  stage: string;
  constraint: string;
  status: AttemptStatus;
  paymentStatus?: 'paid' | 'free';
  stripeSessionId?: string;
  phase1Choice?: ChoiceId;
  phase2Choice?: ChoiceId;
  phase3Choice?: ChoiceId;
  phase4Choice?: ChoiceId;
  allocationMemo?: string;
  decisionMemo?: string;
  dreamStatement?: string;
  consentEmail?: boolean;
  consentMarketing?: boolean;
  stewardshipScore?: number;
  learningScore?: number;
  integrityScore?: number;
  totalScore?: number;
  readinessLevel?: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  outcomeBand?: 'Green' | 'Amber' | 'Red';
  patternLabel?: string;
  hardRedFlag?: boolean;
  hardRedFlagType?: string;
  personalisedParagraph?: string;
  next14DaysBullets?: string[];
  shareSummary?: string;
  pdfStoragePath?: string;
  emailedAt?: string;
  createdAt: string;
  updatedAt: string;
};
