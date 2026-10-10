import React, { useState } from 'react';
import {
  FolderOpen,
  FileText,
  Search,
  Trash2,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { generateContractPdfReport } from '../../utils/pdfGenerator';

export const LibraryView: React.FC = () => {
  const {
    documents,
    activeDocumentId,
    setActiveDocumentId,
    setCurrentView,
    deleteDocument,
    retryAnalysis,
  } = useDocumentContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'samples' | 'uploads'>('all');

  const filteredDocs = documents.filter((doc) => {
    const matchSearch =
      searchQuery === '' ||
      (doc.fileName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      Boolean(doc.analysis?.documentSummary?.contractType?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchType =
      filterType === 'all' ||
      (filterType === 'samples' && doc.isSample) ||
      (filterType === 'uploads' && !doc.isSample);

    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Workspace Repository
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Contract Document Library</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage your analyzed contracts, benchmark agreements, extracted clauses, and reports.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('upload')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors self-start md:self-center"
        >
          <Plus className="w-4 h-4" /> Upload New Contract
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Contracts ({documents.length})
          </button>
          <button
            onClick={() => setFilterType('uploads')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              filterType === 'uploads'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            My Uploads ({documents.filter((d) => !d.isSample).length})
          </button>
          <button
            onClick={() => setFilterType('samples')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              filterType === 'samples'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Sample Benchmarks ({documents.filter((d) => d.isSample).length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contracts by name or type..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Document Grid / Table */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const isSelected = doc.id === activeDocumentId;
            const risks = doc.analysis?.risks || [];
            const highRisks = risks.filter((r) => r.priority === 'high').length;
            const score = doc.analysis?.documentSummary.overallRiskScore || 50;

            return (
              <div
                key={doc.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/10'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {doc.isSample && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                          Sample
                        </span>
                      )}
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete contract from workspace"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-3 truncate" title={doc.fileName}>
                    {doc.fileName}
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">
                    {doc.analysis?.documentSummary.contractType || 'Commercial Agreement'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-400 block text-[10px]">Pages</span>
                      <strong className="text-slate-800">{doc.pageCount}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-400 block text-[10px]">Risks</span>
                      <strong className="text-red-600">{risks.length}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-400 block text-[10px]">Risk Score</span>
                      <strong className="text-slate-800">{score}/100</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setActiveDocumentId(doc.id);
                      setCurrentView('analysis');
                    }}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {isSelected ? 'Active (Open)' : 'Select & Inspect'}
                  </button>

                  {doc.analysis && (
                    <button
                      onClick={() => generateContractPdfReport(doc)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download PDF intelligence report"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Contracts Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              You haven't uploaded any documents matching this filter. Upload a PDF or load a sample contract.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('upload')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            Upload a Contract
          </button>
        </div>
      )}
    </div>
  );
};
