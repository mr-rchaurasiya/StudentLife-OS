import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Sparkles,
  Printer,
  Sliders,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Eye,
  EyeOff,
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';
import {
  CustomMockPaper,
  GenerateMockPaperDto
} from '@studentlife/shared';

export const CustomPaperGeneratorView: React.FC = () => {
  const [papers, setPapers] = useState<CustomMockPaper[]>([]);
  const [activePaperId, setActivePaperId] = useState<string>('paper-jee-adv-2026-01');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showSolutions, setShowSolutions] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);

  // Generator Wizard Form State
  const [examType, setExamType] = useState<string>('JEE Advanced');
  const [subject, setSubject] = useState<string>('Physics & Mathematics');
  const [topicsInput, setTopicsInput] = useState<string>('Rotational Dynamics, Calculus Definite Integrals, Electromagnetism');
  const [totalQuestions, setTotalQuestions] = useState<number>(6);
  const [easyPct, setEasyPct] = useState<number>(30);
  const [mediumPct, setMediumPct] = useState<number>(50);
  const [hardPct, setHardPct] = useState<number>(20);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/custom-paper/papers');
      const data = await res.json();
      if (data.success && data.data) {
        setPapers(data.data);
        if (data.data.length > 0 && !activePaperId) {
          setActivePaperId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load papers', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      const dto: GenerateMockPaperDto = {
        examType,
        subject,
        topics: topicsInput.split(',').map(t => t.trim()).filter(Boolean),
        totalQuestions,
        difficultyDistribution: {
          easyPct,
          mediumPct,
          hardPct
        },
        includeSolutions: true
      };

      const res = await fetch('/api/custom-paper/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });

      const json = await res.json();
      if (json.success && json.data) {
        setPapers(prev => [json.data, ...prev]);
        setActivePaperId(json.data.id);
        setSelectedAnswers({});
        setTestSubmitted(false);
        setShowSolutions(false);
      }
    } catch (err) {
      console.error('Failed to generate paper', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const activePaper = papers.find(p => p.id === activePaperId) || papers[0];

  const handleSelectOption = (questionId: string, opt: string) => {
    if (testSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: opt
    }));
  };

  const calculateScore = () => {
    if (!activePaper) return { score: 0, correct: 0, incorrect: 0, unattempted: 0 };
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    activePaper.sections.forEach(sec => {
      sec.questions.forEach(q => {
        const userAns = selectedAnswers[q.id];
        if (!userAns) {
          unattempted++;
        } else if (userAns === q.correctAnswer || (q.options && userAns.startsWith(q.correctAnswer.slice(0, 10)))) {
          correct++;
          score += q.marks;
        } else {
          incorrect++;
          score -= q.negativeMarks;
        }
      });
    });

    return { score, correct, incorrect, unattempted };
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <RefreshCw size={36} color="#f59e0b" className="animate-spin" />
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Loading AI Mock Paper &amp; Test Series Generator...</p>
        </div>
      </div>
    );
  }

  const scoreStats = testSubmitted ? calculateScore() : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Top Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(244, 63, 94, 0.15) 50%, rgba(15, 23, 42, 0.95) 100%)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 0 35px rgba(245, 158, 11, 0.12)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div 
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 50%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)'
              }}
            >
              <FileCheck2 size={28} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                  AI Custom Mock Paper &amp; Test Series
                </h1>
                <span 
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.18)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Sparkles size={12} color="#fbbf24" /> Exam Grade Synthesizer v3.0
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                Generate full-length customized test series with negative marking schemes, difficulty ratios, and instant step-by-step LaTeX solutions.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowSolutions(!showSolutions)}
              className="glow-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                color: showSolutions ? '#f43f5e' : '#38bdf8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {showSolutions ? <EyeOff size={16} color="#f43f5e" /> : <Eye size={16} color="#38bdf8" />}
              {showSolutions ? 'Hide Solutions' : 'Reveal Solution Key'}
            </button>
            <button
              onClick={handlePrint}
              className="glow-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(244, 63, 94, 0.35)'
              }}
            >
              <Printer size={16} />
              Print / PDF Paper
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Side: Paper Generator Settings & Paper Library (4 cols) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Custom Paper Synthesizer Form */}
          <div 
            className="glass-panel"
            style={{
              padding: '24px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
              <Sliders size={18} color="#fbbf24" />
              AI Paper Synthesizer
            </h3>

            <form onSubmit={handleGeneratePaper} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                  Target Exam Domain
                </label>
                <select
                  value={examType}
                  onChange={e => setExamType(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(2, 6, 23, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="JEE Advanced">JEE Advanced (Engineering / IITs)</option>
                  <option value="JEE Main">JEE Main (NITs / IIITs)</option>
                  <option value="NEET UG">NEET UG (Medical / AIIMS)</option>
                  <option value="UPSC Prelims">UPSC Civil Services (GS Prelims)</option>
                  <option value="GATE CS">GATE CS &amp; IT</option>
                  <option value="CBSE 12th Board">CBSE Class 12th Board</option>
                  <option value="CAT &amp; IIMs">CAT &amp; Management (IIM A/B/C)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                  Subject / Domain
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Physics, Data Structures, Economy"
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(2, 6, 23, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                  High-Yield Topics (Comma-separated)
                </label>
                <input
                  type="text"
                  value={topicsInput}
                  onChange={e => setTopicsInput(e.target.value)}
                  placeholder="e.g. Thermodynamics, Modern Physics"
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(2, 6, 23, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                    Total Questions
                  </label>
                  <select
                    value={totalQuestions}
                    onChange={e => setTotalQuestions(Number(e.target.value))}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(2, 6, 23, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      color: '#f8fafc',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value={4}>4 Qs (Micro Mock)</option>
                    <option value={6}>6 Qs (Speed Test)</option>
                    <option value={10}>10 Qs (Sectional Mock)</option>
                    <option value={15}>15 Qs (Grand Mock)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                    Hardness Ratio
                  </label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(2, 6, 23, 0.9)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', padding: '10px 12px', fontSize: '0.75rem', fontWeight: 800 }}>
                    <span style={{ color: '#34d399' }}>{easyPct}% E</span>
                    <span style={{ color: '#fbbf24' }}>{mediumPct}% M</span>
                    <span style={{ color: '#f43f5e' }}>{hardPct}% H</span>
                  </div>
                </div>
              </div>

              {/* Difficulty Slider */}
              <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.5)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Hardness Weight Slider</span>
                  <span style={{ fontSize: '0.8rem', color: '#f43f5e', fontWeight: 800, fontFamily: 'monospace' }}>H: {hardPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hardPct}
                  onChange={e => {
                    const h = Number(e.target.value);
                    const rem = 100 - h;
                    setHardPct(h);
                    setMediumPct(Math.round(rem * 0.6));
                    setEasyPct(Math.round(rem * 0.4));
                  }}
                  style={{ width: '100%', accentColor: '#f43f5e', cursor: 'pointer' }}
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="glow-hover"
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(244, 63, 94, 0.3)',
                  marginTop: '4px'
                }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Synthesizing Test Paper...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Synthesize Custom Mock Paper
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Papers Library */}
          <div 
            className="glass-panel"
            style={{
              padding: '20px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <BookOpen size={16} color="#818cf8" />
              Generated Test Series ({papers.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {papers.map(p => {
                const isActive = p.id === activePaper?.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePaperId(p.id);
                      setSelectedAnswers({});
                      setTestSubmitted(false);
                    }}
                    className="glow-hover"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '14px',
                      borderRadius: '14px',
                      border: isActive ? '1px solid rgba(244, 63, 94, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                      backgroundColor: isActive ? 'rgba(244, 63, 94, 0.15)' : 'rgba(2, 6, 23, 0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 16px rgba(244, 63, 94, 0.2)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span 
                        style={{
                          backgroundColor: isActive ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                          color: isActive ? '#fecdd3' : '#cbd5e1',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.68rem',
                          fontWeight: 800
                        }}
                      >
                        {p.examType}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                        {p.totalMarks} Marks &bull; {p.durationMinutes}m
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isActive ? '#ffffff' : '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {p.totalQuestions} Questions &bull; {p.subject}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Mock Paper Printable Sheet & Interactive Exam Simulator (8 cols) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activePaper ? (
            <div 
              className="glass-panel"
              style={{
                padding: '30px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
              }}
            >
              
              {/* Formal Exam Paper Header */}
              <div 
                style={{
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '20px',
                  backgroundColor: 'rgba(2, 6, 23, 0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.15em', color: '#fbbf24', textTransform: 'uppercase' }}>
                  {activePaper.examType.toUpperCase()} ALL-INDIA STANDARDIZED ASSESSMENT
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                  {activePaper.title}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: '#94a3b8', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', width: '100%' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'monospace' }}>
                    <Clock size={14} color="#38bdf8" />
                    Duration: {activePaper.durationMinutes} Minutes
                  </span>
                  <span>&bull;</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'monospace' }}>
                    <Award size={14} color="#fbbf24" />
                    Maximum Marks: {activePaper.totalMarks}
                  </span>
                  <span>&bull;</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'monospace' }}>
                    <Target size={14} color="#f43f5e" />
                    Total Questions: {activePaper.totalQuestions}
                  </span>
                </div>
              </div>

              {/* Score card when submitted */}
              {testSubmitted && scoreStats && (
                <div 
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Score</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', marginTop: '4px' }}>
                      {scoreStats.score} <span style={{ fontSize: '1rem', color: '#64748b' }}>/ {activePaper.totalMarks}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Accuracy Rate</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34d399', fontFamily: 'monospace', marginTop: '4px' }}>
                      {scoreStats.correct + scoreStats.incorrect > 0
                        ? Math.round((scoreStats.correct / (scoreStats.correct + scoreStats.incorrect)) * 100)
                        : 0}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Result Breakdown</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, fontFamily: 'monospace', marginTop: '6px' }}>
                      <span style={{ color: '#34d399' }}>{scoreStats.correct} Correct</span> &bull; <span style={{ color: '#f43f5e' }}>{scoreStats.incorrect} Wrong</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setTestSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className="glow-hover"
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#f8fafc',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Reset &amp; Retake
                  </button>
                </div>
              )}

              {/* Sections and Questions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {activePaper.sections.map((section, sIdx) => (
                  <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div 
                      style={{
                        backgroundColor: 'rgba(30, 41, 59, 0.7)',
                        padding: '12px 18px',
                        borderRadius: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>{section.title}</span>
                      <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontFamily: 'monospace', fontWeight: 700 }}>Weightage: {section.weightageMarks} Marks</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {section.questions.map((q, qIdx) => {
                        const isHard = q.difficulty === 'HARD';
                        const isMed = q.difficulty === 'MEDIUM';
                        const diffColor = isHard ? '#f43f5e' : isMed ? '#fbbf24' : '#34d399';
                        const diffBg = isHard ? 'rgba(244, 63, 94, 0.15)' : isMed ? 'rgba(245, 158, 11, 0.15)' : 'rgba(52, 211, 153, 0.15)';
                        const diffBorder = isHard ? 'rgba(244, 63, 94, 0.3)' : isMed ? 'rgba(245, 158, 11, 0.3)' : 'rgba(52, 211, 153, 0.3)';

                        return (
                          <div
                            key={q.id}
                            className="glow-hover"
                            style={{
                              backgroundColor: 'rgba(2, 6, 23, 0.65)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '18px',
                              padding: '20px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '14px',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {/* Question Meta header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span 
                                  style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                                    color: '#38bdf8',
                                    border: '1px solid rgba(56, 189, 248, 0.3)',
                                    fontFamily: 'monospace',
                                    fontWeight: 800,
                                    fontSize: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  {q.questionNumber || qIdx + 1}
                                </span>
                                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Topic: {q.topic}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace' }}>
                                <span 
                                  style={{
                                    backgroundColor: diffBg,
                                    color: diffColor,
                                    border: `1px solid ${diffBorder}`,
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.68rem',
                                    fontWeight: 800
                                  }}
                                >
                                  {q.difficulty}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>+{q.marks} / -{q.negativeMarks}</span>
                              </div>
                            </div>

                            {/* Question Text */}
                            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                              {q.questionText}
                            </div>

                            {/* Options if MCQ */}
                            {q.options && q.options.length > 0 && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', paddingTop: '4px' }}>
                                {q.options.map((opt, optIdx) => {
                                  const isOptionChosen = selectedAnswers[q.id] === opt;
                                  let optBg = 'rgba(15, 23, 42, 0.8)';
                                  let optBorder = 'rgba(255, 255, 255, 0.08)';
                                  let optText = '#cbd5e1';

                                  if (testSubmitted) {
                                    if (opt === q.correctAnswer || opt.startsWith(q.correctAnswer.slice(0, 10))) {
                                      optBg = 'rgba(6, 78, 59, 0.35)';
                                      optBorder = 'rgba(52, 211, 153, 0.6)';
                                      optText = '#a7f3d0';
                                    } else if (isOptionChosen) {
                                      optBg = 'rgba(136, 19, 55, 0.35)';
                                      optBorder = 'rgba(244, 63, 94, 0.6)';
                                      optText = '#fecdd3';
                                    }
                                  } else if (isOptionChosen) {
                                    optBg = 'rgba(245, 158, 11, 0.2)';
                                    optBorder = '#fbbf24';
                                    optText = '#fde68a';
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => handleSelectOption(q.id, opt)}
                                      style={{
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        border: `1px solid ${optBorder}`,
                                        backgroundColor: optBg,
                                        color: optText,
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        textAlign: 'left',
                                        cursor: testSubmitted ? 'default' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        transition: 'all 0.15s ease'
                                      }}
                                    >
                                      <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#64748b' }}>
                                        {String.fromCharCode(65 + optIdx)}.
                                      </span>
                                      <span style={{ flex: 1 }}>{opt}</span>
                                      {testSubmitted && (opt === q.correctAnswer || opt.startsWith(q.correctAnswer.slice(0, 10))) && (
                                        <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0 }} />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Solution breakdown (if revealed or submitted) */}
                            {(showSolutions || testSubmitted) && (
                              <div 
                                style={{
                                  marginTop: '8px',
                                  padding: '16px',
                                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                  border: '1px solid rgba(56, 189, 248, 0.25)',
                                  borderRadius: '14px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '8px'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#38bdf8', fontSize: '0.82rem' }}>
                                  <Sparkles size={14} />
                                  Detailed LaTeX Solution &amp; Conceptual Derivation:
                                </div>
                                <div style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                  {q.detailedSolution}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontFamily: 'monospace', fontWeight: 700 }}>
                                  Correct Key: {q.correctAnswer}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit / Finish Test Actions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} color="#fbbf24" />
                  <span>Answer questions before submitting to calculate verified score and accuracy.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {!testSubmitted ? (
                    <button
                      onClick={() => setTestSubmitted(true)}
                      className="glow-hover"
                      style={{
                        padding: '11px 24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)'
                      }}
                    >
                      <CheckCircle2 size={16} />
                      Submit &amp; Grade Test
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSolutions(true)}
                      className="glow-hover"
                      style={{
                        padding: '10px 20px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: '#6366f1',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      Inspect Full Solutions
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div 
              className="glass-panel"
              style={{ padding: '48px', borderRadius: '24px', textAlign: 'center', color: '#64748b' }}
            >
              No paper selected. Synthesize a new paper from the panel on the left!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CustomPaperGeneratorView;
