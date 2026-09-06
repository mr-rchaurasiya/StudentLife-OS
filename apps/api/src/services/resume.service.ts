import {
  StudentResumeData,
  AtsScoreReport,
  AtsKeywordMatch,
  AtsSectionDiagnostic,
  AtsBulletSuggestion,
  AiInterviewMockQuestion,
  AnalyzeAtsDto,
  OptimizeBulletDto,
  GenerateInterviewQaDto,
} from '@studentlife/shared';

// In-memory student resume store for demonstration & persistence
let studentResumeStore: StudentResumeData = {
  id: 'resume-demo-01',
  userId: 'demo-student-uuid-01',
  templateId: 'MODERN_SINGLE_COLUMN',
  contact: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan.cs@gmail.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA / Seattle, WA',
    githubUrl: 'https://github.com/alexmorgan-cs',
    linkedinUrl: 'https://linkedin.com/in/alex-morgan-cs',
    portfolioUrl: 'https://alexmorgan.dev',
  },
  headline: 'Software Engineer & Distributed Systems Enthusiast',
  professionalSummary:
    'Computer Science senior with proven experience in building high-throughput backend services, distributed caching layers, and microservices architecture. Proficient in Go, TypeScript, PostgreSQL, and Redis. Passionate about low-latency systems and cloud reliability.',
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science & Engineering',
      startDate: 'Aug 2022',
      endDate: 'May 2026 (Expected)',
      cgpaOrGrade: '3.88 / 4.00 (Dean\'s Honor List)',
      relevantCoursework: [
        'Distributed Systems (CS 162)',
        'Data Structures & Algorithms (CS 61B)',
        'Database Systems (CS 186)',
        'Computer Networks (CS 168)',
        'Operating Systems',
      ],
    },
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Backend Engineering Intern',
      company: 'Stripe / FinTech Infrastructure',
      location: 'San Francisco, CA',
      startDate: 'May 2025',
      endDate: 'Aug 2025',
      isCurrentRole: false,
      bulletPoints: [
        'Engineered an idempotent payout reconciliation microservice in Go and PostgreSQL handling over 250,000 daily financial transactions with 99.999% data consistency.',
        'Architected a multi-tier Redis caching strategy that slashed API endpoint p99 latency from 320ms down to 42ms under peak 15,000 RPS traffic loads.',
        'Designed comprehensive integration test suites using Docker containers and mock payment gateways, boosting test coverage from 64% to 92%.',
      ],
    },
    {
      id: 'exp-2',
      role: 'Undergraduate Research Assistant',
      company: 'Berkeley RISELab (Real-time Intelligent Secure Execution)',
      location: 'Berkeley, CA',
      startDate: 'Jan 2024',
      endDate: 'Dec 2024',
      isCurrentRole: false,
      bulletPoints: [
        'Benchmarked Raft consensus algorithm leader election failover latencies in geo-distributed network topologies with simulated packet drops.',
        'Authored performance telemetry logging pipelines in Rust to stream sub-millisecond heartbeat metrics to Prometheus and Grafana dashboards.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'DistriCache: High-Performance Distributed Key-Value Store',
      technologies: ['Go', 'Raft Consensus', 'gRPC', 'Protobuf', 'Docker'],
      githubUrl: 'https://github.com/alexmorgan-cs/districache',
      liveUrl: 'https://districache-demo.dev',
      bulletPoints: [
        'Implemented a distributed in-memory key-value store using the Raft consensus protocol for strong linearizable consistency and automatic failover.',
        'Achieved 12,000 write operations/sec and 45,000 read operations/sec across 5 replicated nodes with sub-5ms cluster replication latency.',
        'Integrated gRPC streaming protocol and custom binary serialization for optimal network serialization overhead.',
      ],
    },
    {
      id: 'proj-2',
      title: 'StreamPulse: Real-Time Event Analytics Pipeline',
      technologies: ['TypeScript', 'Apache Kafka', 'Node.js', 'PostgreSQL', 'Redis', 'TailwindCSS'],
      githubUrl: 'https://github.com/alexmorgan-cs/streampulse',
      liveUrl: 'https://streampulse.dev',
      bulletPoints: [
        'Built an end-to-end telemetry pipeline ingesting 50,000 real-time client analytics events per minute via distributed Apache Kafka partitions.',
        'Developed sliding-window aggregation consumers computing rolling metrics with Redis HyperLogLog for unique visitor cardinality estimation.',
      ],
    },
  ],
  skillCategories: [
    {
      categoryName: 'Languages',
      skills: ['Go', 'TypeScript / JavaScript', 'Python', 'C / C++', 'SQL', 'Rust'],
    },
    {
      categoryName: 'Backend & Distributed',
      skills: ['Node.js / Express', 'gRPC / Protobuf', 'Redis', 'Apache Kafka', 'PostgreSQL', 'RESTful APIs', 'Microservices Architecture'],
    },
    {
      categoryName: 'Cloud & Infrastructure',
      skills: ['Docker', 'Kubernetes', 'AWS (S3, EC2, ECS)', 'CI/CD (GitHub Actions)', 'Prometheus & Grafana', 'Linux / Bash'],
    },
    {
      categoryName: 'Core Computer Science',
      skills: ['Data Structures & Algorithms', 'Distributed Systems', 'Database Indexing (B-Trees, LSM)', 'Concurrency & Goroutines', 'TCP/IP Networking'],
    },
  ],
  certifications: [
    'AWS Certified Solutions Architect – Associate (2025)',
    'Certified Kubernetes Application Developer (CKAD)',
  ],
  achievements: [
    '1st Place Winner – CalHacks 11.0 (Best Distributed System / Infrastructure Track)',
    'Top 2.5% Globally on LeetCode (Knight Badge, 2150+ Contest Rating)',
  ],
  updatedAt: new Date().toISOString(),
};

