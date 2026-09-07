import { HackathonEvent, HackathonTeamMatchResult, FindTeammatesDto } from '@studentlife/shared';

export class HackathonRadarService {
  private static events: HackathonEvent[] = [
    {
      id: 'hack-01',
      title: 'Smart India Hackathon (SIH) 2026',
      organizer: 'Ministry of Education & AICTE',
      format: 'HYBRID',
      prizePool: '₹1,00,00,000 INR',
      daysRemaining: 18,
      registrationDeadline: '2026-09-25',
      bannerGradient: 'from-amber-600 to-rose-600',
      themes: ['Smart Education', 'Clean Energy', 'Healthcare AI', 'Disaster Robotics'],
      portalUrl: 'https://sih.gov.in',
      openTeamSpotsCount: 320,
      featuredChallenge: 'Autonomous AI assistant for multi-lingual Indian classroom real-time summarization.'
    },
    {
      id: 'hack-02',
      title: 'ETHGlobal Singapore 2026',
      organizer: 'ETHGlobal Foundation',
      format: 'HYBRID',
      prizePool: '$150,000 USD',
      daysRemaining: 28,
      registrationDeadline: '2026-10-05',
      bannerGradient: 'from-indigo-600 to-purple-600',
      themes: ['Zero-Knowledge Proofs', 'DeFi Protocols', 'Account Abstraction', 'Decentralized Identity'],
      portalUrl: 'https://ethglobal.com',
      openTeamSpotsCount: 145,
      featuredChallenge: 'Verifiable zkSNARK academic credentials with instant recruiter verification.'
    },
    {
      id: 'hack-03',
      title: 'Kaggle Grandmaster AI Challenge',
      organizer: 'Kaggle & Google DeepMind',
      format: 'ONLINE_GLOBAL',
      prizePool: '$75,000 USD',
      daysRemaining: 42,
      registrationDeadline: '2026-10-19',
      bannerGradient: 'from-cyan-600 to-blue-600',
      themes: ['Multimodal Reasoning', 'LLM Mathematical Proofs', 'Sparse Transformer Kernels'],
      portalUrl: 'https://kaggle.com/competitions',
      openTeamSpotsCount: 88,
      featuredChallenge: 'Achieve >92% accuracy on complex Olympiad geometry formal theorem proving.'
    }
  ];

  public static getEvents(): HackathonEvent[] {
    return this.events;
  }

  public static findTeammates(dto: FindTeammatesDto): HackathonTeamMatchResult[] {
    const skills = dto.mySkills && dto.mySkills.length > 0 ? dto.mySkills : ['React', 'TypeScript', 'Node.js'];
    
    return [
      {
        matchScorePercent: 94,
        teamName: 'NeuralByte Innovators',
        hackathonId: 'hack-01',
        hackathonTitle: 'Smart India Hackathon (SIH) 2026',
        members: [
          { name: 'Priya Sharma (IIT Delhi)', role: 'ML / PyTorch Engineer', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
          { name: 'Aman Verma (BITS Pilani)', role: 'UI/UX & Product Design', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }
        ],
        openRolesNeeded: ['Full-Stack Cloud Architect (React/Node.js)', 'FastAPI Backend Dev'],
        contactHandle: '@priya_ml_sih (Telegram / Campus Connect)'
      },
      {
        matchScorePercent: 88,
        teamName: 'ZeroKnowledge Vanguard',
        hackathonId: 'hack-02',
        hackathonTitle: 'ETHGlobal Singapore 2026',
        members: [
          { name: 'David Chen (NUS Singapore)', role: 'Circom / ZK Circuit Dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }
        ],
        openRolesNeeded: ['Frontend DApp Engineer (TypeScript/Vite)', 'Solidity Smart Contract Auditor'],
        contactHandle: '@david_zk_eth (Discord: david#8821)'
      }
    ];
  }
}
