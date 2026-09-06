import {
  ScholarshipScheme,
  DocumentVerificationItem,
  CheckScholarshipEligibilityDto,
  EligibilityMatchResult,
} from '@studentlife/shared';

let scholarshipsStore: ScholarshipScheme[] = [
  {
    id: 'sch-1',
    title: 'Reliance Foundation Undergraduate Scholarship',
    provider: 'Reliance Foundation (Corporate CSR & Merit Trust)',
    category: 'MEANS_CUM_MERIT',
    awardAmount: '₹2,00,000 total grant',
    awardType: 'ANNUAL_RECURRING',
    eligibilityCriteria: {
      minCgpa: 7.5,
      maxAnnualFamilyIncomeInLakhs: 15,
      targetDegrees: ['B.Tech', 'B.E', 'B.Sc Computer Science', 'B.Sc Data Science'],
      academicYears: [1, 2, 3, 4],
      genderRestriction: 'ALL',
    },
    requiredDocuments: [
      'Bonafide College Certificate',
      'Income Certificate issued by Tehsildar / SDO',
      'Class 12th & Semester Marksheets',
      'Aadhaar Card',
      'Bank Account Passbook Copy',
    ],
    applicationDeadline: '2026-10-15',
    daysRemaining: 39,
    applyUrl: 'https://scholarships.reliancefoundation.org',
    description: 'Empowering India\'s top undergraduate STEM students with up to ₹2 Lakhs in financial support, leadership development workshops, and an active alumni mentor network.',
    selectionProcess: [
      'Online aptitude test (Mental ability, verbal reasoning & numerical analysis)',
      'Academic merit evaluation & socio-economic background validation',
      'Final national scholar announcement (5,000 scholars awarded annually)',
    ],
    isEligible: true,
    isBookmarked: true,
    totalRecipientsPerYear: 5000,
    verifiedByGovtOrTrust: true,
  },
  {
    id: 'sch-2',
    title: 'NSP Central Sector Scheme of Scholarship for College & University Students',
    provider: 'Ministry of Education (Government of India)',
    category: 'GOVT_NATIONAL',
    awardAmount: '₹20,000 / year (₹12,000 for 1st-3rd yr + ₹20,000 for PG)',
    awardType: 'ANNUAL_RECURRING',
    eligibilityCriteria: {
      minCgpa: 7.0,
      maxAnnualFamilyIncomeInLakhs: 4.5,
      targetDegrees: ['B.Tech', 'B.E', 'B.Sc', 'BCA', 'MBBS'],
      academicYears: [1, 2, 3, 4],
      genderRestriction: 'ALL',
    },
    requiredDocuments: [
      'NSP Online Registration Form',
      'Aadhaar Linked Bank Account Details',
      'Income Certificate (Below ₹4.5 Lakhs)',
      '12th Board Examination Top 80th Percentile Scorecard',
      'College Institution Verification Slip',
    ],
    applicationDeadline: '2026-11-30',
    daysRemaining: 85,
    applyUrl: 'https://scholarships.gov.in',
    description: 'Flagship national government scholarship scheme providing Direct Benefit Transfer (DBT) to students pursuing higher professional education.',
    selectionProcess: [
      'State-wise board percentile quota matching (Top 20th percentile of Class 12th)',
      'Online institute level biometric verification by College Nodal Officer',
      'DBT disbursement directly to student PFMS Aadhaar seeded bank account',
    ],
    isEligible: true,
    isBookmarked: true,
    totalRecipientsPerYear: 82000,
    verifiedByGovtOrTrust: true,
  },
  {
    id: 'sch-3',
    title: 'Tata Trusts Higher Education Grant (Engineering & Technology)',
    provider: 'Tata Trusts Philanthropy',
    category: 'PRIVATE_MERIT',
    awardAmount: '₹1,00,000 / year (Tuition & Living Grant)',
    awardType: 'ANNUAL_RECURRING',
    eligibilityCriteria: {
      minCgpa: 8.0,
      maxAnnualFamilyIncomeInLakhs: 8.0,
      targetDegrees: ['B.Tech', 'B.E', 'M.Tech', 'Dual Degree'],
      academicYears: [2, 3, 4],
      genderRestriction: 'ALL',
    },
    requiredDocuments: [
      'College Fee Receipt & Bonafide Letter',
      'Semester Grade Cards showing CGPA >= 8.0',
      'Income Tax Returns (ITR-V) or Form 16 of Parents',
      'Statement of Purpose (SOP) on Engineering Impact',
    ],
    applicationDeadline: '2026-10-31',
    daysRemaining: 55,
    applyUrl: 'https://tatatrusts.org/our-work/individual-grants-programme/education-grants',
    description: 'Merit-cum-means financial grant for high-performing engineering students studying in recognized government & tier-1 technical colleges.',
    selectionProcess: [
      'Scrutiny of academic transcripts and family income proof',
      'Evaluation of student statement of purpose and community impact',
      'Direct grant transfer toward university semester fee accounts',
    ],
    isEligible: true,
    isBookmarked: false,
    totalRecipientsPerYear: 1200,
    verifiedByGovtOrTrust: true,
  },
  {
    id: 'sch-4',
    title: 'Google Generation Scholarship (APAC / India)',
    provider: 'Google University Programs & Diversity In Tech',
    category: 'WOMEN_IN_TECH',
    awardAmount: '$2,500 USD (Approx. ₹2,10,000)',
    awardType: 'ONE_TIME_GRANT',
    eligibilityCriteria: {
      minCgpa: 7.5,
      targetDegrees: ['Computer Science', 'Computer Engineering', 'Information Technology'],
      academicYears: [2, 3],
      genderRestriction: 'FEMALE_ONLY',
    },
    requiredDocuments: [
      'Resume highlighting CS technical projects & open source contributions',
      'Official Academic Transcript',
      'Two Essay Responses on Diversity in Technology & Impact',
    ],
    applicationDeadline: '2026-12-15',
    daysRemaining: 100,
    applyUrl: 'https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship-apac',
    description: 'Awarded to aspiring women in computer science who demonstrate strong technical leadership, innovation, and commitment to diversity in technology.',
    selectionProcess: [
      'Online technical essay and project portfolio review',
      'Google Online Technical Assessment (30 mins coding & CS fundamentals)',
      '1:1 Virtual technical & behavioral interview with Google Software Engineers',
    ],
    isEligible: false,
    isBookmarked: true,
    totalRecipientsPerYear: 60,
    verifiedByGovtOrTrust: true,
  },
  {
    id: 'sch-5',
    title: 'Aditya Birla Group Scholarship for Premier Technical Institutes',
    provider: 'Aditya Birla Centre for Community Initiatives',
    category: 'PRIVATE_MERIT',
    awardAmount: '₹1,80,000 / year + Lifetime ABG Leadership Circle',
    awardType: 'ANNUAL_RECURRING',
    eligibilityCriteria: {
      minCgpa: 8.5,
      targetDegrees: ['B.Tech at IITs / BITS Pilani'],
      academicYears: [1, 2, 3, 4],
      genderRestriction: 'ALL',
    },
    requiredDocuments: [
      'JEE Advanced All India Rank Scorecard (Top 500 AIR)',
      'Semester Transcripts with 8.5+ CGPA',
      'Essays on Vision, Leadership & Technological Disruption',
      'Faculty Recommendation Letters (2x)',
    ],
    applicationDeadline: '2026-09-30',
    daysRemaining: 24,
    applyUrl: 'https://adityabirlascholars.net',
    description: 'Prestigious national scholarship awarded to top JEE Advanced rankers at IITs and BITS Pilani, covering complete hostel and tuition expenses with executive ABG mentorship.',
    selectionProcess: [
      'Shortlisting based on JEE Advanced AIR and academic standing',
      'Essay evaluation by independent panel of academics and industry titans',
      'In-person final interview round in Mumbai with ABG Board of Directors',
    ],
    isEligible: true,
    isBookmarked: false,
    totalRecipientsPerYear: 32,
    verifiedByGovtOrTrust: true,
  },
  {
    id: 'sch-6',
    title: 'Adobe Research Women-in-Technology Scholarship',
    provider: 'Adobe Research Labs',
    category: 'RESEARCH_GRANT',
    awardAmount: '$10,000 USD (₹8,40,000) + 1-Year Adobe Creative Cloud + Adobe Mentorship',
    awardType: 'ONE_TIME_GRANT',
    eligibilityCriteria: {
      minCgpa: 8.0,
      targetDegrees: ['B.Tech Computer Science', 'M.Tech AI/ML', 'PhD Computer Science'],
      academicYears: [3, 4],
      genderRestriction: 'FEMALE_ONLY',
    },
    requiredDocuments: [
      'Curriculum Vitae (CV) with GitHub & research publications',
      'Academic transcripts',
      '3 Letters of Recommendation (Faculty/Industry)',
      'Research Proposal or Innovation Paper',
    ],
    applicationDeadline: '2026-11-10',
    daysRemaining: 65,
    applyUrl: 'https://research.adobe.com/scholarship.html',
    description: 'Recognizes outstanding female undergraduate and graduate students in computer science researching cutting-edge Artificial Intelligence, Computer Vision, and Graphics.',
    selectionProcess: [
      'Peer review of research proposals and engineering codebases by Adobe scientists',
      'Virtual presentation of research vision and technical Q&A',
      'Scholarship grant + Summer Internship interview opportunity at Adobe Research',
    ],
    isEligible: false,
    isBookmarked: false,
    totalRecipientsPerYear: 20,
    verifiedByGovtOrTrust: true,
  },
];

