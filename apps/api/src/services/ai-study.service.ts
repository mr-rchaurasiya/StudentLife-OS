import {
  FlashcardItem,
  AiSummaryResult,
  AiDoubtChatMessage,
  ConceptExplanationResult,
  SummarizeContentDto,
  GenerateFlashcardsDto,
  AskAiDoubtDto,
  ExplainConceptDto,
} from '@studentlife/shared';

const userFlashcardsDb = new Map<string, FlashcardItem[]>();

const DEFAULT_DEMO_FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc-1',
    userId: 'demo-student-uuid-01',
    subjectName: 'Data Structures & Algorithms',
    topicTitle: 'Dynamic Programming',
    question: 'What is the core state transition equation for the 0/1 Knapsack Problem?',
    answer: 'dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]]) when wt[i-1] <= w, else dp[i-1][w]',
    difficulty: 'HARD',
    masteryLevel: 3,
    easeFactor: 2.5,
    repetitionIntervalDays: 4,
    nextReviewDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    tags: ['#DSA', '#DP', '#Knapsack'],
    isAiGenerated: true,
  },
  {
    id: 'fc-2',
    userId: 'demo-student-uuid-01',
    subjectName: 'System Design',
    topicTitle: 'Distributed Caching',
    question: 'How does the Cache-Aside pattern prevent stale data on write operations?',
    answer: 'On write/update, the application updates the database directly and invalidates (evicts/deletes) the entry in the cache rather than writing to cache.',
    difficulty: 'MEDIUM',
    masteryLevel: 4,
    easeFactor: 2.6,
    repetitionIntervalDays: 6,
    nextReviewDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    tags: ['#SystemDesign', '#CacheAside', '#Redis'],
    isAiGenerated: true,
  },
  {
    id: 'fc-3',
    userId: 'demo-student-uuid-01',
    subjectName: 'Computer Networks',
    topicTitle: 'TCP Transport Layer',
    question: 'Why does TCP require a 3-way handshake instead of a 2-way handshake?',
    answer: 'To prevent duplicate old connection SYN segments from causing a half-open duplicate connection on the server, establishing mutual Sequence Number synchronization.',
    difficulty: 'MEDIUM',
    masteryLevel: 2,
    easeFactor: 2.4,
    repetitionIntervalDays: 2,
    nextReviewDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    tags: ['#Networks', '#TCP', '#Protocols'],
    isAiGenerated: false,
  },
  {
    id: 'fc-4',
    userId: 'demo-student-uuid-01',
    subjectName: 'Engineering Mathematics',
    topicTitle: 'Linear Algebra',
    question: 'What is the algebraic condition for a matrix A to be diagonalizable?',
    answer: 'An n×n matrix A is diagonalizable if and only if it has n linearly independent eigenvectors (or the geometric multiplicity equals algebraic multiplicity for all eigenvalues).',
    difficulty: 'HARD',
    masteryLevel: 1,
    easeFactor: 2.2,
    repetitionIntervalDays: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    tags: ['#Math', '#Eigenvalues', '#GATE'],
    isAiGenerated: true,
  },
];

userFlashcardsDb.set('demo-student-uuid-01', DEFAULT_DEMO_FLASHCARDS);

export class AiStudyService {
  static async getFlashcards(userId: string): Promise<FlashcardItem[]> {
    return userFlashcardsDb.get(userId) || DEFAULT_DEMO_FLASHCARDS;
  }

