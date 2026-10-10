import React from 'react';
import {
  FileText,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  UploadCloud,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Clock,
  ExternalLink,
  Radar,
  FileSpreadsheet,
  Building2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { generateContractPdfReport } from '../../utils/pdfGenerator';

export const DashboardView: React.FC = () => {
  const {
    documents,
    activeDocument,
    setActiveDocumentId,
    setCurrentView,
    loadSampleContract,
    updateRiskStatus,
  } = useDocumentContext();

  // Aggregate metrics across all documents or current active document
  const totalDocs = documents.length;
  const allRisks = documents.flatMap((d) =>
    (d.analysis?.risks || []).map((r) => ({ ...r, _docId: d.id }))
  );
  const pendingRisks = allRisks.filter((r) => r.status === 'needs-review');
  const highRisks = pendingRisks.filter((r) => r.priority === 'high');
  const medRisks = pendingRisks.filter((r) => r.priority === 'medium');

  const allObligations = documents.flatMap((d) =>
    (d.analysis?.obligations || []).map((o) => ({ ...o, _docId: d.id }))
  );
  const upcomingDeadlines = allObligations.filter((o) => o.dueDate !== null && o.status === 'upcoming');
  const activeObligations = allObligations.filter((o) => o.status === 'upcoming' || o.status === 'needs-verification');

  // Category distribution for risks
  const categories = ['liability', 'termination', 'renewal', 'payment', 'ip-rights', 'compliance'];
  const categoryCounts: Record<string, number> = {};
  categories.forEach((cat) => {
    categoryCounts[cat] = allRisks.filter((r) => (r.category || '').toLowerCase().includes(cat)).length;
  });

  const maxCatCount = Math.max(1, ...Object.values(categoryCounts));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Top Banner / Welcome Action */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 lg:p-8 text-white shadow-sm border border-slate-800/90">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold tracking-wider text-blue-400 uppercase mb-2">
              Legal Intelligence · Contract Risk Radar
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Contract Risk & Obligation Intelligence
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Automated clause extraction, asymmetric liability identification, and operational deadline tracking grounded strictly in verifiable contract text.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('upload')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              Upload New Contract
            </button>
            <button
              onClick={() => setCurrentView('chat')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-medium text-xs transition-colors cursor-pointer"
            >
              Ask Contract (Q&A)
            </button>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Documents Analyzed
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums font-mono">{totalDocs}</span>
              <span className="text-xs text-slate-500 font-medium">contracts loaded</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="truncate">Active: <strong className="text-slate-800 font-semibold">{activeDocument?.fileName ? '1 target' : 'None'}</strong></span>
            <button
              onClick={() => setCurrentView('library')}
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-0.5 shrink-0 ml-2 cursor-pointer"
            >
              Library <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Findings for Review
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums font-mono">{pendingRisks.length}</span>
              <span className="text-xs font-semibold text-rose-600">({highRisks.length} High Priority)</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{medRisks.length} medium priority</span>
            <button
              onClick={() => setCurrentView('risk-radar')}
              className="text-rose-600 hover:text-rose-700 font-medium inline-flex items-center gap-0.5 shrink-0 ml-2 cursor-pointer"
            >
              Open radar <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Upcoming Deadlines
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums font-mono">{upcomingDeadlines.length}</span>
              <span className="text-xs text-amber-600 font-medium">calendar targets</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Notice windows active</span>
            <button
              onClick={() => setCurrentView('obligations')}
              className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-0.5 shrink-0 ml-2 cursor-pointer"
            >
              Timeline <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Active Obligations
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums font-mono">{activeObligations.length}</span>
              <span className="text-xs text-emerald-600 font-medium">operational duties</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Cross-party duties</span>
            <button
              onClick={() => setCurrentView('obligations')}
              className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-0.5 shrink-0 ml-2 cursor-pointer"
            >
              Checklist <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: Category breakdown + Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Findings by Contract Category</h2>
              <p className="text-xs text-slate-500 mt-0.5">Distribution of extracted risks and clauses across key commercial domains</p>
            </div>
            <button
              onClick={() => setCurrentView('analysis')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              View all clauses <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const percentage = Math.round((count / maxCatCount) * 100);
              const labelMap: Record<string, string> = {
                liability: 'Liability & Indemnification Limits',
                termination: 'Termination & Early Exit Conditions',
                renewal: 'Automatic Renewal & Escalations',
                payment: 'Payment Schedules & Late Penalties',
                'ip-rights': 'Intellectual Property & Work-for-Hire',
                compliance: 'Statutory Compliance & Restrictive Covenants',
              };

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700 capitalize">{labelMap[cat] || cat}</span>
                    <span className="text-slate-500 font-mono tabular-nums font-semibold">{count} findings</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat === 'liability'
                          ? 'bg-red-500'
                          : cat === 'termination'
                          ? 'bg-amber-500'
                          : cat === 'renewal'
                          ? 'bg-indigo-500'
                          : cat === 'payment'
                          ? 'bg-blue-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(count > 0 ? 10 : 0, percentage)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Priority Distribution (1 col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Review Priority</h2>
              <span className="text-xs font-medium text-slate-400">Triage Radar</span>
            </div>

            {/* Segmented breakdown counters */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-around text-center mb-5">
              <div>
                <span className="block text-2xl font-black text-red-600 font-mono tabular-nums">{highRisks.length}</span>
                <span className="text-[11px] font-semibold text-slate-600">High Risk</span>
              </div>
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <div>
                <span className="block text-2xl font-black text-amber-600 font-mono tabular-nums">{medRisks.length}</span>
                <span className="text-[11px] font-semibold text-slate-600">Medium</span>
              </div>
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <div>
                <span className="block text-2xl font-black text-blue-600 font-mono tabular-nums">
                  {allRisks.filter((r) => r.priority === 'low').length}
                </span>
                <span className="text-[11px] font-semibold text-slate-600">Low / Notice</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/70 border border-red-200/60 text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">High Priority: Asymmetric exposure</strong>
                  <span className="text-[11px] text-red-700 leading-relaxed block mt-0.5">Uncapped indemnification, strict non-competes, large exit fees.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Medium Priority: Commercial friction</strong>
                  <span className="text-[11px] text-amber-700 leading-relaxed block mt-0.5">Auto-renewal windows, interest rates, audit rights.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentView('risk-radar')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              Open Risk Radar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Two columns: Recent Risk Findings + Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Risk Findings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Radar className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Priority Review Findings</h2>
            </div>
            <button
              onClick={() => setCurrentView('risk-radar')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View all ({pendingRisks.length})
            </button>
          </div>

          <div className="space-y-3">
            {pendingRisks.slice(0, 3).map((risk, idx) => (
              <div
                key={`${risk._docId || 'doc'}-${risk.id || idx}`}
                className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50 transition-all text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        risk.priority === 'high'
                          ? 'text-red-700 font-semibold'
                          : risk.priority === 'medium'
                          ? 'text-amber-700 font-semibold'
                          : 'text-blue-700 font-semibold'
                      }`}
                    >
                      {risk.priority} Priority
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500 font-mono tabular-nums">Page {risk.pageNumber}</span>
                  </div>
                  <button
                    onClick={() => updateRiskStatus(risk.id, 'reviewed')}
                    className="text-[11px] text-slate-500 hover:text-slate-900 font-medium underline cursor-pointer"
                  >
                    Mark Reviewed
                  </button>
                </div>

                <h4 className="font-bold text-slate-900 text-xs mt-2">{risk.title}</h4>
                <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">{risk.explanation}</p>

                <div className="mt-2.5 p-2.5 rounded-lg bg-white border border-slate-200/80 text-[11px] text-slate-500 italic">
                  "{(risk.quotation || '').length > 120 ? (risk.quotation || '').substring(0, 120) + '...' : (risk.quotation || '')}"
                </div>
              </div>
            ))}

            {pendingRisks.length === 0 && (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-medium">All potential risks reviewed!</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines & Triggering Events */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Upcoming Deadlines & Notice Windows</h2>
            </div>
            <button
              onClick={() => setCurrentView('obligations')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View all ({allObligations.length})
            </button>
          </div>

          <div className="space-y-3">
            {allObligations.slice(0, 3).map((ob, idx) => (
              <div
                key={`${ob._docId || 'doc'}-${ob.id || idx}`}
                className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50 transition-all text-xs"
              >
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-semibold text-slate-800">
                    {ob.responsibleParty}
                  </span>
                  {ob.dueDate ? (
                    <span className="font-semibold text-amber-800 font-mono tabular-nums">
                      Due: {ob.dueDate}
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      Conditional Trigger
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-xs">{ob.action}</h4>
                <p className="text-slate-600 mt-1 text-[11px]">
                  <strong className="text-slate-700">Trigger / Timeline:</strong> {ob.timingOrTrigger}
                </p>

                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Source: {ob.sourceClause} · <span className="font-mono tabular-nums">Page {ob.pageNumber}</span></span>
                  <span className="capitalize text-slate-600 font-medium">{ob.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Documents Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Analyzed Contracts</h2>
            <p className="text-xs text-slate-500 mt-0.5">Contracts loaded in your workspace with instant risk access</p>
          </div>
          <button
            onClick={() => setCurrentView('upload')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            + Add Contract
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                <th className="pb-3 pl-1">Contract File</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Governing Law</th>
                <th className="pb-3">Pages</th>
                <th className="pb-3">Risk Rating</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-1">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => {
                const isCurrent = doc.id === activeDocument?.id;
                const score = doc.analysis?.documentSummary.overallRiskScore || 50;

                return (
                  <tr
                    key={doc.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isCurrent ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="py-3.5 pl-1">
                      <div className="flex items-center gap-2.5">
                        <FileText className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`} />
                        <div>
                          <span className="font-semibold text-slate-800 block truncate max-w-xs">
                            {doc.fileName}
                          </span>
                          {doc.isSample && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              · Benchmark Data
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-600">
                      {doc.analysis?.documentSummary.contractType || 'Commercial Agreement'}
                    </td>
                    <td className="py-3.5 text-slate-600">
                      {doc.analysis?.documentSummary.governingLaw || 'N/A'}
                    </td>
                    <td className="py-3.5 text-slate-500 font-mono tabular-nums">{doc.pageCount} pgs</td>
                    <td className="py-3.5">
                      <span
                        className={`font-bold font-mono tabular-nums text-[11px] ${
                          score >= 70
                            ? 'text-red-700'
                            : score >= 40
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {score}/100
                      </span>
                    </td>
                    <td className="py-3.5">
                      {doc.analysisStatus === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                        </span>
                      ) : (
                        <span className="text-amber-600 font-medium text-[11px]">Processing</span>
                      )}
                    </td>
                    <td className="py-3.5 text-right pr-1 space-x-2">
                      <button
                        onClick={() => {
                          setActiveDocumentId(doc.id);
                          setCurrentView('analysis');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                      {doc.analysis && (
                        <button
                          onClick={() => generateContractPdfReport(doc)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-[11px] transition-colors cursor-pointer"
                          title="Download PDF intelligence report"
                        >
                          Report
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
