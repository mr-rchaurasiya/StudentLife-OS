import {
  StudentPublicPortfolio,
  ColdOutreachRequestDto,
  ColdOutreachResult
} from '@studentlife/shared';

class LivePortfolioService {
  private portfolios: Map<string, StudentPublicPortfolio> = new Map();

  constructor() {
    this.seedDefaultProfile();
  }

  private seedDefaultProfile() {
    const defaultPortfolio: StudentPublicPortfolio = {
      username: 'rohan-verma',
      fullName: 'Rohan Verma',
      headline: 'Computer Science Scholar @ IIT Bombay | Distributed Systems & Quantum ML',
      college: 'Indian Institute of Technology Bombay',
      bio: 'Building low-latency high-frequency computing engines and decentralized AI swarms. Top 0.1% percentile in JEE Advanced 2024. Active open-source contributor.',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      githubUsername: 'rohan-verma-iitb',
      linkedinUrl: 'https://linkedin.com/in/rohanverma-dev',
      portfolioTheme: 'CYBER_DARK',
      totalStudentLifeXp: 18450,
      topSkills: ['Distributed Systems', 'Rust / C++', 'TypeScript', 'PyTorch / CUDA', 'PostgreSQL', 'Quantum Qiskit'],
      projects: [
        {
          title: 'HyperOrder L2 HFT Matching Engine',
          techStack: ['C++20', 'SIMD AVX-512', 'Lock-Free Ring Buffers'],
          githubUrl: 'https://github.com/rohan-verma-iitb/hyperorder-engine',
          starsCount: 342,
          impactMetrics: 'Processes 4.2M order events/sec with sub-400ns p99 tail latency.'
        },
        {
          title: 'NeuroSpike SNN Neuromorphic Simulator',
          techStack: ['Python', 'Rust', 'WebAssembly', 'Loihi SDK'],
          githubUrl: 'https://github.com/rohan-verma-iitb/neurospike',
          starsCount: 189,
          impactMetrics: '96.4% energy efficiency reduction compared to conventional backprop DNNs.'
        }
      ],
      verifiedBadges: [
        '🏆 Century Grandmaster Mythic Singularity (Phase 100)',
        '⚡ Inter-Collegiate Knowledge Olympiad Top 10 (AIR #3)',
        '🔬 PMRF Research Fellowship Sovereign Verified',
        '⭐ Smart India Hackathon Grand Finalist'
      ],
      viewCount: 1420
    };

    this.portfolios.set(defaultPortfolio.username, defaultPortfolio);
  }

  public getPortfolio(username: string): StudentPublicPortfolio {
    return this.portfolios.get(username) || this.portfolios.get('rohan-verma')!;
  }

  public draftColdOutreach(dto: ColdOutreachRequestDto): ColdOutreachResult {
    const student = this.getPortfolio('rohan-verma');

    let subject = '';
    let emailBody = '';
    let connectionNote = '';
    let followUp = '';

    if (dto.recipientType === 'RECRUITER') {
      subject = `Application for ${dto.targetRoleOrLab} – ${student.fullName} (${student.college})`;
      emailBody = `Dear ${dto.recipientName},\n\nI hope this email finds you well. I have been closely tracking ${dto.companyOrUniversity}'s engineering breakthroughs and was deeply impressed by your team's work.\n\nI am currently a senior student at ${student.college}, specializing in ${student.topSkills.slice(0, 3).join(', ')}. My key project, ${student.projects[0]?.title || 'Distributed Engine'}, ${student.projects[0]?.impactMetrics || 'delivers massive performance gains'}.\n\nGiven my background in ${dto.studentKeyAchievement || 'high-performance systems'}, I would love to contribute as a ${dto.targetRoleOrLab}. You can review my live verified portfolio at https://studentlife.app/p/${student.username}.\n\nWould you have 10 minutes next Tuesday for a quick introductory chat?\n\nWarm regards,\n${student.fullName}\n${student.college}`;
      connectionNote = `Hi ${dto.recipientName}, admired your work at ${dto.companyOrUniversity}! I'm a CS student at ${student.college} building ${dto.studentKeyAchievement}. Would love to connect and follow your team's updates!`;
      followUp = `Hi ${dto.recipientName}, bumping this in case it got buried! Still very excited about the ${dto.targetRoleOrLab} position at ${dto.companyOrUniversity}. Let me know if you need any additional code samples.`;
    } else if (dto.recipientType === 'PROFESSOR_PI') {
      subject = `Prospective Research Student – Inquiry for ${dto.targetRoleOrLab} (${student.fullName})`;
      emailBody = `Dear Professor ${dto.recipientName},\n\nI read your recent publication on ${dto.targetRoleOrLab} with great enthusiasm, particularly your methodology on computational modeling.\n\nI am an undergraduate researcher at ${student.college}. Over the past year, I have built ${student.projects[0]?.title || 'scientific simulators'} and achieved ${student.verifiedBadges[0] || 'top honors'}. I am eager to apply this expertise to your laboratory's ongoing projects.\n\nMy complete research and code portfolio is available at https://studentlife.app/p/${student.username}.\n\nI would be grateful for the opportunity to discuss prospective research or fellowship opportunities under your guidance.\n\nSincerely,\n${student.fullName}\n${student.college}`;
      connectionNote = `Dear Prof. ${dto.recipientName}, loved your paper on ${dto.targetRoleOrLab}. As a researcher at ${student.college}, I would be honored to connect with you.`;
      followUp = `Dear Prof. ${dto.recipientName}, following up on my previous email regarding research positions in your lab. Looking forward to your thoughts when convenient.`;
    } else {
      subject = `${student.fullName} <> ${dto.companyOrUniversity} – Engineering & Startup Collaboration`;
      emailBody = `Hey ${dto.recipientName},\n\nLoved what you are building at ${dto.companyOrUniversity}! Your trajectory in the ecosystem has been incredible to witness.\n\nI'm a builder from ${student.college} with experience in ${student.topSkills.slice(0, 3).join(', ')}. Recently built ${student.projects[0]?.title || 'high-impact tools'}, achieving ${dto.studentKeyAchievement || 'industry-standard benchmarks'}.\n\nI'd love to help your team ship faster in ${dto.targetRoleOrLab}. Live portfolio: https://studentlife.app/p/${student.username}.\n\nOpen to a brief 5-min sync this week?\n\nBest,\n${student.fullName}`;
      connectionNote = `Hey ${dto.recipientName}, huge fan of ${dto.companyOrUniversity}! I build ${dto.studentKeyAchievement}. Would love to connect!`;
      followUp = `Hey ${dto.recipientName}, quick follow-up! Happy to build a mini-prototype or POC for ${dto.companyOrUniversity} to demonstrate value.`;
    }

    return {
      emailSubject: subject,
      emailBodyMarkdown: emailBody,
      linkedinConnectionNote: connectionNote,
      followUpTemplate: followUp
    };
  }
}

export const livePortfolioService = new LivePortfolioService();