let documentChecklistStore: DocumentVerificationItem[] = [
  {
    id: 'doc-1',
    documentName: 'Aadhaar Card (Aadhaar Linked with Bank Account)',
    category: 'IDENTITY',
    isVerified: true,
    notes: 'Verified via DigiLocker. Seeded with NPCI for direct DBT payments.',
    fileFormat: 'PDF (DigiLocker Certified)',
  },
  {
    id: 'doc-2',
    documentName: 'Current College Bonafide & Student ID Card',
    category: 'COLLEGE_VERIFICATION',
    isVerified: true,
    notes: 'Signed and stamped by Dean of Academic Affairs (Valid for AY 2026-27).',
    fileFormat: 'PDF (Official Stamp)',
  },
  {
    id: 'doc-3',
    documentName: 'Official Semester 1–5 Marksheets (CGPA Proof: 3.88 / 8.9)',
    category: 'ACADEMIC',
    isVerified: true,
    notes: 'Official grade card signed by Controller of Examinations.',
    fileFormat: 'PDF',
  },
  {
    id: 'doc-4',
    documentName: 'Family Income Certificate / Form 16 (Below ₹8 Lakhs)',
    category: 'INCOME_FINANCIAL',
    isVerified: false,
    notes: 'Pending renewal from Tehsildar Office for the current financial year.',
    fileFormat: 'PDF (Signed by Revenue Authority)',
  },
  {
    id: 'doc-5',
    documentName: 'Active Savings Bank Passbook / Cancelled Cheque',
    category: 'INCOME_FINANCIAL',
    isVerified: true,
    notes: 'IFSC and Account number clearly legible for Direct Benefit Transfer.',
    fileFormat: 'PDF / Scanned Copy',
  },
  {
    id: 'doc-6',
    documentName: 'Statement of Purpose (SOP) on Engineering Aspirations',
    category: 'ACADEMIC',
    isVerified: true,
    notes: 'Polished 500-word essay covering distributed systems projects & financial need.',
    fileFormat: 'PDF / Markdown',
  },
];

