import { jsPDF } from 'jspdf';
import { ContractDocument } from '../types/document';

export function generateContractPdfReport(doc: ContractDocument): void {
  const analysis = doc.analysis;
  if (!analysis) {
    alert('No analysis available to generate report.');
    return;
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 50) {
      addFooter();
      pdf.addPage();
      y = margin;
      addHeaderBanner();
    }
  };

  const addHeaderBanner = () => {
    pdf.setFillColor(15, 23, 42); // Navy slate-900
    pdf.rect(0, 0, pageWidth, 28, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CLAUSEGUARD AI · DOCUMENT INTELLIGENCE REPORT', margin, 18);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`,
      pageWidth - margin - 100,
      18
    );
  };

  const addFooter = () => {
    const pageNum = (pdf as any).internal.getNumberOfPages();
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184); // slate-400
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      'PRELIMINARY AI ASSESSMENT · NOT LEGAL ADVICE · PREPARED FOR CLIENT REVIEW',
      margin,
      pageHeight - 20
    );
    pdf.text(`Page ${pageNum}`, pageWidth - margin - 40, pageHeight - 20);
  };

  // First page header
  addHeaderBanner();
  y = 50;

  // Title & Subtitle
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Contract Intelligence & Risk Assessment', margin, y);
  y += 24;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  pdf.text(`Document: ${doc.fileName}`, margin, y);
  y += 16;
  if (doc.isSample) {
    pdf.setTextColor(180, 83, 9); // Amber
    pdf.setFont('helvetica', 'bold');
    pdf.text('[SAMPLE BENCHMARK CONTRACT]', margin, y);
    pdf.setFont('helvetica', 'normal');
    y += 18;
  }

  // Summary Metadata Card Box
  checkPageBreak(120);
  pdf.setFillColor(248, 250, 252); // slate-50
  pdf.setDrawColor(226, 232, 240); // slate-200
  pdf.roundedRect(margin, y, contentWidth, 90, 4, 4, 'FD');

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text('CONTRACT METADATA & PARAMETERS', margin + 12, y + 18);

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(51, 65, 85);
  pdf.text(`Contract Type: ${analysis.documentSummary.contractType || 'N/A'}`, margin + 12, y + 36);
  pdf.text(
    `Effective Date: ${analysis.documentSummary.effectiveDate || 'Not specified'}`,
    margin + 12,
    y + 52
  );
  pdf.text(`Governing Law: ${analysis.documentSummary.governingLaw || 'N/A'}`, margin + 12, y + 68);

  const col2X = margin + contentWidth / 2;
  pdf.text(`Term / Duration: ${analysis.documentSummary.termOrDuration || 'N/A'}`, col2X, y + 36);
  pdf.text(
    `Parties: ${(analysis.documentSummary.parties || []).join(', ') || 'N/A'}`,
    col2X,
    y + 52,
    { maxWidth: contentWidth / 2 - 20 }
  );
  pdf.text(
    `Overall Risk Rating: ${analysis.documentSummary.overallRiskScore}/100`,
    col2X,
    y + 68
  );

  y += 106;

  // Executive Plain-English Summary
  checkPageBreak(100);
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text('1. Executive Plain-English Summary', margin, y);
  y += 16;

  pdf.setFontSize(9.5);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(51, 65, 85);
  const summaryLines = pdf.splitTextToSize(analysis.documentSummary?.plainEnglishSummary || 'No summary available.', contentWidth);
  pdf.text(summaryLines, margin, y);
  y += summaryLines.length * 13 + 18;

  // Risk Radar & Findings Section
  const risksList = analysis.risks || [];
  checkPageBreak(80);
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text(`2. Risk Radar & Review Findings (${risksList.length} findings)`, margin, y);
  y += 18;

  for (const risk of risksList) {
    const riskBoxEstimatedHeight = 110;
    checkPageBreak(riskBoxEstimatedHeight);

    // Color code indicator
    const isHigh = risk.priority === 'high';
    const isMed = risk.priority === 'medium';
    if (isHigh) {
      pdf.setFillColor(254, 242, 242); // red-50
      pdf.setDrawColor(252, 165, 165); // red-300
    } else if (isMed) {
      pdf.setFillColor(254, 249, 195); // amber-50
      pdf.setDrawColor(252, 211, 77); // amber-300
    } else {
      pdf.setFillColor(240, 249, 255); // sky-50
      pdf.setDrawColor(186, 230, 253); // sky-300
    }

    const startRiskY = y;
    // Estimate inner text height
    pdf.setFontSize(9);
    const whyLines = pdf.splitTextToSize(`Why it matters: ${risk.explanation || 'Review required'}`, contentWidth - 24);
    const recLines = pdf.splitTextToSize(`Recommendation: ${risk.recommendedAction || 'Consult legal counsel'}`, contentWidth - 24);
    const quoteLines = pdf.splitTextToSize(`Quote: "${risk.quotation || ''}"`, contentWidth - 24);

    const calculatedHeight = 40 + (whyLines.length + recLines.length + quoteLines.length) * 11;
    pdf.roundedRect(margin, y, contentWidth, calculatedHeight, 3, 3, 'FD');

    // Risk badge & title
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(isHigh ? 185 : isMed ? 180 : 3, isHigh ? 28 : isMed ? 83 : 105, isHigh ? 28 : isMed ? 9 : 161);
    pdf.text(`[${(risk.priority || 'low').toUpperCase()} PRIORITY] ${risk.title || 'Risk Finding'}`, margin + 12, y + 16);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Category: ${(risk.category || 'General').toUpperCase()} · Page ${risk.pageNumber || 1}`, pageWidth - margin - 150, y + 16);

    let innerY = y + 30;
    pdf.setFontSize(8.5);
    pdf.setTextColor(30, 41, 59);
    pdf.text(whyLines, margin + 12, innerY);
    innerY += whyLines.length * 11 + 4;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Mitigation Tactic: ', margin + 12, innerY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(recLines, margin + 12, innerY);
    innerY += recLines.length * 11 + 4;

    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(71, 85, 105);
    pdf.text(quoteLines, margin + 12, innerY);

    y = startRiskY + calculatedHeight + 12;
  }

  // Key Extracted Clauses
  const clausesList = analysis.clauses || [];
  checkPageBreak(80);
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text(`3. Extracted Key Clauses (${clausesList.length} clauses)`, margin, y);
  y += 18;

  for (const clause of clausesList) {
    checkPageBreak(75);
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(226, 232, 240);

    const summaryText = pdf.splitTextToSize(clause.summary || 'Summary unavailable', contentWidth - 24);
    const quoteText = pdf.splitTextToSize(`Source [Page ${clause.pageNumber || 1}]: "${clause.quotation || ''}"`, contentWidth - 24);
    const boxH = 32 + (summaryText.length + quoteText.length) * 11;

    pdf.roundedRect(margin, y, contentWidth, boxH, 3, 3, 'FD');

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text(`${clause.title || 'Clause'} (${(clause.category || 'other').toUpperCase()})`, margin + 12, y + 16);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(51, 65, 85);
    let cY = y + 28;
    pdf.text(summaryText, margin + 12, cY);
    cY += summaryText.length * 11 + 3;

    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 116, 139);
    pdf.text(quoteText, margin + 12, cY);

    y += boxH + 10;
  }

  // Structured Obligations & Deadlines
  const obligationsList = analysis.obligations || [];
  checkPageBreak(80);
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text(`4. Obligations & Compliance Deadlines (${obligationsList.length} items)`, margin, y);
  y += 18;

  for (const ob of obligationsList) {
    checkPageBreak(55);
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(margin, y, contentWidth, 48, 2, 2, 'FD');

    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text(`[${ob.responsibleParty || 'Party'}] ${ob.action || 'Obligation'}`, margin + 10, y + 16, { maxWidth: contentWidth - 140 });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(71, 85, 105);
    pdf.text(`Trigger / Due: ${ob.dueDate || ob.timingOrTrigger || 'As specified'}`, margin + 10, y + 32, { maxWidth: contentWidth - 140 });

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(ob.priority === 'high' ? 220 : 37, ob.priority === 'high' ? 38 : 99, ob.priority === 'high' ? 38 : 235);
    pdf.text(`Status: ${(ob.status || 'upcoming').toUpperCase()}`, pageWidth - margin - 120, y + 16);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(148, 163, 184);
    pdf.text(`Source: Page ${ob.pageNumber || 1}`, pageWidth - margin - 120, y + 32);

    y += 56;
  }

  // Legal Disclaimer Box at end
  checkPageBreak(70);
  pdf.setFillColor(241, 245, 249);
  pdf.setDrawColor(203, 213, 225);
  pdf.roundedRect(margin, y, contentWidth, 54, 3, 3, 'FD');

  pdf.setFontSize(7.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(71, 85, 105);
  pdf.text('LEGAL NOTICE & ARTIFICIAL INTELLIGENCE DISCLAIMER', margin + 10, y + 14);

  pdf.setFont('helvetica', 'normal');
  const discLines = pdf.splitTextToSize(
    'ClauseGuard AI provides automated document pattern identification and risk triage based on statistical language models. This document does not constitute formal legal representation, an attorney-client relationship, or a warranty of legal enforceability. Consult qualified legal counsel before signing, executing, or amending commercial contracts.',
    contentWidth - 20
  );
  pdf.text(discLines, margin + 10, y + 26);

  addFooter();

  // Save the PDF
  const cleanFileName = doc.fileName.replace(/\.[^/.]+$/, '');
  pdf.save(`ClauseGuard_Report_${cleanFileName}.pdf`);
}
