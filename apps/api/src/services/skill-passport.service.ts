import {
  AcademicCredential,
  VerifiedPassportSummary,
  GenerateCredentialDto
} from '@studentlife/shared';

export class SkillPassportService {
  private static credentials: AcademicCredential[] = [
    {
      id: 'cred-01',
      studentName: 'Aman Chaurasiya',
      credentialTitle: 'Mastery in Data Structures, Algorithms & System Design',
      issuer: 'StudentLife OS Academic Cryptographic Authority',
      sha256VerificationHash: '8fa710e39c4a8b23f00192e10a8d7cbef90124ca8921be0932af84bc912301ef',
      issuedDate: '2026-09-07',
      level: 'LEVEL 50 GRANDMASTER',
      verifiedSkills: ['Dynamic Programming', 'Graph Algorithms', 'Microservices', 'Distributed Caching', 'Database Sharding'],
      xpMilestoneReached: 12500,
      publicVerificationUrl: 'https://studentlife-os.app/verify/cred-01-8fa710e',
      status: 'VERIFIED'
    },
    {
      id: 'cred-02',
      studentName: 'Aman Chaurasiya',
      credentialTitle: 'GATE 2027 CSE Computer Architecture & OS Specialist',
      issuer: 'National Competitive Exam Board (Simulated)',
      sha256VerificationHash: 'c4e92a8123bf90029bca01e74f1188dc224901ea7823f990bc1193ad0102e3b1',
      issuedDate: '2026-09-01',
      level: 'DIAMOND TIER',
      verifiedSkills: ['CPU Pipelining', 'Virtual Memory', 'Semaphore Concurrency', 'Cache Coherence'],
      xpMilestoneReached: 9800,
      publicVerificationUrl: 'https://studentlife-os.app/verify/cred-02-c4e92a8',
      status: 'VERIFIED'
    },
    {
      id: 'cred-03',
      studentName: 'Aman Chaurasiya',
      credentialTitle: 'Apex 50-Phase Full-Stack Super-App Architect',
      issuer: 'StudentLife Global Engineering Syndicate',
      sha256VerificationHash: '7a01bc93ef01824aa09bcae88120349281eafbc782910248bcde00912abced44',
      issuedDate: '2026-09-07',
      level: 'PINNACLE LAUREATE',
      verifiedSkills: ['TypeScript Monorepo', 'React 18', 'WebGL Simulators', 'Express REST', 'PWA & Offline Worker'],
      xpMilestoneReached: 15000,
      publicVerificationUrl: 'https://studentlife-os.app/verify/cred-03-7a01bc9',
      status: 'VERIFIED'
    }
  ];

  public static getPassportSummary(): VerifiedPassportSummary {
    return {
      totalCredentialsIssued: this.credentials.length,
      topRankPercentile: 99.8,
      totalVerifiedBadges: 18,
      grandmasterStatus: true,
      credentials: this.credentials
    };
  }

  public static generateCredential(dto: GenerateCredentialDto, studentName: string = 'Aman Chaurasiya'): AcademicCredential {
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newCred: AcademicCredential = {
      id: `cred-${Date.now()}`,
      studentName,
      credentialTitle: dto.credentialTitle,
      issuer: 'StudentLife OS Academic Cryptographic Authority',
      sha256VerificationHash: randomHex,
      issuedDate: new Date().toISOString().split('T')[0],
      level: 'DIAMOND VERIFIED',
      verifiedSkills: dto.skills && dto.skills.length > 0 ? dto.skills : ['Analytical Problem Solving', 'Advanced CS Theory'],
      xpMilestoneReached: 10000 + Math.floor(Math.random() * 5000),
      publicVerificationUrl: `https://studentlife-os.app/verify/cred-${Date.now()}-${randomHex.substring(0, 7)}`,
      status: 'VERIFIED'
    };

    this.credentials.unshift(newCred);
    return newCred;
  }
}
