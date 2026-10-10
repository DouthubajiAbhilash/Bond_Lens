import React, { useState } from 'react';
import {
  Radar,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  Flag,
  FileText,
  Search,
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { RiskPriority, RiskStatus, RiskFinding } from '../../types/document';

export const RiskRadarView: React.FC = () => {
  const { activeDocument, updateRiskStatus, setIsDisclaimerOpen, setCurrentView } =
    useDocumentContext();

  const [priorityFilter, setPriorityFilter] = useState<'all' | RiskPriority>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | RiskStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!activeDocument || !activeDocument.analysis) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-xl mx-auto my-12">
        <Radar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Contract Analysis Loaded</h3>
        <p className="text-xs text-slate-500 mt-1">Please upload or select a contract to view the Risk Radar.</p>
        <button
          onClick={() => setCurrentView('upload')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Select Contract
        </button>
      </div>
    );
  }

  const risks = activeDocument.analysis.risks || [];

  const filteredRisks = risks.filter((r) => {
    const matchPriority = priorityFilter === 'all' || r.priority === priorityFilter;
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchSearch =
      searchQuery === '' ||
      (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.explanation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.recommendedAction || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchPriority && matchStatus && matchSearch;
  });

  const highCount = risks.filter((r) => r.priority === 'high').length;
  const medCount = risks.filter((r) => r.priority === 'medium').length;
  const lowCount = risks.filter((r) => r.priority === 'low').length;
  const reviewedCount = risks.filter((r) => r.status === 'reviewed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Banner & Triage Stats */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-semibold text-red-600 uppercase tracking-wider text-[11px]">
                Risk Radar & Triage
              </span>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setIsDisclaimerOpen(true)}
                className="text-[11px] text-amber-700 hover:text-amber-900 underline font-medium cursor-pointer"
              >
                Preliminary AI Assessment · Not Legal Advice
              </button>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
              Risk Identification & Mitigation Matrix
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Audits asymmetry in liabilities, indemnities, unilateral termination rights, and restrictive covenants. Findings are machine evaluations to guide legal counsel discussions.
            </p>
          </div>

          {/* Quick Counter Chips */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-red-50/80 border border-red-200/80 text-center">
              <span className="block text-xl font-extrabold text-red-700 leading-tight font-mono tabular-nums">{highCount}</span>
              <span className="text-[10px] font-semibold text-red-800 uppercase">High Priority</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-amber-50/80 border border-amber-200/80 text-center">
              <span className="block text-xl font-extrabold text-amber-700 leading-tight font-mono tabular-nums">{medCount}</span>
              <span className="text-[10px] font-semibold text-amber-800 uppercase">Medium</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-blue-50/80 border border-blue-200/80 text-center">
              <span className="block text-xl font-extrabold text-blue-700 leading-tight font-mono tabular-nums">{lowCount}</span>
              <span className="text-[10px] font-semibold text-blue-800 uppercase">Low Notice</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-center">
              <span className="block text-xl font-extrabold text-emerald-700 leading-tight font-mono tabular-nums">{reviewedCount}</span>
              <span className="text-[10px] font-semibold text-emerald-800 uppercase">Reviewed</span>
            </div>
          </div>
        </div>

        {/* Filters and Search Row */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-medium">Priority:</span>
            {(['all', 'high', 'medium', 'low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                  priorityFilter === p
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}

            <span className="text-slate-400 font-medium ml-2">Status:</span>
            {(['all', 'needs-review', 'reviewed', 'flagged-for-counsel'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter risk findings..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="space-y-4">
        {filteredRisks.map((risk, idx) => {
          const isHigh = risk.priority === 'high';
          const isMed = risk.priority === 'medium';

          return (
            <div
              key={`${risk.id}-${idx}`}
              className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
                isHigh
                  ? 'border-red-200/90 hover:border-red-300'
                  : isMed
                  ? 'border-amber-200/90 hover:border-amber-300'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isHigh
                          ? 'text-red-700'
                          : isMed
                          ? 'text-amber-700'
                          : 'text-blue-700'
                      }`}
                    >
                      {risk.priority} Review Priority
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500 capitalize">
                      Category: <strong className="text-slate-700">{risk.category}</strong>
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                      Page {risk.pageNumber}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 pt-1 tracking-tight">{risk.title}</h3>
                </div>

                {/* Status action dropdown / buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                  <button
                    onClick={() =>
                      updateRiskStatus(
                        risk.id,
                        risk.status === 'reviewed' ? 'needs-review' : 'reviewed'
                      )
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      risk.status === 'reviewed'
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {risk.status === 'reviewed' ? 'Reviewed' : 'Mark Reviewed'}
                  </button>

                  <button
                    onClick={() =>
                      updateRiskStatus(
                        risk.id,
                        risk.status === 'flagged-for-counsel' ? 'needs-review' : 'flagged-for-counsel'
                      )
                    }
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      risk.status === 'flagged-for-counsel'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                    title="Flag for legal counsel review"
                  >
                    <Flag className="w-3.5 h-3.5 text-red-600" />
                    <span className="hidden sm:inline">Counsel</span>
                  </button>
                </div>
              </div>

              {/* Why it deserves attention */}
              <div className="mt-4 space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Why this deserves attention:
                  </span>
                  <p className="text-slate-700">{risk.explanation}</p>
                </div>

                {/* Recommended action / negotiation tactic */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <span className="block font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                    Recommended Negotiation / Mitigation Tactic:
                  </span>
                  <p className="text-blue-800">{risk.recommendedAction}</p>
                </div>

                {/* Verbatim Supporting Citation Quote */}
                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-slate-400 font-sans pb-1 mb-1 border-b border-slate-800">
                    <span>Source Excerpt · Page {risk.pageNumber}</span>
                    <span className="text-emerald-400">Verbatim Citation</span>
                  </div>
                  <blockquote className="italic text-slate-100">"{risk.quotation}"</blockquote>
                </div>
              </div>
            </div>
          );
        })}

        {filteredRisks.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-sm font-semibold text-slate-700">No matching risk findings</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting the priority or status filters above.</p>
          </div>
        )}
      </div>
    </div>
  );
};
