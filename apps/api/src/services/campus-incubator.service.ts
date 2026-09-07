import {
  CampusStartupProject,
  GeneratePitchDeckDto,
  GrantOpportunity,
  PitchDeckSlide,
} from '@studentlife/shared';

export class CampusIncubatorService {
  private projects: CampusStartupProject[] = [];
  private sampleGrants: GrantOpportunity[] = [
    {
      id: 'grant-1',
      grantName: 'NIDHI-EIR (Entrepreneur-in-Residence)',
      agency: 'Department of Science and Technology (DST, Govt of India)',
      maxFundingINR: 360000,
      applicationDeadline: '2026-10-30',
      eligibilityScore: 95,
      applicationUrl: 'https://nidhi-eir.in',
    },
    {
      id: 'grant-2',
      grantName: 'AICTE Student Idea2PoC Catalyst Grant',
      agency: 'AICTE / MoE Innovation Cell',
      maxFundingINR: 500000,
      applicationDeadline: '2026-11-15',
      eligibilityScore: 92,
      applicationUrl: 'https://mic.gov.in',
    },
    {
      id: 'grant-3',
      grantName: 'Y Combinator Collegiate Founder Fellowship',
      agency: 'Y Combinator Labs',
      maxFundingINR: 41500000, // $500k standard
      applicationDeadline: '2026-10-10',
      eligibilityScore: 88,
      applicationUrl: 'https://www.ycombinator.com/apply',
    },
  ];

  constructor() {
    this.seedDefaultProject();
  }

  private seedDefaultProject() {
    const defaultSlides: PitchDeckSlide[] = [
      {
        slideNumber: 1,
        title: 'Title & Vision',
        headline: 'AuraGrid: Decentralized Campus Compute Mesh',
        bulletPoints: [
          'Harnessing idle campus GPU/NPU power across 50,000 university dorms',
          'Fractionalized micro-rentals for academic AI training at 1/10th AWS pricing',
        ],
        visualCallout: 'Decentralized Peer-to-Peer AI Compute for Academia',
        metricHighlight: '$1.4B University AI Compute Market',
      },
      {
        slideNumber: 2,
        title: 'The Problem',
        headline: 'GPU Shortages & Prohibitive Cloud Costs Block Student Research',
        bulletPoints: [
          '83% of graduate students face multi-week HPC queue wait times',
          'Commercial cloud bills exceed average university department grants',
          'Dorm PCs and gaming rigs remain 91% idle throughout the night',
        ],
        visualCallout: 'Compute Bottleneck in Global Higher Ed',
      },
      {
        slideNumber: 3,
        title: 'The Solution',
        headline: 'Automated Zero-Knowledge P2P Compute Cluster',
        bulletPoints: [
          '1-Click lightweight background daemon on Mac/Linux/Windows',
          'Cryptographically isolated container execution with proof-of-compute',
          'Direct payout in Study Coins or INR bank transfer to student node runners',
        ],
        visualCallout: 'Secure Zero-Trust Distributed Execution',
      },
      {
        slideNumber: 4,
        title: 'Market Opportunity (TAM/SAM/SOM)',
        headline: 'Rapidly Expanding Academic Machine Learning Infrastructure',
        bulletPoints: [
          'TAM: $18.4 Billion Global Academic High-Performance Computing',
          'SAM: $4.2 Billion Collegiate & Engineering Campus Labs',
          'SOM: $120 Million Tier-1 IIT/NIT/Ivy League Student Research Hubs',
        ],
        visualCallout: 'Targeting 250+ Premier Technical Campuses in Year 1',
        metricHighlight: 'TAM: $18.4B | SOM: $120M',
      },
      {
        slideNumber: 5,
        title: 'Business Model & Unit Economics',
        headline: '15% Compute Take Rate & Campus Enterprise SaaS Licenses',
        bulletPoints: [
          'Blended Customer Acquisition Cost (CAC): ₹850 via campus ambassador clubs',
          'Estimated Lifetime Value (LTV): ₹14,200 / student lab per year',
          'LTV / CAC Ratio: 16.7x with 3-month payback cycle',
        ],
        visualCallout: 'High Gross Margin Distributed Network Effect',
        metricHighlight: '16.7x LTV / CAC',
      },
    ];

    this.projects.push({
      id: 'proj-default-01',
      startupName: 'AuraGrid Labs',
      tagLine: 'Decentralized P2P Campus Compute Grid for Machine Learning Researchers',
      industryVertical: 'DeepTech / Distributed Cloud',
      stage: 'PROTOTYPE_MVP',
      problemStatement: 'Student AI researchers are locked out of high-end compute due to cloud billing costs and shared lab queues.',
      solutionStatement: 'A decentralized desktop compute cluster allowing students to pool idle GPU clusters with zero-trust encryption.',
      tamSamSom: {
        tam: '$18.4 Billion',
        sam: '$4.2 Billion',
        som: '$120 Million',
      },
      unitEconomics: {
        cac: '₹850',
        ltv: '₹14,200',
        paybackMonths: 3,
      },
      slides: defaultSlides,
      matchedGrants: this.sampleGrants,
      createdAt: new Date().toISOString(),
    });
  }

