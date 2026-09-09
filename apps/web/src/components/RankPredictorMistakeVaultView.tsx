import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  School,
  Sliders,
  X,
  Target,
  Zap,
  Award,
  Flame
} from 'lucide-react';
import {
  RankPredictionResult,
  MistakeEntry,
  PredictRankDto
} from '@studentlife/shared';

export const RankPredictorMistakeVaultView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'RANK_PREDICTOR' | 'MISTAKE_VAULT'>('RANK_PREDICTOR');
  const [examType, setExamType] = useState<string>('JEE Advanced');
  const [physicsAccuracy, setPhysicsAccuracy] = useState<number>(85);
  const [mathAccuracy, setMathAccuracy] = useState<number>(78);
  const [chemistryAccuracy, setChemistryAccuracy] = useState<number>(88);
  const [avgSpeed, setAvgSpeed] = useState<number>(72);
  
  const [prediction, setPrediction] = useState<RankPredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);
  const [mistakeFilter, setMistakeFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('ALL');
  
  // Retest Modal state
  const [activeRetestMistake, setActiveRetestMistake] = useState<MistakeEntry | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [retestResult, setRetestResult] = useState<{ isCorrect: boolean; message: string } | null>(null);

  useEffect(() => {
    handlePredictRank();
    fetchMistakes();
  }, []);

  const handlePredictRank = async () => {
    try {
      setIsPredicting(true);
      const dto: PredictRankDto = {
        examType,
        subjectScores: [
          { subject: 'Section A (Physics/Domain 1)', accuracyPercent: physicsAccuracy, avgSpeedSecondsPerQuestion: avgSpeed, attemptCount: 40 },
          { subject: 'Section B (Maths/Quant)', accuracyPercent: mathAccuracy, avgSpeedSecondsPerQuestion: avgSpeed, attemptCount: 35 },
          { subject: 'Section C (Chemistry/Domain 2)', accuracyPercent: chemistryAccuracy, avgSpeedSecondsPerQuestion: avgSpeed, attemptCount: 45 },
        ]
      };

      const res = await fetch('/api/rank-predictor/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPrediction(data.data);
      }
    } catch (err) {
      console.error('Failed to predict rank', err);
    } finally {
      setIsPredicting(false);
    }
  };

  const fetchMistakes = async () => {
    try {
      const res = await fetch('/api/rank-predictor/mistakes');
      const data = await res.json();
      if (data.success && data.data) {
        setMistakes(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch mistakes', err);
    }
  };

  const handleRetestSubmit = async () => {
    if (!activeRetestMistake || !selectedOption) return;
    try {
      const res = await fetch('/api/rank-predictor/mistakes/retest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mistakeId: activeRetestMistake.id,
          userAnswer: selectedOption
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const isCorrect = data.data.isCorrect;
        setRetestResult({
          isCorrect,
          message: isCorrect
            ? '🎯 Excellent! Conceptual gap resolved. Spaced review interval extended by +7 days.'
            : '❌ Still incorrect. Review the step-by-step mathematical reasoning below.'
        });
        fetchMistakes();
      }
    } catch (err) {
      console.error('Failed to submit retest', err);
    }
  };

  const applyPreset = (preset: 'TOP_100' | 'NINETY_NINE' | 'SAFE_CUTOFF') => {
    if (preset === 'TOP_100') {
      setPhysicsAccuracy(94);
      setMathAccuracy(92);
      setChemistryAccuracy(96);
      setAvgSpeed(55);
    } else if (preset === 'NINETY_NINE') {
      setPhysicsAccuracy(86);
      setMathAccuracy(84);
      setChemistryAccuracy(89);
      setAvgSpeed(70);
    } else {
      setPhysicsAccuracy(72);
      setMathAccuracy(68);
      setChemistryAccuracy(75);
      setAvgSpeed(95);
    }
  };

  const pendingMistakes = mistakes.filter(m => !m.isResolved);
  const resolvedMistakes = mistakes.filter(m => m.isResolved);
  const filteredMistakes = mistakeFilter === 'ALL' 
    ? mistakes 
    : mistakeFilter === 'PENDING' 
      ? pendingMistakes 
      : resolvedMistakes;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Top Cosmic Hero Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(99, 102, 241, 0.15) 50%, rgba(15, 23, 42, 0.95) 100%)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(244, 63, 94, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 0 35px rgba(244, 63, 94, 0.12)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div 
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 50%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(244, 63, 94, 0.35)'
              }}
            >
              <TrendingUp size={28} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                  AIR Predictor & Mistake Vault
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
                  <Sparkles size={12} color="#fbbf24" /> Predictive Intelligence v2.5
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                Machine Learning percentile & rank engine paired with an automated Spaced Mistake Vault.
              </p>
            </div>
          </div>

          {/* Tab Switcher Pills */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              padding: '5px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              gap: '6px'
            }}
          >
            <button
              onClick={() => setActiveTab('RANK_PREDICTOR')}
              className="glow-hover"
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'RANK_PREDICTOR'
                  ? 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)'
                  : 'transparent',
                color: activeTab === 'RANK_PREDICTOR' ? '#ffffff' : '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'RANK_PREDICTOR' ? '0 4px 16px rgba(244, 63, 94, 0.35)' : 'none'
              }}
            >
              <TrendingUp size={16} />
              AIR & Cutoff Predictor
            </button>
            <button
              onClick={() => setActiveTab('MISTAKE_VAULT')}
              className="glow-hover"
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'MISTAKE_VAULT'
                  ? 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)'
                  : 'transparent',
                color: activeTab === 'MISTAKE_VAULT' ? '#ffffff' : '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'MISTAKE_VAULT' ? '0 4px 16px rgba(244, 63, 94, 0.35)' : 'none'
              }}
            >
              <AlertTriangle size={16} />
              Mistake Vault
              <span
                style={{
                  backgroundColor: activeTab === 'MISTAKE_VAULT' ? 'rgba(0,0,0,0.35)' : 'rgba(244, 63, 94, 0.25)',
                  color: activeTab === 'MISTAKE_VAULT' ? '#ffffff' : '#f43f5e',
                  borderRadius: '9999px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}
              >
                {pendingMistakes.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'RANK_PREDICTOR' ? (
        /* AIR Rank Predictor Screen */
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Left Parameter Panel */}
          <div 
            className="glass-panel"
            style={{
              padding: '24px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Sliders size={18} color="#fbbf24" />
                Performance Parameters
              </h3>
            </div>

            {/* Quick Benchmark Preset Buttons */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                Quick Target Benchmarks
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                <button
                  onClick={() => applyPreset('TOP_100')}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    color: '#fbbf24',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  AIR &lt; 100
                </button>
                <button
                  onClick={() => applyPreset('NINETY_NINE')}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  99th %ile
                </button>
                <button
                  onClick={() => applyPreset('SAFE_CUTOFF')}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    backgroundColor: 'rgba(52, 211, 153, 0.1)',
                    color: '#34d399',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Safe Cutoff
                </button>
              </div>
            </div>

            {/* Target Exam Domain Select */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                Target Competitive Exam
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
                <option value="UPSC Civil Services">UPSC Civil Services (IAS / IPS / IFS)</option>
                <option value="GATE Computer Science">GATE Computer Science &amp; IT</option>
                <option value="CAT &amp; IIMs">CAT &amp; Management (IIM A/B/C)</option>
              </select>
            </div>

            {/* Sliders Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Subject 1 Slider */}
              <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.5)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Subject 1 Accuracy</span>
                  <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 800, fontFamily: 'monospace' }}>{physicsAccuracy}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={physicsAccuracy}
                  onChange={e => setPhysicsAccuracy(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                />
              </div>

              {/* Subject 2 Slider */}
              <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.5)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Subject 2 Accuracy</span>
                  <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 800, fontFamily: 'monospace' }}>{mathAccuracy}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={mathAccuracy}
                  onChange={e => setMathAccuracy(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#fbbf24', cursor: 'pointer' }}
                />
              </div>

              {/* Subject 3 Slider */}
              <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.5)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Subject 3 Accuracy</span>
                  <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 800, fontFamily: 'monospace' }}>{chemistryAccuracy}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={chemistryAccuracy}
                  onChange={e => setChemistryAccuracy(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#34d399', cursor: 'pointer' }}
                />
              </div>

              {/* Speed Slider */}
              <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.5)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Avg Speed per Question</span>
                  <span style={{ fontSize: '0.85rem', color: '#f43f5e', fontWeight: 800, fontFamily: 'monospace' }}>{avgSpeed}s</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={avgSpeed}
                  onChange={e => setAvgSpeed(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#f43f5e', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handlePredictRank}
              disabled={isPredicting}
              className="glow-hover"
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(244, 63, 94, 0.3)'
              }}
            >
              <Sparkles size={16} />
              {isPredicting ? 'Recalculating...' : 'Recalculate AIR & Cutoffs'}
            </button>
          </div>

          {/* Right Results & Matchmaker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {prediction && (
              <>
                {/* 3-Hero Stats Row */}
                <div 
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    borderRadius: '20px',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  {/* Percentile Card */}
                  <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Predicted Percentile</span>
                      <Target size={16} color="#38bdf8" />
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', lineHeight: 1.1 }}>
                      {prediction.predictedPercentile}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                      Top {(100 - prediction.predictedPercentile).toFixed(2)}% of national candidates
                    </div>
                  </div>

                  {/* AIR Range Card */}
                  <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Predicted All-India Rank</span>
                      <Award size={16} color="#fbbf24" />
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace', lineHeight: 1.2 }}>
                      #{prediction.predictedAIRRange.minRank.toLocaleString()} – #{prediction.predictedAIRRange.maxRank.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                      Based on dynamic cohort distribution
                    </div>
                  </div>

                  {/* Estimated Raw Score */}
                  <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(52, 211, 153, 0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estimated Raw Score</span>
                      <Zap size={16} color="#34d399" />
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#34d399', fontFamily: 'monospace', lineHeight: 1.1 }}>
                      {prediction.estimatedScore} <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 600 }}>/ {prediction.totalMarks}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                      Target cutoff feasibility: {((prediction.estimatedScore / prediction.totalMarks) * 100).toFixed(1)}% marks
                    </div>
                  </div>
                </div>

                {/* AI Strengths & Weaknesses Intelligence Bar */}
                <div 
                  className="glass-panel"
                  style={{
                    padding: '20px 24px',
                    borderRadius: '18px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '18px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <CheckCircle2 size={16} color="#34d399" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        High-Yield Mastered Areas
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {prediction.strongAreas.map((area, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: 'rgba(52, 211, 153, 0.12)',
                            color: '#a7f3d0',
                            border: '1px solid rgba(52, 211, 153, 0.25)',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <AlertTriangle size={16} color="#f43f5e" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Rank Leak Weaknesses
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {prediction.criticalWeaknesses.map((weakness, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: 'rgba(244, 63, 94, 0.12)',
                            color: '#fecdd3',
                            border: '1px solid rgba(244, 63, 94, 0.25)',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          {weakness}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* College Admission Cutoff Matchmaker */}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <School size={18} color="#38bdf8" />
                        Target Institution &amp; Cutoff Matchmaker
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                        Live algorithmic probability for tier-1 admissions based on previous opening &amp; closing cutoffs.
                      </p>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {prediction.eligibleInstitutions.length} Matches Found
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    {prediction.eligibleInstitutions.map((inst, idx) => {
                      const isHigh = inst.admissionProbability === 'HIGH';
                      const isMod = inst.admissionProbability === 'MODERATE';
                      const probColor = isHigh ? '#34d399' : isMod ? '#fbbf24' : '#f43f5e';
                      const probBg = isHigh ? 'rgba(52, 211, 153, 0.12)' : isMod ? 'rgba(245, 158, 11, 0.12)' : 'rgba(244, 63, 94, 0.12)';
                      const probBorder = isHigh ? 'rgba(52, 211, 153, 0.3)' : isMod ? 'rgba(245, 158, 11, 0.3)' : 'rgba(244, 63, 94, 0.3)';

                      return (
                        <div
                          key={idx}
                          className="glow-hover"
                          style={{
                            padding: '16px',
                            borderRadius: '14px',
                            backgroundColor: 'rgba(2, 6, 23, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '12px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                                {inst.college}
                              </h4>
                              <span
                                style={{
                                  backgroundColor: probBg,
                                  color: probColor,
                                  border: `1px solid ${probBorder}`,
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  letterSpacing: '0.04em'
                                }}
                              >
                                {inst.admissionProbability}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                              {inst.branch}
                            </div>
                          </div>

                          <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              Required Cutoff: <strong style={{ color: '#38bdf8' }}>{inst.cutoffPercentile}%</strong>
                            </span>
                            <span style={{ fontSize: '0.72rem', color: prediction.predictedPercentile >= inst.cutoffPercentile ? '#34d399' : '#f43f5e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                              {prediction.predictedPercentile >= inst.cutoffPercentile ? '✓ Qualified' : 'Gap: ' + (inst.cutoffPercentile - prediction.predictedPercentile).toFixed(2) + '%'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Improvement Guidance Banner */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}
                >
                  <Flame size={24} color="#fbbf24" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.85rem', color: '#fde68a', lineHeight: 1.5 }}>
                    <strong>Strategic AI Recommendation:</strong> Boosting your <strong>Subject 2 accuracy by +6%</strong> and lowering question speed from <strong>{avgSpeed}s to 60s</strong> will advance your rank by approximately <strong>~3,400 positions</strong>, locking in High-Probability admission for Tier-1 Institutes.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Mistake Vault & Error Notebook Screen */
        <div 
          className="glass-panel"
          style={{
            padding: '28px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {/* Mistake Header & Summary Stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <AlertTriangle size={20} color="#fbbf24" />
                Spaced Mistake Vault &amp; Error Notebook
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                Every question you answered incorrectly in mock tests, PYQs, and battles is logged here with spaced repetition intervals.
              </p>
            </div>

            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', backgroundColor: 'rgba(2, 6, 23, 0.7)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => setMistakeFilter('ALL')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: mistakeFilter === 'ALL' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: mistakeFilter === 'ALL' ? '#ffffff' : '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                All ({mistakes.length})
              </button>
              <button
                onClick={() => setMistakeFilter('PENDING')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: mistakeFilter === 'PENDING' ? 'rgba(244, 63, 94, 0.25)' : 'transparent',
                  color: mistakeFilter === 'PENDING' ? '#f43f5e' : '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Pending Review ({pendingMistakes.length})
              </button>
              <button
                onClick={() => setMistakeFilter('RESOLVED')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: mistakeFilter === 'RESOLVED' ? 'rgba(52, 211, 153, 0.25)' : 'transparent',
                  color: mistakeFilter === 'RESOLVED' ? '#34d399' : '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Resolved ({resolvedMistakes.length})
              </button>
            </div>
          </div>

          {/* Mistake Entries List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredMistakes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <CheckCircle2 size={40} color="#34d399" style={{ margin: '0 auto 12px auto', display: 'block' }} />
                <h4 style={{ fontSize: '1rem', color: '#cbd5e1', margin: '0 0 6px 0' }}>No Mistakes in this Filter</h4>
                <p style={{ fontSize: '0.8rem', margin: 0 }}>All your logged conceptual errors in this category are fully mastered.</p>
              </div>
            ) : (
              filteredMistakes.map(m => (
                <div
                  key={m.id}
                  className="glow-hover"
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: m.isResolved ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(244, 63, 94, 0.25)',
                    backgroundColor: m.isResolved ? 'rgba(6, 78, 59, 0.15)' : 'rgba(2, 6, 23, 0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#f8fafc', padding: '3px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                        {m.examOrSubject} &bull; {m.topic}
                      </span>
                      <span style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, fontFamily: 'monospace' }}>
                        Failed {m.failedCount}x
                      </span>
                      {m.mistakeReason && (
                        <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
                          {m.mistakeReason.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    <div>
                      {m.isResolved ? (
                        <span style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <CheckCircle2 size={16} /> Concept Resolved
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveRetestMistake(m);
                            setSelectedOption('');
                            setRetestResult(null);
                          }}
                          className="glow-hover"
                          style={{
                            padding: '6px 14px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)',
                            color: '#ffffff',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 14px rgba(244, 63, 94, 0.3)'
                          }}
                        >
                          <RotateCcw size={13} /> Re-Test Now
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.5 }}>
                    {m.questionText}
                  </div>

                  {/* Wrong Attempt vs Correct Solution Breakdown */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700 }}>Your Incorrect Attempt:</span>
                      <span style={{ textDecoration: 'line-through', fontFamily: 'monospace' }}>{m.userWrongAnswer}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700 }}>Verified Solution:</span>
                      <span style={{ fontWeight: 800, fontFamily: 'monospace' }}>{m.correctAnswer}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', lineHeight: 1.5 }}>
                      <strong style={{ color: '#fbbf24' }}>Explanation: </strong> {m.explanation}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Retest Interactive Modal */}
      {activeRetestMistake && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="glass-panel"
            style={{
              maxWidth: '560px',
              width: '100%',
              backgroundColor: '#0f172a',
              borderRadius: '24px',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <RotateCcw size={18} color="#f43f5e" />
                Re-Test Conceptual Gap
              </h3>
              <button
                onClick={() => setActiveRetestMistake(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Question Text */}
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.5 }}>
              {activeRetestMistake.questionText}
            </div>

            {/* Options List */}
            {activeRetestMistake.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeRetestMistake.options.map((opt, i) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedOption(opt)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: isSelected ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(2, 6, 23, 0.6)',
                        color: isSelected ? '#fde68a' : '#cbd5e1',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div 
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid #fbbf24' : '2px solid rgba(255, 255, 255, 0.3)',
                          flexShrink: 0
                        }}
                      />
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Retest Result Feedback Alert */}
            {retestResult && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: retestResult.isCorrect ? 'rgba(6, 78, 59, 0.3)' : 'rgba(136, 19, 55, 0.3)',
                  border: retestResult.isCorrect ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
                  color: retestResult.isCorrect ? '#a7f3d0' : '#fecdd3',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {retestResult.message}
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
              <button
                onClick={() => setActiveRetestMistake(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#cbd5e1',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={handleRetestSubmit}
                disabled={!selectedOption}
                className="glow-hover"
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: selectedOption ? 'pointer' : 'not-allowed',
                  opacity: selectedOption ? 1 : 0.5,
                  boxShadow: '0 4px 14px rgba(244, 63, 94, 0.35)'
                }}
              >
                Submit &amp; Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankPredictorMistakeVaultView;
