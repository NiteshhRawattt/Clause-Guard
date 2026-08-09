import type { AnalysisResult, HistoryEntry } from '../types';

export const mockAnalysisResult: AnalysisResult = {
  id: 'analysis-001',
  documentName: 'Employment Agreement.pdf',
  attentionScore: 78,
  riskLevel: 'High',
  summary:
    'This agreement contains several clauses that deserve careful review before signing. Key areas of concern include a broad non-compete restriction, short termination notice periods, and sweeping intellectual property ownership terms.',
  analyzedAt: new Date().toISOString(),

  categories: [
    { name: 'Termination', severity: 'High', clauseCount: 2 },
    { name: 'Non-Compete', severity: 'High', clauseCount: 1 },
    { name: 'Intellectual Property', severity: 'Medium', clauseCount: 2 },
    { name: 'Compensation', severity: 'Low', clauseCount: 1 },
    { name: 'Confidentiality', severity: 'Medium', clauseCount: 1 },
    { name: 'Auto Renewal', severity: 'High', clauseCount: 1 },
  ],

  clauses: [
    {
      id: 'clause-001',
      category: 'Non-Compete',
      severity: 'High',
      title: '24-Month Non-Compete Restriction',
      originalText:
        'The employee shall not, directly or indirectly, engage in, be employed by, consult for, or have any financial interest in any organization that competes with the Company in any capacity, for a period of twenty-four (24) months following the termination of employment, regardless of cause.',
      simpleExplanation:
        'After leaving the company, this clause may restrict you from working with certain competitors for up to two years.',
      whyItMatters:
        'A broad restriction could significantly limit your future job opportunities depending on how "competitor," geography, and duration are defined. The absence of geographic limits makes this particularly wide-reaching.',
      questionToAsk:
        'Can the duration, geography, and definition of "competitor" be narrowed? Is there compensation offered for this restriction period?',
      simplestVersion:
        'This clause could stop you from joining some competing companies after you leave — for two full years.',
    },
    {
      id: 'clause-002',
      category: 'Termination',
      severity: 'High',
      title: '7-Day Termination Notice Period',
      originalText:
        'Either party may terminate this Agreement by providing seven (7) days written notice to the other party. The Company reserves the right to terminate immediately for cause, as determined at the Company\'s sole discretion.',
      simpleExplanation:
        'Both you and the company can end employment with just 7 days notice. The company can also fire you immediately if they decide there is "cause."',
      whyItMatters:
        '"Cause" is determined solely by the company, which gives them significant discretion. Seven days is a very short notice period that may not give you adequate time to find alternative employment.',
      questionToAsk:
        'How is "cause" defined? Can the notice period be extended to 30 days? Is there severance in lieu of notice?',
      simplestVersion:
        "The company could let you go with just 7 days notice — or even immediately if they say there's a good reason.",
    },
    {
      id: 'clause-003',
      category: 'Intellectual Property',
      severity: 'Medium',
      title: 'Broad IP Ownership Clause',
      originalText:
        'All inventions, discoveries, improvements, works of authorship, and innovations conceived, developed, or reduced to practice by the Employee, whether or not during working hours and whether or not using Company resources, that relate to the Company\'s current or anticipated business, shall be the exclusive property of the Company.',
      simpleExplanation:
        'The company may claim ownership of work you create — even in your personal time — if it relates to their business area.',
      whyItMatters:
        'The phrase "whether or not during working hours" and "anticipated business" are very broad. This could potentially cover personal projects, side work, or hobbies if they overlap with the company\'s field.',
      questionToAsk:
        'Can personal projects and side work be explicitly carved out? What does "anticipated business" mean in practice?',
      simplestVersion:
        'If you build something related to this company\'s work — even at home on weekends — they might own it.',
    },
    {
      id: 'clause-004',
      category: 'Auto Renewal',
      severity: 'High',
      title: 'Automatic Renewal — 60-Day Cancellation Window',
      originalText:
        'This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal no less than sixty (60) days prior to the expiration of the then-current term.',
      simpleExplanation:
        'The contract automatically continues each year unless you give 60 days advance written notice that you want to end it.',
      whyItMatters:
        'Missing the 60-day window locks you into another full year. The notice must be in writing, and there is no grace period mentioned.',
      questionToAsk:
        'Is the 60-day window negotiable? What happens if the notice deadline is missed by a few days?',
      simplestVersion:
        "If you forget to send a written notice 60 days before the contract ends, it automatically restarts for another year.",
    },
    {
      id: 'clause-005',
      category: 'Confidentiality',
      severity: 'Medium',
      title: 'Perpetual Confidentiality Obligation',
      originalText:
        'The Employee agrees to maintain in strict confidence all Confidential Information received during the course of employment and shall not disclose such information to any third party at any time, whether during or after the term of employment, without prior written consent of the Company.',
      simpleExplanation:
        'You must keep company information confidential forever — even after you leave the company.',
      whyItMatters:
        '"Confidential Information" is not defined within this clause, which may create ambiguity. A perpetual obligation with no time limit is broader than industry standard.',
      questionToAsk:
        'How is "Confidential Information" defined? Is there a time limit on this obligation after employment ends?',
      simplestVersion:
        "You can never share company secrets — and this rule doesn't expire, even after you stop working there.",
    },
    {
      id: 'clause-006',
      category: 'Compensation',
      severity: 'Low',
      title: 'Discretionary Bonus Structure',
      originalText:
        'The Employee may be eligible for an annual performance bonus at the sole discretion of the Company. The Company makes no guarantee of any bonus payment and reserves the right to modify, suspend, or discontinue the bonus program at any time without notice.',
      simpleExplanation:
        'Any bonus is entirely at the company\'s discretion and is not guaranteed — they can change or cancel the program without telling you.',
      whyItMatters:
        'While common in many employment contracts, the lack of any defined criteria or minimum threshold means you have no reliable expectation of bonus compensation.',
      questionToAsk:
        'What criteria determine bonus eligibility and amount? Can a performance-based minimum be added?',
      simplestVersion:
        "Bonuses are completely optional for the company — they don't have to pay any, and they can stop the program whenever they want.",
    },
  ],

  unclearAreas: [
    {
      id: 'unclear-001',
      title: 'Dispute Resolution Process',
      description:
        'A process for resolving disputes between the parties does not appear to be clearly defined in the reviewed text. It is unclear whether arbitration, mediation, or litigation would apply.',
    },
    {
      id: 'unclear-002',
      title: 'Data Deletion & Return of Property',
      description:
        'Terms regarding the return or deletion of company data and personal devices upon termination do not appear to be clearly addressed in the reviewed section.',
    },
    {
      id: 'unclear-003',
      title: 'Remote Work & Expense Policy',
      description:
        'Provisions covering remote work arrangements, reimbursable expenses, and equipment allowances appear unclear or absent from the reviewed sections.',
    },
  ],

  beforeYouSign: [
    {
      id: 'bys-001',
      text: '24-month non-compete restriction with no defined geographic boundary',
      severity: 'High',
    },
    {
      id: 'bys-002',
      text: '7-day termination notice with company-defined "cause" for immediate termination',
      severity: 'High',
    },
    {
      id: 'bys-003',
      text: 'Broad intellectual property ownership — including work done outside of office hours',
      severity: 'Medium',
    },
    {
      id: 'bys-004',
      text: 'Automatic renewal requires 60-day written notice to cancel — easy to miss',
      severity: 'High',
    },
  ],
};

export const mockHistory: HistoryEntry[] = [
  {
    id: 'history-001',
    documentName: 'Employment Agreement.pdf',
    attentionScore: 78,
    riskLevel: 'High',
    analyzedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'history-002',
    documentName: 'Rental Agreement.pdf',
    attentionScore: 64,
    riskLevel: 'Medium',
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'history-003',
    documentName: 'Freelance Contract.pdf',
    attentionScore: 39,
    riskLevel: 'Low',
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export const analysisSteps = [
  { id: 1, label: 'Reading document', duration: 400 },
  { id: 2, label: 'Identifying key clauses', duration: 500 },
  { id: 3, label: 'Evaluating attention areas', duration: 450 },
  { id: 4, label: 'Preparing plain-language explanations', duration: 400 },
];
