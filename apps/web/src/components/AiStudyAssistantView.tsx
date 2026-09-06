import React, { useState, useEffect } from 'react';
import {
  FlashcardItem,
  AiSummaryResult,
  AiDoubtChatMessage,
  ConceptExplanationResult,
} from '@studentlife/shared';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  BookOpen,
  Layers,
  MessageSquare,
  Brain,
  RotateCw,
  Send,
  Zap,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const DEFAULT_SAMPLE_CONTENT = `# Dynamic Programming: 0/1 Knapsack Pattern

Whenever we are given a set of items with weights and profits, and we need to find a subset that satisfies a weight constraint W while maximizing total profit.

We maintain a dynamic programming array dp[w] which represents the maximum value achievable with capacity w. For each item with weight wt and value val, we iterate capacity w from W down to wt to ensure each item is evaluated at most once.

Time Complexity is O(N * W), and Space Complexity is O(W) with state compression.`;

const DEFAULT_FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc-1',
    subjectName: 'Data Structures & Algorithms',
    topicTitle: 'Dynamic Programming',
    question: 'What is the core state transition equation for the 0/1 Knapsack Problem?',
    answer: 'dp[w] = max(dp[w], val[i] + dp[w - wt[i]]) iterating capacity backwards from W down to wt[i].',
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
    subjectName: 'System Design',
    topicTitle: 'Distributed Caching',
    question: 'How does the Cache-Aside pattern prevent stale data on write operations?',
    answer: 'The application writes directly to the Database and then invalidates (evicts) the corresponding key from the Cache.',
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
    subjectName: 'Computer Networks',
    topicTitle: 'TCP Transport Layer',
    question: 'Why does TCP require a 3-way handshake instead of a 2-way handshake?',
    answer: 'To prevent old duplicate connection requests from establishing false sessions and synchronize initial sequence numbers (ISN) mutually.',
    difficulty: 'MEDIUM',
    masteryLevel: 2,
    easeFactor: 2.4,
    repetitionIntervalDays: 2,
    nextReviewDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    tags: ['#Networks', '#TCP', '#Protocols'],
    isAiGenerated: false,
  },
];

interface AiStudyAssistantViewProps {
  initialContent?: string;
}