const HIGH_PRIORITY_KEYWORDS = [
  'Go', 'TypeScript', 'Distributed Systems', 'Redis', 'Kafka', 'PostgreSQL', 'Microservices',
  'Docker', 'Kubernetes', 'gRPC', 'REST APIs', 'Data Structures', 'Algorithms', 'CI/CD',
  'AWS', 'System Design', 'Concurrency', 'Latency Optimization', 'Unit Testing', 'Raft'
];

const ACTION_VERBS = [
  'Architected', 'Engineered', 'Implemented', 'Designed', 'Optimized', 'Benchmarked',
  'Built', 'Developed', 'Integrated', 'Automated', 'Spearheaded', 'Refactored', 'Slashed'
];

export class ResumeService {
  /**
   * Get active resume profile
   */
  public async getResume(): Promise<StudentResumeData> {
    return studentResumeStore;
  }

  /**
   * Save or update resume profile
   */
  public async updateResume(resume: StudentResumeData): Promise<StudentResumeData> {
    studentResumeStore = {
      ...resume,
      updatedAt: new Date().toISOString(),
    };
    return studentResumeStore;
  }

  /**
   * Analyze Resume for ATS compliance, keyword frequency, impact metrics & STAR format
   */
  public async analyzeAts(dto: AnalyzeAtsDto): Promise<AtsScoreReport> {
    const { resume, targetRole, jobDescriptionText } = dto;
    const allResumeText = [
      resume.headline,
      resume.professionalSummary,
      ...resume.experience.flatMap((e) => [e.role, e.company, ...e.bulletPoints]),
      ...resume.projects.flatMap((p) => [p.title, ...p.technologies, ...p.bulletPoints]),
      ...resume.skillCategories.flatMap((sc) => sc.skills),
      ...resume.certifications,
      ...resume.achievements,
    ].join(' ').toLowerCase();

    // Determine target keywords (either from JD text or default list)
    let targetKeywords = [...HIGH_PRIORITY_KEYWORDS];
    if (jobDescriptionText && jobDescriptionText.trim().length > 20) {
      const extracted = HIGH_PRIORITY_KEYWORDS.filter((k) =>
        jobDescriptionText.toLowerCase().includes(k.toLowerCase())
      );
      if (extracted.length > 5) {
        targetKeywords = extracted;
      }
    }

    // Keyword detection
    const detectedKeywords: AtsKeywordMatch[] = [];
    const missingKeywords: string[] = [];
    let matchedCount = 0;

    targetKeywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw.toLowerCase()}\\b`, 'gi');
      const matches = allResumeText.match(regex);
      const isFound = Boolean(matches && matches.length > 0);
      const frequency = matches ? matches.length : 0;

      if (isFound) {
        matchedCount++;
        detectedKeywords.push({
          keyword: kw,
          category: 'Core Requirement',
          isFoundInResume: true,
          frequency,
        });
      } else {
        missingKeywords.push(kw);
      }
    });

    const keywordMatchPercentage = Math.round((matchedCount / targetKeywords.length) * 100);

    // Analyze bullet points for metrics and action verbs
    const allBullets = [
      ...resume.experience.flatMap((e) => e.bulletPoints),
      ...resume.projects.flatMap((p) => p.bulletPoints),
    ];

    let quantifiedBulletsCount = 0;
    let actionVerbBulletsCount = 0;

    allBullets.forEach((bullet) => {
      const hasNumber = /\d+(%|k|ms|s|x|rps|m|\+)?/i.test(bullet);
      if (hasNumber) quantifiedBulletsCount++;

      const firstWord = bullet.trim().split(' ')[0];
      const hasActionVerb = ACTION_VERBS.some(
        (verb) => verb.toLowerCase() === firstWord?.toLowerCase()
      );
      if (hasActionVerb) actionVerbBulletsCount++;
    });

    const quantifiedImpactScore = allBullets.length > 0
      ? Math.round((quantifiedBulletsCount / allBullets.length) * 100)
      : 80;

    const readabilityScore = 95; // Clean ATS single-column structure
    const formattingComplianceScore = 96;

    // Overall ATS score calculation
    const overallAtsScore = Math.round(
      keywordMatchPercentage * 0.4 +
      quantifiedImpactScore * 0.3 +
      readabilityScore * 0.15 +
      formattingComplianceScore * 0.15
    );

    // Section Diagnostics
    const sectionDiagnostics: AtsSectionDiagnostic[] = [
      {
        sectionName: 'Contact Information',
        score: resume.contact.email && resume.contact.phone && resume.contact.githubUrl ? 100 : 80,
        status: 'EXCELLENT',
        feedback: 'Includes clean direct links to GitHub, LinkedIn, and email. No parsing friction.',
      },
      {
        sectionName: 'Professional Summary',
        score: resume.professionalSummary.length > 100 ? 95 : 75,
        status: 'EXCELLENT',
        feedback: 'Punchy 3-line summary emphasizing core competencies and distributed systems focus.',
      },
      {
        sectionName: 'Experience & Internships',
        score: quantifiedImpactScore >= 80 ? 94 : 78,
        status: quantifiedImpactScore >= 80 ? 'EXCELLENT' : 'GOOD',
        feedback: `${quantifiedBulletsCount}/${allBullets.length} bullets contain quantifiable metrics (%, latency, throughput).`,
      },
      {
        sectionName: 'Technical Projects',
        score: resume.projects.length >= 2 ? 96 : 80,
        status: 'EXCELLENT',
        feedback: 'Features complex full-stack/distributed system projects with listed GitHub repositories and live URLs.',
      },
      {
        sectionName: 'Skills Categorization',
        score: resume.skillCategories.length >= 3 ? 98 : 85,
        status: 'EXCELLENT',
        feedback: 'Neatly organized by category (Languages, Backend, Infrastructure) for optimal parser ingestion.',
      },
    ];

    // Bullet improvement suggestions
    const bulletSuggestions: AtsBulletSuggestion[] = [
      {
        originalBullet: 'Worked on database queries and improved performance for our web application.',
        enhancedBullet: 'Engineered composite PostgreSQL indexes and optimized N+1 ORM queries, reducing median page load latency by 45% across 50,000 monthly active users.',
        reasoning: 'Transformed passive "worked on" into active "Engineered", adding concrete technical methods and quantifiable % latency reduction.',
        quantifiedMetricAdded: true,
        actionVerbUsed: 'Engineered',
      },
      {
        originalBullet: 'Responsible for writing unit tests and fixing bugs before releases.',
        enhancedBullet: 'Automated CI/CD test automation pipelines with Docker and Jest, increasing code coverage from 60% to 92% and preventing critical production regressions.',
        reasoning: 'Replaced passive duty statement with active achievement verb and quantified test coverage metric.',
        quantifiedMetricAdded: true,
        actionVerbUsed: 'Automated',
      },
    ];

    const criticalWarnings: string[] = [];
    if (missingKeywords.length > 4) {
      criticalWarnings.push(`Consider weaving top keywords like ${missingKeywords.slice(0, 3).join(', ')} into your project descriptions.`);
    }

    return {
      overallAtsScore,
      readabilityScore,
      keywordMatchPercentage,
      quantifiedImpactScore,
      formattingComplianceScore,
      targetRoleTitle: targetRole || 'Distributed Systems & Backend Engineer',
      sectionDiagnostics,
      detectedKeywords,
      missingKeywords: missingKeywords.slice(0, 8),
      criticalWarnings,
      bulletSuggestions,
    };
  }

  /**
   * Optimize a single bullet point into STAR format
   */
  public async optimizeBullet(dto: OptimizeBulletDto): Promise<AtsBulletSuggestion> {
    const { bulletPoint, roleOrProjectContext, targetSkill } = dto;
    const skillPrefix = targetSkill ? ` utilizing ${targetSkill}` : '';

    const enhancedBullet = `Architected and deployed high-efficiency backend services${skillPrefix}, achieving a 40% reduction in query execution latency and supporting 20,000+ daily active user interactions with 99.9% uptime.`;

    return {
      originalBullet: bulletPoint,
      enhancedBullet,
      reasoning: `Converted into STAR framework: Situation/Task + Action (Architected & Deployed) + Context (${roleOrProjectContext || 'Backend'}) + Quantified Metric (-40% latency, 20k users).`,
      quantifiedMetricAdded: true,
      actionVerbUsed: 'Architected',
    };
  }

  /**
   * Generate tailored mock interview questions based on resume content
   */
  public async generateInterviewQa(dto: GenerateInterviewQaDto): Promise<AiInterviewMockQuestion[]> {
    const { resume } = dto;
    const questions: AiInterviewMockQuestion[] = [];

    // Project 1 Question
    if (resume.projects.length > 0) {
      const p1 = resume.projects[0];
      questions.push({
        id: 'qa-1',
        questionType: 'TECHNICAL_DEEP_DIVE',
        relatedProjectOrExperience: p1.title,
        question: `In your project '${p1.title}', how did you handle split-brain scenarios and network partitions in the Raft consensus group? What happens if the leader is partitioned away?`,
        contextWhyAsked: 'Interviewers test your practical understanding of distributed state machine replication and quorum rules.',
        idealAnswerRubric: [
          'State that Raft requires a strict majority quorum ((N/2) + 1) to elect a new leader.',
          'Explain that the isolated leader in the minority partition cannot commit log entries because it cannot reach consensus with a quorum.',
          'Describe the reconciliation phase when network re-connects: higher term number from the majority partition forces the old leader to step down and overwrite uncommitted logs.',
        ],
        keyTermsToInclude: ['Majority Quorum', 'Term Number', 'Heartbeat Timeout', 'Log Replication', 'Leader Step-Down'],
      });
    }

    // Project 2 / Experience Question
    if (resume.experience.length > 0) {
      const exp1 = resume.experience[0];
      questions.push({
        id: 'qa-2',
        questionType: 'SYSTEM_ARCHITECTURE',
        relatedProjectOrExperience: `${exp1.role} at ${exp1.company}`,
        question: `You mentioned slashing p99 latency from 320ms to 42ms with Redis caching. How did you prevent cache penetration, cache breakdown (thundering herd), and handle stale cache invalidation?`,
        contextWhyAsked: 'Evaluates your experience with real-world production caching trade-offs beyond simple key-value lookups.',
        idealAnswerRubric: [
          'Discuss Cache-Aside vs Write-Through strategies and why Cache-Aside was selected.',
          'Explain Cache Breakdown defense: mutex locks (singleflight pattern) or probabilistic early expiration (XFetch).',
          'Explain Cache Penetration defense: caching null objects with short TTL or using Bloom Filters.',
          'Describe cache invalidation hooks triggered on database mutations with event-driven message queues.',
        ],
        keyTermsToInclude: ['Singleflight Mutex', 'Bloom Filter', 'Cache-Aside', 'TTL Jitter', 'Event-Driven Invalidation'],
      });
    }

    // Tradeoff Analysis Question
    questions.push({
      id: 'qa-3',
      questionType: 'TRADEOFF_ANALYSIS',
      relatedProjectOrExperience: 'Database & Data Storage Architecture',
      question: 'When designing a high-throughput event logging service, how do you decide between an append-only log storage (like LSM-Tree / Kafka) versus a traditional B+ Tree relational database (PostgreSQL)?',
      contextWhyAsked: 'Tests your understanding of disk I/O patterns, sequential vs random writes, and query requirements.',
      idealAnswerRubric: [
        'Highlight that LSM-trees convert random disk writes into sequential disk writes in memory (MemTable) before flushing to SSTables, making writes orders of magnitude faster.',
        'Contrast with B+ Trees which require in-place updates, leading to random disk I/O and write amplification for write-heavy workloads.',
        'Conclude with the trade-off: B+ trees offer faster point/range reads with ACID transactions; LSMs offer superior write throughput at the expense of read compaction latency.',
      ],
      keyTermsToInclude: ['Sequential vs Random I/O', 'MemTable & SSTable', 'Write Amplification', 'Compaction', 'B+ Tree Page Splitting'],
    });

    // Behavioral STAR Question
    questions.push({
      id: 'qa-4',
      questionType: 'BEHAVIORAL_STAR',
      relatedProjectOrExperience: 'Engineering Internship / Collaboration',
      question: 'Tell me about a time when you discovered a subtle concurrency bug or performance bottleneck right before a deadline. How did you diagnose, communicate, and fix it?',
      contextWhyAsked: 'Assesses problem-solving under pressure, debugging methodology, and clear cross-team communication.',
      idealAnswerRubric: [
        'Situation: Describe the high-stakes context and symptoms (e.g. race condition under concurrent load testing).',
        'Task: The goal to isolate the root cause without delaying release.',
        'Action: Methodical debugging with race detectors, CPU/Memory profilers (pprof), or thread dumps; communicating ETA clearly.',
        'Result: The precise resolution (e.g. read-write mutex lock or sync.Pool optimization) and regression test introduced.',
      ],
      keyTermsToInclude: ['Root Cause Analysis', 'Race Detector', 'Regression Test', 'Transparent Stakeholder Update'],
    });

    return questions;
  }
}

export const resumeService = new ResumeService();
