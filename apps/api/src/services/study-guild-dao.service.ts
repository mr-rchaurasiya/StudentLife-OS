import {
  GuildProposal,
  CastGuildVoteDto,
  CreateGuildProposalDto
} from '@studentlife/shared';
import * as crypto from 'crypto';

export class StudyGuildDaoService {
  private proposals: Map<string, GuildProposal> = new Map();

  constructor() {
    this.seedDefault();
  }

  private seedDefault() {
    const defaultProposals: GuildProposal[] = [
      {
        id: 'prop-01',
        title: 'Acquire 4x NVIDIA RTX 4090 Dedicated GPU Cluster for Student Open-Source LLM Fine-Tuning',
        proposerName: 'Ananya Iyer (AI Chapter Lead)',
        category: 'HARDWARE_ACQUISITION',
        requestedTreasuryCoins: 2400,
        quadraticVotesAccumulated: 384,
        totalVotersCount: 42,
        quorumReached: true,
        status: 'VOTING_ACTIVE',
        onChainProposalHash: '0x8f3b2c149a4f6d8923bc7810e4a78912cd34567890abcdef1234567890abcdef'
      },
      {
        id: 'prop-02',
        title: 'Sponsor Campus Hackathon Travel & Registration Stipends for Smart India Hackathon (SIH 2026)',
        proposerName: 'Aman C. (Hackathon Guild)',
        category: 'HACKATHON_SPONSORSHIP',
        requestedTreasuryCoins: 1200,
        quadraticVotesAccumulated: 290,
        totalVotersCount: 35,
        quorumReached: true,
        status: 'PASSED_FUNDED',
        onChainProposalHash: '0x4d2a1b9876543210fedcba0987654321abcdef0123456789abcdef0123456789'
      },
      {
        id: 'prop-03',
        title: 'IEEE Xplore & ACM Digital Library Student Enterprise Group License Renewal',
        proposerName: 'Library Committee',
        category: 'COURSE_LICENSE',
        requestedTreasuryCoins: 800,
        quadraticVotesAccumulated: 180,
        totalVotersCount: 22,
        quorumReached: false,
        status: 'VOTING_ACTIVE',
        onChainProposalHash: '0x7e8f9a0123456789abcdef0123456789abcdef0123456789abcdef0123456789'
      }
    ];

    defaultProposals.forEach(p => this.proposals.set(p.id, p));
  }

  public getProposals(): GuildProposal[] {
    return Array.from(this.proposals.values());
  }

  public castVote(dto: CastGuildVoteDto): GuildProposal | null {
    const proposal = this.proposals.get(dto.proposalId);
    if (!proposal) return null;

    // Quadratic voting: votes = sqrt(credits)
    const effectiveVotes = Math.round(Math.sqrt(Math.max(1, dto.creditsToSpend)) * 10) / 10;
    proposal.quadraticVotesAccumulated += effectiveVotes;
    proposal.totalVotersCount += 1;

    if (proposal.totalVotersCount >= 30 && proposal.quadraticVotesAccumulated >= 250) {
      proposal.quorumReached = true;
    }
    return proposal;
  }

  public createProposal(dto: CreateGuildProposalDto): GuildProposal {
    const hash = '0x' + crypto.createHash('sha256').update(JSON.stringify(dto) + Date.now()).digest('hex');
    const newProp: GuildProposal = {
      id: `prop-${Date.now()}`,
      title: dto.title,
      proposerName: 'You (Guild Member)',
      category: dto.category,
      requestedTreasuryCoins: dto.requestedTreasuryCoins,
      quadraticVotesAccumulated: 1,
      totalVotersCount: 1,
      quorumReached: false,
      status: 'VOTING_ACTIVE',
      onChainProposalHash: hash
    };

    this.proposals.set(newProp.id, newProp);
    return newProp;
  }
}

export const studyGuildDaoService = new StudyGuildDaoService();
