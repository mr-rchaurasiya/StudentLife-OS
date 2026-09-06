import {
  InternshipOpportunity,
  TrackedJobApplication,
  CreateJobApplicationDto,
  UpdateJobApplicationDto,
  ColdOutreachTemplate,
  GenerateColdOutreachDto,
} from '@studentlife/shared';

let opportunitiesStore: InternshipOpportunity[] = [
  {
    id: 'opp-1',
    companyName: 'Stripe',
    companyLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Software Engineering Intern – Backend & Distributed Systems',
    opportunityType: 'SUMMER_INTERNSHIP',
    location: 'San Francisco, CA / Seattle, WA',
    workLocationType: 'HYBRID',
    stipendOrSalary: '$9,800 / month + Housing',
    targetGraduationBatch: ['2026', '2027'],
    applicationDeadline: '2026-10-31',
    daysRemaining: 55,
    matchScorePercent: 96,
    requiredSkills: ['Go', 'Distributed Systems', 'PostgreSQL', 'Redis', 'Concurrency'],
    matchedSkills: ['Go', 'Distributed Systems', 'PostgreSQL', 'Redis', 'Concurrency'],
    missingSkills: [],
    applyUrl: 'https://stripe.com/jobs/university',
    description: 'Join Stripe\'s core ledger infrastructure team building high-throughput, ACID-compliant transaction pipelines handling $1T+ in global GDP economic activity.',
    perks: ['Housing stipend ($2,500/mo)', 'Executive mentorship', 'Return offer conversion > 85%'],
    isBookmarked: true,
    postedDate: '2026-09-01',
  },
  {
    id: 'opp-2',
    companyName: 'Google',
    companyLogoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Software Engineering Intern (Summer 2026)',
    opportunityType: 'SUMMER_INTERNSHIP',
    location: 'Mountain View, CA / New York, NY / Remote',
    workLocationType: 'HYBRID',
    stipendOrSalary: '$9,200 / month + Relocation',
    targetGraduationBatch: ['2026', '2027'],
    applicationDeadline: '2026-11-15',
    daysRemaining: 70,
    matchScorePercent: 94,
    requiredSkills: ['Data Structures & Algorithms', 'C++', 'Go', 'System Design', 'Linux'],
    matchedSkills: ['Data Structures & Algorithms', 'Go', 'System Design', 'Linux'],
    missingSkills: ['C++'],
    applyUrl: 'https://careers.google.com/students',
    description: 'Work alongside world-class Google engineers on scalable software infrastructure spanning Google Cloud, Search, Android, and Core Machine Learning.',
    perks: ['Full housing accommodation', 'Catered gourmet meals', '1:1 Host mentorship'],
    isBookmarked: true,
    postedDate: '2026-08-28',
  },
  {
    id: 'opp-3',
    companyName: 'OpenAI',
    companyLogoUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'AI Systems & Distributed Training Research Intern',
    opportunityType: 'SUMMER_INTERNSHIP',
    location: 'San Francisco, CA',
    workLocationType: 'ONSITE',
    stipendOrSalary: '$10,500 / month + Housing',
    targetGraduationBatch: ['2025', '2026', '2027'],
    applicationDeadline: '2026-10-15',
    daysRemaining: 39,
    matchScorePercent: 89,
    requiredSkills: ['Python', 'Distributed Systems', 'GPU Concurrency', 'PyTorch', 'C++'],
    matchedSkills: ['Python', 'Distributed Systems'],
    missingSkills: ['GPU Concurrency', 'PyTorch'],
    applyUrl: 'https://openai.com/careers',
    description: 'Accelerate large-scale distributed training clusters powering frontier multimodal LLMs. Optimize cluster communication (NCCL, InfiniBand) and fault-tolerant checkpointing.',
    perks: ['Compute access on 10k+ H100 clusters', 'Direct collaboration with frontier AI researchers', 'Daily catered meals'],
    isBookmarked: false,
    postedDate: '2026-09-02',
  },
  {
    id: 'opp-4',
    companyName: 'Jane Street',
    companyLogoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Quantitative Software Engineer Intern',
    opportunityType: 'SUMMER_INTERNSHIP',
    location: 'New York, NY / London, UK',
    workLocationType: 'ONSITE',
    stipendOrSalary: '$12,500 / month ($78/hr) + $10k Sign-on',
    targetGraduationBatch: ['2026', '2027'],
    applicationDeadline: '2026-10-01',
    daysRemaining: 25,
    matchScorePercent: 86,
    requiredSkills: ['Algorithms', 'Low Latency', 'OCaml / Functional Programming', 'Computer Architecture', 'Concurrency'],
    matchedSkills: ['Algorithms', 'Computer Architecture', 'Concurrency'],
    missingSkills: ['OCaml / Functional Programming', 'Low Latency'],
    applyUrl: 'https://janestreet.com/join-jane-street/programs-and-internships/',
    description: 'Design ultra-low latency trading infrastructure and distributed risk evaluation engines executing millions of market orders per second.',
    perks: ['Free luxury corporate housing in NYC', 'Highest compensation in industry', 'Intensive OCaml bootcamp'],
    isBookmarked: false,
    postedDate: '2026-08-20',
  },
  {
    id: 'opp-5',
    companyName: 'Cloudflare',
    companyLogoUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Systems & Edge Compute Engineering Intern',
    opportunityType: 'OFF_CYCLE_INTERN',
    location: 'Austin, TX / San Francisco, CA / Remote',
    workLocationType: 'REMOTE',
    stipendOrSalary: '$8,500 / month',
    targetGraduationBatch: ['2025', '2026', '2027'],
    applicationDeadline: '2026-11-30',
    daysRemaining: 85,
    matchScorePercent: 92,
    requiredSkills: ['Rust', 'Go', 'TCP/IP', 'BGP / Anycast Routing', 'Distributed Caching'],
    matchedSkills: ['Rust', 'Go', 'TCP/IP', 'Distributed Caching'],
    missingSkills: ['BGP / Anycast Routing'],
    applyUrl: 'https://cloudflare.com/careers/internships',
    description: 'Build edge runtime services on Cloudflare Workers handling 55+ million HTTP requests per second across 330+ global cities.',
    perks: ['100% remote flexibility', 'Generous home office stipend', 'Direct production deployment access'],
    isBookmarked: true,
    postedDate: '2026-09-04',
  },
  {
    id: 'opp-6',
    companyName: 'Datadog',
    companyLogoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Cloud Telemetry & Reliability Engineering Intern',
    opportunityType: 'SUMMER_INTERNSHIP',
    location: 'Boston, MA / New York, NY',
    workLocationType: 'HYBRID',
    stipendOrSalary: '$8,800 / month + Housing',
    targetGraduationBatch: ['2026', '2027'],
    applicationDeadline: '2026-11-20',
    daysRemaining: 75,
    matchScorePercent: 91,
    requiredSkills: ['Go', 'Python', 'Kafka', 'Prometheus', 'Kubernetes'],
    matchedSkills: ['Go', 'Python', 'Kafka', 'Prometheus', 'Kubernetes'],
    missingSkills: [],
    applyUrl: 'https://datadoghq.com/careers',
    description: 'Engineer high-cardinality time-series ingestion engines parsing tens of billions of metrics and traces every hour.',
    perks: ['Modern Boston/NYC offices', 'Comprehensive cloud sandbox allowances', 'Hackathon weeks'],
    isBookmarked: false,
    postedDate: '2026-09-03',
  },
];

