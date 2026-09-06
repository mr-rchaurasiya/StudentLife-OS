import {
  MockTestTemplate,
  SubmitTestAttemptDto,
  MockTestScorecard,
  QuestionAttemptDetail,
  SectionScoreDetail,
} from '@studentlife/shared';

const SEED_MOCK_TESTS: MockTestTemplate[] = [
  {
    id: 'mock-gate-cse-full-1',
    title: 'GATE 2027 CSE Full-Length National Simulation',
    description: 'Comprehensive 3-hour national level mock test covering Discrete Mathematics, Algorithms, OS, DBMS, Computer Networks, and General Aptitude with negative marking.',
    examType: 'GATE CSE',
    category: 'NATIONAL_COMPETITIVE',
    durationMinutes: 180,
    totalMarks: 100,
    passingMarks: 28,
    totalQuestions: 6, // Focused high-yield sample for simulation speed & accuracy testing
    difficulty: 'HARD',
    totalAttemptsCount: 14200,
    averageScorePercent: 46.8,
    createdAt: new Date().toISOString(),
    sections: [
      {
        id: 'sec-ga-em',
        name: 'Section 1: General Aptitude & Engineering Mathematics',
        description: 'Quantitative aptitude, spatial reasoning, and linear algebra/calculus.',
        totalQuestions: 3,
        totalMarks: 5,
        questions: [
          {
            id: 'mq-gate-1',
            sectionId: 'sec-ga-em',
            questionNumber: 1,
            type: 'SINGLE_MCQ',
            difficulty: 'EASY',
            marks: 1,
            negativeMarks: 0.33,
            subject: 'General Aptitude',
            topic: 'Quantitative Aptitude & Percentages',
            questionText: 'A vessel contains 60 litres of milk. 6 litres of milk is taken out and replaced by water. This process is repeated one more time. What is the amount of milk left in the vessel now?',
            options: [
              { id: 'opt-a', text: '48.6 litres' },
              { id: 'opt-b', text: '50.4 litres' },
              { id: 'opt-c', text: '52.0 litres' },
              { id: 'opt-d', text: '46.8 litres' },
            ],
            correctAnswer: 'opt-a',
            explanation: 'Final milk = Initial × (1 - x/V)^n = 60 × (1 - 6/60)² = 60 × (0.9)² = 60 × 0.81 = 48.6 litres.',
            stepByStepSolution: [
              'Step 1: Formula for repeated replacement: Quantity left = Initial × (1 - Replacement / Total Volume)^n',
              'Step 2: Initial = 60 L, Replacement = 6 L, Total = 60 L, n = 2 times.',
              'Step 3: Remaining = 60 × (1 - 6/60)² = 60 × (0.9)².',
              'Step 4: Remaining = 60 × 0.81 = 48.6 litres.',
            ],
            keyFormula: 'Q = Q_0 × (1 - x/V)^n',
          },
          {
            id: 'mq-gate-2',
            sectionId: 'sec-ga-em',
            questionNumber: 2,
            type: 'SINGLE_MCQ',
            difficulty: 'MEDIUM',
            marks: 2,
            negativeMarks: 0.66,
            subject: 'Engineering Mathematics',
            topic: 'Linear Algebra & Determinants',
            questionText: 'Let A be a 3 × 3 matrix with det(A) = 5. What is the value of det(2 · adj(A))?',
            options: [
              { id: 'opt-a', text: '200' },
              { id: 'opt-b', text: '100' },
              { id: 'opt-c', text: '40' },
              { id: 'opt-d', text: '500' },
            ],
            correctAnswer: 'opt-a',
            explanation: 'For an n×n matrix, det(k · adj(A)) = kⁿ · det(adj(A)) = kⁿ · (det(A))^(n-1). For n=3, k=2: 2³ × 5^(3-1) = 8 × 25 = 200.',
            stepByStepSolution: [
              'Step 1: Recall determinant properties: det(k · M) = k^n · det(M) for an n × n matrix.',
              'Step 2: Here n = 3 and k = 2, so det(2 · adj(A)) = 2³ · det(adj(A)) = 8 · det(adj(A)).',
              'Step 3: Property of adjugate determinant: det(adj(A)) = (det(A))^(n-1).',
              'Step 4: For n=3, det(adj(A)) = 5^(3-1) = 5² = 25.',
              'Step 5: Multiply: 8 × 25 = 200.',
            ],
            keyFormula: 'det(k · adj(A)) = k^n · (det(A))^(n-1)',
          },
          {
            id: 'mq-gate-3',
            sectionId: 'sec-ga-em',
            questionNumber: 3,
            type: 'SINGLE_MCQ',
            difficulty: 'MEDIUM',
            marks: 2,
            negativeMarks: 0.66,
            subject: 'Engineering Mathematics',
            topic: 'Probability & Bayes Theorem',
            questionText: 'A fair coin is tossed 4 times. What is the conditional probability of getting at least 3 heads given that at least 1 head was obtained?',
            options: [
              { id: 'opt-a', text: '5 / 15 (1/3)' },
              { id: 'opt-b', text: '4 / 15' },
              { id: 'opt-c', text: '5 / 16' },
              { id: 'opt-d', text: '1 / 4' },
            ],
            correctAnswer: 'opt-a',
            explanation: 'Total outcomes = 2⁴ = 16. Event B (at least 1 head) = 16 - 1 (all tails) = 15. Event A (at least 3 heads) = 4 heads (1) + 3 heads (4) = 5 outcomes. P(A|B) = P(A ∩ B) / P(B) = (5/16) / (15/16) = 5/15 = 1/3.',
            stepByStepSolution: [
              'Step 1: Sample space size for 4 tosses = 2⁴ = 16.',
              'Step 2: Event B (at least 1 head) = 16 - 1 (TTTT) = 15 outcomes.',
              'Step 3: Event A (at least 3 heads) = 4C3 + 4C4 = 4 + 1 = 5 outcomes.',
              'Step 4: Since A ⊂ B, P(A ∩ B) = 5/16.',
              'Step 5: P(A|B) = (5/16) / (15/16) = 5/15 = 1/3.',
            ],
            keyFormula: 'P(A|B) = P(A ∩ B) / P(B)',
          },
        ],
      },
      {
        id: 'sec-core-cs',
        name: 'Section 2: Core Computer Science & Information Technology',
        description: 'Data Structures, Operating Systems, Database Systems, Computer Networks.',
        totalQuestions: 3,
        totalMarks: 6,
        questions: [
          {
            id: 'mq-gate-4',
            sectionId: 'sec-core-cs',
            questionNumber: 4,
            type: 'SINGLE_MCQ',
            difficulty: 'HARD',
            marks: 2,
            negativeMarks: 0.66,
            subject: 'Algorithms & Data Structures',
            topic: 'Dynamic Programming & DAGs',
            questionText: 'What is the time complexity to find the longest path between any two vertices in a Directed Acyclic Graph (DAG) with V vertices and E edges?',
            options: [
              { id: 'opt-a', text: 'O(V + E)' },
              { id: 'opt-b', text: 'NP-Hard (cannot be solved in polynomial time)' },
              { id: 'opt-c', text: 'O(V² · E)' },
              { id: 'opt-d', text: 'O(V log V + E)' },
            ],
            correctAnswer: 'opt-a',
            explanation: 'While longest path in a general graph is NP-Hard, in a Directed Acyclic Graph (DAG), we can topologically sort the vertices in O(V + E) time and then use dynamic programming/relaxation to find the longest path in O(V + E) linear time.',
            stepByStepSolution: [
              'Step 1: Compute Topological Sorting of the DAG in O(V + E) using Kahn\'s algorithm or DFS.',
              'Step 2: Initialize dist[] array to -∞, and set source vertex dist[s] = 0.',
              'Step 3: For each vertex u in topological order, relax all outgoing edges (u, v): dist[v] = max(dist[v], dist[u] + weight(u, v)).',
              'Step 4: Each edge and vertex is visited exactly once.',
              'Step 5: Overall Time Complexity = O(V + E).',
            ],
            keyFormula: 'Longest Path in DAG: Topological Sort + Edge Relaxation in O(V + E)',
          },
          {
            id: 'mq-gate-5',
            sectionId: 'sec-core-cs',
            questionNumber: 5,
            type: 'SINGLE_MCQ',
            difficulty: 'MEDIUM',
            marks: 2,
            negativeMarks: 0.66,
            subject: 'Operating Systems',
            topic: 'Deadlock & Banker\'s Algorithm',
            questionText: 'A system has 4 processes (P1, P2, P3, P4) sharing 12 units of a resource R. What is the maximum number of units each process can demand such that a deadlock is guaranteed NEVER to occur?',
            options: [
              { id: 'opt-a', text: '3 units' },
              { id: 'opt-b', text: '4 units' },
              { id: 'opt-c', text: '2 units' },
              { id: 'opt-d', text: '5 units' },
            ],
            correctAnswer: 'opt-a',
            explanation: 'Deadlock avoidance condition: Total Resources ≥ Σ (Max_i - 1) + 1. For 4 processes each requiring m units: 12 ≥ 4(m - 1) + 1 ⇒ 11 ≥ 4m - 4 ⇒ 15 ≥ 4m ⇒ m ≤ 3.75. Hence max integer m = 3.',
            stepByStepSolution: [
              'Step 1: Worst-case allocation without deadlock occurs when each process holds (m - 1) resources and needs 1 more.',
              'Step 2: Maximum resources held in worst-case state = 4 × (m - 1) = 4m - 4.',
              'Step 3: To guarantee at least one process can finish and release its resources: Total Resources ≥ (4m - 4) + 1.',
              'Step 4: 12 ≥ 4m - 3 ⇒ 4m ≤ 15 ⇒ m ≤ 3.75.',
              'Step 5: Since resource requests are integers, the maximum safe demand is m = 3 units.',
            ],
            keyFormula: 'R ≥ Σ (Max_i - 1) + 1 for Deadlock Freedom',
          },
          {
            id: 'mq-gate-6',
            sectionId: 'sec-core-cs',
            questionNumber: 6,
            type: 'SINGLE_MCQ',
            difficulty: 'MEDIUM',
            marks: 2,
            negativeMarks: 0.66,
            subject: 'Computer Networks',
            topic: 'Subnetting & CIDR',
            questionText: 'An organization is granted the block 198.51.100.0/24. The administrator needs to create 6 subnets, each supporting at least 25 hosts. What is the subnet mask and the number of usable hosts per subnet?',
            options: [
              { id: 'opt-a', text: 'Subnet Mask: 255.255.255.224 (/27), Usable Hosts: 30' },
              { id: 'opt-b', text: 'Subnet Mask: 255.255.255.240 (/28), Usable Hosts: 14' },
              { id: 'opt-c', text: 'Subnet Mask: 255.255.255.192 (/26), Usable Hosts: 62' },
              { id: 'opt-d', text: 'Subnet Mask: 255.255.255.128 (/25), Usable Hosts: 126' },
            ],
            correctAnswer: 'opt-a',
            explanation: 'To get at least 6 subnets: 2^s ≥ 6 ⇒ s = 3 subnet bits. Prefix becomes 24 + 3 = /27 (Mask: 255.255.255.224). Remaining host bits = 32 - 27 = 5 bits. Usable hosts = 2⁵ - 2 = 30 hosts (satisfies ≥ 25 hosts).',
            stepByStepSolution: [
              'Step 1: Determine subnet bits needed: 2³ = 8 subnets (>= 6 subnets).',
              'Step 2: New CIDR prefix = 24 + 3 = /27.',
              'Step 3: Subnet mask = 11111111.11111111.11111111.11100000 = 255.255.255.224.',
              'Step 4: Host bits per subnet = 32 - 27 = 5.',
              'Step 5: Usable hosts = 2⁵ - 2 = 32 - 2 = 30 hosts.',
            ],
            keyFormula: 'Usable Hosts = 2^h - 2; Subnet Mask = / (32 - h)',
          },
        ],
      },
    ],
  },
  {
    id: 'mock-univ-finals-1',
    title: 'University Finals: Systems & Algorithms Semester Exam',
    description: 'Timed sectional semester examination designed to test in-depth algorithmic complexity, operating system concurrency, and relational schema normalization.',
    examType: 'University Finals',
    category: 'UNIVERSITY',
    durationMinutes: 60,
    totalMarks: 30,
    passingMarks: 12,
    totalQuestions: 4,
    difficulty: 'MEDIUM',
    totalAttemptsCount: 6800,
    averageScorePercent: 62.4,
    createdAt: new Date().toISOString(),
    sections: [
      {
        id: 'sec-univ-algo',
        name: 'Section A: Algorithms & Complexity',
        totalQuestions: 2,
        totalMarks: 15,
        questions: [
          {
            id: 'mq-univ-1',
            sectionId: 'sec-univ-algo',
            questionNumber: 1,
            type: 'SINGLE_MCQ',
            difficulty: 'MEDIUM',
            marks: 7.5,
            negativeMarks: 0,
            subject: 'Algorithms',
            topic: 'Asymptotic Notations',
            questionText: 'Which of the following statements is FALSE regarding asymptotic time complexity?',
            options: [
              { id: 'opt-a', text: '2^(n+1) = O(2^n)' },
              { id: 'opt-b', text: '2^(2n) = O(2^n)' },
              { id: 'opt-c', text: 'n! = O(n^n)' },
              { id: 'opt-d', text: 'log(n!) = Θ(n log n)' },
            ],
            correctAnswer: 'opt-b',
            explanation: '2^(2n) = (2^n)² = 4^n. The ratio 4^n / 2^n = 2^n -> ∞ as n -> ∞. Thus 2^(2n) is NOT O(2^n).',
            stepByStepSolution: [
              'Step 1: Check 2^(n+1) = 2 · 2^n <= c · 2^n for c=2. True.',
              'Step 2: Check 2^(2n) = (2²)^n = 4^n. Lim (4^n / 2^n) = Lim (2^n) = ∞. Thus 2^(2n) is not bounded by c · 2^n. Statement B is FALSE.',
              'Step 3: Check n! <= n^n. True.',
              'Step 4: By Stirling\'s approximation, log(n!) = Θ(n log n). True.',
            ],
            keyFormula: '2^(2n) = 4^n ≠ O(2^n)',
          },
          {
            id: 'mq-univ-2',
            sectionId: 'sec-univ-algo',
            questionNumber: 2,
            type: 'SINGLE_MCQ',
            difficulty: 'EASY',
            marks: 7.5,
            negativeMarks: 0,
            subject: 'Algorithms',
            topic: 'Binary Search Trees',
            questionText: 'What is the height of an AVL tree with n nodes in the worst case?',
            options: [
              { id: 'opt-a', text: '≈ 1.44 log₂(n)' },
              { id: 'opt-b', text: '≈ 2 log₂(n)' },
              { id: 'opt-c', text: 'O(n)' },
              { id: 'opt-d', text: 'O(√n)' },
            ],
            correctAnswer: 'opt-a',
            explanation: 'In the worst case (Fibonacci AVL tree), the height h of an AVL tree with n nodes is bounded by h < 1.4404 · log₂(n + 2) - 0.328.',
            stepByStepSolution: [
              'Step 1: The minimum number of nodes in an AVL tree of height h is given by N(h) = N(h-1) + N(h-2) + 1.',
              'Step 2: This recurrence resembles Fibonacci numbers: N(h) = F(h+3) - 1.',
              'Step 3: Solving for h in terms of n yields h ≈ log_φ(√5 · (n+1)) ≈ 1.44 log₂(n).',
            ],
            keyFormula: 'Max Height of AVL Tree = 1.44 · log₂(n)',
          },
        ],
      },
      {
        id: 'sec-univ-os',
        name: 'Section B: Operating Systems Concurrency',
        totalQuestions: 2,
        totalMarks: 15,
        questions: [
          {
            id: 'mq-univ-3',
            sectionId: 'sec-univ-os',
            questionNumber: 3,
            type: 'SINGLE_MCQ',
            difficulty: 'MEDIUM',
            marks: 7.5,
            negativeMarks: 0,
            subject: 'Operating Systems',
            topic: 'Semaphores & Mutexes',
            questionText: 'A counting semaphore S is initialized to 10. Then 12 wait (P) operations and 6 signal (V) operations are completed on S. What is the current value of S?',
            options: [
              { id: 'opt-a', text: '4' },
              { id: 'opt-b', text: '-2' },
              { id: 'opt-c', text: '8' },
              { id: 'opt-d', text: '0' },
            ],
            correctAnswer: 'opt-a',
            explanation: 'Semaphore value = Initial - (Wait operations) + (Signal operations) = 10 - 12 + 6 = 4.',
            stepByStepSolution: [
              'Step 1: P (wait) decrements semaphore value by 1.',
              'Step 2: V (signal) increments semaphore value by 1.',
              'Step 3: S_current = 10 - 12 + 6 = 4.',
            ],
            keyFormula: 'S = S_0 - count(wait) + count(signal)',
          },
          {
            id: 'mq-univ-4',
            sectionId: 'sec-univ-os',
            questionNumber: 4,
            type: 'SINGLE_MCQ',
            difficulty: 'HARD',
            marks: 7.5,
            negativeMarks: 0,
            subject: 'Operating Systems',
            topic: 'Page Replacement Algorithms',
            questionText: 'Belady\'s Anomaly is exhibited by which of the following page replacement algorithms?',
            options: [
              { id: 'opt-a', text: 'FIFO (First-In First-Out)' },
              { id: 'opt-b', text: 'LRU (Least Recently Used)' },
              { id: 'opt-c', text: 'Optimal (OPT / MIN)' },
              { id: 'opt-d', text: 'LFU (Least Frequently Used)' },
            ],
            correctAnswer: 'opt-a',
            explanation: 'Belady\'s anomaly is the phenomenon where increasing the number of page frames results in an increase in page faults. It occurs in FIFO, but never in stack algorithms like LRU or Optimal.',
            stepByStepSolution: [
              'Step 1: Belady\'s Anomaly occurs when frame count increases, but page fault count increases.',
              'Step 2: Stack algorithms (where page set in n frames is always a subset of n+1 frames) NEVER suffer from Belady\'s anomaly.',
              'Step 3: LRU and Optimal are stack algorithms; FIFO is not.',
              'Step 4: Hence, FIFO exhibits Belady\'s Anomaly.',
            ],
            keyFormula: 'Belady\'s Anomaly: FIFO exhibits it; Stack algorithms (LRU, OPT) do not.',
          },
        ],
      },
    ],
  },
];

