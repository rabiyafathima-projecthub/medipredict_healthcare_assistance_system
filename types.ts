export enum Severity {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface Disease {
  id: string;
  name: string;
  symptoms: string[];
  severity: Severity;
  description: string;
  healthTips: string[];
}

export interface PredictionResult {
  disease: Disease;
  confidence: number;
  explanation?: string;
}

export interface Hospital {
  name: string;
  address: string;
  rating?: string;
  openNow?: boolean;
}

export type ViewState = 'LANDING' | 'LOGIN' | 'DASHBOARD' | 'PREDICT' | 'RESULTS';