import {
  StudentAnalyticsSummary,
  SubjectMasteryMetrics,
  SpeedAccuracyQuadrantItem,
  WeakAreaDiagnosticItem,
  PerformanceTrendData,
} from '@studentlife/shared';

const DEFAULT_SUBJECT_MASTERIES: SubjectMasteryMetrics[] = [
  {
    subjectName: 'Algorithms & Data Structures',
    totalQuestionsAttempted: 84,
    correctAnswers: 68,
    accuracyRate: 81,
    averageTimePerQuestionSeconds: 95,
    masteryGrade: 'PROFICIENT',
    colorCode: '#6366f1',
  },
  {
    subjectName: 'Operating Systems',
    totalQuestionsAttempted: 62,
    correctAnswers: 44,
    accuracyRate: 71,
    averageTimePerQuestionSeconds: 110,
    masteryGrade: 'INTERMEDIATE',
    colorCode: '#06b6d4',
  },
  {
    subjectName: 'Engineering Mathematics',
    totalQuestionsAttempted: 58,
    correctAnswers: 51,
    accuracyRate: 88,
    averageTimePerQuestionSeconds: 78,
    masteryGrade: 'EXPERT',
    colorCode: '#a855f7',
  },
  {
    subjectName: 'Database Management Systems',
    totalQuestionsAttempted: 48,
    correctAnswers: 39,
    accuracyRate: 81,
    averageTimePerQuestionSeconds: 82,
    masteryGrade: 'PROFICIENT',
    colorCode: '#10b981',
  },
  {
    subjectName: 'Computer Networks',
    totalQuestionsAttempted: 52,
    correctAnswers: 28,
    accuracyRate: 54,
    averageTimePerQuestionSeconds: 145,
    masteryGrade: 'NOVICE',
    colorCode: '#f59e0b',
  },
];

const DEFAULT_QUADRANTS: SpeedAccuracyQuadrantItem[] = [
  {
    id: 'sq-1',
    topic: 'Linear Algebra & Matrices',
    subject: 'Engineering Mathematics',
    accuracyPercentage: 92,
    avgTimeSeconds: 65,
    quadrant: 'FAST_ACCURATE',
  },
  {
    id: 'sq-2',
    topic: 'Graph Theory & BFS/DFS',
    subject: 'Algorithms',
    accuracyPercentage: 86,
    avgTimeSeconds: 80,
    quadrant: 'FAST_ACCURATE',
  },
  {
    id: 'sq-3',
    topic: 'Normalization & Functional Dependencies',
    subject: 'DBMS',
    accuracyPercentage: 84,
    avgTimeSeconds: 72,
    quadrant: 'FAST_ACCURATE',
  },
  {
    id: 'sq-4',
    topic: 'Virtual Memory & Inverted Page Tables',
    subject: 'Operating Systems',
    accuracyPercentage: 78,
    avgTimeSeconds: 140,
    quadrant: 'SLOW_ACCURATE',
  },
  {
    id: 'sq-5',
    topic: 'Dynamic Programming Recurrences',
    subject: 'Algorithms',
    accuracyPercentage: 68,
    avgTimeSeconds: 165,
    quadrant: 'SLOW_ACCURATE',
  },
  {
    id: 'sq-6',
    topic: 'Quantitative Aptitude Percentages',
    subject: 'General Aptitude',
    accuracyPercentage: 45,
    avgTimeSeconds: 50,
    quadrant: 'FAST_INACCURATE',
  },
  {
    id: 'sq-7',
    topic: 'TCP Congestion Control & Sliding Windows',
    subject: 'Computer Networks',
    accuracyPercentage: 42,
    avgTimeSeconds: 155,
    quadrant: 'SLOW_INACCURATE',
  },
  {
    id: 'sq-8',
    topic: 'Subnetting & VLSM Masking',
    subject: 'Computer Networks',
    accuracyPercentage: 38,
    avgTimeSeconds: 170,
    quadrant: 'SLOW_INACCURATE',
  },
];

const DEFAULT_WEAK_AREAS: WeakAreaDiagnosticItem[] = [
  {
    id: 'wa-1',
    topic: 'Subnetting & CIDR Address Calculation',
    subject: 'Computer Networks',
    accuracyPercentage: 38,
    errorCount: 14,
    negativeMarksLost: 4.62,
    severityLevel: 'CRITICAL',
    recommendationAction: 'Review CIDR bit-masking rules and solve 10 subnetting PYQs',
    pyqCountAvailable: 24,
  },
  {
    id: 'wa-2',
    topic: 'TCP Congestion Window & Slow Start Threshold',
    subject: 'Computer Networks',
    accuracyPercentage: 42,
    errorCount: 11,
    negativeMarksLost: 3.63,
    severityLevel: 'CRITICAL',
    recommendationAction: 'Study timeout vs 3 duplicate ACK transitions in TCP Tahoe/Reno',
    pyqCountAvailable: 18,
  },
  {
    id: 'wa-3',
    topic: 'Deadlock Avoidance & Banker’s Safety Algorithm',
    subject: 'Operating Systems',
    accuracyPercentage: 58,
    errorCount: 8,
    negativeMarksLost: 2.64,
    severityLevel: 'MODERATE',
    recommendationAction: 'Practice resource matrix vector allocations under varying processes',
    pyqCountAvailable: 15,
  },
  {
    id: 'wa-4',
    topic: 'Dynamic Programming Matrix Chain Multiplication',
    subject: 'Algorithms',
    accuracyPercentage: 62,
    errorCount: 6,
    negativeMarksLost: 1.98,
    severityLevel: 'MODERATE',
    recommendationAction: 'Derive split point recurrence intervals step-by-step',
    pyqCountAvailable: 20,
  },
];

const DEFAULT_TRENDS: PerformanceTrendData[] = [
  {
    testId: 'mock-1',
    testTitle: 'Diagnostic Assessment 1',
    dateStr: 'Aug 10, 2026',
    score: 42,
    maxScore: 100,
    percentage: 42,
    percentile: 74.5,
  },
  {
    testId: 'mock-2',
    testTitle: 'Subject Test: Systems & DSA',
    dateStr: 'Aug 22, 2026',
    score: 56,
    maxScore: 100,
    percentage: 56,
    percentile: 86.2,
  },
  {
    testId: 'mock-3',
    testTitle: 'National Full Mock 1',
    dateStr: 'Sept 01, 2026',
    score: 68.5,
    maxScore: 100,
    percentage: 68.5,
    percentile: 94.8,
  },
  {
    testId: 'mock-4',
    testTitle: 'GATE 2027 CSE Full Simulation',
    dateStr: 'Sept 06, 2026',
    score: 77.0,
    maxScore: 100,
    percentage: 77.0,
    percentile: 97.4,
  },
];

class PerformanceService {
  public getAnalyticsSummary(_userId: string): StudentAnalyticsSummary {
    return {
      overallReadinessScore: 78,
      estimatedPercentile: 97.4,
      totalMockTestsAttempted: 4,
      totalQuestionsSolved: 304,
      averageSpeedSecondsPerQuestion: 88,
      strongAreasCount: 18,
      weakAreasCount: 4,
      accuracyRate: 76.2,
      subjectMasteries: DEFAULT_SUBJECT_MASTERIES,
      speedAccuracyMatrix: DEFAULT_QUADRANTS,
      weakAreas: DEFAULT_WEAK_AREAS,
      historicalTrends: DEFAULT_TRENDS,
    };
  }

  public getWeakAreas(_userId: string): WeakAreaDiagnosticItem[] {
    return DEFAULT_WEAK_AREAS;
  }
}

export const performanceService = new PerformanceService();
