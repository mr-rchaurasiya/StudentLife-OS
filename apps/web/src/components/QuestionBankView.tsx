import React, { useState, useEffect } from 'react';
import {
  QuestionBankItem,
  QuestionBankStats,
  QuestionSubmitResultDto,
} from '@studentlife/shared';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  Award,
  Zap,
  Flame,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  RefreshCw,
  Clock,
  Code2,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const FALLBACK_QUESTIONS: QuestionBankItem[] = [
  {
    id: 'qb-gate-2024-algo-1',
    examType: 'GATE CSE',
    year: 2024,
    subject: 'Algorithms & Data Structures',
    topic: 'Dynamic Programming & Recurrence',
    type: 'SINGLE_MCQ',
    difficulty: 'MEDIUM',
    marks: 2,
    negativeMarks: 0.66,
    questionText: 'Consider the recurrence relation T(n) = 2T(n/2) + n / log(n) for n > 2 with T(2) = 1. Which of the following asymptotic bounds holds true for T(n)?',
    options: [
      { id: 'opt-a', text: 'Θ(n log log n)' },
      { id: 'opt-b', text: 'Θ(n log n)' },
      { id: 'opt-c', text: 'Θ(n²)' },
      { id: 'opt-d', text: 'Θ(n)' },
    ],
    correctAnswer: 'opt-a',
    explanation: 'Using the Master Theorem extension or substitution: T(n)/n = T(n/2)/(n/2) + 1/log(n). Let k = log n, S(k) = S(k-1) + 1/k. The harmonic sum of 1/k yields log(log n). Hence T(n) = Θ(n log log n).',
    stepByStepSolution: [
      'Step 1: Normalize the recurrence by dividing both sides by n: T(n)/n = T(n/2)/(n/2) + 1/log n.',
      'Step 2: Let G(n) = T(n)/n. Then G(n) = G(n/2) + 1/log n.',
      'Step 3: Substitute n = 2^k, yielding H(k) = H(k-1) + 1/k.',
      'Step 4: The summation Σ (1/i) from i=1 to k equals the Harmonic series ~ ln(k) = ln(log n).',
      'Step 5: Multiplying back by n gives T(n) = Θ(n · log(log n)).',
    ],
    keyFormula: 'T(n) = aT(n/b) + n^(log_b a) / log^k(n) ⇒ Θ(n^(log_b a) · log(log n)) for k = -1',
    tags: ['Master Theorem', 'Recurrences', 'GATE 2024', 'Complexity Analysis'],
    isBookmarked: true,
    totalAttemptsCount: 3420,
    globalAccuracyRate: 42.5,
  },
  {
    id: 'qb-gate-2023-os-1',
    examType: 'GATE CSE',
    year: 2023,
    subject: 'Operating Systems',
    topic: 'Virtual Memory & Page Replacement',
    type: 'SINGLE_MCQ',
    difficulty: 'HARD',
    marks: 2,
    negativeMarks: 0.66,
    questionText: 'A system uses a 32-bit virtual address and 4 KB page size. Each page table entry occupies 4 bytes. If an inverted page table is used instead of a 2-level hierarchical page table, and physical RAM is 512 MB, what is the number of entries in the inverted page table?',
    options: [
      { id: 'opt-a', text: '1,048,576 entries (2²⁰)' },
      { id: 'opt-b', text: '131,072 entries (2¹⁷)' },
      { id: 'opt-c', text: '65,536 entries (2¹⁶)' },
      { id: 'opt-d', text: '262,144 entries (2¹⁸)' },
    ],
    correctAnswer: 'opt-b',
    explanation: 'An inverted page table has exactly one entry for each physical frame of main memory. Physical Memory = 512 MB = 2²⁹ bytes. Frame size = Page size = 4 KB = 2¹² bytes. Number of frames = 2²⁹ / 2¹² = 2¹⁷ = 131,072 entries.',
    stepByStepSolution: [
      'Step 1: Inverted page table size depends exclusively on Physical Memory (RAM), not virtual address space.',
      'Step 2: RAM size = 512 MB = 512 × 1024 × 1024 bytes = 2²⁹ bytes.',
      'Step 3: Page / Frame size = 4 KB = 4096 bytes = 2¹² bytes.',
      'Step 4: Total physical frames = Physical Memory / Frame Size = 2²⁹ / 2¹² = 2¹⁷ frames.',
      'Step 5: Therefore, inverted page table contains 2¹⁷ = 131,072 entries.',
    ],
    keyFormula: 'Entries in Inverted Page Table = Physical RAM Size / Page Size',
    tags: ['Virtual Memory', 'Inverted Page Table', 'GATE 2023', 'Hardware Paging'],
    isBookmarked: false,
    totalAttemptsCount: 4890,
    globalAccuracyRate: 58.1,
  },
  {
    id: 'qb-gate-2023-cn-1',
    examType: 'GATE CSE',
    year: 2023,
    subject: 'Computer Networks',
    topic: 'TCP Congestion Control & Sliding Window',
    type: 'SINGLE_MCQ',
    difficulty: 'MEDIUM',
    marks: 2,
    negativeMarks: 0.66,
    questionText: 'In a TCP connection, the current Congestion Window (cwnd) is 32 KB and the Slow Start Threshold (ssthresh) is 16 KB. If a timeout occurs at Round Trip Time (RTT) t, what will be the values of ssthresh and cwnd immediately after the timeout (at RTT t+1)?',
    options: [
      { id: 'opt-a', text: 'ssthresh = 16 KB, cwnd = 1 MSS (1 KB)' },
      { id: 'opt-b', text: 'ssthresh = 16 KB, cwnd = 16 KB' },
      { id: 'opt-c', text: 'ssthresh = 8 KB, cwnd = 1 MSS (1 KB)' },
      { id: 'opt-d', text: 'ssthresh = 8 KB, cwnd = 8 KB' },
    ],
    correctAnswer: 'opt-a',
    explanation: 'When a TCP Timeout occurs: ssthresh is set to max(cwnd/2, 2 MSS) = 32 KB / 2 = 16 KB. cwnd is collapsed back to 1 MSS (1 KB) and slow start resumes.',
    stepByStepSolution: [
      'Step 1: Identify event type: Timeout vs 3 Duplicate ACKs. For Timeout, severe network congestion is inferred.',
      'Step 2: Compute new ssthresh = cwnd / 2 = 32 KB / 2 = 16 KB.',
      'Step 3: Reset cwnd to 1 MSS (typically 1 KB / 1 segment).',
      'Step 4: Hence, ssthresh = 16 KB and cwnd = 1 KB.',
    ],
    keyFormula: 'Timeout Reaction: ssthresh ← cwnd / 2, cwnd ← 1 MSS',
    tags: ['TCP', 'Congestion Window', 'Slow Start', 'GATE 2023'],
    isBookmarked: true,
    totalAttemptsCount: 5120,
    globalAccuracyRate: 67.4,
  },
  {
    id: 'qb-gate-2022-dbms-1',
    examType: 'GATE CSE',
    year: 2022,
    subject: 'Database Management Systems',
    topic: 'Normalization & Functional Dependencies',
    type: 'SINGLE_MCQ',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.33,
    questionText: 'Given relation R(A, B, C, D, E) with Functional Dependencies F = { A → BC, CD → E, B → D, E → A }. What is the highest normal form satisfied by relation R?',
    options: [
      { id: 'opt-a', text: '1NF only' },
      { id: 'opt-b', text: '2NF' },
      { id: 'opt-c', text: '3NF' },
      { id: 'opt-d', text: 'BCNF' },
    ],
    correctAnswer: 'opt-c',
    explanation: 'Candidate keys are A, E, BC, and CD. Since every attribute is part of some candidate key (prime attribute), all non-trivial dependencies satisfy the 3NF condition (RHS is prime). However, in B → D, B is not a superkey, so BCNF is violated.',
    stepByStepSolution: [
      'Step 1: Find candidate keys: A+ = ABCDE, E+ = EABCD, (BC)+ = BCDE A = ABCDE, (CD)+ = CDEAB. Candidate keys: {A, E, BC, CD}.',
      'Step 2: All attributes {A, B, C, D, E} are prime attributes!',
      'Step 3: Therefore, every functional dependency satisfies the 3NF condition (RHS is prime).',
      'Step 4: In B → D, B is not a superkey, which violates BCNF.',
      'Step 5: Hence, highest normal form is 3NF.',
    ],
    keyFormula: '3NF Rule: For X → Y, either X is Super Key OR Y is a Prime Attribute',
    tags: ['Normalization', '3NF vs BCNF', 'Candidate Keys', 'GATE 2022'],
    isBookmarked: false,
    totalAttemptsCount: 6200,
    globalAccuracyRate: 71.8,
  },
  {
    id: 'qb-univ-2024-math-1',
    examType: 'University Finals',
    year: 2024,
    subject: 'Engineering Mathematics',
    topic: 'Linear Algebra & Eigenvalues',
    type: 'SINGLE_MCQ',
    difficulty: 'MEDIUM',
    marks: 2,
    negativeMarks: 0,
    questionText: 'Let matrix M = [[2, 1], [1, 2]]. What are the eigenvalues and the corresponding trace & determinant of M⁴?',
    options: [
      { id: 'opt-a', text: 'Eigenvalues: 81 and 1; Trace = 82; Det = 81' },
      { id: 'opt-b', text: 'Eigenvalues: 16 and 1; Trace = 17; Det = 16' },
      { id: 'opt-c', text: 'Eigenvalues: 81 and 16; Trace = 97; Det = 1296' },
      { id: 'opt-d', text: 'Eigenvalues: 3 and 1; Trace = 4; Det = 3' },
    ],
    correctAnswer: 'opt-a',
    explanation: 'Eigenvalues of M are roots of (2-λ)² - 1 = 0 => λ₁ = 3, λ₂ = 1. By Spectral Mapping Theorem, eigenvalues of M⁴ are 3⁴ = 81 and 1⁴ = 1. Trace(M⁴) = 81 + 1 = 82, Det(M⁴) = 81 × 1 = 81.',
    stepByStepSolution: [
      'Step 1: Find characteristic polynomial: det(M - λI) = (2-λ)² - 1 = λ² - 4λ + 3 = 0.',
      'Step 2: Factoring yields (λ - 3)(λ - 1) = 0 ⇒ Eigenvalues λ₁ = 3, λ₂ = 1.',
      'Step 3: If λ is eigenvalue of M, then λ⁴ is eigenvalue of M⁴. Thus λ₁⁴ = 81, λ₂⁴ = 1.',
      'Step 4: Trace = sum of eigenvalues = 81 + 1 = 82.',
      'Step 5: Determinant = product of eigenvalues = 81 × 1 = 81.',
    ],
    keyFormula: 'Eigenvalues of A^k are (λ_i)^k. Trace = Σ λ_i, Det = Π λ_i',
    tags: ['Linear Algebra', 'Eigenvalues', 'Matrix Powers', 'University Finals'],
    isBookmarked: true,
    totalAttemptsCount: 2980,
    globalAccuracyRate: 80.2,
  },
  {
    id: 'qb-univ-2024-dsa-2',
    examType: 'University Finals',
    year: 2024,
    subject: 'Algorithms & Data Structures',
    topic: 'Graph Theory & Shortest Path',
    type: 'SINGLE_MCQ',
    difficulty: 'HARD',
    marks: 2,
    negativeMarks: 0,
    questionText: 'What is the tightest time complexity of Dijkstra\'s algorithm when implemented using a Fibonacci Heap on a directed graph with V vertices and E edges?',
    options: [
      { id: 'opt-a', text: 'O(E + V log V)' },
      { id: 'opt-b', text: 'O((V + E) log V)' },
      { id: 'opt-c', text: 'O(V²)' },
      { id: 'opt-d', text: 'O(E log V)' },
    ],
    correctAnswer: 'opt-a',
    explanation: 'With a Fibonacci heap, Extract-Min takes amortized O(log V) time for V vertices (V log V), and Decrease-Key takes amortized O(1) time for E edges (E × 1 = E). Total time is O(E + V log V).',
    stepByStepSolution: [
      'Step 1: Dijkstra performs V Extract-Min operations and at most E Decrease-Key operations.',
      'Step 2: Binary Heap: Extract-Min = O(log V), Decrease-Key = O(log V) ⇒ O((V + E) log V).',
      'Step 3: Fibonacci Heap: Extract-Min = O(log V) amortized, Decrease-Key = O(1) amortized.',
      'Step 4: Total Time = V · O(log V) + E · O(1) = O(E + V log V).',
    ],
    keyFormula: 'Fibonacci Heap Dijkstra: T(V, E) = O(E + V log V)',
    tags: ['Dijkstra', 'Fibonacci Heap', 'Graph Algorithms', 'Amortized Complexity'],
    isBookmarked: false,
    totalAttemptsCount: 4120,
    globalAccuracyRate: 51.3,
  },
];