export class ScholarshipService {
  /**
   * Get all curated scholarships
   */
  public async getScholarships(): Promise<ScholarshipScheme[]> {
    return scholarshipsStore;
  }

  /**
   * Toggle bookmark
   */
  public async toggleBookmark(id: string): Promise<ScholarshipScheme | null> {
    const item = scholarshipsStore.find((s) => s.id === id);
    if (!item) return null;
    item.isBookmarked = !item.isBookmarked;
    return item;
  }

  /**
   * Check student eligibility and calculate total potential grant aid
   */
  public async checkEligibility(dto: CheckScholarshipEligibilityDto): Promise<EligibilityMatchResult> {
    const { cgpa, familyIncomeLakhs, gender, academicYear } = dto;

    const matchedSchemes = scholarshipsStore.filter((scheme) => {
      const crit = scheme.eligibilityCriteria;
      const passesCgpa = cgpa >= crit.minCgpa;
      const passesIncome = !crit.maxAnnualFamilyIncomeInLakhs || familyIncomeLakhs <= crit.maxAnnualFamilyIncomeInLakhs;
      const passesYear = crit.academicYears.includes(academicYear);
      const passesGender = crit.genderRestriction === 'ALL' || (crit.genderRestriction === 'FEMALE_ONLY' && gender === 'FEMALE');

      return passesCgpa && passesIncome && passesYear && passesGender;
    });

    return {
      eligibleSchemes: matchedSchemes,
      totalPotentialAidEstimate: '₹4,80,000 ($5,800)',
      matchedCount: matchedSchemes.length,
      recommendedNextSteps: [
        'Renew Family Income Certificate from Tehsildar office before the Oct 15 deadline.',
        'Upload official signed Bonafide certificate to the National Scholarship Portal (NSP).',
        'Submit Statement of Purpose for the Reliance Foundation Undergraduate Scholarship test.',
      ],
    };
  }

  /**
   * Get document verification checklist
   */
  public async getDocumentChecklist(): Promise<DocumentVerificationItem[]> {
    return documentChecklistStore;
  }

  /**
   * Toggle document verification status
   */
  public async toggleDocumentVerification(id: string): Promise<DocumentVerificationItem | null> {
    const item = documentChecklistStore.find((d) => d.id === id);
    if (!item) return null;
    item.isVerified = !item.isVerified;
    return item;
  }
}

export const scholarshipService = new ScholarshipService();