class MockTestService {
  private templates: MockTestTemplate[] = [...SEED_MOCK_TESTS];
  private scorecards: Map<string, MockTestScorecard[]> = new Map();

  public getTemplates(): MockTestTemplate[] {
    return this.templates;
  }

  public getTemplateById(id: string): MockTestTemplate | null {
    return this.templates.find((t) => t.id === id) || null;
  }

  public submitTest(userId: string, dto: SubmitTestAttemptDto): MockTestScorecard {
    const template = this.templates.find((t) => t.id === dto.mockTestId);
    if (!template) {
      throw new Error('Mock test not found');
    }

    let totalScore = 0;
    let totalAttempted = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalUnattempted = 0;

    const questionDetails: QuestionAttemptDetail[] = [];
    const sectionBreakdowns: SectionScoreDetail[] = [];

    // Evaluate each section and question
    for (const sec of template.sections) {
      let secAttempted = 0;
      let secCorrect = 0;
      let secIncorrect = 0;
      let secMarksObtained = 0;

      for (const q of sec.questions) {
        const response = dto.responses[q.id];
        const isAttempted = !!(response && response.selectedOptionId);
        let isCorrect = false;
        let marksEarned = 0;

        if (isAttempted) {
          totalAttempted++;
          secAttempted++;

          if (Array.isArray(q.correctAnswer) && Array.isArray(response.selectedOptionId)) {
            isCorrect =
              q.correctAnswer.length === response.selectedOptionId.length &&
              q.correctAnswer.every((ans) => (response.selectedOptionId as string[]).includes(ans));
          } else {
            isCorrect = q.correctAnswer === response.selectedOptionId;
          }

          if (isCorrect) {
            totalCorrect++;
            secCorrect++;
            marksEarned = q.marks;
          } else {
            totalIncorrect++;
            secIncorrect++;
            marksEarned = -q.negativeMarks;
          }
        } else {
          totalUnattempted++;
          marksEarned = 0;
        }

        secMarksObtained += marksEarned;
        totalScore += marksEarned;

        questionDetails.push({
          questionId: q.id,
          sectionId: sec.id,
          questionNumber: q.questionNumber,
          questionText: q.questionText,
          subject: q.subject,
          topic: q.topic,
          marks: q.marks,
          negativeMarks: q.negativeMarks,
          userSelectedAnswer: response?.selectedOptionId,
          correctAnswer: q.correctAnswer,
          isCorrect,
          isAttempted,
          isMarkedForReview: response?.isMarkedForReview || false,
          marksEarned: Number(marksEarned.toFixed(2)),
          timeSpentSeconds: response?.timeSpentSeconds || 0,
          explanation: q.explanation,
          stepByStepSolution: q.stepByStepSolution,
          options: q.options,
        });
      }

      const secAccuracy = secAttempted > 0 ? Math.round((secCorrect / secAttempted) * 100) : 0;
      sectionBreakdowns.push({
        sectionId: sec.id,
        sectionName: sec.name,
        totalQuestions: sec.questions.length,
        attemptedQuestions: secAttempted,
        correctQuestions: secCorrect,
        incorrectQuestions: secIncorrect,
        marksObtained: Number(secMarksObtained.toFixed(2)),
        totalSectionMarks: sec.totalMarks,
        accuracyPercentage: secAccuracy,
      });
    }

    // Clamp score to non-negative if desired or keep negative marking realism
    const normalizedScore = Number(totalScore.toFixed(2));
    const percentage = Number(((Math.max(0, normalizedScore) / template.totalMarks) * 100).toFixed(1));
    const accuracy = totalAttempted > 0 ? Number(((totalCorrect / totalAttempted) * 100).toFixed(1)) : 0;

    // Percentile & Rank Estimation algorithm
    const estimatedPercentile = Math.min(99.8, Math.max(12, Number((percentage * 0.95 + 8).toFixed(1))));
    const estimatedRank =
      estimatedPercentile >= 99
        ? 'Top 100 (AIR < 100)'
        : estimatedPercentile >= 95
        ? 'AIR 100 – 500'
        : estimatedPercentile >= 85
        ? 'AIR 500 – 2,000'
        : 'AIR 2,000+';

    // XP calculation: +50 base XP + +20 per correct question
    const xpEarned = 50 + totalCorrect * 20;

    const scorecard: MockTestScorecard = {
      attemptId: `att-${Date.now()}`,
      mockTestId: template.id,
      testTitle: template.title,
      examType: template.examType,
      totalScore: normalizedScore,
      maxScore: template.totalMarks,
      percentage,
      accuracyPercentage: accuracy,
      totalAttempted,
      totalCorrect,
      totalIncorrect,
      totalUnattempted,
      totalTimeSpentSeconds: dto.timeSpentSeconds,
      estimatedPercentile,
      estimatedRank,
      xpEarned,
      sectionBreakdown: sectionBreakdowns,
      questionDetails,
      submittedAt: new Date().toISOString(),
    };

    if (!this.scorecards.has(userId)) {
      this.scorecards.set(userId, []);
    }
    this.scorecards.get(userId)!.unshift(scorecard);

    return scorecard;
  }

  public getAttemptHistory(userId: string): MockTestScorecard[] {
    return this.scorecards.get(userId) || [];
  }
}

export const mockTestService = new MockTestService();
