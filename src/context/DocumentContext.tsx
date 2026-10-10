import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ContractDocument,
  RiskStatus,
  ObligationStatus,
  AnalysisResult,
  ExtractedPage,
} from '../types/document';
import { SAMPLE_DOCUMENTS } from '../data/sampleContracts';
import { extractDocumentText, analyzeContract } from '../services/api';

export type ActiveView =
  | 'dashboard'
  | 'upload'
  | 'analysis'
  | 'risk-radar'
  | 'obligations'
  | 'chat'
  | 'reports'
  | 'library';

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  type: 'urgent' | 'warning' | 'info';
  date: string;
  read: boolean;
}

interface DocumentContextType {
  documents: ContractDocument[];
  activeDocumentId: string;
  activeDocument: ContractDocument | null;
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  setActiveDocumentId: (id: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  isDisclaimerOpen: boolean;
  setIsDisclaimerOpen: (open: boolean) => void;
  
  // Actions
  uploadAndProcessFile: (file: File) => Promise<string>;
  processRawContractText: (title: string, rawText: string) => Promise<string>;
  retryAnalysis: (docId: string) => Promise<void>;
  deleteDocument: (id: string) => void;
  updateRiskStatus: (riskId: string, status: RiskStatus) => void;
  updateObligationStatus: (obligationId: string, status: ObligationStatus) => void;
  toggleObligationReminder: (obligationId: string) => void;
  updateObligationNote: (obligationId: string, note: string) => void;
  loadSampleContract: (sampleId: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'clauseguard_documents_v1';

function normalizeAnalysisIds(docId: string, analysisData: AnalysisResult): AnalysisResult {
  return {
    ...analysisData,
    clauses: (analysisData.clauses || []).map((c, idx) => ({
      ...c,
      id: c.id && c.id.startsWith(docId) ? c.id : `${docId}-c-${c.id || idx}`,
    })),
    risks: (analysisData.risks || []).map((r, idx) => ({
      ...r,
      id: r.id && r.id.startsWith(docId) ? r.id : `${docId}-r-${r.id || idx}`,
    })),
    obligations: (analysisData.obligations || []).map((o, idx) => ({
      ...o,
      id: o.id && o.id.startsWith(docId) ? o.id : `${docId}-ob-${o.id || idx}`,
    })),
  };
}

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<ContractDocument[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((doc: ContractDocument) => {
            if (doc.analysis) {
              return {
                ...doc,
                analysis: normalizeAnalysisIds(doc.id, doc.analysis),
              };
            }
            return doc;
          });
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
    return SAMPLE_DOCUMENTS.map((doc) => ({
      ...doc,
      analysis: doc.analysis ? normalizeAnalysisIds(doc.id, doc.analysis) : undefined,
    }));
  });

  const [activeDocumentId, setActiveDocumentId] = useState<string>(() => {
    return documents[0]?.id || SAMPLE_DOCUMENTS[0].id;
  });

  const [currentView, setCurrentView] = useState<ActiveView>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'High Priority Liability Discrepancy',
      desc: 'CloudScale MSA contains an uncapped indemnity clause paired with a 3-month liability limit.',
      type: 'urgent',
      date: 'Today, 9:30 AM',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Upcoming Renewal Notice Window',
      desc: 'Automatic 12-month extension notice deadline is approaching (requires 60 days notice).',
      type: 'warning',
      date: 'Yesterday',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Document Analysis Ready',
      desc: 'Deep verification completed for Apex Dynamics Independent Contractor Agreement.',
      type: 'info',
      date: '2 days ago',
      read: true,
    },
  ]);

  // Persist documents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documents));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [documents]);

  const activeDocument = documents.find((d) => d.id === activeDocumentId) || documents[0] || null;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      if (activeDocumentId === id) {
        setActiveDocumentId(updated[0]?.id || '');
      }
      return updated;
    });
  };

  const updateRiskStatus = (riskId: string, status: RiskStatus) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (!doc.analysis) return doc;
        return {
          ...doc,
          analysis: {
            ...doc.analysis,
            risks: doc.analysis.risks.map((r) =>
              r.id === riskId ? { ...r, status } : r
            ),
          },
        };
      })
    );
  };

  const updateObligationStatus = (obligationId: string, status: ObligationStatus) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (!doc.analysis) return doc;
        return {
          ...doc,
          analysis: {
            ...doc.analysis,
            obligations: doc.analysis.obligations.map((o) =>
              o.id === obligationId ? { ...o, status } : o
            ),
          },
        };
      })
    );
  };

  const toggleObligationReminder = (obligationId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (!doc.analysis) return doc;
        return {
          ...doc,
          analysis: {
            ...doc.analysis,
            obligations: doc.analysis.obligations.map((o) =>
              o.id === obligationId ? { ...o, reminderSet: !o.reminderSet } : o
            ),
          },
        };
      })
    );
  };

  const updateObligationNote = (obligationId: string, note: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (!doc.analysis) return doc;
        return {
          ...doc,
          analysis: {
            ...doc.analysis,
            obligations: doc.analysis.obligations.map((o) =>
              o.id === obligationId ? { ...o, userNotes: note } : o
            ),
          },
        };
      })
    );
  };

  const loadSampleContract = (sampleId: string) => {
    const found = SAMPLE_DOCUMENTS.find((s) => s.id === sampleId);
    if (!found) return;

    // Check if already in documents list
    const exists = documents.some((d) => d.id === sampleId);
    if (!exists) {
      setDocuments((prev) => [found, ...prev]);
    }
    setActiveDocumentId(sampleId);
    setCurrentView('analysis');
  };

  const uploadAndProcessFile = async (file: File): Promise<string> => {
    const docId = 'doc-' + Date.now();
    const newDoc: ContractDocument = {
      id: docId,
      fileName: file.name,
      fileType: file.type || 'application/pdf',
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      pageCount: 1,
      wordCount: 0,
      rawText: '',
      pages: [],
      isSample: false,
      analysisStatus: 'extracting',
    };

    // Add in pending state
    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDocumentId(docId);

    try {
      // 1. Read file as base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const res = reader.result as string;
          const base64 = res.split(',')[1] || res;
          resolve(base64);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      // 2. Extract text from server
      const extraction = await extractDocumentText(base64Data, file.name, file.type);

      // Update doc with extracted text
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? {
                ...d,
                rawText: extraction.text,
                pages: extraction.pages,
                pageCount: extraction.pageCount,
                wordCount: extraction.wordCount,
                analysisStatus: 'analyzing',
              }
            : d
        )
      );

      // 3. Run Gemini deep analysis
      const analysisData = await analyzeContract(
        extraction.text,
        extraction.pages,
        file.name
      );

      const normalizedData = normalizeAnalysisIds(docId, analysisData);

      // 4. Update doc with completed analysis
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? {
                ...d,
                analysisStatus: 'completed',
                analysis: normalizedData,
              }
            : d
        )
      );

      // Add notification
      setNotifications((prev) => [
        {
          id: 'notif-' + Date.now(),
          title: `Analysis Ready: ${file.name}`,
          desc: `Identified ${normalizedData.risks?.length || 0} potential risk findings and ${normalizedData.obligations?.length || 0} obligations.`,
          type: 'info',
          date: 'Just now',
          read: false,
        },
        ...prev,
      ]);

      return docId;
    } catch (err: any) {
      console.error('File processing error:', err);
      const errMsg = err.message || 'Failed to process document.';
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? {
                ...d,
                analysisStatus: 'error',
                errorMessage: errMsg,
              }
            : d
        )
      );
      throw err;
    }
  };

  const processRawContractText = async (title: string, rawText: string): Promise<string> => {
    const docId = 'doc-' + Date.now();
    const cleanText = rawText.trim();
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    const pageCount = Math.max(1, Math.ceil(wordCount / 400));
    const pages: ExtractedPage[] = [];
    const chunkSize = Math.max(1, Math.ceil(cleanText.length / pageCount));
    for (let i = 0; i < pageCount; i++) {
      const chunk = cleanText.substring(i * chunkSize, (i + 1) * chunkSize).trim();
      if (chunk) {
        pages.push({ pageNumber: i + 1, text: chunk });
      }
    }
    if (pages.length === 0) {
      pages.push({ pageNumber: 1, text: cleanText });
    }

    const cleanName = title.trim() || 'Custom-Contract';
    const finalFileName = cleanName.toLowerCase().endsWith('.txt') || cleanName.toLowerCase().endsWith('.docx') || cleanName.toLowerCase().endsWith('.pdf')
      ? cleanName
      : `${cleanName}.txt`;

    const newDoc: ContractDocument = {
      id: docId,
      fileName: finalFileName,
      fileType: 'text/plain',
      fileSize: new Blob([cleanText]).size,
      uploadedAt: new Date().toISOString(),
      pageCount,
      wordCount,
      rawText: cleanText,
      pages,
      isSample: false,
      analysisStatus: 'analyzing',
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDocumentId(docId);

    try {
      const analysisData = await analyzeContract(cleanText, pages, finalFileName);
      const normalizedData = normalizeAnalysisIds(docId, analysisData);

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? {
                ...d,
                analysisStatus: 'completed',
                analysis: normalizedData,
              }
            : d
        )
      );

      setNotifications((prev) => [
        {
          id: 'notif-' + Date.now(),
          title: `Analysis Ready: ${finalFileName}`,
          desc: `Identified ${normalizedData.risks?.length || 0} potential risk findings and ${normalizedData.obligations?.length || 0} obligations.`,
          type: 'info',
          date: 'Just now',
          read: false,
        },
        ...prev,
      ]);

      return docId;
    } catch (err: any) {
      console.error('Raw contract processing error:', err);
      const errMsg = err.message || 'Failed to process contract text.';
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? {
                ...d,
                analysisStatus: 'error',
                errorMessage: errMsg,
              }
            : d
        )
      );
      throw err;
    }
  };

  const retryAnalysis = async (docId: string): Promise<void> => {
    const target = documents.find((d) => d.id === docId);
    if (!target) return;

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, analysisStatus: 'analyzing', errorMessage: undefined } : d
      )
    );

    try {
      const analysisData = await analyzeContract(
        target.rawText,
        target.pages,
        target.fileName
      );

      const normalizedData = normalizeAnalysisIds(docId, analysisData);

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? {
                ...d,
                analysisStatus: 'completed',
                analysis: normalizedData,
              }
            : d
        )
      );
    } catch (err: any) {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? {
                ...d,
                analysisStatus: 'error',
                errorMessage: err.message || 'Retry failed.',
              }
            : d
        )
      );
      throw err;
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        activeDocumentId,
        activeDocument,
        currentView,
        setCurrentView,
        setActiveDocumentId,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        globalSearchQuery,
        setGlobalSearchQuery,
        notifications,
        markNotificationAsRead,
        isDisclaimerOpen,
        setIsDisclaimerOpen,
        uploadAndProcessFile,
        processRawContractText,
        retryAnalysis,
        deleteDocument,
        updateRiskStatus,
        updateObligationStatus,
        toggleObligationReminder,
        updateObligationNote,
        loadSampleContract,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export function useDocumentContext() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
}
