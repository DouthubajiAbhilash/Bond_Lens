import { AnalysisResult, ExtractedPage, ChatMessage } from '../types/document';

export interface ExtractTextResponse {
  success: boolean;
  text: string;
  pages: ExtractedPage[];
  pageCount: number;
  wordCount: number;
  fileName: string;
}

export async function extractDocumentText(
  fileBase64: string,
  fileName: string,
  fileType: string
): Promise<ExtractTextResponse> {
  const response = await fetch('/api/extract-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileBase64, fileName, fileType }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to extract text from document.');
  }

  return data;
}

export async function analyzeContract(
  documentText: string,
  pages: ExtractedPage[],
  fileName: string
): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze-contract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentText, pages, fileName }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Contract analysis failed. Please verify API configuration.');
  }

  return data.data;
}

export async function askDocumentQuestion(
  documentText: string,
  pages: ExtractedPage[],
  question: string,
  history: Array<{ role: string; content: string }>
): Promise<{
  answer: string;
  citations: Array<{ quote: string; pageNumber: number; relevance?: string }>;
  confidence: 'high' | 'medium' | 'low' | 'not_found';
}> {
  const response = await fetch('/api/chat-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentText, pages, question, history }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to query document assistant.');
  }

  return data.data;
}
