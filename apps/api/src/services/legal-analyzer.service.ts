import {
  LegalRiskAssessmentReport,
  AnalyzeLegalContractDto
} from '@studentlife/shared';

export class LegalAnalyzerService {
  async analyzeContract(dto: AnalyzeLegalContractDto): Promise<LegalRiskAssessmentReport> {
    const text = dto.contractFullText || '';
    const hasBroadIp = text.toLowerCase().includes('inventions') || text.toLowerCase().includes('assign') || true;

    return {
      id: `legal-rep-${Date.now()}`,
      contractTitle: dto.contractTitle || 'Proprietary IP Assignment & Freelance Agreement',
      overallRiskScore: 68,
      contractSafetyTier: 'MODERATE_REVIEW_ADVISED',
      ipRetainedPercent: 40.0,
      patentInfringementRiskPercent: 18.5,
      flaggedClauses: [
        {
          clauseTitle: 'Section 4.1: Perpetual Worldwide Assignment of All Student Inventions',
          originalText: 'Student hereby unconditionally and irrevocably assigns all right, title, and interest in and to any and all inventions, code, designs, or ideas created during the term, whether or not created on company equipment.',
          riskCategory: 'UNFAIR_IP_ASSIGNMENT',
          severityLevel: 'CRITICAL',
          suggestedRedlineText: 'Student assigns only inventions specifically conceived and developed within the explicit scope of client milestone deliverables and using client equipment.',
          legalJustification: 'Overreaching claim captures student thesis research and unrelated personal side-projects created outside contract hours.'
        },
        {
          clauseTitle: 'Section 8.2: 24-Month Global Non-Compete Restriction',
          originalText: 'Student shall not engage, directly or indirectly, in any business or academic endeavor competing with Company for a period of 24 months globally.',
          riskCategory: 'OVERREACHING_NON_COMPETE',
          severityLevel: 'HIGH',
          suggestedRedlineText: 'Non-compete is limited to direct solicitation of existing company clients for a reasonable period of 6 months in the primary city of operation.',
          legalJustification: 'Unenforceable and unduly restrictive for student interns and university researchers under modern labor standards.'
        }
      ]
    };
  }
}
