import {
  PaperRefereeReport,
  ReviewPaperSubmissionDto
} from '@studentlife/shared';

export class PaperRefereeService {
  async reviewPaper(dto: ReviewPaperSubmissionDto): Promise<PaperRefereeReport> {
    const isStrong = dto.abstractText.length > 80;
    const overallScore = isStrong ? 8.2 : 5.8;

    return {
      id: `ref-report-${Date.now()}`,
      paperTitle: dto.paperTitle || 'Novel Deep Reinforcement Learning Architecture',
      overallScore,
      decisionRecommendation: overallScore >= 8.0 ? 'STRONG_ACCEPT' : overallScore >= 6.5 ? 'WEAK_ACCEPT' : 'MAJOR_REVISION',
      acceptanceProbabilityPercent: overallScore >= 8.0 ? 88.5 : 45.0,
      criteriaScores: [
        {
          criterion: 'TECHNICAL_NOVELTY',
          scoreOutOf10: isStrong ? 8.8 : 6.0,
          comments: 'The conceptual framework demonstrates a clean formulation over baseline transformer benchmarks.'
        },
        {
          criterion: 'METHODOLOGICAL_RIGOR',
          scoreOutOf10: isStrong ? 8.2 : 5.5,
          comments: 'Proofs and ablation metrics are mathematically coherent; consider testing against larger distributed datasets.'
        },
        {
          criterion: 'STATISTICAL_VALIDITY',
          scoreOutOf10: isStrong ? 7.9 : 6.2,
          comments: 'p-values < 0.01 with 5-seed confidence bounds reported clearly in Table 2.'
        },
        {
          criterion: 'CLARITY_STRUCTURE',
          scoreOutOf10: isStrong ? 9.0 : 7.0,
          comments: 'Well-structured narrative with crisp notation and publication-grade LaTeX typography.'
        },
        {
          criterion: 'REPRODUCIBILITY',
          scoreOutOf10: isStrong ? 8.5 : 6.0,
          comments: 'Open-source GitHub artifacts and seed configs provided for reproducible verification.'
        }
      ],
      reviewer2Critique: 'While the theoretical claims are ambitious, the authors should explicitly clarify memory consumption scaling on GPU clusters when context windows scale past 128k tokens. The comparison with baseline ResNet architectures in Section 4.2 requires expanded discussion.',
      suggestedRebuttalStrategy: [
        'Acknowledge Reviewer 2\'s insightful point regarding GPU cluster memory ceiling.',
        'Reference Appendix C Table 5 where KV-cache tensor compression benchmarks are documented.',
        'Commit to adding explicit asymptotic memory bound notations in the camera-ready version.'
      ],
      noveltyHighlights: [
        'Linear-time attention computational complexity bound O(N)',
        'Zero-shot generalization across 14 unseen academic benchmark tasks'
      ],
      methodologyGaps: [
        'Limited evaluation on low-power edge microcontrollers',
        'Sensitivity analysis under severe adversarial token perturbations'
      ]
    };
  }
}
