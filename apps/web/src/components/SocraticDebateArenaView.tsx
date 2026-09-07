import React, { useState, useEffect } from 'react';
import {
  Swords,
  Sparkles,
  Send,
  AlertTriangle,
  Trophy,
  Bot,
  User,
  Plus
} from 'lucide-react';
import {
  DebateSession,
  DebatePersona,
  StartDebateDto,
  SubmitArgumentDto
} from '@studentlife/shared';

interface SocraticDebateArenaViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const SocraticDebateArenaView: React.FC<SocraticDebateArenaViewProps> = ({ onAddXp }) => {
  const [session, setSession] = useState<DebateSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userArgument, setUserArgument] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newTopicMotion, setNewTopicMotion] = useState<string>('Quantum Computing Will Render Classical RSA Encryption Obsolete in 5 Years');
  const [selectedPersona, setSelectedPersona] = useState<DebatePersona>('STRICT_EXAMINER');

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/socratic-debate/session-demo');
      const data = await res.json();
      if (data.success && data.data) {
        setSession(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch debate session', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewDebate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dto: StartDebateDto = {
        topicMotion: newTopicMotion,
        persona: selectedPersona
      };
      const res = await fetch('/api/socratic-debate/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSession(data.data);
        setShowNewModal(false);
        onAddXp?.(20, 'Initiated Socratic Debate Arena');
      }
    } catch (err) {
      console.error('Failed to start debate', err);
    }
  };

  const handleSubmitArgument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !userArgument.trim()) return;

    try {
      setIsSubmitting(true);
      const dto: SubmitArgumentDto = {
        sessionId: session.id,
        userArgument
      };
      const res = await fetch('/api/socratic-debate/rebut', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSession(data.data);
        setUserArgument('');
        onAddXp?.(25, 'Delivered Counter-Rebuttal in Socratic Arena');
      }
    } catch (err) {
      console.error('Failed to submit argument', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !session) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Swords size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Connecting to AI Adversarial Socratic Opponent...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
              <Sparkles size={12} /> PHASE 52 &bull; ADVERSARIAL THESIS DEFENDER
            </span>
            <span className="badge badge-completed">
              Persona: {session.persona.replace('_', ' ')}
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            AI Socratic Debate <span className="gradient-text">Arena ⚔️</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Defend complex academic theses under adversarial Socratic scrutiny with live logical fallacy detection.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
        >
          <Plus size={14} /> New Debate Topic
        </button>
      </div>

      {/* Motion Bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid var(--accent-primary)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
          ACTIVE MOTION:
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
          "{session.topicMotion}"
        </div>
      </div>

      {/* Debate Chat Feed & Scorecard */}
      <div style={{ display: 'grid', gridTemplateColumns: session.scorecard ? '1.4fr 1fr' : '1fr', gap: '20px' }}>
        {/* Left: Chat Turns */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '480px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto', paddingRight: '8px' }}>
            {session.turns.map((turn, idx) => {
              const isAi = turn.speaker === 'AI';
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAi ? 'flex-start' : 'flex-end',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isAi ? <Bot size={13} color="#c084fc" /> : <User size={13} color="#38bdf8" />}
                    <strong>{isAi ? `AI (${session.persona.replace('_', ' ')})` : 'You'}</strong> &bull; {turn.timestamp}
                  </div>

                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '14px 18px',
                      borderRadius: isAi ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                      backgroundColor: isAi ? 'rgba(30, 27, 75, 0.7)' : 'rgba(14, 116, 144, 0.5)',
                      border: isAi ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      color: '#ffffff'
                    }}
                  >
                    {turn.content}

                    {turn.fallacyDetected && (
                      <div style={{
                        marginTop: '10px',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        fontSize: '0.75rem',
                        color: '#fca5a5',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <AlertTriangle size={12} />
                        Logical Fallacy: {turn.fallacyDetected}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Argument Input Form */}
          {!session.isCompleted ? (
            <form onSubmit={handleSubmitArgument} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input
                type="text"
                value={userArgument}
                onChange={(e) => setUserArgument(e.target.value)}
                placeholder="Type your rebuttal or empirical counter-argument..."
                className="glass-input"
                style={{ flex: 1, padding: '12px 16px', fontSize: '0.9rem' }}
                disabled={isSubmitting}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={16} />
                {isSubmitting ? 'Countering...' : 'Deliver Rebuttal'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem' }}>
              🏆 Debate Session Concluded! Review your Dialectical Scorecard.
            </div>
          )}
        </div>

        {/* Right: Scorecard (If Completed) */}
        {session.scorecard && (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Trophy size={24} color="#fbbf24" />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Formal Debate Scorecard</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Adversarial Examination Review</div>
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(9, 13, 22, 0.8)',
              border: '1px solid var(--border-glass)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>
                {session.scorecard.overallScore}/100
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cumulative Argumentation Rating</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Logical Coherence</span>
                <span style={{ fontWeight: 800, color: '#38bdf8' }}>{session.scorecard.logicalCoherence}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Evidence & Proof Weight</span>
                <span style={{ fontWeight: 800, color: '#818cf8' }}>{session.scorecard.evidenceWeight}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fallacy Resistance</span>
                <span style={{ fontWeight: 800, color: '#34d399' }}>{session.scorecard.fallacyResistance}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Persuasive Impact</span>
                <span style={{ fontWeight: 800, color: '#fbbf24' }}>{session.scorecard.persuasiveness}%</span>
              </div>
            </div>

            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-glass)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4
            }}>
              {session.scorecard.summaryFeedback}
            </div>
          </div>
        )}
      </div>

      {/* New Debate Modal */}
      {showNewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
              Launch Socratic Debate Match ⚔️
            </h3>

            <form onSubmit={handleStartNewDebate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Debate Motion / Thesis Statement
                </label>
                <input
                  type="text"
                  value={newTopicMotion}
                  onChange={(e) => setNewTopicMotion(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  AI Adversary Persona
                </label>
                <select
                  value={selectedPersona}
                  onChange={(e) => setSelectedPersona(e.target.value as any)}
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px' }}
                >
                  <option value="STRICT_EXAMINER">Strict PhD Defense Examiner</option>
                  <option value="SKEPTICAL_PEER">Skeptical Rival Peer</option>
                  <option value="DIALECTICAL_PHILOSOPHER">Dialectical Socratic Philosopher</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                >
                  Start Debate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
