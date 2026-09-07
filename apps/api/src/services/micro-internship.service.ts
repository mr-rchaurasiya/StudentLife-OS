import {
  MicroInternshipGig,
  SubmitProofOfWorkDto
} from '@studentlife/shared';

export class MicroInternshipService {
  private gigs: Map<string, MicroInternshipGig> = new Map();

  constructor() {
    this.seedDefault();
  }

  private seedDefault() {
    const defaultGigs: MicroInternshipGig[] = [
      {
        id: 'gig-01',
        title: 'Benchmark ONNX Runtime vs PyTorch on Raspberry Pi 5',
        sponsorOrganization: 'EdgeAI Robotics Lab',
        category: 'AI_BENCHMARK',
        bountyStudyCoins: 250,
        deadlineHours: 48,
        requirements: [
          'Compile ONNX quantized int8 MobileNetV3 model',
          'Measure latency distribution across 1000 inferences',
          'Submit reproducible Jupyter Notebook & latency CSV in PR'
        ],
        status: 'OPEN',
        escrowStatus: 'FUNDED_IN_ESCROW'
      },
      {
        id: 'gig-02',
        title: 'Implement WebRTC Screen-Share & Canvas Pointer Bridge',
        sponsorOrganization: 'OpenCollab EdTech',
        category: 'FULLSTACK_FEATURE',
        bountyStudyCoins: 400,
        deadlineHours: 36,
        requirements: [
          'MediaStream getDisplayMedia capture handler in React',
          'Binary WebSocket cursor coordinates broadcast at 60 FPS',
          'Pass end-to-end Cypress integration tests'
        ],
        status: 'OPEN',
        escrowStatus: 'FUNDED_IN_ESCROW'
      },
      {
        id: 'gig-03',
        title: 'Indian Judicial Judgment NER Dataset Annotation (100 Docs)',
        sponsorOrganization: 'LegalTech AI Foundation',
        category: 'DATASET_CURATION',
        bountyStudyCoins: 180,
        deadlineHours: 24,
        requirements: [
          'Tag Statutes, Petitioner, Respondent, Judge, and IPC Section entities',
          'Ensure CoNLL-2003 format compatibility and zero tag overlaps'
        ],
        status: 'IN_SPRINT',
        pullRequestUrl: 'https://github.com/LegalTechAI/corpus-in/pull/142',
        escrowStatus: 'FUNDED_IN_ESCROW'
      },
      {
        id: 'gig-04',
        title: 'Smart Contract Slither & Mythril Static Security Scan',
        sponsorOrganization: 'Polygon Student Guild',
        category: 'SECURITY_AUDIT',
        bountyStudyCoins: 500,
        deadlineHours: 48,
        requirements: [
          'Run Slither vulnerability detectors on ERC-4626 Vault contract',
          'Provide remediation patches for reentrancy and integer underflow risks'
        ],
        status: 'APPROVED',
        pullRequestUrl: 'https://github.com/PolygonGuild/vault-contracts/pull/88',
        escrowStatus: 'RELEASED_TO_STUDENT'
      }
    ];

    defaultGigs.forEach(g => this.gigs.set(g.id, g));
  }

  public getAllGigs(): MicroInternshipGig[] {
    return Array.from(this.gigs.values());
  }

  public submitProofOfWork(dto: SubmitProofOfWorkDto): MicroInternshipGig | null {
    const gig = this.gigs.get(dto.gigId);
    if (!gig) return null;

    gig.pullRequestUrl = dto.pullRequestUrl;
    gig.status = 'SUBMITTED';
    return gig;
  }

  public releaseEscrow(gigId: string): MicroInternshipGig | null {
    const gig = this.gigs.get(gigId);
    if (!gig) return null;

    gig.status = 'APPROVED';
    gig.escrowStatus = 'RELEASED_TO_STUDENT';
    return gig;
  }
}

export const microInternshipService = new MicroInternshipService();
