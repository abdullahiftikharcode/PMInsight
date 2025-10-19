export interface Citation {
  standard: string;
  section: string;
  title: string;
  justification: string;
  confidence?: number;
}

export interface Activity {
  name: string;
  description: string;
  deliverables: string[];
  duration: string;
  roles: string[];
  citations?: Citation[];
  dependencies?: string[];
  risks?: string[];
}

export interface Phase {
  name: string;
  description: string;
  duration: string;
  activities: Activity[];
  dependencies?: string[];
  deliverables?: string[];
  decisionGates?: string[];
}

export interface Tailoring {
  rationale: string;
  decisions: string[];
  omitted: string[];
}

export interface ProcessTemplate {
  scenario: string;
  name: string;
  description: string;
  lifecycle: 'predictive' | 'agile' | 'hybrid';
  duration: string;
  teamSize: string;
  characteristics: string[];
  phases: Phase[];
  tailoring: Tailoring;
}

export interface ProcessInputs {
  projectName: string;
  scenarioId: string;
  lifecycle: 'predictive' | 'agile' | 'hybrid';
  constraints: string[];
  drivers: string[];
  teamSize?: string;
  duration?: string;
  budget?: string;
  riskTolerance?: 'low' | 'medium' | 'high';
}

export interface GeneratedProcess {
  projectName: string;
  scenario: string;
  summary: string;
  phases: Phase[];
  generatedAt: string;
  tailoring: Tailoring;
  evidence: EvidenceSummary;
}

export interface EvidenceSummary {
  totalCitations: number;
  standardsCoverage: {
    PMBOK: number;
    PRINCE2: number;
    ISO21500: number;
    ISO21502: number;
  };
  confidenceScore: number;
  qualityMetrics: {
    completeness: number;
    accuracy: number;
    relevance: number;
  };
}

export interface ProcessValidation {
  isValid: boolean;
  issues: ValidationIssue[];
  recommendations: string[];
  qualityScore: number;
}

export interface ValidationIssue {
  type: 'missing_citation' | 'insufficient_evidence' | 'incomplete_activity' | 'missing_deliverable';
  phase: string;
  activity: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  recommendation: string;
}

export interface ProcessComparison {
  scenarios: string[];
  phases: PhaseComparison[];
  similarities: string[];
  differences: string[];
  recommendations: string[];
}

export interface PhaseComparison {
  phaseName: string;
  scenarios: {
    [scenario: string]: {
      activities: string[];
      deliverables: string[];
      duration: string;
    };
  };
}
