import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Calendar,
  Building,
  DollarSign,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  FileSpreadsheet,
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { ClauseCategory, Clause } from '../../types/document';
import { generateContractPdfReport } from '../../utils/pdfGenerator';

export const AnalysisView: React.FC = () => {
  const { activeDocument, setCurrentView } = useDocumentContext();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>(null);

  if (!activeDocument) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-xl mx-auto my-12">
        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Contract Selected</h3>
        <p className="text-xs text-slate-500 mt-1">Please select or upload a contract to view structured analysis.</p>
        <button
          onClick={() => setCurrentView('upload')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Go to Upload
        </button>
      </div>
    );
  }

  const analysis = activeDocument.analysis;

  if (activeDocument.analysisStatus === 'analyzing') {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto"></div>
        <h3 className="text-base font-bold text-slate-900">ClauseGuard AI Deep Analysis in Progress</h3>
        <p className="text-xs text-slate-500">
          Auditing contract text, extracting clauses, and validating evidence against source pages...
        </p>
      </div>
    );
  }

  if (activeDocument.analysisStatus === 'error' || !analysis) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-red-200 max-w-lg mx-auto my-12 space-y-3">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="text-base font-bold text-red-950">Contract Analysis Unavailable</h3>
        <p className="text-xs text-red-700">{activeDocument.errorMessage || 'No analysis data was generated.'}</p>
        <button
          onClick={() => setCurrentView('upload')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
        >
          Re-Upload or Select Benchmark
        </button>
      </div>
    );
  }

  const clauses = analysis.clauses || [];

  // Filter clauses
  const filteredClauses = clauses.filter((clause) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (clause.category || '').toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchQuery === '' ||
      (clause.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (clause.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (clause.quotation || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: `All (${clauses.length})` },
    { id: 'payment', label: 'Payment' },
    { id: 'termination', label: 'Termination' },
    { id: 'liability', label: 'Liability' },
    { id: 'renewal', label: 'Renewal' },
    { id: 'confidentiality', label: 'Confidentiality' },
    { id: 'ip-rights', label: 'IP Rights' },
    { id: 'penalty', label: 'Penalties' },
    { id: 'dispute-resolution', label: 'Dispute' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Executive Plain-English Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-semibold text-blue-700 uppercase tracking-wider text-[11px]">
                {analysis.documentSummary.contractType}
              </span>
              {activeDocument.isSample && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[11px] text-slate-400">Benchmark Data</span>
                </>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
              {analysis.documentSummary.title || activeDocument.fileName}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => generateContractPdfReport(activeDocument)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-600" />
              Download Report
            </button>
            <button
              onClick={() => setCurrentView('risk-radar')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              Inspect {analysis.risks.length} Risks
            </button>
          </div>
        </div>

        {/* 4 Metadata Points (Clean Unboxed Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Parties Involved</span>
            <p className="font-semibold text-slate-800 mt-1">
              {(analysis.documentSummary.parties || []).join(' vs. ') || 'N/A'}
            </p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Effective Date</span>
            <p className="font-semibold text-slate-800 mt-1 font-mono tabular-nums">{analysis.documentSummary.effectiveDate || 'Not specified'}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Term / Duration</span>
            <p className="font-semibold text-slate-800 mt-1">{analysis.documentSummary.termOrDuration || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Governing Law</span>
            <p className="font-semibold text-slate-800 mt-1">{analysis.documentSummary.governingLaw || 'N/A'}</p>
          </div>
        </div>

        {/* Plain English Summary Content */}
        <div className="pt-5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Plain-English Executive Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {analysis.documentSummary.plainEnglishSummary}
          </p>
        </div>
      </div>

      {/* Clause Catalog Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Extracted Commercial Clauses</h2>
            <p className="text-xs text-slate-500">
              Each clause is cross-referenced with exact page coordinates and verbatim quotes
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search extracted clauses..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Clause Cards List */}
        <div className="space-y-3.5">
          {filteredClauses.map((clause, idx) => {
            const isExpanded = expandedClauseId === clause.id;
            return (
              <div
                key={`${clause.id}-${idx}`}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-5 shadow-xs transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase tracking-wider">
                        {clause.category}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        Page {clause.pageNumber}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Party: <strong className="text-slate-700">{clause.responsibleParty}</strong>
                      </span>
                      {clause.verificationStatus === 'verified' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Source Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 pt-1">{clause.title}</h3>
                  </div>

                  <button
                    onClick={() => setExpandedClauseId(isExpanded ? null : clause.id)}
                    className="self-start sm:self-center px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center gap-1 shrink-0 font-medium transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        Less <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Inspect Quote <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{clause.summary}</p>

                {/* Parameters Pills (Amounts, Notice Periods, Triggers) */}
                {clause.keyParameters && (
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    {clause.keyParameters.amountOrRate && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                        <DollarSign className="w-3 h-3 text-slate-500" />
                        <strong>Amount/Rate:</strong> {clause.keyParameters.amountOrRate}
                      </span>
                    )}
                    {clause.keyParameters.noticePeriod && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <strong>Notice Window:</strong> {clause.keyParameters.noticePeriod}
                      </span>
                    )}
                    {clause.keyParameters.triggeringEvent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <strong>Trigger:</strong> {clause.keyParameters.triggeringEvent}
                      </span>
                    )}
                  </div>
                )}

                {/* Verbatim Supporting Quote Box (Expandable) */}
                {isExpanded && (
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono space-y-1.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans pb-1 border-b border-slate-800">
                      <span>Source Quote · Page {clause.pageNumber}</span>
                      <span className="text-emerald-400 font-medium">Exact Excerpt</span>
                    </div>
                    <blockquote className="pt-1 italic leading-relaxed text-slate-100">
                      "{clause.quotation}"
                    </blockquote>
                  </div>
                )}
              </div>
            );
          })}

          {filteredClauses.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
              <Search className="w-6 h-6 mx-auto mb-2 text-slate-400" />
              <p className="text-xs font-medium">No clauses match the selected category or query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
