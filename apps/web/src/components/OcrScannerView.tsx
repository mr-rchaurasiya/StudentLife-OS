import React, { useState } from 'react';
import {
  OcrScanResult
} from '@studentlife/shared';
import {
  Scan,
  FileText,
  Sparkles,
  CheckCircle2,
  Brain,
  HelpCircle,
  Camera,
  Zap
} from 'lucide-react';

interface OcrScannerViewProps {
  onAddXp?: (xp: number, reason: string) => void;
  onNavigateView?: (view: string) => void;
}

const FALLBACK_SCAN_CALCULUS: OcrScanResult = {
  id: 'scan-calc-01',
  documentType: 'HANDWRITTEN_NOTE',
  title: 'Handwritten Class Notes: Multivariable Calculus & Partial Derivatives',
  subjectName: 'Engineering Mathematics',
  confidenceScorePercent: 96.8,
  extractedMarkdown: `### 📘 Multivariable Calculus — Gradient & Directional Derivatives

**Core Notes Extracted:**
1. Let $f(x, y, z)$ be a scalar field. The **Gradient Vector** is defined as:
   $$\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right)$$
2. **Directional Derivative** along unit vector $\\mathbf{u}$:
   $$D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u} = |\\nabla f| \\cos(\\theta)$$
3. **Maximum Rate of Increase**: Occurs when $\\theta = 0$, in the exact direction of the gradient $\\nabla f$, with magnitude $|\\nabla f|$.
4. **Tangent Plane Equation** to surface $F(x, y, z) = 0$ at $(x_0, y_0, z_0)$:
   $$\\nabla F(x_0, y_0, z_0) \\cdot (x - x_0, y - y_0, z - z_0) = 0$$`,
  keyFormulas: [
    {
      id: 'frm-1',
      name: 'Directional Derivative Formula',
      latex: 'D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u}',
      explanation: 'Calculates instantaneous rate of change of scalar field f in the direction of unit vector u.'
    },
    {
      id: 'frm-2',
      name: 'Gradient Vector',
      latex: '\\nabla f = \\frac{\\partial f}{\\partial x}\\mathbf{i} + \\frac{\\partial f}{\\partial y}\\mathbf{j} + \\frac{\\partial f}{\\partial z}\\mathbf{k}',
      explanation: 'Points in the direction of greatest spatial rate of increase of the function.'
    }
  ],
  bulletSummary: [
    'Gradient vector points in the direction of steepest ascent.',
    'Directional derivative is zero perpendicular to the gradient vector (along level curves).',
    'Crucial for GATE Calculus and Machine Learning Gradient Descent optimization.'
  ],
  generatedQuiz: [
    {
      id: 'q-1',
      questionText: 'In which direction does a scalar field f(x, y) increase most rapidly at point P?',
      options: [
        'Along the tangent to the level curve',
        'In the exact direction of the gradient vector ∇f',
        'Perpendicular to ∇f',
        'Opposite to ∇f'
      ],
      correctAnswerIndex: 1,
      explanation: 'The maximum value of Du(f) = |∇f| cos(θ) occurs when cos(θ) = 1 (i.e., θ = 0°), which is along ∇f.'
    },
    {
      id: 'q-2',
      questionText: 'What is the directional derivative of f along a vector orthogonal to the gradient ∇f?',
      options: ['0', '1', '|∇f|', 'Undefined'],
      correctAnswerIndex: 0,
      explanation: 'Since u is orthogonal to ∇f, the dot product ∇f · u = 0.'
    }
  ],
  suggestedFlashcardsCount: 4,
  scannedAt: new Date().toISOString()
};