export const QuestionBankView: React.FC = () => {
  const { tokens } = useAuth();
  const [questions, setQuestions] = useState<QuestionBankItem[]>(FALLBACK_QUESTIONS);
  const [stats, setStats] = useState<QuestionBankStats>({
    totalQuestions: 6,
    totalSolved: 14,
    accuracyRate: 78,
    pyqsMastered: 11,
    bookmarkedCount: 3,
    streakDays: 6,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [selectedExam, setSelectedExam] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [unsolvedOnly, setUnsolvedOnly] = useState(false);

  // State for user interactions
  const [userSelections, setUserSelections] = useState<{ [qId: string]: string }>({});
  const [submissionResults, setSubmissionResults] = useState<{ [qId: string]: QuestionSubmitResultDto }>({});
  const [expandedSolutions, setExpandedSolutions] = useState<{ [qId: string]: boolean }>({});
  const [submittingQId, setSubmittingQId] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : undefined;

      const params = new URLSearchParams();
      if (selectedExam !== 'ALL') params.append('examType', selectedExam);
      if (selectedSubject !== 'ALL') params.append('subject', selectedSubject);
      if (selectedDifficulty !== 'ALL') params.append('difficulty', selectedDifficulty);
      if (selectedYear !== 'ALL') params.append('year', selectedYear);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (bookmarkedOnly) params.append('bookmarkedOnly', 'true');
      if (unsolvedOnly) params.append('unsolvedOnly', 'true');

      const [resQuestions, resStats] = await Promise.all([
        fetch(`${API_BASE}/question-bank?${params.toString()}`, { headers }),
        fetch(`${API_BASE}/question-bank/stats`, { headers }),
      ]);

      if (resQuestions.ok) {
        const data = await resQuestions.json();
        if (data.success && Array.isArray(data.data)) {
          setQuestions(data.data);
        }
      }

      if (resStats.ok) {
        const statsData = await resStats.json();
        if (statsData.success && statsData.data) {
          setStats(statsData.data);
        }
      }
    } catch {
      // Keep fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedExam, selectedSubject, selectedDifficulty, selectedYear, bookmarkedOnly, unsolvedOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submissionResults[questionId]) return; // Already solved
    setUserSelections((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitAnswer = async (question: QuestionBankItem) => {
    const selected = userSelections[question.id];
    if (!selected) return;

    setSubmittingQId(question.id);
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE}/question-bank/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          questionId: question.id,
          selectedAnswer: selected,
          timeTakenSeconds: 45,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setSubmissionResults((prev) => ({
            ...prev,
            [question.id]: data.data,
          }));
          setExpandedSolutions((prev) => ({
            ...prev,
            [question.id]: true,
          }));
          // Update stats
          setStats((prev) => ({
            ...prev,
            totalSolved: prev.totalSolved + 1,
            pyqsMastered: data.data.isCorrect ? prev.pyqsMastered + 1 : prev.pyqsMastered,
          }));
        }
      } else {
        // Fallback local check
        const isCorrect = selected === question.correctAnswer;
        const localResult: QuestionSubmitResultDto = {
          questionId: question.id,
          isCorrect,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          stepByStepSolution: question.stepByStepSolution,
          xpAwarded: isCorrect ? 20 : 3,
          marksEarned: isCorrect ? question.marks : 0,
        };
        setSubmissionResults((prev) => ({
          ...prev,
          [question.id]: localResult,
        }));
        setExpandedSolutions((prev) => ({
          ...prev,
          [question.id]: true,
        }));
      }
    } catch {
      const isCorrect = selected === question.correctAnswer;
      const localResult: QuestionSubmitResultDto = {
        questionId: question.id,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        stepByStepSolution: question.stepByStepSolution,
        xpAwarded: isCorrect ? 20 : 3,
        marksEarned: isCorrect ? question.marks : 0,
      };
      setSubmissionResults((prev) => ({
        ...prev,
        [question.id]: localResult,
      }));
      setExpandedSolutions((prev) => ({
        ...prev,
        [question.id]: true,
      }));
    } finally {
      setSubmittingQId(null);
    }
  };

  const handleToggleBookmark = async (questionId: string) => {
    // Optimistic UI update
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q))
    );

    try {
      const headers = tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : undefined;
      const res = await fetch(`${API_BASE}/question-bank/${questionId}/bookmark`, {
        method: 'POST',
        headers,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setStats((prev) => ({
            ...prev,
            bookmarkedCount: data.data.isBookmarked ? prev.bookmarkedCount + 1 : Math.max(0, prev.bookmarkedCount - 1),
          }));
        }
      }
    } catch {
      // Ignored for optimistic UI
    }
  };

  const toggleSolutionExpand = (questionId: string) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'HARD':
        return <span style={{ padding: '3px 9px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>🔴 HARD</span>;
      case 'MEDIUM':
        return <span style={{ padding: '3px 9px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>🟡 MEDIUM</span>;
      case 'EASY':
      default:
        return <span style={{ padding: '3px 9px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>🟢 EASY</span>;
    }
  };

  const availableSubjects = Array.from(new Set(FALLBACK_QUESTIONS.map((q) => q.subject)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* 1. Header & Stats Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>📖</span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Question Bank & PYQ Repository
            </h1>
          </div>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Master 10,000+ past year questions, national competition archives, and step-by-step verified solutions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => fetchData()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(255, 255, 255, 0.04)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* 2. Top Stats Cockpit */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Indexed PYQs
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              10,480+
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #10b981' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Questions Solved
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {stats.totalSolved} <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>({stats.pyqsMastered} Mastered)</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
            <Zap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Accuracy Rate
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {stats.accuracyRate}%
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #ec4899' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6' }}>
            <Flame size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Practice Streak
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {stats.streakDays} Days 🔥
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Search row */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search by topic, formula, keyword (e.g., Master Theorem, Dijkstra, TCP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px 11px 40px',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Search size={15} /> Search
          </button>
        </form>

        {/* Filter Pills & Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
          {/* Exam Type Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, marginRight: '4px' }}>Exam:</span>
            {['ALL', 'GATE CSE', 'University Finals'].map((exam) => (
              <button
                key={exam}
                onClick={() => setSelectedExam(exam)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedExam === exam ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: selectedExam === exam ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedExam === exam ? '#c7d2fe' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {exam === 'ALL' ? 'All Exams' : exam}
              </button>
            ))}
          </div>

          {/* Subject Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Subjects</option>
              {availableSubjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Difficulty:</span>
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedDifficulty === diff ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: selectedDifficulty === diff ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedDifficulty === diff ? '#f3e8ff' : 'var(--text-secondary)',
                }}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Year filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </div>

          {/* Quick Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: bookmarkedOnly ? '1px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.08)',
                background: bookmarkedOnly ? 'rgba(236, 72, 153, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                color: bookmarkedOnly ? '#f472b6' : 'var(--text-secondary)',
              }}
            >
              {bookmarkedOnly ? <BookmarkCheck size={14} /> : <Bookmark size={14} />} Bookmarked
            </button>

            <button
              onClick={() => setUnsolvedOnly(!unsolvedOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: unsolvedOnly ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                background: unsolvedOnly ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                color: unsolvedOnly ? '#34d399' : 'var(--text-secondary)',
              }}
            >
              <SlidersHorizontal size={14} /> Unsolved Only
            </button>
          </div>
        </div>
      </div>

      {/* 4. Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Showing {questions.length} Practice Questions
          </h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
            Earn +15 to +25 XP per correct solution 🎯
          </span>
        </div>

        {questions.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <BookOpen size={40} style={{ color: 'var(--text-tertiary)', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>No questions found for the selected filters</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Try adjusting your exam, subject, difficulty, or search query.
            </p>
          </div>
        ) : (
          questions.map((question, idx) => {
            const isSelected = userSelections[question.id];
            const submission = submissionResults[question.id];
            const isExpanded = expandedSolutions[question.id];
            const isSubmitting = submittingQId === question.id;

            return (
              <div
                key={question.id}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  border: submission
                    ? submission.isCorrect
                      ? '1px solid rgba(16, 185, 129, 0.4)'
                      : '1px solid rgba(239, 68, 68, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  background: submission
                    ? submission.isCorrect
                      ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.04) 0%, rgba(15, 23, 42, 0.7) 100%)'
                      : 'linear-gradient(180deg, rgba(239, 68, 68, 0.04) 0%, rgba(15, 23, 42, 0.7) 100%)'
                    : 'rgba(15, 23, 42, 0.65)',
                }}
              >
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#a5b4fc',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      {question.examType} {question.year && `• ${question.year}`}
                    </span>
                    {getDifficultyBadge(question.difficulty)}
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      +{question.marks} Marks {question.negativeMarks ? `(-${question.negativeMarks})` : ''}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                      • {question.subject} ❯ {question.topic}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleToggleBookmark(question.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: question.isBookmarked ? '#ec4899' : 'var(--text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {question.isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    {question.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>

                {/* Question Text */}
                <div style={{ fontSize: '1.02rem', fontWeight: 600, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--accent)', marginRight: '8px' }}>Q{idx + 1}.</span>
                  {question.questionText}
                </div>

                {/* Code Snippet if any */}
                {question.codeSnippet && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#a5f3fc',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                      <Code2 size={13} /> Code Snippet
                    </div>
                    <pre style={{ margin: 0, overflowX: 'auto' }}>{question.codeSnippet}</pre>
                  </div>
                )}

                {/* MCQ Options */}
                {question.options && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                    {question.options.map((opt) => {
                      const isOptionSelected = isSelected === opt.id;
                      let optionBg = 'rgba(255, 255, 255, 0.03)';
                      let optionBorder = '1px solid rgba(255, 255, 255, 0.1)';
                      let optionColor = 'var(--text-primary)';

                      if (submission) {
                        if (opt.id === question.correctAnswer) {
                          optionBg = 'rgba(16, 185, 129, 0.2)';
                          optionBorder = '1px solid #10b981';
                          optionColor = '#a7f3d0';
                        } else if (isOptionSelected && !submission.isCorrect) {
                          optionBg = 'rgba(239, 68, 68, 0.2)';
                          optionBorder = '1px solid #ef4444';
                          optionColor = '#fca5a5';
                        }
                      } else if (isOptionSelected) {
                        optionBg = 'rgba(99, 102, 241, 0.2)';
                        optionBorder = '1px solid #818cf8';
                        optionColor = '#e0e7ff';
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={!!submission}
                          onClick={() => handleSelectOption(question.id, opt.id)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '10px',
                            background: optionBg,
                            border: optionBorder,
                            color: optionColor,
                            textAlign: 'left',
                            cursor: submission ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '0.88rem',
                            fontWeight: 500,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: isOptionSelected || (submission && opt.id === question.correctAnswer) ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#ffffff',
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

                {/* Card Action & Feedback Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px' }}>
                  {/* Accuracy & Attempts Telemetry */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                    <span>🎯 Global Accuracy: <strong style={{ color: 'var(--text-secondary)' }}>{question.globalAccuracyRate}%</strong></span>
                    <span>👥 {question.totalAttemptsCount.toLocaleString()} Attempts</span>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {!submission ? (
                      <button
                        onClick={() => handleSubmitAnswer(question)}
                        disabled={!isSelected || isSubmitting}
                        style={{
                          padding: '8px 20px',
                          borderRadius: '8px',
                          background: isSelected ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.06)',
                          color: isSelected ? '#ffffff' : 'var(--text-tertiary)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          border: 'none',
                          cursor: isSelected && !isSubmitting ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Check Answer
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {submission.isCorrect ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.85rem', fontWeight: 700 }}>
                            <CheckCircle2 size={16} /> Correct! +{submission.xpAwarded} XP
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontSize: '0.85rem', fontWeight: 700 }}>
                            <XCircle size={16} /> Incorrect (+{submission.xpAwarded} XP for trying)
                          </span>
                        )}

                        <button
                          onClick={() => toggleSolutionExpand(question.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {isExpanded ? 'Hide Solution' : 'View Detailed Solution'}
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Step-by-Step Solution Drawer */}
                {isExpanded && (
                  <div
                    style={{
                      borderRadius: '12px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      padding: '18px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontSize: '0.88rem', fontWeight: 700 }}>
                      <CheckCircle2 size={16} /> Step-by-Step Mathematical & Algorithmic Breakdown
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {question.stepByStepSolution.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            fontSize: '0.88rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.55,
                            background: 'rgba(255, 255, 255, 0.02)',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            borderLeft: '2px solid #818cf8',
                          }}
                        >
                          {step}
                        </div>
                      ))}
                    </div>

                    {question.keyFormula && (
                      <div
                        style={{
                          background: 'rgba(99, 102, 241, 0.1)',
                          border: '1px dashed rgba(99, 102, 241, 0.4)',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <Zap size={16} style={{ color: '#818cf8', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase' }}>
                            Key Theorem / Core Formula
                          </div>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#f8fafc', marginTop: '2px' }}>
                            {question.keyFormula}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', paddingTop: '4px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Topics:</span>
                      {question.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. Rapid Practice Flash Banner */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(168, 85, 247, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
            <Clock size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
              Want to test your speed under real exam conditions?
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#cbd5e1', fontSize: '0.86rem' }}>
              Switch to the <strong>Mock Test Simulator (Phase 12)</strong> for full-length timed tests with negative marking and percentile rankings.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            // Can switch views or trigger test
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            padding: '10px 22px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.88rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
          }}
        >
          Launch Rapid Drill ⚡
        </button>
      </div>
    </div>
  );
};
