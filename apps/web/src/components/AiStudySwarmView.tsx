import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  GraduationCap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GroupVivaSession, SwarmMessage } from '@studentlife/shared';

interface AiStudySwarmViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const AiStudySwarmView: React.FC<AiStudySwarmViewProps> = ({ onAddXp }) => {
  const [session, setSession] = useState<GroupVivaSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isSubmittingQuery, setIsSubmittingQuery] = useState<boolean>(false);
  const [vivaAnswerInput, setVivaAnswerInput] = useState<string>('');
  const [isSubmittingViva, setIsSubmittingViva] = useState<boolean>(false);
  const [newTopicInput, setNewTopicInput] = useState<string>('');

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/study-swarm/session');
      const json = await res.json();
      if (json.success && json.data) {
        setSession(json.data);
      }
    } catch (err) {
      console.error('Failed to load study swarm session', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewTopic = async () => {
    if (!newTopicInput.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/study-swarm/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectTopic: newTopicInput.trim() }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSession(json.data);
        setNewTopicInput('');
        onAddXp?.(20, 'Initialized Autonomous Study Swarm Circle');
      }
    } catch (err) {
      console.error('Failed to start new topic', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendQuery = async () => {
    if (!inputQuery.trim() || !session) return;
    setIsSubmittingQuery(true);
    try {
      const res = await fetch('/api/study-swarm/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          questionOrDoubt: inputQuery.trim(),
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSession(json.data);
        setInputQuery('');
        onAddXp?.(15, 'Engaged in Autonomous Multi-Agent Swarm Debate');
      }
    } catch (err) {
      console.error('Failed to post query', err);
    } finally {
      setIsSubmittingQuery(false);
    }
  };

  const handleSubmitViva = async () => {
    if (!vivaAnswerInput.trim() || !session) return;
    setIsSubmittingViva(true);
    try {
      const res = await fetch('/api/study-swarm/viva/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          studentAnswer: vivaAnswerInput.trim(),
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSession(json.data);
        setVivaAnswerInput('');
        onAddXp?.(45, 'Completed Group Viva Oral Examination');
      }
    } catch (err) {
      console.error('Failed to submit viva answer', err);
    } finally {
      setIsSubmittingViva(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div className="glass-panel glow-hover" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
        borderLeft: '4px solid #6366f1',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-completed">
                <Bot size={13} /> PHASE 66: AUTONOMOUS STUDY BUDDY SWARM
              </span>
              <span className="badge badge-active">3-AGENT AI STUDY CIRCLE + VIVA</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              AI Study Buddy Swarm & <span className="gradient-text">Group Viva Simulator</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Form an autonomous peer study circle with specialized AI personas and defend your understanding against an oral viva examiner.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="e.g. Quantum Computing: Grover Search..."
              value={newTopicInput}
              onChange={(e) => setNewTopicInput(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-glass)',
                color: '#fff',
                fontSize: '0.85rem',
                minWidth: '240px',
              }}
            />
            <button
              className="btn btn-primary"
              onClick={handleStartNewTopic}
              disabled={isLoading || !newTopicInput.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Sparkles size={14} /> New Swarm Circle
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Connecting to autonomous peer study circle agents...
        </div>
      ) : session ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 340px) 1fr', gap: '20px' }}>
          {/* Left Column: Active Peer Personas & Viva Rubric */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Peer Cards */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={16} color="#818cf8" /> Autonomous Study Buddies
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {session.peers.map((peer) => (
                  <div
                    key={peer.id}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-glass)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                        <span>{peer.avatarEmoji}</span>
                        <span>{peer.name}</span>
                      </div>
                      <span className="badge" style={{ fontSize: '0.7rem', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                        {peer.confidenceLevel}% Mastery
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {peer.specialty}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group Viva Box */}
            <div className="glass-panel" style={{ padding: '20px', borderLeft: '3px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <GraduationCap size={18} color="#fbbf24" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fbbf24' }}>Oral Viva Examiner</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                {session.currentQuestion || 'Oral evaluation question ready for candidate response.'}
              </p>

              {session.studentAnswerGrade ? (
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  marginBottom: '12px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#34d399', fontSize: '0.85rem' }}>
                      Evaluation Score: {session.studentAnswerGrade.scorePercent}%
                    </span>
                    <span className="badge badge-completed">+{session.studentAnswerGrade.awardedXp} XP</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {session.studentAnswerGrade.critique}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>
                    <strong>Key Nuances to Solidify:</strong>
                    <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0' }}>
                      {session.studentAnswerGrade.missedPoints.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}

              <textarea
                placeholder="Type your verbal defense / proof explanation to the professor..."
                value={vivaAnswerInput}
                onChange={(e) => setVivaAnswerInput(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-glass)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  marginBottom: '8px',
                  resize: 'none',
                }}
              />
              <button
                className="btn btn-secondary"
                onClick={handleSubmitViva}
                disabled={isSubmittingViva || !vivaAnswerInput.trim()}
                style={{ width: '100%', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              >
                <CheckCircle2 size={14} /> Submit Viva Answer (+45 XP)
              </button>
            </div>
          </div>

          {/* Right Column: Live Study Circle Discussion Feed */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '620px' }}>
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{session.subjectTopic}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-Time Autonomous Agent Swarm Feed</span>
              </div>
              <span className="badge badge-active" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399' }} /> Live Multi-Agent Swarm
              </span>
            </div>

            {/* Messages Container */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '8px' }}>
              {session.messages.map((msg: SwarmMessage) => {
                const isStudent = msg.senderRole === 'STUDENT';
                const isProf = msg.senderRole === 'PROFESSOR';
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isStudent ? 'flex-end' : 'flex-start',
                      maxWidth: isStudent ? '80%' : '88%',
                      backgroundColor: isStudent
                        ? 'rgba(99, 102, 241, 0.25)'
                        : isProf
                        ? 'rgba(245, 158, 11, 0.15)'
                        : 'rgba(15, 23, 42, 0.7)',
                      border: isStudent
                        ? '1px solid rgba(99, 102, 241, 0.4)'
                        : isProf
                        ? '1px solid rgba(245, 158, 11, 0.3)'
                        : '1px solid var(--border-glass)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '16px' }}>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: isStudent ? '#818cf8' : isProf ? '#fbbf24' : '#38bdf8',
                      }}>
                        {msg.senderName}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5, margin: 0 }}>
                      {msg.content}
                    </p>

                    {msg.mathSnippet && (
                      <div style={{
                        marginTop: '8px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: '#34d399',
                        borderLeft: '2px solid #34d399',
                      }}>
                        <code>{msg.mathSnippet}</code>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Ask the study buddies a doubt or challenge a peer derivation..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendQuery();
                }}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-glass)',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              />
              <button
                className="btn btn-primary"
                onClick={handleSendQuery}
                disabled={isSubmittingQuery || !inputQuery.trim()}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 20px' }}
              >
                <Send size={15} /> Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: '#f87171' }}>
          <AlertCircle size={24} style={{ marginBottom: '8px' }} />
          <div>Unable to load session data.</div>
        </div>
      )}
    </div>
  );
};
