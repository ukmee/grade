export interface Module {
  id: string;
  name: string;
  td: string; // Using string to allow empty state
  exam: string; // Using string to allow empty state
  coef: string;
  tdOnly: boolean;
}

export type GradingType = '40-60' | '50-50' | '33-67' | 'custom';

export interface GradingSystem {
  type: GradingType;
  tdWeight: number; // 0-100
  examWeight: number; // 0-100
}

export interface CalculationResult {
  average: number;
  totalCoef: number;
  breakdown: Array<{
    id: string;
    name: string;
    td: number;
    exam: number | null;
    final: number;
    coef: number;
  }>;
}

export interface CalculationError {
  field: string;
  message: string;
}

declare global {
  interface Window {
    html2pdf: any;
    gtag: (command: string, action: string, params?: any) => void;
  }
}