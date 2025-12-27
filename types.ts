
export enum CustomerSegment {
  STANDARD = 'STANDARD',
  GOLD = 'GOLD',
  VIP_PLATINUM = 'VIP_PLATINUM'
}

export enum ComplaintCategory {
  FRAUD_CARD_NOT_PRESENT = 'FRAUD_CARD_NOT_PRESENT',
  SERVICE_ISSUE = 'SERVICE_ISSUE',
  TECHNICAL = 'TECHNICAL',
  UNKNOWN = 'UNKNOWN'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum Sentiment {
  ANGRY = 'ANGRY',
  NEUTRAL = 'NEUTRAL',
  CONCERNED = 'CONCERNED'
}

export interface ComplaintData {
  id: string;
  timestamp: string;
  customerName: string;
  customerSegment: CustomerSegment;
  originalText: string;
  maskedText: string;
  piiTags: string[];
}

export interface KBArticle {
  id: string;
  title: string;
  relevance: number;
}

export interface AnalysisResult {
  category: ComplaintCategory;
  priority: Priority;
  sentiment: Sentiment;
  confidenceScore: number;
  reasoning: string;
}

export interface Suggestion {
  responseDraft: string;
  actions: string[];
  kbArticles: KBArticle[];
}

export interface ComplaintState {
  complaint: ComplaintData;
  analysis: AnalysisResult | null;
  suggestion: Suggestion | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}
