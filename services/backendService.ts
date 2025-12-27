
import { SimilarComplaint } from "../types";

// Note: In a real app, use import.meta.env.VITE_BACKEND_URL
const BACKEND_URL = 'http://localhost:8080';

export interface BackendSource {
  id: string;
  title: string;
  snippet: string;
  similarity: number;
}

export interface BackendComplaintResponse {
  id: number;
  maskedText: string;
  kategori: string;
  oncelik: string;
  oneri: string;
  kaynaklar: BackendSource[];
  categoryConfidence: number;
  urgencyConfidence: number;
  durum: string;
}

export async function submitComplaint(text: string): Promise<BackendComplaintResponse> {
  const response = await fetch(`${BACKEND_URL}/api/sikayet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metin: text })
  });

  if (!response.ok) {
    throw new Error(`Backend hatası: ${response.status}`);
  }

  return await response.json();
}

export async function findSimilarComplaints(complaintId: number, limit: number = 5): Promise<SimilarComplaint[]> {
  const response = await fetch(`${BACKEND_URL}/api/complaints/${complaintId}/similar?limit=${limit}`);

  if (!response.ok) {
    throw new Error(`Benzer şikayetler hatası: ${response.status}`);
  }

  const data = await response.json();
  return data.similar_complaints || [];
}

export async function editComplaintResponse(complaintId: number, editedResponse: string, reason: string): Promise<BackendComplaintResponse> {
  const response = await fetch(`${BACKEND_URL}/api/complaints/${complaintId}/edit`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': 'frontend-user'
    },
    body: JSON.stringify({
      customer_reply_draft: editedResponse,
      edit_reason: reason
    })
  });

  if (!response.ok) throw new Error("Düzenleme hatası");
  return await response.json();
}

export async function approveComplaint(complaintId: number, notes?: string): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/api/complaints/${complaintId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes: notes || '' })
  });
  if (!response.ok) throw new Error("Onaylama hatası");
}

export async function rejectComplaint(complaintId: number, notes?: string): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/api/complaints/${complaintId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes: notes || '' })
  });
  if (!response.ok) throw new Error("Reddetme hatası");
}
