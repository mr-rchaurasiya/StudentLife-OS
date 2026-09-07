import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  HeartPulse,
  Brain,
  Wind,
  ShieldAlert,
  CheckCircle2,
  Smile
} from 'lucide-react';
import { MentalSanctumState, BreathingPaceMode, AnxietyReframingRecord } from '@studentlife/shared';

interface MentalResilienceViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const MentalResilienceView: React.FC<MentalResilienceViewProps> = ({ onAddXp }) => {
  const [sanctumState, setSanctumState] = useState<MentalSanctumState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stressScore, setStressScore] = useState<number>(6);
  const [triggerSource, setTriggerSource] = useState<string>('Upcoming Exam / Deadline Overload');
  const [worryInput, setWorryInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Breathing Pacer State
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'INHALE' | 'HOLD' | 'EXHALE' | 'REST'>('INHALE');
  const [breathCounter, setBreathCounter] = useState<number>(4);

  useEffect(() => {
    fetchSanctum();
  }, []);

  // Breathing animation interval
  useEffect(() => {
    let timer: any;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathCounter((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'INHALE') {
                return 'HOLD';
              } else if (currentPhase === 'HOLD') {
                return 'EXHALE';
              } else {
                return 'INHALE';
              }
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase]);

  const fetchSanctum = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/mental-resilience/state');
      const json = await res.json();
      if (json.success && json.data) {
        setSanctumState(json.data);
      }
    } catch (err) {
      console.error('Failed to load mental sanctum state', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!worryInput.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/mental-resilience/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStressScore: stressScore,
          triggerSource,
          rawWorryText: worryInput.trim(),
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSanctumState(json.data);
        setWorryInput('');
        onAddXp?.(35, 'Completed Socratic Cognitive Reframing & Grounding');
      }
    } catch (err) {
      console.error('Failed to submit check-in', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaceChange = async (mode: BreathingPaceMode) => {
    try {
      const res = await fetch('/api/mental-resilience/breathing/mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSanctumState(json.data);
      }
    } catch (err) {
      console.error('Failed to change breathing mode', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div className="glass-panel glow-hover" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
        borderLeft: '4px solid #10b981',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-completed">
                <HeartPulse size={13} /> PHASE 69: MENTAL RESILIENCE SANCTUM
              </span>
              <span className="badge badge-active">EXAM ANXIETY & BIO-COACHING</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              AI Mental Resilience & <span className="gradient-text">Exam Anxiety Bio-Sanctum</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Paced 4-7-8 box breathing, Socratic cognitive reframing of catastrophizing thoughts, and pre-exam psychological calibration.
            </p>
          </div>

          {sanctumState && (
            <div className="glass-panel" style={{ padding: '12px 20px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Psychological Readiness Index</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                {sanctumState.currentReadinessIndex}% / 100%
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Calibrating bio-resilience sanctum...
        </div>
      ) : sanctumState ? (
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '20px' }}>
          {/* Left Column: Interactive Breathwork Pacer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wind size={16} color="#34d399" /> Paced Breathwork Pacer
                </h3>
                <span className="badge badge-active">Parasympathetic Calming</span>
              </div>

              {/* Mode Selector */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', justifyContent: 'center' }}>
                {(['CALMING_4_7_8', 'BOX_BREATHING_4_4_4_4', 'RAPID_GROUNDING_3_3_3'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handlePaceChange(mode)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: sanctumState.activeBreathingMode === mode ? 'var(--accent-emerald)' : 'rgba(15, 23, 42, 0.6)',
                      color: sanctumState.activeBreathingMode === mode ? '#fff' : 'var(--text-secondary)',
                    }}
                  >
                    {mode.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              {/* Animated Circle Pacer */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
                <div
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    background: isBreathingActive
                      ? 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(6, 182, 212, 0.1) 70%)'
                      : 'rgba(15, 23, 42, 0.6)',
                    border: '3px solid #10b981',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: isBreathingActive ? '0 0 30px rgba(16, 185, 129, 0.4)' : 'none',
                    transition: 'all 0.5s ease',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em' }}>
                    {isBreathingActive ? breathPhase : 'READY'}
                  </span>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                    {isBreathingActive ? breathCounter : '4s'}
                  </span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                style={{ width: '100%', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={15} /> {isBreathingActive ? 'Stop Paced Session' : 'Start 2-Min Paced Breathing'}
              </button>
            </div>

            {/* Quick Grounding Checklist */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smile size={16} color="#fbbf24" /> 5-4-3-2-1 Emergency Grounding
              </h4>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li>👁️ <strong>5 things</strong> you can physically see around you</li>
                <li>✋ <strong>4 things</strong> you can physically feel or touch</li>
                <li>👂 <strong>3 sounds</strong> you can identify in your environment</li>
                <li>👃 <strong>2 scents</strong> you can smell</li>
                <li>👅 <strong>1 positive affirmation</strong> or taste</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Socratic Thought Reframing Engine */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Input Form */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Brain size={18} color="#22d3ee" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Socratic Cognitive Thought Reframer</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                      Subjective Stress / Overwhelm (1 = Calm, 10 = High Panic)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={stressScore}
                        onChange={(e) => setStressScore(Number(e.target.value))}
                        style={{ flex: 1, accentColor: '#10b981' }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: stressScore > 7 ? '#f87171' : '#34d399', minWidth: '24px' }}>
                        {stressScore}/10
                      </span>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                      Primary Trigger Source
                    </label>
                    <select
                      value={triggerSource}
                      onChange={(e) => setTriggerSource(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid var(--border-glass)',
                        color: '#fff',
                        fontSize: '0.85rem',
                      }}
                    >
                      <option value="Upcoming Exam / Deadline Overload">Upcoming Exam / Deadline Overload</option>
                      <option value="Oral Viva & Professor Evaluation">Oral Viva & Professor Evaluation</option>
                      <option value="Internship / Job Placement Rejection">Internship / Job Placement Rejection</option>
                      <option value="Peer Comparison & Imposter Syndrome">Peer Comparison & Imposter Syndrome</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                    What is the catastrophizing thought currently occupying your mind?
                  </label>
                  <textarea
                    placeholder="e.g. 'I didn't finish Topic 4 in the syllabus, so I am guaranteed to fail the entire paper tomorrow...'"
                    value={worryInput}
                    onChange={(e) => setWorryInput(e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid var(--border-glass)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      resize: 'none',
                    }}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleCheckIn}
                  disabled={isSubmitting || !worryInput.trim()}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                >
                  <CheckCircle2 size={15} /> {isSubmitting ? 'Reframing Thought...' : 'Reframe with Socratic Bio-Coaching (+35 XP)'}
                </button>
              </div>
            </div>

            {/* Reframed Records */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} color="#34d399" /> Your Cognitive Reframing Vault ({sanctumState.reframedThoughts.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {sanctumState.reframedThoughts.map((rec: AnxietyReframingRecord) => (
                  <div
                    key={rec.id}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--border-glass)',
                      borderLeft: '4px solid #10b981',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.7rem' }}>
                        Distortion: {rec.cognitiveDistortionTag}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#f87171', marginBottom: '8px', fontStyle: 'italic' }}>
                      "{rec.catastrophizingThought}"
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#34d399', marginBottom: '10px', lineHeight: 1.5 }}>
                      <strong>✨ Socratic Reframe:</strong> {rec.socraticReframe}
                    </div>

                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      fontSize: '0.75rem',
                      color: '#a7f3d0',
                    }}>
                      ⚡ <strong>Micro-Empowerment Action:</strong> {rec.empowermentAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
