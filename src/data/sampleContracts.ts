import { ContractDocument } from '../types/document';

export const SAMPLE_DOCUMENTS: ContractDocument[] = [
  {
    id: 'sample-doc-1',
    fileName: 'CloudScale_B2B_SaaS_Master_Services_Agreement.pdf',
    fileType: 'application/pdf',
    fileSize: 245760, // 240 KB
    uploadedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    pageCount: 4,
    wordCount: 1680,
    isSample: true,
    analysisStatus: 'completed',
    rawText: `[PAGE 1]
MASTER SERVICES AGREEMENT
This Master Services Agreement ("Agreement") is entered into as of October 1, 2026 ("Effective Date"), by and between CloudScale Enterprise Inc., a Delaware corporation with its principal office at 450 Mission Street, San Francisco, CA ("Provider"), and VentureSync Technologies LLC, a California limited liability company ("Customer").

1. SERVICES AND ACCESS
Provider grants Customer a non-exclusive, non-transferable subscription to access and use the CloudScale Enterprise Platform ("Service") during the applicable Subscription Term solely for Customer's internal business operations. Customer shall not sublicense, reverse engineer, or permit unauthorized third parties to access the platform.

2. FEES, INVOICING AND PAYMENT
2.1 Subscription Fees: Customer shall pay the annual subscription fee of $48,000 in quarterly installments of $12,000.
2.2 Payment Terms: All invoices are due and payable Net 15 days from the date of invoice. Late payments shall accrue interest at the rate of 1.5% per month or the maximum legal rate allowable by applicable law, whichever is higher. Customer shall reimburse Provider for all reasonable collection costs and attorney fees incurred in collecting past-due amounts.
2.3 Taxes: All fees are exclusive of sales, use, excise, or value-added taxes, which shall be borne exclusively by Customer.

[PAGE 2]
3. TERM AND AUTO-RENEWAL
3.1 Initial Term: The initial term of this Agreement shall commence on the Effective Date and continue for a period of twelve (12) months ("Initial Term").
3.2 Automatic Renewal: Upon expiration of the Initial Term, this Agreement shall automatically renew for successive consecutive twelve (12) month periods (each a "Renewal Term"), unless either party delivers written notice of non-renewal to the other party at least sixty (60) days prior to the expiration of the then-current term.
3.3 Fee Increases: Provider reserves the right to increase subscription fees by up to seven percent (7%) upon thirty (30) days advance notice prior to any Renewal Term commencement.

4. TERMINATION
4.1 Termination for Cause: Either party may terminate this Agreement immediately upon written notice if the other party breaches any material term and fails to cure such breach within thirty (30) days of receiving written notice.
4.2 Termination for Convenience: Customer may terminate this Agreement for convenience only upon ninety (90) days prior written notice, subject to payment of an Early Termination Fee equal to eighty percent (80%) of the remaining contract value through the end of the then-current Subscription Term.
4.3 Effect of Termination: Customer shall immediately cease using the Service. Within fifteen (15) days of termination, Provider will export Customer Data upon written request and payment of a standard $1,500 data extraction fee.

[PAGE 3]
5. CONFIDENTIALITY AND DATA SECURITY
5.1 Definition: "Confidential Information" includes proprietary technical, financial, and business information disclosed by either party that is designated as confidential or reasonably understood to be confidential.
5.2 Obligations: Each party agrees to protect the other party's Confidential Information with at least the same degree of care it uses for its own confidential information, but in no event less than reasonable care. Confidentiality obligations shall survive termination for a period of five (5) years, provided trade secrets shall remain confidential in perpetuity.
5.3 Security Incidents: In the event of a confirmed security breach involving Customer personal data, Provider shall notify Customer in writing within seventy-two (72) hours of confirmed discovery and take reasonable remedial steps.

6. INTELLECTUAL PROPERTY AND FEEDBACK
Provider retains all right, title, and interest in and to the Service, including all software, algorithms, documentation, and enhancements. Any suggestions, feedback, or modifications provided by Customer shall become the exclusive intellectual property of Provider without any royalty or compensation due to Customer.

[PAGE 4]
7. INDEMNIFICATION AND LIABILITY ALLOCATION
7.1 Customer Indemnification: Customer shall defend, indemnify, and hold harmless Provider and its officers, directors, and employees from and against any third-party claims, damages, liabilities, and expenses (including attorneys' fees) arising out of Customer Content, unauthorized use of the Service, or Customer's violation of applicable law.
7.2 Provider Indemnification: Provider shall defend Customer against third-party claims alleging that the Service infringes a registered United States patent or copyright.
7.3 Limitation of Liability: EXCEPT FOR INDEMNIFICATION OBLIGATIONS UNDER SECTION 7.1 AND BREACHES OF CONFIDENTIALITY, IN NO EVENT SHALL PROVIDER'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED THE TOTAL FEES ACTUALLY PAID BY CUSTOMER IN THE PRECEDING THREE (3) MONTHS. PROVIDER SHALL NOT BE LIABLE FOR ANY INDIRECT, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES.
7.4 Asymmetric Cap: For the avoidance of doubt, Customer's indemnity obligations under Section 7.1 are expressly uncapped and not subject to the limitation in Section 7.3.

8. DISPUTE RESOLUTION AND GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws principles. Any legal suit or proceeding shall be instituted exclusively in the federal or state courts located in New Castle County, Delaware. EACH PARTY IRREVOCABLY WAIVES ANY RIGHT TO TRIAL BY JURY.`,
    pages: [
      {
        pageNumber: 1,
        text: 'MASTER SERVICES AGREEMENT\nEffective Date: October 1, 2026\nParties: CloudScale Enterprise Inc. ("Provider") and VentureSync Technologies LLC ("Customer")\n1. Services and Access\n2. Fees, Invoicing and Payment (Net 15 days, 1.5% monthly late fee, $48,000 annual)',
      },
      {
        pageNumber: 2,
        text: '3. Term and Auto-Renewal (12-month Initial Term, 60-day non-renewal notice window, up to 7% annual price escalation)\n4. Termination (30-day cure period for cause; 90-day notice for convenience with 80% remaining contract value early termination fee)',
      },
      {
        pageNumber: 3,
        text: '5. Confidentiality (5-year survival, trade secrets perpetual, 72-hour breach notice)\n6. Intellectual Property (Provider owns service; Customer feedback irrevocably assigned to Provider)',
      },
      {
        pageNumber: 4,
        text: '7. Indemnification and Liability Allocation (Provider liability capped at 3 months fees; Customer indemnity is uncapped; Mutual jury trial waiver)\n8. Governing Law (Delaware, New Castle County courts)',
      },
    ],
    analysis: {
      documentSummary: {
        title: 'CloudScale B2B SaaS Master Services Agreement',
        contractType: 'Master Services Agreement (Enterprise SaaS)',
        parties: ['CloudScale Enterprise Inc. (Provider)', 'VentureSync Technologies LLC (Customer)'],
        effectiveDate: 'October 1, 2026',
        termOrDuration: '12 Months with Automatic 12-Month Renewals',
        governingLaw: 'State of Delaware (New Castle County jurisdiction)',
        plainEnglishSummary:
          'This agreement governs VentureSync Technologies\' access to the CloudScale Enterprise Platform for $48,000 annually. It contains standard SaaS software licensing provisions but includes notably asymmetric liability caps, a 60-day auto-renewal notice requirement, and an aggressive early termination penalty requiring payment of 80% of the remaining contract balance. Payment terms are strict Net 15 with compounding late fees.',
        overallRiskScore: 74,
        overallRiskSummary:
          'High review priority: Highly asymmetric liability cap (Provider liability capped at 3 months of fees while Customer indemnity is completely uncapped) combined with severe termination convenience penalties (80% remaining fees).',
      },
      clauses: [
        {
          id: 'sd1-c-1',
          category: 'liability',
          title: 'Asymmetric Limitation of Liability & Uncapped Indemnity',
          summary: 'Provider caps its liability to only 3 months of paid fees (~$12,000), while Customer indemnity obligations remain entirely uncapped.',
          quotation: 'IN NO EVENT SHALL PROVIDER\'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED THE TOTAL FEES ACTUALLY PAID BY CUSTOMER IN THE PRECEDING THREE (3) MONTHS... Customer\'s indemnity obligations under Section 7.1 are expressly uncapped.',
          pageNumber: 4,
          responsibleParty: 'Customer & Provider',
          keyParameters: {
            amountOrRate: '3 months fees cap for Provider; Uncapped for Customer',
            noticePeriod: null,
            triggeringEvent: 'Any legal claim or liability event',
          },
          verificationStatus: 'verified',
        },
        {
          id: 'sd1-c-2',
          category: 'renewal',
          title: 'Automatic 12-Month Renewal with 60-Day Notice Window',
          summary: 'The contract automatically locks Customer into another full year unless written notice of non-renewal is delivered at least 60 days before the anniversary.',
          quotation: 'this Agreement shall automatically renew for successive consecutive twelve (12) month periods... unless either party delivers written notice of non-renewal to the other party at least sixty (60) days prior to the expiration of the then-current term.',
          pageNumber: 2,
          responsibleParty: 'Both Parties',
          keyParameters: {
            amountOrRate: 'Up to 7% annual price increase',
            noticePeriod: '60 days prior to term end',
            triggeringEvent: 'Expiration of 12-month Initial Term',
          },
          verificationStatus: 'verified',
        },
        {
          id: 'sd1-c-3',
          category: 'termination',
          title: 'Termination for Convenience with 80% Penalty Fee',
          summary: 'Customer must give 90 days notice to exit early and pay an exorbitant Early Termination Fee equal to 80% of all remaining payments.',
          quotation: 'Customer may terminate this Agreement for convenience only upon ninety (90) days prior written notice, subject to payment of an Early Termination Fee equal to eighty percent (80%) of the remaining contract value.',
          pageNumber: 2,
          responsibleParty: 'Customer',
          keyParameters: {
            amountOrRate: '80% of remaining contract value',
            noticePeriod: '90 days prior written notice',
            triggeringEvent: 'Termination without cause',
          },
          verificationStatus: 'verified',
        },
        {
          id: 'sd1-c-4',
          category: 'payment',
          title: 'Strict Net 15 Payment Terms & 1.5% Monthly Late Fee',
          summary: 'Invoices must be paid within 15 days. Unpaid amounts incur 1.5% interest per month (18% annualized) plus collection legal costs.',
          quotation: 'All invoices are due and payable Net 15 days from the date of invoice. Late payments shall accrue interest at the rate of 1.5% per month or the maximum legal rate allowable by applicable law.',
          pageNumber: 1,
          responsibleParty: 'Customer',
          keyParameters: {
            amountOrRate: '$12,000 quarterly, 1.5% monthly late interest',
            noticePeriod: '15 days',
            triggeringEvent: 'Invoice receipt',
          },
          verificationStatus: 'verified',
        },
        {
          id: 'sd1-c-5',
          category: 'confidentiality',
          title: 'Confidentiality Obligations & 72-Hour Security Incident Notice',
          summary: '5-year confidentiality obligation with perpetual protection for trade secrets, and mandatory 72-hour notification for confirmed personal data security breaches.',
          quotation: 'Confidentiality obligations shall survive termination for a period of five (5) years, provided trade secrets shall remain confidential in perpetuity... Provider shall notify Customer in writing within seventy-two (72) hours of confirmed discovery.',
          pageNumber: 3,
          responsibleParty: 'Mutual / Provider',
          keyParameters: {
            amountOrRate: null,
            noticePeriod: '72 hours for security breaches',
            triggeringEvent: 'Discovery of confirmed security breach',
          },
          verificationStatus: 'verified',
        },
        {
          id: 'sd1-c-6',
          category: 'ip-rights',
          title: 'Feedback Assignment to Provider',
          summary: 'Any feedback, product recommendations, or enhancements suggested by Customer become the sole exclusive property of Provider without compensation.',
          quotation: 'Any suggestions, feedback, or modifications provided by Customer shall become the exclusive intellectual property of Provider without any royalty or compensation due to Customer.',
          pageNumber: 3,
          responsibleParty: 'Customer',
          keyParameters: {
            amountOrRate: 'Royalty-free',
            noticePeriod: null,
            triggeringEvent: 'Submission of feedback or feature requests',
          },
          verificationStatus: 'verified',
        },
      ],
      risks: [
        {
          id: 'sd1-r-1',
          priority: 'high',
          category: 'liability',
          title: 'Uncapped Customer Indemnity vs. 3-Month Liability Cap for Provider',
          explanation:
            'The liability limit is severely one-sided. If Provider suffers downtime or commits an error, your maximum recovery is capped at 3 months of fees ($12,000). Meanwhile, your indemnification obligations to Provider have no dollar cap whatsoever.',
          recommendedAction:
            'Negotiate a mutual cap tied to 12 months of fees ($48,000) or an explicit super-cap for IP/confidentiality. Add an express dollar ceiling to Section 7.1 customer indemnification.',
          quotation:
            'Customer\'s indemnity obligations under Section 7.1 are expressly uncapped and not subject to the limitation in Section 7.3.',
          pageNumber: 4,
          status: 'needs-review',
        },
        {
          id: 'sd1-r-2',
          priority: 'high',
          category: 'termination',
          title: '80% Remaining Balance Penalty for Early Termination',
          explanation:
            'Terminating the contract for convenience provides almost zero financial relief, since Customer must still pay 80% of the remaining contract value plus give 90 days notice.',
          recommendedAction:
            'Push to remove the 80% early termination fee entirely, or reduce it to 30 days notice with payment only for services utilized through the effective termination date.',
          quotation:
            'subject to payment of an Early Termination Fee equal to eighty percent (80%) of the remaining contract value through the end of the then-current Subscription Term.',
          pageNumber: 2,
          status: 'needs-review',
        },
        {
          id: 'sd1-r-3',
          priority: 'medium',
          category: 'renewal',
          title: '60-Day Auto-Renewal Deadline with 7% Unilateral Price Hike',
          explanation:
            'If your team misses the 60-day cancellation window prior to October 1, 2027, you are automatically locked in for another 12 months with up to a 7% price escalation ($51,360).',
          recommendedAction:
            'Calendar a non-renewal reminder 90 days in advance (July 2, 2027). Request 30-day notice requirement instead of 60 days, and cap annual price escalation at 3% or CPI.',
          quotation:
            'unless either party delivers written notice of non-renewal to the other party at least sixty (60) days prior to the expiration of the then-current term... Provider reserves the right to increase subscription fees by up to seven percent (7%).',
          pageNumber: 2,
          status: 'needs-review',
        },
        {
          id: 'sd1-r-4',
          priority: 'medium',
          category: 'payment',
          title: 'Anerous Net 15 Payment Terms with Compounding 1.5% Late Interest',
          explanation:
            'Standard corporate payment cycles are Net 30 or Net 45. Net 15 creates operational cashflow friction, and the 1.5% monthly late fee represents an effective 18% annual APR.',
          recommendedAction:
            'Request standard enterprise Net 30 payment terms and reduce late interest to 1.0% per month or statutory prime rate.',
          quotation:
            'All invoices are due and payable Net 15 days from the date of invoice. Late payments shall accrue interest at the rate of 1.5% per month',
          pageNumber: 1,
          status: 'needs-review',
        },
        {
          id: 'sd1-r-5',
          priority: 'low',
          category: 'dispute-resolution',
          title: 'Delaware Forum Selection and Waiver of Jury Trial',
          explanation:
            'Any dispute must be litigated in Delaware courts, and both parties waive trial by jury. Standard for Delaware corporations, but may increase litigation travel expenses if based in California.',
          recommendedAction:
            'Acceptable if balanced, or propose neutral arbitration (JAMS / AAA) with virtual hearings to minimize travel costs.',
          quotation:
            'instituted exclusively in the federal or state courts located in New Castle County, Delaware. EACH PARTY IRREVOCABLY WAIVES ANY RIGHT TO TRIAL BY JURY.',
          pageNumber: 4,
          status: 'reviewed',
        },
      ],
      obligations: [
        {
          id: 'sd1-ob-1',
          responsibleParty: 'VentureSync (Customer)',
          action: 'Pay Q1 Subscription Invoice ($12,000)',
          timingOrTrigger: 'Due Net 15 days from Effective Date',
          dueDate: '2026-10-16',
          priority: 'high',
          status: 'upcoming',
          sourceClause: 'Section 2.1 & 2.2 Payment Terms',
          pageNumber: 1,
        },
        {
          id: 'sd1-ob-2',
          responsibleParty: 'VentureSync (Customer)',
          action: 'Decision / Delivery of Non-Renewal Notice (to avoid automatic 12-month extension)',
          timingOrTrigger: 'Must be delivered at least 60 days prior to October 1, 2027',
          dueDate: '2027-08-02',
          priority: 'high',
          status: 'upcoming',
          sourceClause: 'Section 3.2 Automatic Renewal',
          pageNumber: 2,
        },
        {
          id: 'sd1-ob-3',
          responsibleParty: 'CloudScale (Provider)',
          action: 'Provide Written Notice of any Fee Increase for the Renewal Term',
          timingOrTrigger: 'At least 30 days prior to Renewal Term commencement',
          dueDate: '2027-09-01',
          priority: 'medium',
          status: 'upcoming',
          sourceClause: 'Section 3.3 Fee Increases',
          pageNumber: 2,
        },
        {
          id: 'sd1-ob-4',
          responsibleParty: 'CloudScale (Provider)',
          action: 'Notify Customer of any Confirmed Personal Data Security Incidents',
          timingOrTrigger: 'Within 72 hours of confirmed incident discovery',
          dueDate: null,
          priority: 'high',
          status: 'needs-verification',
          sourceClause: 'Section 5.3 Security Incidents',
          pageNumber: 3,
        },
        {
          id: 'sd1-ob-5',
          responsibleParty: 'CloudScale (Provider)',
          action: 'Export Customer Data Upon Written Request & Fee Payment',
          timingOrTrigger: 'Within 15 days of termination upon $1,500 fee receipt',
          dueDate: null,
          priority: 'medium',
          status: 'needs-verification',
          sourceClause: 'Section 4.3 Effect of Termination',
          pageNumber: 2,
        },
      ],
    },
  },
  {
    id: 'sample-doc-2',
    fileName: 'Apex_Dynamics_Contractor_IP_Assignment_Agreement.pdf',
    fileType: 'application/pdf',
    fileSize: 184320, // 180 KB
    uploadedAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    pageCount: 3,
    wordCount: 1220,
    isSample: true,
    analysisStatus: 'completed',
    rawText: `[PAGE 1]
INDEPENDENT CONTRACTOR & INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT
Effective Date: September 15, 2026
Between: Apex Dynamics Labs Inc. ("Company") and Marcus Vance ("Contractor")

1. SERVICES AND DELIVERABLES
Contractor agrees to perform software architecture consulting services as described in Statement of Work #1. Contractor shall dedicate a minimum of 25 hours per week. Contractor shall maintain detailed weekly logs.

2. COMPENSATION AND MILESTONES
Company shall pay Contractor an hourly rate of $165. Invoices submitted bi-weekly, payable Net 30 days. Total fees under SOW-1 shall not exceed $66,000 without prior written approval.

[PAGE 2]
3. WORK FOR HIRE AND IP ASSIGNMENT
Contractor agrees that all inventions, source code, designs, and discoveries created during the term of this Agreement ("Work Product") shall constitute a "work made for hire" for Company. To the extent any Work Product does not qualify, Contractor hereby irrevocably assigns all right, title, and interest, including moral rights, exclusively to Company.

4. NON-COMPETITION AND NON-SOLICITATION
4.1 Non-Competition: For the duration of this Agreement and for a period of twenty-four (24) months following termination, Contractor shall not directly or indirectly provide consulting services to any entity developing competitive algorithmic trading platforms in North America.
4.2 Non-Solicitation: Contractor shall not solicit Company employees or clients for eighteen (18) months following termination.

[PAGE 3]
5. TERMINATION
Either party may terminate upon fourteen (14) days written notice. Company may terminate immediately for breach.

6. GOVERNING LAW
Governed by California law. (Note: California Business & Professions Code Section 16600 generally prohibits post-employment non-compete covenants).`,
    pages: [
      {
        pageNumber: 1,
        text: 'INDEPENDENT CONTRACTOR AGREEMENT\nParties: Apex Dynamics Labs Inc. and Marcus Vance\nServices: Architecture consulting ($165/hr, bi-weekly invoicing, Net 30 days, $66,000 cap)',
      },
      {
        pageNumber: 2,
        text: '3. Work Product and IP Assignment (Complete assignment to Company, moral rights waived)\n4. Restrictive Covenants (24-month non-compete in North America, 18-month non-solicitation)',
      },
      {
        pageNumber: 3,
        text: '5. Termination (14 days notice)\n6. Governing Law (California)',
      },
    ],
    analysis: {
      documentSummary: {
        title: 'Apex Dynamics Contractor & IP Assignment Agreement',
        contractType: 'Independent Contractor & IP Assignment Agreement',
        parties: ['Apex Dynamics Labs Inc. (Company)', 'Marcus Vance (Contractor)'],
        effectiveDate: 'September 15, 2026',
        termOrDuration: 'Project-based (until SOW completion or 14-day termination notice)',
        governingLaw: 'State of California',
        plainEnglishSummary:
          'This agreement retains Marcus Vance as an independent software consultant at $165/hour capped at $66,000. It grants the Company total ownership of all created IP under work-for-hire and assignment clauses. However, it imposes an aggressive 24-month post-termination non-compete restriction across North America, which is highly scrutinized and generally unenforceable under California law.',
        overallRiskScore: 68,
        overallRiskSummary:
          'High review priority: Contains a 24-month post-termination non-competition clause under California governing law, where non-compete agreements are strictly prohibited by statute.',
      },
      clauses: [
        {
          id: 'c-201',
          category: 'ip-rights',
          title: 'Comprehensive Work-For-Hire and Irrevocable IP Assignment',
          summary: 'All software, inventions, and moral rights created are irrevocably assigned to Apex Dynamics.',
          quotation: 'Contractor hereby irrevocably assigns all right, title, and interest, including moral rights, exclusively to Company.',
          pageNumber: 2,
          responsibleParty: 'Contractor',
          keyParameters: {
            amountOrRate: null,
            noticePeriod: null,
            triggeringEvent: 'Creation of work product',
          },
          verificationStatus: 'verified',
        },
        {
          id: 'c-202',
          category: 'penalty',
          title: '24-Month North American Non-Competition Covenant',
          summary: 'Restricts the contractor from consulting for any competitive platform for two full years.',
          quotation: 'Contractor shall not directly or indirectly provide consulting services to any entity developing competitive algorithmic trading platforms in North America for twenty-four (24) months.',
          pageNumber: 2,
          responsibleParty: 'Contractor',
          keyParameters: {
            amountOrRate: null,
            noticePeriod: '24 months post-termination',
            triggeringEvent: 'Contract termination',
          },
          verificationStatus: 'verified',
        },
      ],
      risks: [
        {
          id: 'r-201',
          priority: 'high',
          category: 'compliance',
          title: 'Potentially Unenforceable 24-Month Non-Compete Under California Law',
          explanation:
            'California Business and Professions Code § 16600 voids non-compete covenants in employment and contractor agreements. Including this clause may expose the employer to statutory civil liability under AB 1076 / SB 699.',
          recommendedAction:
            'Have California counsel strike Section 4.1 non-competition clause to avoid statutory non-compliance penalties, relying instead on trade secret protections.',
          quotation:
            'for a period of twenty-four (24) months following termination, Contractor shall not directly or indirectly provide consulting services to any entity developing competitive algorithmic trading platforms in North America.',
          pageNumber: 2,
          status: 'needs-review',
        },
      ],
      obligations: [
        {
          id: 'ob-201',
          responsibleParty: 'Apex Dynamics (Company)',
          action: 'Pay Bi-Weekly Consultant Invoice (Net 30)',
          timingOrTrigger: 'Within 30 days of bi-weekly invoice submission',
          dueDate: null,
          priority: 'medium',
          status: 'upcoming',
          sourceClause: 'Section 2 Compensation',
          pageNumber: 1,
        },
      ],
    },
  },
];