  async getProjects(): Promise<CampusStartupProject[]> {
    return this.projects;
  }

  async generatePitchDeck(dto: GeneratePitchDeckDto): Promise<CampusStartupProject> {
    const projId = `proj-${Date.now()}`;
    const name = dto.startupName.trim();
    const domain = dto.industryVertical.trim();
    const idea = dto.rawProjectIdea.trim();

    const slides: PitchDeckSlide[] = [
      {
        slideNumber: 1,
        title: 'Title & Core Vision',
        headline: `${name}: Revolutionizing ${domain}`,
        bulletPoints: [
          `Mission: ${idea.slice(0, 100)}...`,
          'Built by student engineers with unfair distribution advantages across academic networks',
        ],
        visualCallout: `Next-Gen ${domain} Ecosystem`,
        metricHighlight: 'Fast-Moving Collegiate Frontier',
      },
      {
        slideNumber: 2,
        title: 'Problem & Market Pain',
        headline: `Critical Inefficiencies Identified in Current ${domain} Workflows`,
        bulletPoints: [
          'High manual overhead and excessive friction for end-users',
          'Lack of modern, affordable, integrated alternatives for student and enterprise demographics',
          'Fragmented legacy tools that fail to leverage real-time AI automation',
        ],
        visualCallout: 'Severe Market Friction & High Willingness to Pay',
      },
      {
        slideNumber: 3,
        title: 'Proprietary Solution',
        headline: `${name} Modular Architecture`,
        bulletPoints: [
          'Automated, AI-first intelligent pipeline with immediate workflow value',
          'Low infrastructure footprint enabling sub-second response times',
          'Zero barrier-to-entry for frictionless collegiate on-boarding',
        ],
        visualCallout: '10x Faster & 80% Lower Cost',
      },
      {
        slideNumber: 4,
        title: 'Target Market Opportunity',
        headline: `Sizable Multi-Billion Total Addressable Market in ${domain}`,
        bulletPoints: [
          `TAM: $8.5 Billion Global ${domain} Sector`,
          'SAM: $2.1 Billion Collegiate & Young Professional Segment',
          'SOM: $75 Million Initial 100 Campus Launch Strategy',
        ],
        visualCallout: 'Strong B2B2C Viral Growth Vector',
        metricHighlight: 'TAM: $8.5B | SOM: $75M',
      },
      {
        slideNumber: 5,
        title: 'Unit Economics & Go-to-Market',
        headline: 'Capital-Efficient Growth with High Retention',
        bulletPoints: [
          'Target CAC: ₹1,200 via campus hackathons & organic referrals',
          'Target LTV: ₹18,000 via tiered student / department subscriptions',
          'Target Payback: 4 Months with 88% Net Revenue Retention',
        ],
        visualCallout: 'Scalable Viral Referral Flywheel',
        metricHighlight: '15x LTV/CAC',
      },
    ];

    const newProj: CampusStartupProject = {
      id: projId,
      startupName: name,
      tagLine: `${domain} innovation platform built by students.`,
      industryVertical: domain,
      stage: 'IDEA_VALIDATION',
      problemStatement: `Users struggle with outdated solutions in ${domain}.`,
      solutionStatement: idea,
      tamSamSom: {
        tam: '$8.5 Billion',
        sam: '$2.1 Billion',
        som: '$75 Million',
      },
      unitEconomics: {
        cac: '₹1,200',
        ltv: '₹18,000',
        paybackMonths: 4,
      },
      slides,
      matchedGrants: this.sampleGrants,
      createdAt: new Date().toISOString(),
    };

    this.projects.unshift(newProj);
    return newProj;
  }
}

export const campusIncubatorService = new CampusIncubatorService();
