import {
  FellowshipProposal,
  DraftFellowshipDto,
  FellowshipType,
} from '@studentlife/shared';

export class FellowshipDrafterService {
  private proposals: FellowshipProposal[] = [];

  constructor() {
    this.seedDefaultProposal();
  }

  private seedDefaultProposal() {
    this.proposals.push({
      id: 'prop-default-01',
      fellowshipType: 'PMRF_INDIA',
      applicantField: 'Computer Science & AI Hardware Acceleration',
      statementOfPurpose: 'My research objective is to architect energy-efficient neuromorphic memory compute architectures that reduce large language model inference latency by 4x on edge robotics. Having led distributed systems projects at IIT, this fellowship provides the direct foundation to publish in top tier IEEE/ACM micro-architecture venues.',
      researchMethodology: '1. Mathematical formulation of Sparse Matrix Vector (SpMV) memory-bound bottlenecks.\n2. Cycle-accurate gem5 architectural simulation.\n3. Hardware FPGA prototyping with custom systolic tensor arrays.',
      broaderImpactStatements: [
        'Enables sub-10W localized AI inference for agricultural drone telemetry across rural India.',
        'Reduces reliance on proprietary foreign accelerator chipsets through open-source RISC-V extensions.',
      ],
      refereeBulletPoints: [
        'Highlight candidate ranking in top 2% of GATE/B.Tech cohort.',
        'Emphasize lead authorship in algorithmic optimizations and hardware co-design.',
        'Validate independent research drive and peer mentoring contributions.',
      ],
      competitiveIndexScore: 94,
      createdAt: new Date().toISOString(),
    });
  }

  async getProposals(): Promise<FellowshipProposal[]> {
    return this.proposals;
  }

  async draftProposal(dto: DraftFellowshipDto): Promise<FellowshipProposal> {
    const propId = `prop-${Date.now()}`;
    const fellowshipName = this.getFellowshipDisplayName(dto.fellowshipType);
    const field = dto.applicantField.trim();
    const topic = dto.primaryResearchTopic.trim();

    const sop = `As an aspiring researcher in ${field}, I propose to investigate "${topic}". Applying for the prestigious ${fellowshipName} represents a transformative milestone in my academic trajectory. Through structured doctoral inquiry and rigorous theoretical modeling, I aim to establish novel benchmarks that bridge foundational computer science with real-world deployment constraints.`;

    const methodology = `Phase I: Comprehensive Literature Gap Analysis & Mathematical Formalism.\nPhase II: Benchmark Dataset Synthesis & Controlled Baseline Experimentation.\nPhase III: Peer-Reviewed Publication at Premier ACM/IEEE/Springer Conferences & Open-Source Artifact Dissemination.`;

    const broaderImpact = [
      `Advances national and global computational sovereignty in ${field}.`,
      `Creates reproducible, peer-reviewed open benchmarks for subsequent academic cohorts.`,
      `Fosters cross-disciplinary innovation between academic research labs and industrial partners.`,
    ];

    const referees = [
      `Endorse the candidate's strong analytical foundation and problem formulation rigor in ${field}.`,
      `Highlight demonstrated publication track-record or high-impact capstone execution.`,
      `Affirm personal integrity, collaborative team ethos, and intellectual perseverance.`,
    ];

    const newProposal: FellowshipProposal = {
      id: propId,
      fellowshipType: dto.fellowshipType,
      applicantField: field,
      statementOfPurpose: sop,
      researchMethodology: methodology,
      broaderImpactStatements: broaderImpact,
      refereeBulletPoints: referees,
      competitiveIndexScore: 92,
      createdAt: new Date().toISOString(),
    };

    this.proposals.unshift(newProposal);
    return newProposal;
  }

  private getFellowshipDisplayName(type: FellowshipType): string {
    switch (type) {
      case 'PMRF_INDIA':
        return "Prime Minister's Research Fellowship (PMRF India)";
      case 'FULBRIGHT_NEHRU':
        return 'Fulbright-Nehru Doctoral Fellowship (USIEF)';
      case 'DAAD_GERMANY':
        return 'DAAD Graduate Research Fellowship (Germany)';
      case 'RHODES_OXFORD':
        return 'Rhodes Scholarship (University of Oxford)';
      case 'ERASMUS_MUNDUS':
        return 'Erasmus Mundus Joint Master/Doctoral Grant';
    }
  }
}

export const fellowshipDrafterService = new FellowshipDrafterService();