export const AiStudyAssistantView: React.FC<AiStudyAssistantViewProps> = ({ initialContent }) => {
  const { tokens } = useAuth();
  const [activeTab, setActiveTab] = useState<'SUMMARIZER' | 'FLASHCARDS' | 'DOUBT_SOLVER' | 'CONCEPT_EXPLAINER'>('SUMMARIZER');

  // Summarizer State
  const [inputText, setInputText] = useState(initialContent || DEFAULT_SAMPLE_CONTENT);
  const [subjectName, setSubjectName] = useState('Data Structures & Algorithms');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<AiSummaryResult | null>(null);

  // Flashcards State
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>(DEFAULT_FLASHCARDS);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);

  // Doubt Solver State
  const [doubtLevel, setDoubtLevel] = useState<'ELI5' | 'STANDARD' | 'EXAM_ADVANCED'>('STANDARD');
  const [chatInput, setChatInput] = useState('');
  const [isSendingDoubt, setIsSendingDoubt] = useState(false);
  const [chatHistory, setChatHistory] = useState<AiDoubtChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `👋 Hello! I am your AI Study Assistant. Ask me any doubt from your syllabus, exam question, or tricky concept. You can switch between **ELI5**, **Standard**, and **Exam Advanced** depths!`,
      timestamp: new Date().toISOString(),
      suggestedFollowUps: [
        'Why does the inner loop in 0/1 Knapsack run backwards?',
        'Explain CAP theorem with a real-world example',
        'How does Dijkstra algorithm handle directed cyclic graphs?',
      ],
    },
  ]);

  // Concept Explainer State
  const [conceptQuery, setConceptQuery] = useState('Dynamic Programming');
  const [conceptResult, setConceptResult] = useState<ConceptExplanationResult | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);

  useEffect(() => {
    fetchFlashcards();
    handleExplainConcept('Dynamic Programming');
  }, [tokens]);

  const fetchFlashcards = async () => {
    try {
      const res = await fetch(`${API_BASE}/ai-study/flashcards`, {
        headers: { Authorization: `Bearer ${tokens?.accessToken || ''}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setFlashcards(data.data);
        }
      }
    } catch {
      // Fallback to local state
    }
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    setIsSummarizing(true);
    try {
      const res = await fetch(`${API_BASE}/ai-study/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.accessToken || ''}`,
        },
        body: JSON.stringify({
          content: inputText,
          subjectName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setSummaryResult(data.data);
          return;
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsSummarizing(false);
    }

    // Fallback local summary
    setSummaryResult({
      summary: `This study document covers critical invariants of ${subjectName}. It outlines essential algorithmic choices, memory optimization steps, and edge-case validation to maximize accuracy under time-constrained exam settings.`,
      keyTakeaways: [
        '📌 Invariant: State transitions must respect discrete capacity limits.',
        '📌 Memory Optimization: Compress 2D table into 1D buffer iterating backwards.',
        '📌 Edge Case: Empty elements or negative parameters must be guarded.',
      ],
      mindMapBullets: [
        `🏛️ Domain: ${subjectName}`,
        '  ├── 🔑 Recurrence Equations & Base Cases',
        '  ├── ⚡ Time Complexity: O(N * W)',
        '  └── 💾 Space Complexity: O(W)',
      ],
      formulaOrSyntaxSnippet: 'Time Complexity: O(N · W) | Space Complexity: O(W)',
      suggestedFlashcardCount: 3,
    });
  };

  const handleGenerateCardsFromSummary = async () => {
    setIsGeneratingCards(true);
    try {
      const res = await fetch(`${API_BASE}/ai-study/flashcards/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.accessToken || ''}`,
        },
        body: JSON.stringify({
          content: inputText,
          subjectName,
          topicTitle: 'Core Concept & Optimization',
          count: 3,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setFlashcards([...data.data, ...flashcards]);
          setActiveTab('FLASHCARDS');
          setCurrentCardIndex(0);
          setIsFlipped(false);
          return;
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsGeneratingCards(false);
    }

    // Local fallback
    const newCard: FlashcardItem = {
      id: `ai-fc-${Date.now()}`,
      subjectName,
      topicTitle: 'Generated Key Takeaway',
      question: `What is the space-optimized formulation for ${subjectName}?`,
      answer: 'Iterating state variables in reverse order allows single-row array updates without overwriting previous subproblem dependencies.',
      difficulty: 'MEDIUM',
      masteryLevel: 0,
      easeFactor: 2.5,
      repetitionIntervalDays: 1,
      nextReviewDate: new Date().toISOString().split('T')[0],
      tags: ['#AiGenerated', '#StudySummary'],
      isAiGenerated: true,
    };
    setFlashcards([newCard, ...flashcards]);
    setActiveTab('FLASHCARDS');
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleGradeCard = async (grade: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY') => {
    const activeCard = flashcards[currentCardIndex];
    if (!activeCard) return;

    try {
      await fetch(`${API_BASE}/ai-study/flashcards/${activeCard.id}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.accessToken || ''}`,
        },
        body: JSON.stringify({ grade }),
      });
    } catch {
      // Continue
    }

    // Next card
    setIsFlipped(false);
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handleSendDoubt = async (queryText?: string) => {
    const text = queryText || chatInput;
    if (!text.trim()) return;

    const userMsg: AiDoubtChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      level: doubtLevel,
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsSendingDoubt(true);

    try {
      const res = await fetch(`${API_BASE}/ai-study/doubt-solver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.accessToken || ''}`,
        },
        body: JSON.stringify({
          question: text,
          subjectName,
          level: doubtLevel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setChatHistory((prev) => [...prev, data.data]);
          return;
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsSendingDoubt(false);
    }

    // Local fallback reply
    const assistantMsg: AiDoubtChatMessage = {
      id: `bot-${Date.now()}`,
      role: 'assistant',
      content: `Here is the explanation for **"${text}"** at level **${doubtLevel}**:\n\nThe fundamental premise relies on optimal substructure where sub-solutions combine to satisfy the global constraint. Always ensure boundary values (like 0 or empty sets) are initialized correctly.`,
      timestamp: new Date().toISOString(),
      level: doubtLevel,
      suggestedFollowUps: ['How do I avoid common time-limit exceeded (TLE) errors?'],
    };
    setChatHistory((prev) => [...prev, assistantMsg]);
  };

  const handleExplainConcept = async (conceptName: string) => {
    setConceptQuery(conceptName);
    setIsExplaining(true);
    setShowPracticeAnswer(false);

    try {
      const res = await fetch(`${API_BASE}/ai-study/explain-concept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.accessToken || ''}`,
        },
        body: JSON.stringify({
          concept: conceptName,
          subjectName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setConceptResult(data.data);
          return;
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsExplaining(false);
    }

    // Local fallback
    setConceptResult({
      concept: conceptName,
      subjectName,
      intuitionAnalogy: `Think of ${conceptName} like caching calculated values so you never have to recompute identical subproblems.`,
      formalDefinition: `${conceptName} is an algorithmic optimization paradigm that breaks complex tasks into overlapping subproblems and stores intermediate solutions.`,
      coreMechanism: [
        '1. Optimal Substructure identification.',
        '2. Recurrence state relation modeling.',
        '3. Iterative evaluation with memory caching.',
        '4. Result reconstruction.',
      ],
      timeAndSpaceComplexity: 'Time: O(States · Transitions) | Space: O(States)',
      commonPitfalls: ['Unbounded duplicate item inclusion', 'Stack overflow on unmemoized deep recursion'],
      practiceQuestion: {
        question: `How would you partition an array into two subsets of equal sum?`,
        answer: `If total sum is odd, return False. Otherwise run 0/1 subset sum with target = totalSum / 2.`,
      },
    });
  };

  const currentCard = flashcards[currentCardIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Header Bar */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1
              style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
              }}
            >
              ✨ AI Study Assistant & Cognitive Engine
            </h1>
            <span
              style={{
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#f472b6',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              PHASE 08 ACTIVE
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
            Transform documents into executive summaries, 3D active-recall flashcards, and 24/7 intelligent doubt resolution.
          </p>
        </div>

        {/* Multi-Tool Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '4px',
          }}
        >
          <button
            onClick={() => setActiveTab('SUMMARIZER')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background:
                activeTab === 'SUMMARIZER'
                  ? 'linear-gradient(135deg, #ec4899, #db2777)'
                  : 'transparent',
              color: activeTab === 'SUMMARIZER' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <BookOpen size={14} /> Doc Summarizer
          </button>
          <button
            onClick={() => setActiveTab('FLASHCARDS')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background:
                activeTab === 'FLASHCARDS'
                  ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                  : 'transparent',
              color: activeTab === 'FLASHCARDS' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Layers size={14} /> 3D Flashcards ({flashcards.length})
          </button>
          <button
            onClick={() => setActiveTab('DOUBT_SOLVER')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background:
                activeTab === 'DOUBT_SOLVER'
                  ? 'linear-gradient(135deg, #06b6d4, #0284c7)'
                  : 'transparent',
              color: activeTab === 'DOUBT_SOLVER' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <MessageSquare size={14} /> AI Doubt Solver
          </button>
          <button
            onClick={() => setActiveTab('CONCEPT_EXPLAINER')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background:
                activeTab === 'CONCEPT_EXPLAINER'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'transparent',
              color: activeTab === 'CONCEPT_EXPLAINER' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Brain size={14} /> Concept Explainer
          </button>
        </div>
      </div>

      {/* TAB 1: Document Summarizer */}
      {activeTab === 'SUMMARIZER' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(340px, 1fr) minmax(360px, 1.2fr)',
            gap: '20px',
          }}
        >
          {/* Input Box */}
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f472b6' }}>
                📄 Source Text / Notes Input
              </span>
              <select
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-color)',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                }}
              >
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="System Design">System Design</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Engineering Mathematics">Engineering Mathematics</option>
              </select>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste any long chapter notes, PDF transcript, or concept explanation here..."
              rows={14}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid var(--border-color)',
                color: '#f8fafc',
                fontSize: '0.88rem',
                fontFamily: 'Consolas, monospace',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
              }}
            />

            <button
              onClick={handleSummarize}
              disabled={isSummarizing}
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: isSummarizing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(236, 72, 153, 0.3)',
              }}
            >
              <Sparkles size={16} />
              {isSummarizing ? 'Analyzing & Extracting...' : '✨ Generate AI Summary & Mindmap'}
            </button>
          </div>

          {/* AI Output Box */}
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {summaryResult ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a78bfa' }}>
                    🧠 Executive Takeaways & Formulas
                  </span>
                  <button
                    onClick={handleGenerateCardsFromSummary}
                    disabled={isGeneratingCards}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Layers size={13} /> Convert to Flashcards
                  </button>
                </div>

                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '14px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    lineHeight: '1.6',
                    color: '#e2e8f0',
                  }}
                >
                  {summaryResult.summary}
                </div>

                {/* Key Takeaways */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: '#38bdf8', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Key Invariants & Exam Rules
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {summaryResult.keyTakeaways.map((point, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(56, 189, 248, 0.08)',
                          borderLeft: '3px solid #38bdf8',
                          padding: '8px 12px',
                          borderRadius: '0 8px 8px 0',
                          fontSize: '0.82rem',
                          color: '#f1f5f9',
                        }}
                      >
                        {point}
                      </div>
                    ))}
                  </div>
                </div>

                {/* MindMap */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: '#34d399', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Structured MindMap Tree
                  </h4>
                  <pre
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      padding: '12px',
                      borderRadius: '8px',
                      fontFamily: 'Consolas, monospace',
                      fontSize: '0.8rem',
                      color: '#6ee7b7',
                      margin: 0,
                    }}
                  >
                    {summaryResult.mindMapBullets.join('\n')}
                  </pre>
                </div>

                {summaryResult.formulaOrSyntaxSnippet && (
                  <div
                    style={{
                      background: 'rgba(236, 72, 153, 0.1)',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '0.82rem',
                      color: '#f472b6',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Zap size={15} />
                    <span>{summaryResult.formulaOrSyntaxSnippet}</span>
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                  gap: '12px',
                  padding: '40px',
                }}
              >
                <Brain size={48} color="#818cf8" opacity={0.5} />
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    Ready for AI Document Analysis
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    Click "Generate AI Summary & Mindmap" to condense the source text into structured active study cards.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: 3D Flashcards Player */}
      {activeTab === 'FLASHCARDS' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          {/* Deck Telemetry Banner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              maxWidth: '680px',
              padding: '12px 20px',
              background: 'var(--card-bg)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Card <strong style={{ color: '#fff' }}>{currentCardIndex + 1}</strong> of{' '}
              <strong style={{ color: '#fff' }}>{flashcards.length}</strong>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem' }}>
              <span style={{ color: '#a78bfa' }}>
                Mastery: ⭐ {currentCard?.masteryLevel || 0}/5
              </span>
              <span style={{ color: '#38bdf8' }}>
                Ease Factor: {currentCard?.easeFactor.toFixed(1) || '2.5'}
              </span>
            </div>
          </div>

          {/* Interactive Flashcard */}
          {currentCard && (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                width: '100%',
                maxWidth: '680px',
                minHeight: '320px',
                background: isFlipped
                  ? 'linear-gradient(135deg, rgba(30, 27, 75, 0.9), rgba(15, 23, 42, 0.95))'
                  : 'linear-gradient(135deg, rgba(24, 24, 27, 0.9), rgba(9, 9, 11, 0.95))',
                border: isFlipped
                  ? '1px solid rgba(139, 92, 246, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '32px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isFlipped
                  ? '0 12px 30px rgba(139, 92, 246, 0.2)'
                  : '0 12px 30px rgba(0,0,0,0.4)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
              }}
            >
              {/* Card Top Label */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#818cf8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {currentCard.subjectName} • {currentCard.topicTitle}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background:
                      currentCard.difficulty === 'HARD'
                        ? 'rgba(239, 68, 68, 0.15)'
                        : 'rgba(56, 189, 248, 0.15)',
                    color: currentCard.difficulty === 'HARD' ? '#f87171' : '#38bdf8',
                    fontWeight: 700,
                  }}
                >
                  {currentCard.difficulty}
                </span>
              </div>

              {/* Main Card Body */}
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                {!isFlipped ? (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>
                      QUESTION (Click to flip)
                    </div>
                    <div
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1.5,
                      }}
                    >
                      {currentCard.question}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#a78bfa', marginBottom: '8px' }}>
                      ANSWER & INVARIANT
                    </div>
                    <div
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#f1f5f9',
                        lineHeight: 1.6,
                      }}
                    >
                      {currentCard.answer}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Hint */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <RotateCw size={12} />
                <span>Click card to reveal answer / question</span>
              </div>
            </div>
          )}

          {/* SM-2 Active Recall Confidence Grading Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              width: '100%',
              maxWidth: '680px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => handleGradeCard('AGAIN')}
              style={{
                flex: 1,
                minWidth: '130px',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              🔄 Again (1d)
            </button>
            <button
              onClick={() => handleGradeCard('HARD')}
              style={{
                flex: 1,
                minWidth: '130px',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              ⚡ Hard (2d)
            </button>
            <button
              onClick={() => handleGradeCard('GOOD')}
              style={{
                flex: 1,
                minWidth: '130px',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              👍 Good (4d)
            </button>
            <button
              onClick={() => handleGradeCard('EASY')}
              style={{
                flex: 1,
                minWidth: '130px',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              🌟 Easy (+25 XP)
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: 24/7 AI Doubt Solver */}
      {activeTab === 'DOUBT_SOLVER' && (
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minHeight: '560px',
          }}
        >
          {/* Depth Level Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '12px',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Explanation Depth Mode:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['ELI5', 'STANDARD', 'EXAM_ADVANCED'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDoubtLevel(lvl)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background:
                      doubtLevel === lvl
                        ? 'linear-gradient(135deg, #06b6d4, #0284c7)'
                        : 'rgba(255,255,255,0.06)',
                    color: doubtLevel === lvl ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  {lvl === 'ELI5' ? '🧸 ELI5' : lvl === 'STANDARD' ? '📘 Standard' : '📐 Exam Advanced'}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Stream */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              overflowY: 'auto',
              maxHeight: '420px',
              paddingRight: '6px',
              flex: 1,
            }}
          >
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius:
                      msg.role === 'user'
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                        : 'rgba(255,255,255,0.05)',
                    border:
                      msg.role === 'user'
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}

                  {msg.codeSnippet && (
                    <pre
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        padding: '10px',
                        borderRadius: '8px',
                        fontFamily: 'Consolas, monospace',
                        fontSize: '0.8rem',
                        color: '#38bdf8',
                        margin: '10px 0 0 0',
                        overflowX: 'auto',
                      }}
                    >
                      {msg.codeSnippet}
                    </pre>
                  )}
                </div>

                {/* Follow up suggestions */}
                {msg.suggestedFollowUps && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                      marginTop: '8px',
                    }}
                  >
                    {msg.suggestedFollowUps.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendDoubt(q)}
                        style={{
                          background: 'rgba(6, 182, 212, 0.1)',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                          color: '#22d3ee',
                          borderRadius: '12px',
                          padding: '3px 10px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                        }}
                      >
                        💡 {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isSendingDoubt && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontStyle: 'italic',
                }}
              >
                AI Assistant is typing explanation...
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Why is Dijkstra greedy?', 'How does sharding handle rebalancing?')..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendDoubt()}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSendDoubt()}
              disabled={isSendingDoubt}
              style={{
                padding: '0 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Concept Deep-Dive Explainer */}
      {activeTab === 'CONCEPT_EXPLAINER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Concept Preset Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              'Dynamic Programming',
              'Distributed Caching',
              'TCP 3-Way Handshake',
              'Eigenvalues & Eigenvectors',
              'CAP Theorem',
            ].map((c) => (
              <button
                key={c}
                onClick={() => handleExplainConcept(c)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background:
                    conceptQuery === c
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'rgba(255,255,255,0.05)',
                  color: conceptQuery === c ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {conceptResult && (
            <div
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                    {conceptResult.concept}
                  </h2>
                  {isExplaining && (
                    <span style={{ fontSize: '0.75rem', color: '#34d399', fontStyle: 'italic' }}>
                      ✨ Regenerating concept...
                    </span>
                  )}
                </div>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {conceptResult.subjectName}
                </span>
              </div>

              {/* Intuition Analogy Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                  borderLeft: '4px solid #10b981',
                  borderRadius: '0 12px 12px 0',
                  padding: '16px',
                }}
              >
                <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '4px', fontSize: '0.85rem' }}>
                  💡 INTUITIVE ANALOGY
                </div>
                <div style={{ fontSize: '0.9rem', color: '#f1f5f9', lineHeight: 1.6 }}>
                  {conceptResult.intuitionAnalogy}
                </div>
              </div>

              {/* Formal Definition */}
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>
                  Formal Definition & Specification
                </h4>
                <div style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                  {conceptResult.formalDefinition}
                </div>
              </div>

              {/* 4-Step Mechanism */}
              <div>
                <h4 style={{ fontSize: '0.85rem', color: '#818cf8', margin: '0 0 8px 0' }}>
                  Core 4-Step Mechanism
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                  {conceptResult.coreMechanism.map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '0.82rem',
                        color: '#cbd5e1',
                      }}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Traps & Pitfalls */}
              <div>
                <h4 style={{ fontSize: '0.85rem', color: '#f87171', margin: '0 0 8px 0' }}>
                  ⚠️ Common Traps & Exam Pitfalls
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#fca5a5', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  {conceptResult.commonPitfalls.map((pitfall, idx) => (
                    <li key={idx}>{pitfall}</li>
                  ))}
                </ul>
              </div>

              {/* Practice Test Self-Check */}
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#818cf8', fontSize: '0.85rem' }}>
                    📝 Instant Practice Check
                  </span>
                  <button
                    onClick={() => setShowPracticeAnswer(!showPracticeAnswer)}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    {showPracticeAnswer ? 'Hide Solution' : 'Show Solution'}
                  </button>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#fff' }}>
                  {conceptResult.practiceQuestion.question}
                </div>
                {showPracticeAnswer && (
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.25)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      color: '#34d399',
                      fontSize: '0.82rem',
                    }}
                  >
                    <strong>Solution: </strong> {conceptResult.practiceQuestion.answer}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
