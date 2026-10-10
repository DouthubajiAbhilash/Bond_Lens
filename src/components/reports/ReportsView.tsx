import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle2,
  FileText,
  ShieldAlert,
  Calendar,
  Scale,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { generateContractPdfReport } from '../../utils/pdfGenerator';

export const ReportsView: React.FC = () => {
  const { activeDocument, setCurrentView } = useDocumentContext();

  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeRisks, setIncludeRisks] = useState(true);
  const [includeClauses, setIncludeClauses] = useState(true);
  const [includeObligations, setIncludeObligations] = useState(true);
  const [includeCitations, setIncludeCitations] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!activeDocument || !activeDocument.analysis) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-xl mx-auto my-12">
        <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Contract Analysis Loaded</h3>
        <p className="text-xs text-slate-500 mt-1">Please select or upload a contract to generate intelligence reports.</p>
        <button
          onClick={() => setCurrentView('upload')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Select Contract
        </button>
      </div>
    );
  }

  const analysis = activeDocument.analysis;

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        generateContractPdfReport(activeDocument);
      } finally {
        setIsExporting(false);
      }
    }, 400);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
              Document Intelligence Report Generator
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Executive Contract Intelligence Report
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Export formal, evidence-backed PDF briefs for partners, investors, executive teams, or external legal counsel.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Preview
            </button>
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Generating PDF...' : 'Download PDF Report'}
            </button>
          </div>
        </div>

        {/* Configuration Checklist */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
            Report Modules Included:
          </span>
          <div className="flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={includeSummary}
                onChange={(e) => setIncludeSummary(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Plain-English Executive Summary
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={includeRisks}
                onChange={(e) => setIncludeRisks(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Risk Radar & Triage Findings ({analysis.risks.length})
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={includeClauses}
                onChange={(e) => setIncludeClauses(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Key Extracted Clauses ({analysis.clauses.length})
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={includeObligations}
                onChange={(e) => setIncludeObligations(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Obligations & Timeline ({analysis.obligations.length})
            </label>
          </div>
        </div>
      </div>

      {/* High-Fidelity Report Document Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-12 space-y-8 print:shadow-none print:border-none">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 tracking-wider uppercase mb-1">
              <Scale className="w-4 h-4" /> ClauseGuard AI · Contract Assessment Brief
            </div>
            <h2 className="text-2xl font-black text-slate-900">{analysis.documentSummary.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Target Document: {activeDocument.fileName} ({activeDocument.pageCount} pages)
            </p>
          </div>

          <div className="text-right text-xs text-slate-500">
            <span className="block font-semibold text-slate-700">
              Assessment Date: {new Date().toLocaleDateString()}
            </span>
            <span>Preliminary Assessment · Strict Evidence Layer</span>
          </div>
        </div>

        {/* Metadata Table */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Agreement Type</span>
            <strong className="text-slate-800">{analysis.documentSummary.contractType}</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Effective Date</span>
            <strong className="text-slate-800">{analysis.documentSummary.effectiveDate}</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Governing Law</span>
            <strong className="text-slate-800">{analysis.documentSummary.governingLaw}</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Composite Risk Score</span>
            <strong className="text-red-600">{analysis.documentSummary.overallRiskScore} / 100</strong>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        {includeSummary && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              1. Plain-English Executive Summary
            </h3>
            <p className="text-xs leading-relaxed text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
              {analysis.documentSummary.plainEnglishSummary}
            </p>
          </div>
        )}

        {/* Section 2: Risk Radar Findings */}
        {includeRisks && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              2. Risk Findings Requiring Review ({analysis.risks.length})
            </h3>
            <div className="space-y-3">
              {analysis.risks.map((risk, idx) => (
                <div
                  key={`${risk.id}-${idx}`}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    risk.priority === 'high'
                      ? 'bg-red-50/50 border-red-200'
                      : risk.priority === 'medium'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        risk.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : risk.priority === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {risk.priority} Priority
                    </span>
                    <span className="text-slate-500 font-medium">Source: Page {risk.pageNumber}</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{risk.title}</h4>
                  <p className="text-slate-700"><strong>Why it matters:</strong> {risk.explanation}</p>
                  <p className="text-blue-900"><strong>Mitigation:</strong> {risk.recommendedAction}</p>
                  <blockquote className="p-2 rounded bg-white/80 border border-slate-200/80 italic text-slate-600 text-[11px]">
                    "{risk.quotation}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Key Clauses */}
        {includeClauses && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              3. Verified Commercial Clauses ({analysis.clauses.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.clauses.map((c, idx) => (
                <div key={`${c.id}-${idx}`} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase text-slate-600">{c.category}</span>
                    <span className="text-blue-700 font-semibold">Page {c.pageNumber}</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{c.title}</h4>
                  <p className="text-slate-600 text-[11px]">{c.summary}</p>
                  <blockquote className="text-[10px] italic text-slate-500 border-l-2 border-slate-300 pl-2">
                    "{c.quotation.length > 90 ? c.quotation.substring(0, 90) + '...' : c.quotation}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Obligations */}
        {includeObligations && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              4. Operational Obligations & Compliance Deadlines ({analysis.obligations.length})
            </h3>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden text-xs">
              {analysis.obligations.map((o, idx) => (
                <div key={`${o.id}-${idx}`} className="p-3 bg-white flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-blue-800">[{o.responsibleParty}] </span>
                    <span className="text-slate-800 font-semibold">{o.action}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Timeline: {o.timingOrTrigger}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {o.dueDate ? (
                      <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {o.dueDate}
                      </span>
                    ) : (
                      <span className="text-slate-400">Conditional</span>
                    )}
                    <span className="block text-[10px] text-slate-400 mt-1">Page {o.pageNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formal Legal Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-slate-100 text-slate-600 text-[10px] leading-relaxed border border-slate-200">
          <strong>LEGAL DISCLAIMER:</strong> This report is generated by ClauseGuard AI as an automated analytical aid for startup founders and business executives. It reflects statistical language pattern extraction and does not constitute formal legal counsel, statutory compliance warranty, or attorney representation. Always review commercial terms with qualified counsel before contract execution.
        </div>
      </div>
    </div>
  );
};