  static async summarizeContent(dto: SummarizeContentDto): Promise<AiSummaryResult> {
    const rawContent = dto.content.trim();
    const subject = dto.subjectName || 'Computer Science & Engineering';

    const sentences = rawContent
      .split(/[.!?\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15);

    const keyPoints = sentences.slice(0, 5).map((s) => `📌 ${s}`);
    if (keyPoints.length === 0) {
      keyPoints.push('📌 Key foundational premise identified in text.');
      keyPoints.push('📌 Critical optimization pattern for competitive problem solving.');
      keyPoints.push('📌 Architectural trade-offs between space complexity and throughput.');
    }

    const mindMap = [
      `🏛️ Core Domain: ${subject}`,
      `  ├── 🔑 Essential Invariants & Theorems`,
      `  ├── ⚙️ Algorithmic & Structural Mechanics`,
      `  └── 🎯 Real-World Applications & Edge Cases`,
    ];

    let formulaSnippet = '';
    if (rawContent.toLowerCase().includes('time') || rawContent.toLowerCase().includes('space') || rawContent.toLowerCase().includes('o(') || rawContent.toLowerCase().includes('dp')) {
      formulaSnippet = 'Time Complexity: O(N · W) | Space Complexity: O(W) (Optimized 1D Buffer)';
    } else {
      formulaSnippet = 'Key Formula: S(n) = Σ_{i=1}^n f(i) | Proof by Strong Mathematical Induction';
    }

    const wordCount = rawContent.split(/\s+/).length;
    const summaryText = `This study document synthesizes fundamental principles of ${subject}. The text outlines primary problem constraints, invariant conditions, and practical implementations. By structuring state transitions and minimizing redundant work, memory footprint is kept optimal while guaranteeing deterministic behavior under edge conditions (${wordCount} source words condensed).`;

    return {
      summary: summaryText,
      keyTakeaways: keyPoints,
      mindMapBullets: mindMap,
      formulaOrSyntaxSnippet: formulaSnippet,
      suggestedFlashcardCount: Math.min(8, Math.max(3, Math.ceil(wordCount / 50))),
    };
  }

  static async generateFlashcards(userId: string, dto: GenerateFlashcardsDto): Promise<FlashcardItem[]> {
    const count = dto.count || 3;
    const cards: FlashcardItem[] = [];

    const promptText = dto.content;
    const sub = dto.subjectName;
    const topic = dto.topicTitle;

    for (let i = 1; i <= count; i++) {
      let q = '';
      let a = '';
      let diff: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM';

      if (i === 1) {
        q = `What is the primary objective and invariant property of ${topic}?`;
        a = `In ${sub}, ${topic} ensures that valid state boundaries are preserved while computing optimal sub-solutions without re-evaluating overlapping work.`;
        diff = 'EASY';
      } else if (i === 2) {
        q = `What is the worst-case edge scenario or failure mode when applying ${topic}?`;
        a = `Under boundary conditions (e.g. empty inputs, cyclic dependencies, or memory overflow), lack of base-case validation leads to infinite recursion or corrupt cache reads.`;
        diff = 'HARD';
      } else {
        q = `How can you optimize space complexity for ${topic} from quadratic to linear?`;
        a = `By maintaining only the previous state row/pointers rather than storing the full historical matrix, reducing memory from O(N²) to O(N).`;
        diff = 'MEDIUM';
      }

      cards.push({
        id: `ai-fc-${Date.now()}-${i}`,
        userId,
        subjectName: sub,
        topicTitle: topic,
        question: q,
        answer: a,
        difficulty: diff,
        masteryLevel: 0,
        easeFactor: 2.5,
        repetitionIntervalDays: 1,
        nextReviewDate: new Date().toISOString().split('T')[0],
        tags: [`#${sub.replace(/\s+/g, '')}`, `#${topic.replace(/\s+/g, '')}`, '#AiGenerated'],
        isAiGenerated: true,
      });
    }

    const current = userFlashcardsDb.get(userId) || DEFAULT_DEMO_FLASHCARDS;
    const updated = [...cards, ...current];
    userFlashcardsDb.set(userId, updated);

    return cards;
  }

  static async askAiDoubt(dto: AskAiDoubtDto): Promise<AiDoubtChatMessage> {
    const q = dto.question.trim();
    const level = dto.level || 'STANDARD';
    const sub = dto.subjectName || 'General Engineering & Science';

    let content = '';
    let codeSnippet: string | undefined = undefined;
    let followUps: string[] = [];

    if (level === 'ELI5') {
      content = `Imagine you have a giant toy box and you only have a small backpack to take on a trip! 🎒 You can't fit every toy, so you check each toy's weight and how fun it is. You make smart choices step-by-step so your backpack has the most fun possible without tearing! That is the core idea of **${q}**.`;
      followUps = [
        'Can you show me a simple 3-line example?',
        'Why not just pick the biggest toy first (Greedy approach)?',
      ];
    } else if (level === 'EXAM_ADVANCED') {
      content = `### 📐 Formal Analysis & Competitive Exam Perspective (${sub})
Regarding **"${q}"**:
1. **Mathematical Invariant**: Let $S(k, w)$ denote the optimal objective value over the subproblem prefix $k$ with remaining capacity $w$.
2. **Transition Recurrence**:
   $$S(k, w) = \\max\\left(S(k-1, w),\\; V_k + S(k-1, w - W_k)\\right)$$
3. **Common GATE/Interview Trap**: Beware of fractional values vs discrete integer constraints. If values can be split, use Greedy $O(N \\log N)$; if discrete 0/1, use Dynamic Programming $O(N \\cdot W)$ which is pseudo-polynomial in input bit length.`;
      codeSnippet = `// Optimized Linear Space Implementation
vector<int> dp(W + 1, 0);
for (int i = 0; i < n; ++i) {
    for (int w = W; w >= weight[i]; --w) {
        dp[w] = max(dp[w], value[i] + dp[w - weight[i]]);
    }
}`;
      followUps = [
        'How does this differ from the Unbounded Knapsack problem?',
        'Prove why iterating backwards in the inner loop avoids duplicate item reuse.',
      ];
    } else {
      content = `Great question! Here is a structured explanation for **"${q}"**:

- **Core Concept**: In ${sub}, this represents a classic state-space exploration problem where subproblems overlap.
- **Why it matters**: Instead of brute-force checking all $2^N$ combinations (exponential time), we memorize optimal solutions to sub-states to achieve polynomial runtime.
- **Rule of Thumb**: When you see optimal substructure + overlapping subproblems, formulate a state transition table.`;
      codeSnippet = `def solve(items, capacity):
    # dp[w] stores max value achievable with capacity w
    dp = [0] * (capacity + 1)
    for weight, value in items:
        for w in range(capacity, weight - 1, -1):
            dp[w] = max(dp[w], dp[w - weight] + value)
    return dp[capacity]`;
      followUps = [
        'What is the time and space complexity breakdown?',
        'How can I identify this in a LeetCode medium/hard problem?',
      ];
    }

    return {
      id: `chat-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      level,
      suggestedFollowUps: followUps,
      codeSnippet,
    };
  }

  static async explainConcept(dto: ExplainConceptDto): Promise<ConceptExplanationResult> {
    const concept = dto.concept || 'Dynamic Programming';
    const sub = dto.subjectName || 'Computer Science';

    return {
      concept,
      subjectName: sub,
      intuitionAnalogy: `Think of ${concept} like remembering the answer to 1 + 1 + 1 + 1 + 1 = 5. If someone adds another + 1 at the end, you don't recount from zero; you instantly know 5 + 1 = 6 because you cached the previous state!`,
      formalDefinition: `${concept} is an algorithmic paradigm that solves complex problems by breaking them down into simpler subproblems, solving each subproblem once, and storing their solutions using a memory-based data structure (array, map, or matrix).`,
      coreMechanism: [
        '1. Characterize the structure of an optimal solution.',
        '2. Recursively define the value of an optimal solution.',
        '3. Compute the value of an optimal solution (Top-Down with Memoization or Bottom-Up Tabulation).',
        '4. Construct the optimal sequence of decisions from the computed table.',
      ],
      timeAndSpaceComplexity: 'Time Complexity: O(Number of States · Transitions per State) | Space: O(States)',
      commonPitfalls: [
        'Mistaking greedy choice for global optimum without proving the greedy-choice property.',
        'Iterating loops in the forward direction when items can only be used once (causes unbounded item reuse).',
        'Stack overflow in Top-Down recursion without tail-call optimization or deep recursion limits.',
      ],
      practiceQuestion: {
        question: `Given an array of integers nums and an integer target, return true if you can partition the array into two subsets such that the sum of elements in both subsets is equal.`,
        answer: `Check if totalSum is odd (if so, return False). Target is totalSum // 2. Solve as 0/1 Subset Sum DP in O(N · Target) time.`,
      },
    };
  }

  static async gradeFlashcard(
    userId: string,
    cardId: string,
    grade: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY'
  ): Promise<FlashcardItem> {
    const cards = userFlashcardsDb.get(userId) || DEFAULT_DEMO_FLASHCARDS;
    const card = cards.find((c) => c.id === cardId);

    if (!card) {
      throw new Error('Flashcard not found');
    }

    let interval = card.repetitionIntervalDays;
    let ease = card.easeFactor;
    let mastery = card.masteryLevel;

    if (grade === 'AGAIN') {
      interval = 1;
      ease = Math.max(1.3, ease - 0.2);
      mastery = Math.max(0, mastery - 1);
    } else if (grade === 'HARD') {
      interval = Math.max(1, Math.round(interval * 1.2));
      ease = Math.max(1.3, ease - 0.15);
    } else if (grade === 'GOOD') {
      interval = Math.max(2, Math.round(interval * ease));
      mastery = Math.min(5, mastery + 1);
    } else if (grade === 'EASY') {
      interval = Math.max(4, Math.round(interval * ease * 1.3));
      ease = ease + 0.15;
      mastery = Math.min(5, mastery + 2);
    }

    card.repetitionIntervalDays = interval;
    card.easeFactor = ease;
    card.masteryLevel = mastery;
    card.lastReviewedAt = new Date().toISOString();
    card.nextReviewDate = new Date(Date.now() + interval * 86400000).toISOString().split('T')[0];

    userFlashcardsDb.set(userId, cards);
    return card;
  }
}