let trackedApplicationsStore: TrackedJobApplication[] = [
  {
    id: 'app-1',
    userId: 'demo-student-uuid-01',
    opportunityId: 'opp-1',
    companyName: 'Stripe',
    roleTitle: 'Backend Engineering Intern',
    stipendOrSalary: '$9,800 / mo',
    location: 'San Francisco, CA',
    stage: 'OA_ASSESSMENT',
    appliedDate: '2026-09-01',
    nextFollowUpDate: '2026-09-08',
    daysSinceLastUpdate: 5,
    notes: 'Completed HackerRank 90-minute OA (2 Distributed Systems & DP problems). Awaiting recruiter feedback.',
    interviewRoundsCount: 1,
    referralStatus: 'SECURED',
    referralContactName: 'David Chen (Staff SDE, Ex-Alumni)',
    portalUrl: 'https://stripe.com/careers/portal',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-2',
    userId: 'demo-student-uuid-01',
    opportunityId: 'opp-2',
    companyName: 'Google',
    roleTitle: 'Software Engineering Intern (Summer 2026)',
    stipendOrSalary: '$9,200 / mo',
    location: 'Mountain View, CA',
    stage: 'SAVED',
    appliedDate: '2026-09-05',
    nextFollowUpDate: '2026-09-10',
    daysSinceLastUpdate: 1,
    notes: 'Resume polished. Requesting alumni referral from Berkeley SWE network.',
    interviewRoundsCount: 0,
    referralStatus: 'REQUESTED',
    portalUrl: 'https://careers.google.com',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-3',
    userId: 'demo-student-uuid-01',
    opportunityId: 'opp-5',
    companyName: 'Cloudflare',
    roleTitle: 'Systems & Edge Compute Intern',
    stipendOrSalary: '$8,500 / mo',
    location: 'Remote',
    stage: 'APPLIED',
    appliedDate: '2026-09-03',
    nextFollowUpDate: '2026-09-12',
    daysSinceLastUpdate: 3,
    notes: 'Submitted application on Greenhouse with DistriCache GitHub project highlighted in portfolio link.',
    interviewRoundsCount: 0,
    referralStatus: 'NONE',
    portalUrl: 'https://boards.greenhouse.io/cloudflare',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-4',
    userId: 'demo-student-uuid-01',
    opportunityId: 'opp-6',
    companyName: 'Datadog',
    roleTitle: 'Telemetry & Reliability Engineering Intern',
    stipendOrSalary: '$8,800 / mo',
    location: 'Boston, MA',
    stage: 'TECHNICAL_INTERVIEW',
    appliedDate: '2026-08-25',
    nextFollowUpDate: '2026-09-09',
    daysSinceLastUpdate: 2,
    notes: 'Passed initial recruiter screen. Round 1 Technical scheduled for Tuesday (System Design & Concurrency).',
    interviewRoundsCount: 2,
    referralStatus: 'SECURED',
    referralContactName: 'Elena Rostova (Senior Tech Recruiter)',
    portalUrl: 'https://datadoghq.com',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-5',
    userId: 'demo-student-uuid-01',
    companyName: 'Vercel / Cloudflare Ecosystem',
    roleTitle: 'Edge Infrastructure Fellowship',
    stipendOrSalary: '$7,500 / mo',
    location: 'Remote',
    stage: 'OFFER_RECEIVED',
    appliedDate: '2026-08-10',
    nextFollowUpDate: '2026-09-15',
    daysSinceLastUpdate: 1,
    notes: '🎉 Received official offer letter! Compensation: $7.5k/mo + $1k WFH stipend. Offer valid until Sept 20.',
    interviewRoundsCount: 3,
    referralStatus: 'SECURED',
    portalUrl: 'https://vercel.com',
    updatedAt: new Date().toISOString(),
  },
];