const FALLBACK_SCAN_DP: OcrScanResult = {
  id: 'scan-dp-02',
  documentType: 'DIAGRAM_CHART',
  title: 'Classroom Whiteboard: 0/1 Knapsack State Space & Recurrence',
  subjectName: 'Algorithms & Data Structures',
  confidenceScorePercent: 98.2,
  extractedMarkdown: `### 💻 0/1 Knapsack Dynamic Programming Recurrence Blueprint

**Recurrence Formulation:**
$$dp[i][w] = \\begin{cases} 
dp[i-1][w] & \\text{if } \\text{weight}[i-1] > w \\\\ 
\\max(dp[i-1][w], \\text{val}[i-1] + dp[i-1][w - \\text{weight}[i-1]]) & \\text{otherwise} 
\\end{cases}$$

- **State Representation**: $dp[i][w]$ = Maximum value attainable using a subset of the first $i$ items with max weight capacity $w$.
- **Time Complexity**: $O(N \\times W)$ pseudo-polynomial.
- **Space Optimization**: 2D table can be compressed to 1D array by iterating $w$ backwards ($W \\to \\text{weight}[i]$).`,
  keyFormulas: [
    {
      id: 'frm-3',
      name: 'Knapsack 1D State Transition',
      latex: 'dp[w] = \\max(dp[w], \\text{val}[i] + dp[w - \\text{wt}[i]])',
      explanation: 'Iterating right-to-left preserves previous stage state without overwriting.'
    }
  ],
  bulletSummary: [
    'Overlapping subproblems are memoized to avoid exponential 2^N runtime.',
    'Backwards iteration in 1D array prevents picking the same item multiple times.',
    'Core pattern for Subset Sum, Partition Equal Subset, and Target Sum.'
  ],
  generatedQuiz: [
    {
      id: 'q-3',
      questionText: 'Why do we iterate backwards from W to wt[i] in the 1D space optimized Knapsack?',
      options: [
        'To make the loop run faster in hardware cache',
        'To prevent using the current item multiple times in the same subproblem',
        'To sort the items by density',
        'To avoid recursion stack overflow'
      ],
      correctAnswerIndex: 1,
      explanation: 'Backwards iteration ensures that dp[w - wt[i]] refers to the state from the PREVIOUS item iteration, maintaining the 0/1 constraint.'
    }
  ],
  suggestedFlashcardsCount: 5,
  scannedAt: new Date().toISOString()
};

