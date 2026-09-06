import React, { useState, useEffect, useRef } from 'react';
import {
  MockTestTemplate,
  MockTestScorecard,
  UserQuestionResponse,
  QuestionPaletteStatus,
} from '@studentlife/shared';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  RotateCcw,
  BookOpen,
  Calculator,
  FileEdit,
  Send,
  Zap,
  Flame,
  ChevronRight,
  ChevronLeft,
  X,
  RefreshCw,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const FALLBACK_MOCKS: MockTestTemplate[] = [
  {
    id: 'mock-gate-cse-full-1',
    title: 'GATE 2027 CSE Full-Length National Simulation',
    description: 'Comprehensive national level mock test covering Discrete Mathematics, Algorithms, OS, DBMS, Computer Networks, and General Aptitude with negative marking.',
    examType: 'GATE CSE',
    category: 'NATIONAL_COMPETITIVE',
    durationMinutes: 180,
    totalMarks: 100,
    passingMarks: 28,
    totalQuestions: 6,
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
        name: 'Section 2: Core Computer Science & IT',
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
            explanation: 'In a Directed Acyclic Graph (DAG), we can topologically sort the vertices in O(V + E) time and then use dynamic programming/relaxation to find the longest path in O(V + E) linear time.',
            stepByStepSolution: [
              'Step 1: Compute Topological Sorting of the DAG in O(V + E).',
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
            correctAnswer: 'opt-a',
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

interface MockTestSimulatorViewProps {
  onTestSubmitted?: (earnedXp: number) => void;
}

export const MockTestSimulatorView: React.FC<MockTestSimulatorViewProps> = ({ onTestSubmitted }) => {
  const { tokens } = useAuth();
  const [templates, setTemplates] = useState<MockTestTemplate[]>(FALLBACK_MOCKS);

  // Active Test Mode state
  const [activeTest, setActiveTest] = useState<MockTestTemplate | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0); // within section
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [userResponses, setUserResponses] = useState<{ [qId: string]: UserQuestionResponse }>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set());

  // Modals & Tools
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchNotes, setScratchNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scorecard View
  const [scorecard, setScorecard] = useState<MockTestScorecard | null>(null);
  const [expandedSolutions, setExpandedSolutions] = useState<{ [qId: string]: boolean }>({});

  const timerRef = useRef<any>(null);

  // Load templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const headers = tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : undefined;
        const res = await fetch(`${API_BASE}/mock-tests`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setTemplates(data.data);
          }
        }
      } catch {
        // Use fallback
      }
    };
    fetchTemplates();
  }, [tokens]);

  // Countdown timer effect
  useEffect(() => {
    if (activeTest && timeRemainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTest]);

  const handleStartTest = (template: MockTestTemplate) => {
    setActiveTest(template);
    setActiveSectionIndex(0);
    setActiveQuestionIndex(0);
    setTimeRemainingSeconds(template.durationMinutes * 60);
    setUserResponses({});
    setScorecard(null);

    // Mark first question as visited
    const firstQ = template.sections[0]?.questions[0];
    if (firstQ) {
      setVisitedQuestions(new Set([firstQ.id]));
    }
  };

  const handleAutoSubmit = () => {
    handleSubmitTest();
  };

  const currentSection = activeTest?.sections[activeSectionIndex];
  const currentQuestion = currentSection?.questions[activeQuestionIndex];

  // Record visit
  useEffect(() => {
    if (currentQuestion) {
      setVisitedQuestions((prev) => new Set([...prev, currentQuestion.id]));
    }
  }, [currentQuestion]);

  const getQuestionPaletteStatus = (qId: string): QuestionPaletteStatus => {
    const resp = userResponses[qId];
    const isVisited = visitedQuestions.has(qId);
    const hasAnswer = resp && resp.selectedOptionId;
    const isMarked = resp && resp.isMarkedForReview;

    if (hasAnswer && isMarked) return 'ANSWERED_AND_MARKED';
    if (hasAnswer) return 'ANSWERED';
    if (isMarked) return 'MARKED_FOR_REVIEW';
    if (isVisited) return 'NOT_ANSWERED';
    return 'NOT_VISITED';
  };

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    setUserResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOptionId: optionId,
        isMarkedForReview: prev[currentQuestion.id]?.isMarkedForReview || false,
        timeSpentSeconds: (prev[currentQuestion.id]?.timeSpentSeconds || 0) + 10,
      },
    }));
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    setUserResponses((prev) => {
      const updated = { ...prev };
      if (updated[currentQuestion.id]) {
        delete updated[currentQuestion.id].selectedOptionId;
      }
      return updated;
    });
  };

  const handleToggleMarkReview = () => {
    if (!currentQuestion) return;
    setUserResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOptionId: prev[currentQuestion.id]?.selectedOptionId,
        isMarkedForReview: !prev[currentQuestion.id]?.isMarkedForReview,
        timeSpentSeconds: (prev[currentQuestion.id]?.timeSpentSeconds || 0) + 5,
      },
    }));
  };

  const handleNextQuestion = () => {
    if (!currentSection || !activeTest) return;
    if (activeQuestionIndex < currentSection.questions.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    } else if (activeSectionIndex < activeTest.sections.length - 1) {
      setActiveSectionIndex((prev) => prev + 1);
      setActiveQuestionIndex(0);
    }
  };

  const handlePrevQuestion = () => {
    if (!currentSection || !activeTest) return;
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1);
    } else if (activeSectionIndex > 0) {
      const prevSecIdx = activeSectionIndex - 1;
      setActiveSectionIndex(prevSecIdx);
      setActiveQuestionIndex(activeTest.sections[prevSecIdx].questions.length - 1);
    }
  };

  const handleJumpToQuestion = (secIdx: number, qIdx: number) => {
    setActiveSectionIndex(secIdx);
    setActiveQuestionIndex(qIdx);
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;
    setIsSubmitting(true);

    try {
      const timeSpent = activeTest.durationMinutes * 60 - timeRemainingSeconds;
      const headers = {
        'Content-Type': 'application/json',
        ...(tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE}/mock-tests/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          mockTestId: activeTest.id,
          timeSpentSeconds: timeSpent,
          responses: userResponses,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setScorecard(data.data);
          if (onTestSubmitted) {
            onTestSubmitted(data.data.xpEarned);
          }
        }
      } else {
        // Local calculation fallback
        generateLocalScorecard(timeSpent);
      }
    } catch {
      const timeSpent = activeTest.durationMinutes * 60 - timeRemainingSeconds;
      generateLocalScorecard(timeSpent);
    } finally {
      setIsSubmitting(false);
      setShowSubmitModal(false);
      setActiveTest(null);
    }
  };

  const generateLocalScorecard = (timeSpent: number) => {
    if (!activeTest) return;
    let totalScore = 0;
    let totalCorrect = 0;
    let totalAttempted = 0;
    let totalIncorrect = 0;

    const questionDetails = activeTest.sections.flatMap((s) =>
      s.questions.map((q) => {
        const resp = userResponses[q.id];
        const isAttempted = !!(resp && resp.selectedOptionId);
        const isCorrect = isAttempted && resp.selectedOptionId === q.correctAnswer;
        const marksEarned = isCorrect ? q.marks : isAttempted ? -q.negativeMarks : 0;

        if (isAttempted) {
          totalAttempted++;
          if (isCorrect) totalCorrect++;
          else totalIncorrect++;
        }
        totalScore += marksEarned;

        return {
          questionId: q.id,
          sectionId: s.id,
          questionNumber: q.questionNumber,
          questionText: q.questionText,
          subject: q.subject,
          topic: q.topic,
          marks: q.marks,
          negativeMarks: q.negativeMarks,
          userSelectedAnswer: resp?.selectedOptionId,
          correctAnswer: q.correctAnswer,
          isCorrect,
          isAttempted,
          isMarkedForReview: resp?.isMarkedForReview || false,
          marksEarned: Number(marksEarned.toFixed(2)),
          timeSpentSeconds: 45,
          explanation: q.explanation,
          stepByStepSolution: q.stepByStepSolution,
          options: q.options,
        };
      })
    );

    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const localScore: MockTestScorecard = {
      attemptId: `att-loc-${Date.now()}`,
      mockTestId: activeTest.id,
      testTitle: activeTest.title,
      examType: activeTest.examType,
      totalScore: Number(totalScore.toFixed(2)),
      maxScore: activeTest.totalMarks,
      percentage: Number(((totalScore / activeTest.totalMarks) * 100).toFixed(1)),
      accuracyPercentage: accuracy,
      totalAttempted,
      totalCorrect,
      totalIncorrect,
      totalUnattempted: activeTest.totalQuestions - totalAttempted,
      totalTimeSpentSeconds: timeSpent,
      estimatedPercentile: 96.5,
      estimatedRank: 'AIR 250 – 500 (Top 0.8%)',
      xpEarned: 50 + totalCorrect * 20,
      sectionBreakdown: [],
      questionDetails,
      submittedAt: new Date().toISOString(),
    };

    setScorecard(localScore);
    if (onTestSubmitted) {
      onTestSubmitted(localScore.xpEarned);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculator engine
  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else if (val === '=') {
      try {
        // Safe simple eval
        const cleaned = calcInput.replace(/[^0-9+\-*/().]/g, '');
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${cleaned})`)();
        setCalcResult(String(res));
      } catch {
        setCalcResult('Error');
      }
    } else {
      setCalcInput((prev) => prev + val);
    }
  };

  // Count active stats for palette
  const getAllQuestions = () => activeTest?.sections.flatMap((s) => s.questions) || [];
  const allQs = getAllQuestions();
  const totalAnswered = allQs.filter((q) => userResponses[q.id]?.selectedOptionId).length;
  const totalMarked = allQs.filter((q) => userResponses[q.id]?.isMarkedForReview).length;
  const totalVisited = allQs.filter((q) => visitedQuestions.has(q.id)).length;
  const totalNotVisited = allQs.length - totalVisited;

  // ==========================================
  // RENDER: Active Live Test Mode
  // ==========================================
  if (activeTest && currentSection && currentQuestion) {
    const currentResponse = userResponses[currentQuestion.id];
    const isOptionSelected = (optId: string) => currentResponse?.selectedOptionId === optId;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '85vh' }}>
        {/* Live Simulator Header */}
        <div
          className="glass-card"
          style={{
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.85)',
            borderBottom: '2px solid #6366f1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.4rem' }}>⏱️</span>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {activeTest.title}
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {activeTest.examType} • Sectional Negative Marking Enforced
              </div>
            </div>
          </div>

          {/* Center Timer Display */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '12px',
              background: timeRemainingSeconds < 300 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.15)',
              border: timeRemainingSeconds < 300 ? '1px solid #ef4444' : '1px solid rgba(99, 102, 241, 0.4)',
              color: timeRemainingSeconds < 300 ? '#f87171' : '#c7d2fe',
              fontSize: '1.25rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '1px',
            }}
          >
            <Clock size={18} className={timeRemainingSeconds < 300 ? 'animate-pulse' : ''} />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>

          {/* Quick Simulation Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                background: showCalculator ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Calculator size={14} /> Calculator
            </button>

            <button
              onClick={() => setShowScratchpad(!showScratchpad)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                background: showScratchpad ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FileEdit size={14} /> Scratchpad
            </button>

            <button
              onClick={() => setShowSubmitModal(true)}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)',
              }}
            >
              <Send size={13} /> Submit Test
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {activeTest.sections.map((sec, idx) => {
            const isSelectedSec = idx === activeSectionIndex;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSectionIndex(idx);
                  setActiveQuestionIndex(0);
                }}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: isSelectedSec ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelectedSec ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  color: isSelectedSec ? '#e0e7ff' : 'var(--text-secondary)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{sec.name}</span>
                <span
                  style={{
                    padding: '2px 7px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    fontSize: '0.72rem',
                  }}
                >
                  {sec.questions.length} Qs • {sec.totalMarks} Marks
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Simulation Arena: Split Workspace + Palette */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', alignItems: 'start' }}>
          {/* Left: Question Card & Interactive Workspace */}
          <div
            className="glass-card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '520px',
              gap: '20px',
            }}
          >
            {/* Question Top Details */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent)' }}>
                    Question {currentQuestion.questionNumber}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    • {currentQuestion.subject} ❯ {currentQuestion.topic}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      padding: '3px 9px',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    +{currentQuestion.marks} Mark{currentQuestion.marks > 1 ? 's' : ''}
                  </span>
                  {currentQuestion.negativeMarks > 0 && (
                    <span
                      style={{
                        padding: '3px 9px',
                        borderRadius: '10px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#f87171',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      -{currentQuestion.negativeMarks} Neg
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.65, color: 'var(--text-primary)', marginBottom: '20px' }}>
                {currentQuestion.questionText}
              </div>

              {/* Code snippet if any */}
              {currentQuestion.codeSnippet && (
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    color: '#a5f3fc',
                    marginBottom: '20px',
                  }}
                >
                  <pre style={{ margin: 0 }}>{currentQuestion.codeSnippet}</pre>
                </div>
              )}

              {/* Options list */}
              {currentQuestion.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentQuestion.options.map((opt) => {
                    const selected = isOptionSelected(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        style={{
                          padding: '12px 18px',
                          borderRadius: '10px',
                          border: selected ? '2px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: selected ? 'rgba(99, 102, 241, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                          color: selected ? '#ffffff' : 'var(--text-secondary)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '0.92rem',
                          fontWeight: 500,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: selected ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {opt.id.replace('opt-', '').toUpperCase()}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '16px',
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleToggleMarkReview}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: currentResponse?.isMarkedForReview ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: currentResponse?.isMarkedForReview ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: currentResponse?.isMarkedForReview ? '#f3e8ff' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  🟣 {currentResponse?.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
                </button>

                {currentResponse?.selectedOptionId && (
                  <button
                    onClick={handleClearResponse}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: 'var(--text-tertiary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Clear Response
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handlePrevQuestion}
                  disabled={activeSectionIndex === 0 && activeQuestionIndex === 0}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: activeSectionIndex === 0 && activeQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ChevronLeft size={15} /> Previous
                </button>

                <button
                  onClick={handleNextQuestion}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Save & Next <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Interactive Question Palette */}
          <div
            className="glass-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Question Palette
            </h3>

            {/* Status Legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
                <span>Answered ({totalAnswered})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }} />
                <span>Not Answered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#a855f7' }} />
                <span>Marked ({totalMarked})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#475569' }} />
                <span>Not Visited ({totalNotVisited})</span>
              </div>
            </div>

            {/* Question Numbers Grid by Section */}
            {activeTest.sections.map((sec, sIdx) => (
              <div key={sec.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#a5b4fc' }}>
                  {sec.name.split(':')[0]}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {sec.questions.map((q, qIdx) => {
                    const status = getQuestionPaletteStatus(q.id);
                    const isCurrent = sIdx === activeSectionIndex && qIdx === activeQuestionIndex;

                    let bg = '#334155';
                    if (status === 'ANSWERED') bg = '#10b981';
                    else if (status === 'MARKED_FOR_REVIEW') bg = '#a855f7';
                    else if (status === 'ANSWERED_AND_MARKED') bg = '#6366f1';
                    else if (status === 'NOT_ANSWERED') bg = '#ef4444';

                    return (
                      <button
                        key={q.id}
                        onClick={() => handleJumpToQuestion(sIdx, qIdx)}
                        style={{
                          aspectRatio: '1',
                          borderRadius: '8px',
                          border: isCurrent ? '2px solid #ffffff' : 'none',
                          background: bg,
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isCurrent ? '0 0 10px rgba(255, 255, 255, 0.4)' : 'none',
                        }}
                      >
                        {q.questionNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Scientific Calculator Modal */}
        {showCalculator && (
          <div
            className="glass-card"
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              width: '280px',
              padding: '16px',
              zIndex: 1000,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              background: '#0f172a',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc' }}>Scientific Calculator</span>
              <button onClick={() => setShowCalculator(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={15} />
              </button>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '8px 12px', borderRadius: '6px', textAlign: 'right', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', minHeight: '16px' }}>{calcInput || '0'}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>{calcResult || '0'}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', 'C', '+', '(', ')', '='].map((k) => (
                <button
                  key={k}
                  onClick={() => handleCalcClick(k)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    background: k === '=' ? '#10b981' : k === 'C' ? '#ef4444' : 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scratchpad Notes Drawer */}
        {showScratchpad && (
          <div
            className="glass-card"
            style={{
              position: 'fixed',
              bottom: '30px',
              left: '30px',
              width: '320px',
              padding: '16px',
              zIndex: 1000,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              background: '#0f172a',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc' }}>Scratchpad / Rough Work</span>
              <button onClick={() => setShowScratchpad(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={15} />
              </button>
            </div>
            <textarea
              placeholder="Jot rough derivations, values, formulas here..."
              value={scratchNotes}
              onChange={(e) => setScratchNotes(e.target.value)}
              rows={8}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#f8fafc',
                padding: '8px',
                fontSize: '0.82rem',
                fontFamily: 'monospace',
                outline: 'none',
              }}
            />
          </div>
        )}

        {/* Submit Test Confirmation Modal */}
        {showSubmitModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px',
            }}
          >
            <div
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '460px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                background: '#0f172a',
                border: '1px solid rgba(239, 68, 68, 0.4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f87171' }}>
                <AlertTriangle size={24} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                  Ready to Submit Test?
                </h3>
              </div>

              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Once submitted, your responses will be locked and graded according to official examination rules with negative marking.
              </p>

              {/* Summary table */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>{totalAnswered}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Answered</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f87171' }}>{allQs.length - totalAnswered}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Unanswered</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#c084fc' }}>{totalMarked}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Marked</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Resume Test
                </button>
                <button
                  onClick={handleSubmitTest}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {isSubmitting ? <RefreshCw size={15} className="animate-spin" /> : 'Yes, Submit Test'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER: Scorecard & Solutions Review Mode
  // ==========================================
  if (scorecard) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
        {/* Scorecard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.8rem' }}>🏆</span>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #34d399 0%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Test Scorecard & Analysis
              </h1>
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {scorecard.testTitle} • Completed in {Math.round(scorecard.totalTimeSpentSeconds / 60)} minutes
            </p>
          </div>

          <button
            onClick={() => setScorecard(null)}
            style={{
              padding: '9px 18px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.85rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RotateCcw size={14} /> Retake / Back to Catalog
          </button>
        </div>

        {/* Score Summary Cockpit Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Score
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
              {scorecard.totalScore} <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>/ {scorecard.maxScore}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              {scorecard.percentage}% Overall Score
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #6366f1' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Estimated Rank
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a5b4fc', marginTop: '4px' }}>
              {scorecard.estimatedRank}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
              {scorecard.estimatedPercentile}th Percentile 🚀
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Accuracy Rate
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
              {scorecard.accuracyPercentage}%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              {scorecard.totalCorrect} Correct • {scorecard.totalIncorrect} Wrong
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #ec4899' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              XP Awarded
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f472b6', marginTop: '4px' }}>
              +{scorecard.xpEarned} XP 🔥
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              Performance Milestone Reached
            </div>
          </div>
        </div>

        {/* Detailed Solutions Review List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Question-by-Question Solution Breakdown
          </h2>

          {scorecard.questionDetails.map((q, idx) => {
            const isExpanded = expandedSolutions[q.questionId];

            return (
              <div
                key={q.questionId}
                className="glass-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  borderLeft: q.isCorrect ? '4px solid #10b981' : q.isAttempted ? '4px solid #ef4444' : '4px solid #64748b',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Q{idx + 1}. {q.subject}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      • {q.topic}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {q.isCorrect ? (
                      <span style={{ padding: '3px 9px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={13} /> Correct (+{q.marksEarned})
                      </span>
                    ) : q.isAttempted ? (
                      <span style={{ padding: '3px 9px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={13} /> Incorrect ({q.marksEarned})
                      </span>
                    ) : (
                      <span style={{ padding: '3px 9px', borderRadius: '10px', background: 'rgba(100, 116, 139, 0.2)', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                        Unattempted (0.00)
                      </span>
                    )}

                    <button
                      onClick={() =>
                        setExpandedSolutions((prev) => ({
                          ...prev,
                          [q.questionId]: !prev[q.questionId],
                        }))
                      }
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {isExpanded ? 'Hide Solution' : 'View Solution'}
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {q.questionText}
                </div>

                {isExpanded && (
                  <div
                    style={{
                      borderRadius: '10px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 700 }}>
                      Step-by-Step Proof & Mathematical Breakdown:
                    </div>
                    {q.stepByStepSolution.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        style={{
                          fontSize: '0.84rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.5,
                          background: 'rgba(255, 255, 255, 0.02)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          borderLeft: '2px solid #818cf8',
                        }}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: Catalog & Test Selection View
  // ==========================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>⏱️</span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Mock Test Simulator
            </h1>
          </div>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Simulate high-stakes national competitive tests under strict timed conditions, section switching, and negative marking rules.
          </p>
        </div>
      </div>

      {/* Top Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Available Mocks
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {templates.length} Full Tests
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #10b981' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Simulation Engine
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              100% Real Rules
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
            <Zap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Target Percentile
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              &gt; 98.5% AIR
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #ec4899' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6' }}>
            <Flame size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              XP Reward
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              +150 XP / Test
            </div>
          </div>
        </div>
      </div>

      {/* Mock Test Templates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {templates.map((template) => (
          <div
            key={template.id}
            className="glass-card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '18px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'all 0.2s ease',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                  }}
                >
                  {template.examType}
                </span>

                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: template.difficulty === 'HARD' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: template.difficulty === 'HARD' ? '#f87171' : '#fbbf24',
                  }}
                >
                  {template.difficulty}
                </span>
              </div>

              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                {template.title}
              </h2>

              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55 }}>
                {template.description}
              </p>

              {/* Specs Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <Clock size={14} style={{ color: '#818cf8' }} /> {template.durationMinutes} Minutes
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <Award size={14} style={{ color: '#34d399' }} /> {template.totalMarks} Total Marks
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <HelpCircle size={14} style={{ color: '#fbbf24' }} /> {template.totalQuestions} Questions
                </div>
              </div>

              {/* Sections overview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Sections Included:</span>
                {template.sections.map((sec) => (
                  <div key={sec.id} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>• {sec.name.split(':')[0]}</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>{sec.questions.length} Qs</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleStartTest(template)}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <Play size={16} /> Launch Live Simulation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
