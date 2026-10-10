import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  FileCheck2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Info,
  RefreshCw,
  FileSpreadsheet,
  Lock,
  FileType,
  ClipboardList,
  Check,
  Layers,
  Zap,
  BookOpen,
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { SAMPLE_DOCUMENTS } from '../../data/sampleContracts';

export const UploadView: React.FC = () => {
  const {
    uploadAndProcessFile,
    processRawContractText,
    setCurrentView,
    loadSampleContract,
    activeDocument,
  } = useDocumentContext();

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Raw text input state
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedText, setPastedText] = useState('');

  const [uploadState, setUploadState] = useState<
    'idle' | 'validating' | 'extracting' | 'analyzing' | 'completed' | 'error'
  >('idle');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ isScanned?: boolean; code?: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setErrorMessage(null);
    setErrorDetails(null);

    // Validate size (limit 25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 25 MB.`);
      return;
    }

    // Validate extension
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const nameLower = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => nameLower.endsWith(ext));

    if (!isValid) {
      setErrorMessage('Unsupported file format. Please upload a PDF (.pdf), Word document (.docx), or text agreement (.txt).');
      return;
    }

    setSelectedFile(file);
    setUploadState('idle');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;

    try {
      setErrorMessage(null);
      setErrorDetails(null);

      // Step 1: Validating
      setUploadState('validating');
      setCurrentStep(1);
      setProgressMessage('Validating document format, signature layers, and file headers...');
      await new Promise((r) => setTimeout(r, 650));

      // Step 2: Extracting
      setUploadState('extracting');
      setCurrentStep(2);
      setProgressMessage('Extracting verbatim document clauses and mapping page boundaries...');

      // Step 3: Server analysis with Gemini
      const processPromise = uploadAndProcessFile(selectedFile);
      
      // Update message as it moves into model reasoning
      setTimeout(() => {
        setUploadState('analyzing');
        setCurrentStep(3);
        setProgressMessage('Running Gemini legal intelligence: evaluating liability symmetry and auto-renewals...');
      }, 1200);

      await processPromise;

      // Step 4: Complete
      setCurrentStep(4);
      setUploadState('completed');
      setProgressMessage('Deep contract audit completed! Structured findings and risk radar generated.');
    } catch (err: any) {
      console.error('Upload flow error:', err);
      setUploadState('error');
      setCurrentStep(0);
      const msg = err.message || 'Analysis could not be completed.';
      setErrorMessage(msg);

      if (msg.includes('scanned image') || msg.includes('SCANNED_OR_EMPTY')) {
        setErrorDetails({ isScanned: true, code: 'SCANNED_PDF' });
      } else {
        setErrorDetails({ isScanned: false, code: 'EXTRACTION_OR_API_ERROR' });
      }
    }
  };

  const startPastedTextAnalysis = async () => {
    if (!pastedText.trim() || pastedText.trim().length < 30) {
      setErrorMessage('Please paste at least 30 characters of agreement text to run contract analysis.');
      return;
    }

    try {
      setErrorMessage(null);
      setErrorDetails(null);

      setUploadState('validating');
      setCurrentStep(1);
      setProgressMessage('Parsing contractual text structure and defining section partitions...');
      await new Promise((r) => setTimeout(r, 500));

      setUploadState('analyzing');
      setCurrentStep(3);
      setProgressMessage('Analyzing covenants, indemnification scope, and obligations with Gemini AI...');

      const title = pastedTitle.trim() || 'Custom-Legal-Agreement';
      await processRawContractText(title, pastedText);

      setCurrentStep(4);
      setUploadState('completed');
      setProgressMessage('Contract audit completed! Obligations and risk classifications indexed.');
    } catch (err: any) {
      console.error('Paste analysis error:', err);
      setUploadState('error');
      setCurrentStep(0);
      setErrorMessage(err.message || 'Failed to process contract text.');
    }
  };

  const loadSampleTemplate = (type: 'nda' | 'saas' | 'employment') => {
    if (type === 'nda') {
      setPastedTitle('Mutual Non-Disclosure Agreement (NDA)');
      setPastedText(`MUTUAL NON-DISCLOSURE AGREEMENT
This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of October 1, 2026 ("Effective Date"), by and between Lumina Cloud Systems Inc. ("Disclosing Party") and Nexus Enterprise Solutions LLC ("Receiving Party").

1. Purpose and Scope.
The parties wish to explore a potential strategic business collaboration (the "Purpose") and in connection therewith may disclose confidential business, financial, and technical proprietary information.

2. Definition of Confidential Information.
"Confidential Information" means any non-public information disclosed by either party, including trade secrets, source code, pricing structures, customer lists, and strategic roadmaps.

3. Obligations of Receiving Party.
The Receiving Party agrees to protect the Confidential Information using the same degree of care, but no less than a reasonable degree of care, that it uses to protect its own confidential information of like nature. The Receiving Party shall not disclose Confidential Information to any third party without prior written consent.

4. Term and Termination.
This Agreement and the obligations of confidentiality shall remain in full force for a period of five (5) years from the Effective Date.

5. Remedies and Unlimited Injunctive Relief.
Receiving Party acknowledges that any breach may cause irreparable harm for which monetary damages alone are inadequate. Receiving Party agrees to submit to immediate injunctive relief without the necessity of posting bond, and Disclosing Party shall be entitled to recover all reasonable attorney's fees incurred in enforcing this Agreement.

6. Governing Law and Jurisdiction.
This Agreement shall be governed by the laws of the State of Delaware, without regard to conflict of law principles.`);
    } else if (type === 'saas') {
      setPastedTitle('Enterprise SaaS Master Services Agreement');
      setPastedText(`MASTER SERVICES & SUBSCRIPTION AGREEMENT
This Agreement is entered into by and between CloudScale Technologies Inc. ("Provider") and Vantage Financial Inc. ("Customer").

1. Subscription Services. Provider grants Customer a non-exclusive, non-transferable right to access and use the CloudScale Platform during the Term solely for Customer's internal business operations.

2. Fees & Payment Terms. Customer shall pay all invoices within fifteen (15) days of invoice date. Any overdue payments shall accrue interest at the rate of 2.5% per month or the maximum rate permitted by applicable law.

3. Term & Automatic Renewal. The initial term is thirty-six (36) months ("Initial Term"). This Agreement shall automatically renew for successive twelve (12) month periods unless Customer provides written notice of non-renewal at least ninety (90) days prior to the expiration of the then-current term.

4. Unilateral Termination for Convenience. Provider may terminate this Agreement at any time, with or without cause, upon thirty (30) days prior written notice to Customer without refund of prepaid fees. Customer may terminate only for material breach that remains uncured for sixty (60) days.

5. Limitation of Liability. IN NO EVENT SHALL PROVIDER'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED THE AMOUNTS PAID BY CUSTOMER IN THE PRIOR ONE (1) MONTH. CUSTOMER'S LIABILITY UNDER THIS AGREEMENT IS UNLIMITED.

6. Indemnification. Customer shall defend, indemnify, and hold harmless Provider from and against any and all third-party claims, losses, damages, liabilities, costs, and expenses (including reasonable attorney's fees) arising out of Customer's use of the Services.`);
    } else {
      setPastedTitle('Executive Employment & Proprietary Rights Agreement');
      setPastedText(`EXECUTIVE EMPLOYMENT & CONFIDENTIALITY AGREEMENT
This Executive Employment Agreement is made between Apex Dynamics Corp. ("Company") and Jane Doe ("Executive").

1. Term of Employment. Employment begins on November 15, 2026, and continues on an at-will basis until terminated in accordance with this Agreement.

2. Non-Competition & Non-Solicitation. During employment and for a period of twenty-four (24) months following termination of employment for any reason, Executive shall not directly or indirectly engage in, perform services for, invest in, or establish any business that competes with the Company anywhere in North America.

3. Intellectual Property Assignment. Executive hereby irrevocably assigns and transfers to Company all worldwide rights, titles, and interests in and to any and all inventions, works of authorship, and proprietary developments conceived or made during or outside employment hours.

4. Dispute Resolution. Any dispute arising under this Agreement shall be resolved through binding confidential arbitration in Wilmington, Delaware. Executive waives any right to jury trial or class action participation.`);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setUploadState('idle');
    setCurrentStep(0);
    setErrorMessage(null);
    setErrorDetails(null);
    setProgressMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-14 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto pt-2">
        <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-2">
          Evidence-Backed Document Ingestion · Zero Training Retention
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload Contract for Deep Risk Analysis
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Upload any PDF or DOCX agreement to audit for asymmetric liability, unlimited indemnification, sneaky auto-renewal deadlines, and operational duties with exact verbatim quotes.
        </p>

        {/* Ingestion Mode Switcher */}
        <div className="mt-6 inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              resetForm();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-blue-600" />
            Upload File (PDF / DOCX)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('paste');
              resetForm();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'paste'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-indigo-600" />
            Paste Contract Text
          </button>
        </div>
      </div>

      {/* Main Upload / Ingestion Panel */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
        {activeTab === 'upload' ? (
          <div>
            {/* Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            {/* IDLE / EMPTY STATE */}
            {!selectedFile && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50/70 scale-[1.01]'
                    : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/70'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center shadow-xs mb-4">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">
                    Drag and drop your contract here, or{' '}
                    <span className="text-blue-600 underline underline-offset-2">browse files</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5">
                    Supports digital and scanned PDF (.pdf), Word (.docx), or Plain Text (.txt) up to 25 MB
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 pt-6 mt-6 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Enterprise-grade confidentiality
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileCheck2 className="w-4 h-4 text-blue-600" /> Verbatim citation & page tracking
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Zap className="w-4 h-4 text-amber-600" /> Multimodal OCR fallback built-in
                  </span>
                </div>
              </div>
            )}

            {/* FILE SELECTED STATE (NO CLICK TRAP) */}
            {selectedFile && uploadState !== 'completed' && (
              <div className="space-y-6">
                {/* Dossier Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      {selectedFile.name.toLowerCase().endsWith('.pdf') ? (
                        <FileText className="w-6 h-6" />
                      ) : selectedFile.name.toLowerCase().endsWith('.docx') ? (
                        <FileSpreadsheet className="w-6 h-6" />
                      ) : (
                        <FileType className="w-6 h-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                          Ready for Analysis
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500 font-mono tabular-nums">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 truncate mt-0.5">
                        {selectedFile.name}
                      </h4>
                    </div>
                  </div>

                  {uploadState === 'idle' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        Change File
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Idle Action Button */}
                {uploadState === 'idle' && (
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={startAnalysis}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                    >
                      <Sparkles className="w-4 h-4 text-blue-200" />
                      Start Risk Analysis with ClauseGuard AI
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Multi-Step Pipeline Indicator */}
                {(uploadState === 'validating' ||
                  uploadState === 'extracting' ||
                  uploadState === 'analyzing') && (
                  <div className="space-y-5 pt-2">
                    {/* Stepper Dots */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      {[
                        { step: 1, label: 'Document Integrity', active: currentStep >= 1 },
                        { step: 2, label: 'Page & Clause Mapping', active: currentStep >= 2 },
                        { step: 3, label: 'Liability & Risk Audit', active: currentStep >= 3 },
                        { step: 4, label: 'Risk Radar Assembly', active: currentStep >= 4 },
                      ].map((s) => (
                        <div
                          key={s.step}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            s.active
                              ? 'bg-blue-50/70 border-blue-300 text-blue-900 font-semibold'
                              : 'bg-slate-50 border-slate-200/80 text-slate-400 font-medium'
                          }`}
                        >
                          <div className="text-[10px] uppercase tracking-wider text-slate-500">
                            Step 0{s.step}
                          </div>
                          <div className="text-xs mt-0.5 truncate">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar & Status Message */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-blue-700 font-bold">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          {progressMessage}
                        </span>
                        <span className="font-mono text-slate-500 font-semibold tabular-nums">
                          {currentStep === 1 ? '25%' : currentStep === 2 ? '55%' : '85%'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-blue-600 rounded-full transition-all duration-700 ${
                            currentStep === 1
                              ? 'w-1/4'
                              : currentStep === 2
                              ? 'w-7/12'
                              : 'w-11/12 animate-pulse'
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Please keep this window open while ClauseGuard cross-references indemnity, termination windows, and covenants against commercial standards.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* COMPLETED SUCCESS STATE */}
            {uploadState === 'completed' && (
              <div className="py-6 text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Contract Analysis Ready!</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">{progressMessage}</p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentView('analysis')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    View Risk Radar & Clauses <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Upload Another Contract
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* DIRECT PASTE TEXT TAB */
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Contract Agreement Title
                </label>
                <div className="text-[11px] text-slate-400">e.g. Master Services Agreement</div>
              </div>
              <input
                type="text"
                placeholder="e.g. Vendor Master Services Agreement (2026)"
                value={pastedTitle}
                onChange={(e) => setPastedTitle(e.target.value)}
                disabled={uploadState === 'validating' || uploadState === 'analyzing'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            {/* Quick Template Fill Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Paste Full Agreement Text
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Quick template:</span>
                  <button
                    type="button"
                    onClick={() => loadSampleTemplate('saas')}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    SaaS MSA
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    type="button"
                    onClick={() => loadSampleTemplate('nda')}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    Mutual NDA
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    type="button"
                    onClick={() => loadSampleTemplate('employment')}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    Employment
                  </button>
                </div>
              </div>
              <textarea
                rows={10}
                placeholder="Paste the full text of your agreement here (including definitions, covenants, termination, and liability clauses)..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                disabled={uploadState === 'validating' || uploadState === 'analyzing'}
                className="w-full p-4 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all leading-relaxed"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>
                  {pastedText.split(/\s+/).filter(Boolean).length} words · {pastedText.length} characters
                </span>
                <span>Minimum 30 characters required</span>
              </div>
            </div>

            {/* Paste Action Controls */}
            {uploadState === 'idle' && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPastedTitle('');
                    setPastedText('');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
                >
                  Clear Text
                </button>
                <button
                  type="button"
                  onClick={startPastedTextAnalysis}
                  disabled={!pastedText.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Analyze Pasted Contract
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Progress indicator during paste analysis */}
            {(uploadState === 'validating' || uploadState === 'analyzing') && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  {progressMessage}
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-4/5 animate-pulse" />
                </div>
              </div>
            )}

            {/* Completed state for paste */}
            {uploadState === 'completed' && (
              <div className="py-4 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Analysis Complete!</h4>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentView('analysis')}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                  >
                    View Findings <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Analyze Another
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Clear Error Message Banner with Actionable Recovery */}
        {errorMessage && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-2.5">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="font-bold text-red-950">
                  {errorDetails?.isScanned
                    ? 'Scanned Image Document Detected'
                    : 'Contract Ingestion Notice'}
                </h5>
                <p className="text-red-800 mt-0.5 leading-relaxed">{errorMessage}</p>

                {errorDetails?.isScanned && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-white/90 border border-red-200 text-[11px] text-slate-700 space-y-1">
                    <p className="font-semibold text-slate-900">Recommended next step:</p>
                    <p>
                      Switch to the <strong>"Paste Contract Text"</strong> tab above and copy-paste the agreement clauses directly to run an instant analysis without file conversion hurdles.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-red-200/60">
              {activeTab === 'upload' && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('paste');
                    setErrorMessage(null);
                  }}
                  className="px-3 py-1.5 bg-white border border-red-300 hover:bg-red-50 text-red-900 font-semibold rounded-lg text-[11px] transition-colors"
                >
                  Switch to Paste Text
                </button>
              )}
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 font-semibold rounded-lg text-[11px] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pre-loaded Benchmark Contracts Section */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Instant Validation Library
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Benchmark Contracts for Immediate Testing
            </h3>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Explore authentic commercial contracts pre-audited with risk radars, obligations, and citations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_DOCUMENTS.map((sample) => (
            <div
              key={sample.id}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-blue-700">
                    {sample.analysis?.documentSummary.contractType || 'Commercial Agreement'}
                  </span>
                  <span className="text-slate-400 font-mono tabular-nums">
                    {sample.pageCount} pages · {sample.wordCount} words
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-1.5">{sample.fileName}</h4>
                <p className="text-slate-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                  {sample.analysis?.documentSummary.plainEnglishSummary}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-red-600 tabular-nums">
                    {sample.analysis?.risks.length} Risk Findings
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="font-medium text-slate-500 tabular-nums">
                    {sample.analysis?.obligations.length} Obligations
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => loadSampleContract(sample.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  Inspect Contract <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