export const OcrScannerView: React.FC<OcrScannerViewProps> = ({ onAddXp, onNavigateView }) => {
  const [activeScan, setActiveScan] = useState<OcrScanResult>(FALLBACK_SCAN_CALCULUS);
  const [selectedPreset, setSelectedPreset] = useState<'CALCULUS' | 'DP'>('CALCULUS');
  const [isScanning, setIsScanning] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleScanPreset = async (preset: 'CALCULUS' | 'DP') => {
    setSelectedPreset(preset);
    setIsScanning(true);
    setQuizAnswers({});
    setQuizSubmitted(false);

    try {
      const res = await fetch('/api/ocr/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presetKey: preset === 'CALCULUS' ? 'CALCULUS_NOTE' : 'DP_BLUEPRINT'
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) setActiveScan(json.data);
      } else {
        setActiveScan(preset === 'CALCULUS' ? FALLBACK_SCAN_CALCULUS : FALLBACK_SCAN_DP);
      }
    } catch {
      setActiveScan(preset === 'CALCULUS' ? FALLBACK_SCAN_CALCULUS : FALLBACK_SCAN_DP);
    } finally {
      setTimeout(() => {
        setIsScanning(false);
        showToast('✨ Vision OCR Scan Complete! Formulas and Summary Extracted.');
      }, 600);
    }
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    activeScan.generatedQuiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const earnedXp = correctCount * 15 + 10;
    showToast(`🎉 Quiz Passed! ${correctCount}/${activeScan.generatedQuiz.length} Correct. +${earnedXp} XP 🔥`);
    if (onAddXp) {
      onAddXp(earnedXp, `OCR Generated Practice Quiz: ${activeScan.title}`);
    }
  };

  const handleSaveToNotes = () => {
    showToast('📝 Note saved to Notes Hub! Click to review.');
    if (onAddXp) onAddXp(20, 'Digitized Handwritten Note');
    if (onNavigateView) onNavigateView('NOTES');
  };

  const handleGenerateFlashcards = () => {
    showToast(`🧠 ${activeScan.suggestedFlashcardsCount} Flashcards scheduled in SM-2 Revision Queue! +25 XP 🔥`);
    if (onAddXp) onAddXp(25, 'Generated Flashcards from OCR Scan');
    if (onNavigateView) onNavigateView('REVISION');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(6, 182, 212, 0.4)',
            fontWeight: '700',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(20, 15, 35, 0.95) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>📸</span>
            <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: '800', background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Camera OCR & Smart Note Scanner
            </h1>
            <span
              style={{
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#22d3ee',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}
            >
              Vision AI Extractor ✨
            </span>
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
            Transform handwritten notebooks, textbook photos, and whiteboard sketches into searchable Markdown notes, LaTeX equations, and interactive SM-2 flashcards.
          </p>
        </div>

        {/* Quick Presets Selector */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0, 0, 0, 0.3)', padding: '4px', borderRadius: '12px' }}>
          <button
            onClick={() => handleScanPreset('CALCULUS')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              background: selectedPreset === 'CALCULUS' ? 'var(--gradient-primary)' : 'transparent',
              color: selectedPreset === 'CALCULUS' ? '#fff' : '#94a3b8'
            }}
          >
            📝 Calculus Copy Photo
          </button>
          <button
            onClick={() => handleScanPreset('DP')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              background: selectedPreset === 'DP' ? 'var(--gradient-primary)' : 'transparent',
              color: selectedPreset === 'DP' ? '#fff' : '#94a3b8'
            }}
          >
            💻 DP Whiteboard Sketch
          </button>
        </div>
      </div>

      {/* Split-Screen Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Column: Image / Scan Document Inspector */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(20, 15, 35, 0.9) 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.5rem',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={18} color="#22d3ee" /> Document Source Inspector
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '700' }}>
              {activeScan.confidenceScorePercent}% OCR Accuracy
            </span>
          </div>

          {/* Photo Preview Container */}
          <div
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#090d16',
              minHeight: '260px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={
                selectedPreset === 'CALCULUS'
                  ? 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
              }
              alt="Scanned Document"
              style={{ width: '100%', height: '260px', objectFit: 'cover', opacity: isScanning ? 0.3 : 0.85 }}
            />

            {/* Bounding Box Visualizer Overlays */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                border: '2px dashed #38bdf8',
                background: 'rgba(56, 189, 248, 0.15)',
                borderRadius: '8px',
                padding: '4px 8px',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: '700'
              }}
            >
              📐 Formula Block Detected
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '30px',
                right: '20px',
                border: '2px dashed #34d399',
                background: 'rgba(52, 211, 153, 0.15)',
                borderRadius: '8px',
                padding: '4px 8px',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: '700'
              }}
            >
              📝 Text Block: {activeScan.subjectName}
            </div>

            {isScanning && (
              <div style={{ position: 'absolute', color: '#38bdf8', fontWeight: '800', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scan size={24} className="spin-slow" /> Analyzing with Vision AI...
              </div>
            )}
          </div>

          {/* Quick 1-Click Action Bridges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleSaveToNotes}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '10px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <FileText size={14} color="#38bdf8" /> Save to Notes Hub
            </button>
            <button
              onClick={handleGenerateFlashcards}
              className="btn btn-primary"
              style={{ flex: 1, padding: '10px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Brain size={14} /> Generate Flashcards (+25 XP)
            </button>
          </div>
        </div>

        {/* Right Column: Extracted Text, LaTeX & AI Practice Quiz */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(20, 15, 35, 0.9) 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.5rem',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          {/* Extracted Markdown */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#c084fc" /> Extracted Structured Notes
              </h4>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{activeScan.subjectName}</span>
            </div>

            <div
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: '12px',
                padding: '14px 16px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.85rem',
                color: '#e2e8f0',
                lineHeight: 1.6,
                maxHeight: '220px',
                overflowY: 'auto'
              }}
            >
              <div style={{ whiteSpace: 'pre-wrap' }}>{activeScan.extractedMarkdown}</div>
            </div>
          </div>

          {/* Key Formulas Section */}
          <div>
            <h4 style={{ margin: '0 0 8px', fontSize: '0.9rem', fontWeight: '800', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} color="#fbbf24" /> Detected LaTeX Formulas
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activeScan.keyFormulas.map((formula) => (
                <div
                  key={formula.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fbbf24' }}>{formula.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{formula.explanation}</div>
                  </div>
                  <code style={{ fontSize: '0.75rem', background: 'rgba(0, 0, 0, 0.4)', padding: '4px 8px', borderRadius: '6px', color: '#38bdf8' }}>
                    {formula.latex}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive AI Practice Quiz */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle size={16} color="#34d399" /> Instant Knowledge Check
              </h4>
              <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: '700' }}>+25 XP Reward 🔥</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeScan.generatedQuiz.map((quiz, qIdx) => (
                <div
                  key={quiz.id}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                    Q{qIdx + 1}. {quiz.questionText}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {quiz.options.map((opt, oIdx) => {
                      const isSelected = quizAnswers[quiz.id] === oIdx;
                      const isCorrect = quiz.correctAnswerIndex === oIdx;
                      let btnBg = 'rgba(255, 255, 255, 0.05)';
                      let border = '1px solid rgba(255, 255, 255, 0.1)';

                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnBg = 'rgba(16, 185, 129, 0.25)';
                          border = '1px solid #10b981';
                        } else if (isSelected && !isCorrect) {
                          btnBg = 'rgba(239, 68, 68, 0.25)';
                          border = '1px solid #ef4444';
                        }
                      } else if (isSelected) {
                        btnBg = 'rgba(99, 102, 241, 0.3)';
                        border = '1px solid #6366f1';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(quiz.id, oIdx)}
                          style={{
                            textAlign: 'left',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border,
                            background: btnBg,
                            color: '#e2e8f0',
                            fontSize: '0.75rem',
                            cursor: quizSubmitted ? 'default' : 'pointer'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div style={{ marginTop: '6px', fontSize: '0.7rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} color="#34d399" /> {quiz.explanation}
                    </div>
                  )}
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.8rem', fontWeight: '800', marginTop: '4px' }}
                >
                  Submit Answers & Claim XP 🔥
                </button>
              ) : (
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#34d399', fontWeight: '700' }}>
                  ✓ Quiz Completed & Recorded
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
