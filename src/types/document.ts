export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export type ClauseCategory =
  | 'payment'
  | 'termination'
  | 'renewal'
  | 'confidentiality'
  | 'liability'
  | 'penalty'
  | 'dispute-resolution'
  | 'ip-rights'
  | 'indemnification'
  | 'other';

export type RiskPriority = 'high' | 'medium' | 'low';

export type RiskStatus = 'needs-review' | 'reviewed' | 'flagged-for-counsel';

export type ObligationStatus = 'upcoming' | 'needs-verification' | 'completed' | 'overdue';

export interface Clause {
  id: string;
  category: ClauseCategory;
  title: string;
  summary: string;
  quotation: string;
  pageNumber: number;
  responsibleParty: string;
  keyParameters?: {
    amountOrRate?: string | null;
    noticePeriod?: string | null;
    triggeringEvent?: string | null;
  };
  verificationStatus: 'verified' | 'needs-verification';
}

export interface RiskFinding {
  id: string;
  priority: RiskPriority;
  category: string;
  title: string;
  explanation: string;
  recommendedAction: string;
  quotation: string;
  pageNumber: number;
  status: RiskStatus;
}

export interface Obligation {
  id: string;
  responsibleParty: string;
  action: string;
  timingOrTrigger: string;
  dueDate: string | null;
  priority: 'high' | 'medium' | 'low';
  status: ObligationStatus;
  sourceClause: string;
  pageNumber: number;
  userNotes?: string;
  reminderSet?: boolean;
}

export interface DocumentSummary {
  title: string;
  contractType: string;
  parties: string[];
  effectiveDate: string;
  termOrDuration: string;
  governingLaw: string;
  plainEnglishSummary: string;
  overallRiskScore: number;
  overallRiskSummary: string;
}

export interface AnalysisResult {
  documentSummary: DocumentSummary;
  clauses: Clause[];
  risks: RiskFinding[];
  obligations: Obligation[];
}

export interface ContractDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  pageCount: number;
  wordCount: number;
  rawText: string;
  pages: ExtractedPage[];
  isSample: boolean;
  analysisStatus: 'idle' | 'extracting' | 'analyzing' | 'completed' | 'error';
  errorMessage?: string;
  analysis?: AnalysisResult;
}

export interface Citation {
  quote: string;
  pageNumber: number;
  relevance?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  confidence?: 'high' | 'medium' | 'low' | 'not_found';
}
