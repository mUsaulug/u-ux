
import { AnalysisResult, Suggestion, ComplaintCategory, Priority, Sentiment } from '../types';
import type { BackendComplaintResponse } from './backendService';

const CATEGORY_MAP: Record<string, ComplaintCategory> = {
  'DOLANDIRICILIK': ComplaintCategory.FRAUD_UNAUTHORIZED_TX,
  'KART_PROBLEMI': ComplaintCategory.CARD_ISSUE,
  'TRANSFER_GECIKMESI': ComplaintCategory.TRANSFER_DELAY,
  'HIZMET_SORUNU': ComplaintCategory.SERVICE_ISSUE,
  'TEKNIK': ComplaintCategory.TECHNICAL
};

const PRIORITY_MAP: Record<string, Priority> = {
  'YUKSEK': Priority.CRITICAL,
  'ORTA': Priority.HIGH,
  'DUSUK': Priority.MEDIUM
};

export function adaptBackendResponse(backend: BackendComplaintResponse): {
  analysis: AnalysisResult;
  suggestion: Suggestion;
} {
  const avgConfidence = (backend.categoryConfidence + backend.urgencyConfidence) / 2;

  const analysis: AnalysisResult = {
    category: CATEGORY_MAP[backend.kategori] || ComplaintCategory.UNKNOWN,
    priority: PRIORITY_MAP[backend.oncelik] || Priority.LOW,
    sentiment: Sentiment.NEUTRAL,
    confidenceScore: avgConfidence,
    reasoning: `Kategori güveni: %${Math.round(backend.categoryConfidence * 100)}, Öncelik güveni: %${Math.round(backend.urgencyConfidence * 100)}`
  };

  const suggestion: Suggestion = {
    responseDraft: backend.oneri,
    actions: ["REVIEW_REQUIRED"],
    kbArticles: backend.kaynaklar.map(k => ({
      id: k.id,
      title: k.title,
      relevance: k.similarity
    }))
  };

  return { analysis, suggestion };
}