export class InternshipService {
  /**
   * Get all active curated opportunities
   */
  public async getOpportunities(): Promise<InternshipOpportunity[]> {
    return opportunitiesStore;
  }

  /**
   * Toggle bookmark on an opportunity
   */
  public async toggleBookmark(id: string): Promise<InternshipOpportunity | null> {
    const opp = opportunitiesStore.find((o) => o.id === id);
    if (!opp) return null;
    opp.isBookmarked = !opp.isBookmarked;
    return opp;
  }

  /**
   * Get all tracked applications in Kanban pipeline
   */
  public async getTrackedApplications(): Promise<TrackedJobApplication[]> {
    return trackedApplicationsStore;
  }

  /**
   * Add new application to Kanban pipeline
   */
  public async createTrackedApplication(dto: CreateJobApplicationDto): Promise<TrackedJobApplication> {
    const newApp: TrackedJobApplication = {
      id: `app-${Date.now()}`,
      userId: 'demo-student-uuid-01',
      opportunityId: dto.opportunityId,
      companyName: dto.companyName,
      roleTitle: dto.roleTitle,
      stipendOrSalary: dto.stipendOrSalary || '$8,500 / mo',
      location: dto.location || 'Remote / Hybrid',
      stage: dto.stage || 'SAVED',
      appliedDate: dto.appliedDate || new Date().toISOString().split('T')[0],
      nextFollowUpDate: dto.nextFollowUpDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      daysSinceLastUpdate: 0,
      notes: dto.notes || '',
      interviewRoundsCount: 0,
      referralStatus: dto.referralStatus || 'NONE',
      portalUrl: dto.portalUrl,
      updatedAt: new Date().toISOString(),
    };
    trackedApplicationsStore = [newApp, ...trackedApplicationsStore];
    return newApp;
  }

