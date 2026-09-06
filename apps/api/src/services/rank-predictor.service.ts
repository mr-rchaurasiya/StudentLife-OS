import {
  RankPredictionResult,
  PredictRankDto,
  MistakeEntry,
  RetestMistakeDto
} from '@studentlife/shared';

export class RankPredictorService {
  private mistakeVault: Map<string, MistakeEntry> = new Map();

  constructor() {
    this.seedDefaultMistakes();
  }

  private seedDefaultMistakes(): void {
    const defaultMistakes: MistakeEntry[] = [
      {
        id: 'mistake-1',
        questionId: 'q-jee-1',
        examOrSubject: 'JEE Advanced',
        topic: 'Rotational Dynamics',
        questionText: 'A uniform solid cylinder of mass M and radius R is given initial angular velocity ω₀ on rough floor (friction μ). Time t for pure rolling without slipping?',
        options: [
          't = (R · ω₀) / (3 · μ · g)',
          't = (2 · R · ω₀) / (3 · μ · g)',
          't = (R · ω₀) / (2 · μ · g)'
        ],
        userWrongAnswer: 't = (2 · R · ω₀) / (3 · μ · g)',
        correctAnswer: 't = (R · ω₀) / (3 · μ · g)',
        explanation: 'Angular deceleration α = 2μg/R, linear acc a = μg. Equating v = ωR gives μgt = (ω₀ - 2μgt/R)R => 3μgt = Rω₀ => t = Rω₀ / (3μg).',
        mistakeReason: 'CALCULATION_ERROR',
        failedCount: 2,
        nextReviewDate: new Date().toISOString(),
        isResolved: false,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'mistake-2',
        questionId: 'q-upsc-1',
        examOrSubject: 'UPSC Civil Services',
        topic: 'Election Commission',
        questionText: 'Which statement is correct regarding qualifications prescribed by the Constitution for Election Commissioners?',
        options: [
          'Prescribed 10 years judicial experience',
          'No qualifications prescribed in Constitution',
          'Must be retired High Court Judge'
        ],
        userWrongAnswer: 'Prescribed 10 years judicial experience',
        correctAnswer: 'No qualifications prescribed in Constitution',
        explanation: 'Article 324 does NOT prescribe legal, educational, or administrative qualifications for Election Commissioners.',
        mistakeReason: 'CONCEPTUAL_GAP',
        failedCount: 1,
        nextReviewDate: new Date().toISOString(),
        isResolved: false,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    for (const m of defaultMistakes) {
      this.mistakeVault.set(m.id, m);
    }
  }

  public predictRank(dto: PredictRankDto): RankPredictionResult {
    const exam = dto.examType || 'JEE Advanced';
    let totalAccuracy = 0;
    let totalSpeed = 0;
    const scores = dto.subjectScores || [];

    if (scores.length > 0) {
      scores.forEach(s => {
        totalAccuracy += s.accuracyPercent;
        totalSpeed += s.avgSpeedSecondsPerQuestion;
      });
      totalAccuracy = totalAccuracy / scores.length;
      totalSpeed = totalSpeed / scores.length;
    } else {
      totalAccuracy = 78;
      totalSpeed = 85;
    }

    // Algorithmic Percentile Estimation
    const speedBonus = Math.max(0, (120 - totalSpeed) / 10);
    const predictedPercentile = Math.min(99.98, Math.max(50.0, Number((totalAccuracy * 0.95 + speedBonus * 0.5).toFixed(2))));

    // Rank Range calculation
    const totalApplicants = exam.includes('JEE') ? 1400000 : exam.includes('NEET') ? 2200000 : exam.includes('UPSC') ? 1000000 : 180000;
    const approxRank = Math.max(1, Math.round((1 - predictedPercentile / 100) * totalApplicants));
    const minRank = Math.max(1, Math.round(approxRank * 0.85));
    const maxRank = Math.round(approxRank * 1.15);

    const isCompetitive = predictedPercentile >= 98.5;

    return {
      examType: exam,
      predictedPercentile,
      predictedAIRRange: { minRank, maxRank },
      estimatedScore: Math.round((predictedPercentile / 100) * 360),
      totalMarks: 360,
      strongAreas: ['Data Structures & Mechanics', 'Calculus Kings Property', 'Fundamental Rights Articles'],
      criticalWeaknesses: ['Negative Weight Graph Algorithms', 'Thermodynamic Entropy Bounds', 'Writs Jurisdiction Details'],
      eligibleInstitutions: [
        {
          college: 'IIT Bombay / AIIMS Delhi',
          branch: 'Computer Science / MBBS Core',
          cutoffPercentile: 99.8,
          admissionProbability: isCompetitive ? 'HIGH' : 'AMBITIOUS'
        },
        {
          college: 'IIT Delhi / BITS Pilani',
          branch: 'Electrical / Electronics & CS',
          cutoffPercentile: 98.9,
          admissionProbability: predictedPercentile >= 98.0 ? 'HIGH' : 'MODERATE'
        },
        {
          college: 'NIT Trichy / Top Govt Medical College',
          branch: 'Information Technology / General Surgery',
          cutoffPercentile: 96.5,
          admissionProbability: predictedPercentile >= 95.0 ? 'HIGH' : 'MODERATE'
        },
        {
          college: 'Premier State University / IIIT Hyderabad',
          branch: 'Applied Sciences & AI',
          cutoffPercentile: 92.0,
          admissionProbability: 'HIGH'
        }
      ]
    };
  }

  public getAllMistakes(): MistakeEntry[] {
    return Array.from(this.mistakeVault.values());
  }

  public retestMistake(dto: RetestMistakeDto): { isCorrect: boolean; mistake: MistakeEntry } {
    const mistake = this.mistakeVault.get(dto.mistakeId);
    if (!mistake) throw new Error('Mistake entry not found');

    const isCorrect = dto.userAnswer === mistake.correctAnswer || dto.userAnswer.startsWith(mistake.correctAnswer.slice(0, 10));

    if (isCorrect) {
      mistake.isResolved = true;
      mistake.nextReviewDate = new Date(Date.now() + 86400000 * 7).toISOString();
    } else {
      mistake.failedCount += 1;
      mistake.nextReviewDate = new Date(Date.now() + 86400000).toISOString();
    }

    return { isCorrect, mistake };
  }

  public addMistake(entry: Omit<MistakeEntry, 'id' | 'createdAt' | 'failedCount' | 'isResolved'>): MistakeEntry {
    const id = `mistake-${Date.now()}`;
    const newEntry: MistakeEntry = {
      ...entry,
      id,
      failedCount: 1,
      isResolved: false,
      createdAt: new Date().toISOString()
    };
    this.mistakeVault.set(id, newEntry);
    return newEntry;
  }
}

export const rankPredictorService = new RankPredictorService();
