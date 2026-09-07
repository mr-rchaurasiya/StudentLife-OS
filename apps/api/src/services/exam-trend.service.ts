import { ExamTrendForecast, PredictExamTrendsDto } from '@studentlife/shared';

export class ExamTrendService {
  private static forecasts: Record<string, ExamTrendForecast> = {
    'GATE (CSE)': {
      examName: 'GATE 2027 Computer Science & Information Technology',
      analyzedYearSpan: '2015 – 2026 (12 Years)',
      totalPYQQuestionsIndexed: 780,
      forecastAccuracyScore: 92.4,
      predictedPaperDifficulty: 'CHALLENGING',
      highProbabilityQuestionPatterns: [
        'Dynamic Programming Optimal Substructure (Matrix Chain / LCS)',
        'Cache Hit/Miss & Direct/Set Associative Memory Mapping',
        'Deadlock Banker\'s Algorithm & Resource Allocation Graphs',
        'Pipelining Stalls & Branch Prediction Hazard Delays',
        'B-Tree & B+ Tree Maximum Keys / Height Calculations'
      ],
      topPredictedTopics: [
        {
          topicName: 'Dynamic Programming & Recurrences',
          historicalFrequencyCount: 18,
          probabilityPercent: 89.5,
          expectedMarksWeightage: 6,
          riskLevel: 'VERY_HIGH',
          recommendedAction: 'Practice all 2-mark GATE questions from 2018-2025 on Bellman-Ford and DP state transitions.'
        },
        {
          topicName: 'Cache Memory & Multi-Level Mapping',
          historicalFrequencyCount: 16,
          probabilityPercent: 85.2,
          expectedMarksWeightage: 4,
          riskLevel: 'VERY_HIGH',
          recommendedAction: 'Master TAG-SET-WORD offset arithmetic for 4-way set associative caches.'
        },
        {
          topicName: 'Graph Traversals (BFS / DFS / Shortest Path)',
          historicalFrequencyCount: 14,
          probabilityPercent: 78.0,
          expectedMarksWeightage: 4,
          riskLevel: 'HIGH',
          recommendedAction: 'Revise Dijkstra, Prim\'s & Kruskal\'s asymptotic time bounds with Fibonacci heaps.'
        },
        {
          topicName: 'Process Synchronization & Semaphores',
          historicalFrequencyCount: 12,
          probabilityPercent: 72.5,
          expectedMarksWeightage: 4,
          riskLevel: 'HIGH',
          recommendedAction: 'Solve Producer-Consumer and Reader-Writer mutex synchronization test cases.'
        },
        {
          topicName: 'Turing Machines & Decidability (TOC)',
          historicalFrequencyCount: 10,
          probabilityPercent: 68.0,
          expectedMarksWeightage: 3,
          riskLevel: 'MEDIUM',
          recommendedAction: 'Master Rice\'s theorem and Post Correspondence Problem undecidability proofs.'
        }
      ]
    },
    'JEE Advanced': {
      examName: 'JEE Advanced Physics & Mathematics',
      analyzedYearSpan: '2016 – 2026 (11 Years)',
      totalPYQQuestionsIndexed: 660,
      forecastAccuracyScore: 89.8,
      predictedPaperDifficulty: 'EXTREME',
      highProbabilityQuestionPatterns: [
        'Rotational Dynamics with Combined Pure Rolling & Variable Friction',
        'Electromagnetic Induction with Moving Rod in Non-Uniform B-field',
        'Definite Integration using King\'s Rule & Leibniz Rule Derivatives',
        'Complex Numbers Geometry & Rotation of Vectors'
      ],
      topPredictedTopics: [
        {
          topicName: 'Rigid Body Dynamics & Angular Momentum',
          historicalFrequencyCount: 15,
          probabilityPercent: 88.0,
          expectedMarksWeightage: 8,
          riskLevel: 'VERY_HIGH',
          recommendedAction: 'Solve multi-correct and matrix-match problems on rolling without slipping on inclined planes.'
        },
        {
          topicName: 'Definite Integrals & Area under Curves',
          historicalFrequencyCount: 14,
          probabilityPercent: 84.5,
          expectedMarksWeightage: 7,
          riskLevel: 'VERY_HIGH',
          recommendedAction: 'Focus on piecewise continuous functions and periodic integral properties.'
        },
        {
          topicName: 'Thermodynamics & Heat Engines (Carnot / Polytropic)',
          historicalFrequencyCount: 11,
          probabilityPercent: 74.0,
          expectedMarksWeightage: 6,
          riskLevel: 'HIGH',
          recommendedAction: 'Review Indicator diagrams (P-V, T-S) and molar heat capacities for mixtures.'
        }
      ]
    }
  };

  public static getForecast(examName: string = 'GATE (CSE)'): ExamTrendForecast {
    return this.forecasts[examName] || this.forecasts['GATE (CSE)'];
  }

  public static predictCustom(dto: PredictExamTrendsDto): ExamTrendForecast {
    const key = dto.examName || 'GATE (CSE)';
    if (this.forecasts[key]) {
      return this.forecasts[key];
    }
    return {
      examName: `${dto.examName} Trend Forecast`,
      analyzedYearSpan: '2018 – 2026',
      totalPYQQuestionsIndexed: 450,
      forecastAccuracyScore: 86.5,
      predictedPaperDifficulty: 'MODERATE',
      highProbabilityQuestionPatterns: [
        `Core fundamental applications in ${dto.targetSubject || 'Main Subject'}`,
        'Numerical calculation problems with non-integer inputs',
        'Concept verification and multi-statement validation'
      ],
      topPredictedTopics: [
        {
          topicName: `${dto.targetSubject || 'Foundational Principles'} Topic 1`,
          historicalFrequencyCount: 12,
          probabilityPercent: 81.0,
          expectedMarksWeightage: 5,
          riskLevel: 'HIGH',
          recommendedAction: 'Review formula cheat-sheet and 5 PYQ mock papers.'
        },
        {
          topicName: `${dto.targetSubject || 'Analytical Reasoning'} Topic 2`,
          historicalFrequencyCount: 9,
          probabilityPercent: 73.5,
          expectedMarksWeightage: 4,
          riskLevel: 'MEDIUM',
          recommendedAction: 'Practice timed sectional drills.'
        }
      ]
    };
  }
}