  /**
   * Update application stage or details in Kanban
   */
  public async updateApplication(id: string, dto: UpdateJobApplicationDto): Promise<TrackedJobApplication | null> {
    const index = trackedApplicationsStore.findIndex((a) => a.id === id);
    if (index === -1) return null;

    trackedApplicationsStore[index] = {
      ...trackedApplicationsStore[index],
      ...dto,
      stage: dto.stage || trackedApplicationsStore[index].stage,
      daysSinceLastUpdate: 0,
      updatedAt: new Date().toISOString(),
    };
    return trackedApplicationsStore[index];
  }

  /**
   * Delete application from Kanban
   */
  public async deleteApplication(id: string): Promise<boolean> {
    const initialLen = trackedApplicationsStore.length;
    trackedApplicationsStore = trackedApplicationsStore.filter((a) => a.id !== id);
    return trackedApplicationsStore.length < initialLen;
  }

  /**
   * Generate tailored Cold Outreach & LinkedIn message templates
   */
  public async generateColdOutreach(dto: GenerateColdOutreachDto): Promise<ColdOutreachTemplate> {
    const { companyName, roleTitle, recipientName, recipientRole, studentKeyProject } = dto;
    const name = recipientName || 'Engineering Leader';
    const role = recipientRole || 'Engineering Manager';
    const project = studentKeyProject || 'DistriCache (Distributed Raft Key-Value Store)';

    return {
      subjectLine: `Aspiring ${roleTitle} @ ${companyName} – UC Berkeley CS Senior / ${project}`,
      body: `Hi ${name},\n\nHope you're having a great week! I've been closely following ${companyName}'s engineering milestones in scalable infrastructure.\n\nI am a Computer Science senior at UC Berkeley actively looking for a ${roleTitle} role. Recently, I built ${project}, which implemented Raft consensus in Go handling 45k ops/sec with sub-5ms replication latency. Previously, I interned at Stripe building idempotent payment pipelines.\n\nI would love the opportunity to contribute to ${companyName}'s engineering team. Would you be open to a brief 10-minute chat or passing my resume to the hiring team?\n\nResume & GitHub: https://github.com/alexmorgan-cs\n\nBest regards,\nAlex Morgan`,
      linkedInConnectNote: `Hi ${name}, saw your work leading engineering at ${companyName}. I'm a UC Berkeley CS senior focusing on distributed systems (built ${project}). Would love to connect and follow your team's updates!`,
      tips: [
        'Keep LinkedIn connection requests under 300 characters for highest acceptance rate (~68%).',
        'Mention a concrete metric or open-source project link within the first 2 sentences.',
        'Follow up exactly 4-5 business days after initial outreach if no reply.',
      ],
    };
  }
}

export const internshipService = new InternshipService();
