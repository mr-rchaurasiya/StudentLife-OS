import React, { useState, useEffect } from 'react';
import {
  MentorHolisticReport,
  MentorActionItem,
  MentorPersonaType,
  MentorChatMessage,
  MentorChatExchangeDto
} from '@studentlife/shared';

interface AiMentorViewProps {
  onNavigateView?: (view: string) => void;
  onAddXp?: (xp: number, reason: string) => void;
}

export const AiMentorView: React.FC<AiMentorViewProps> = ({ onNavigateView, onAddXp }) => {
  const [report, setReport] = useState<MentorHolisticReport | null>(null);
  const [activePersona, setActivePersona] = useState<MentorPersonaType>('STRATEGIC_COACH');
  const [chatMessages, setChatMessages] = useState<MentorChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'AI_MENTOR',
      message: 'Good evening, Alex! I have synthesized your performance across Study, Mock Exams, Career Goals, and Deadlines. Your momentum index is at 91/100 (Peak Momentum 🔥). Let us execute your 3 high-leverage actions for today!',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      actionLink: {
        label: '🎯 Launch DP Drill',
        view: 'QUESTION_BANK'
      }
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchReport(activePersona);
  }, [activePersona]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchReport = async (persona: MentorPersonaType) => {
    try {
      const res = await fetch(`http://localhost:5000/api/ai-mentor/holistic-report?persona=${persona}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) setReport(json.data);
      }
    } catch {
      // Offline fallback
    }
  };

  const handleCompleteAction = async (action: MentorActionItem) => {
    if (action.isCompleted) return;

    try {
      const res = await fetch(`http://localhost:5000/api/ai-mentor/actions/${action.id}/complete`, {
        method: 'POST'
      });
      if (res.ok) {
        const json = await res.json();
        setReport(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            dailyActionPlan: prev.dailyActionPlan.map(a => a.id === action.id ? json.data : a)
          };
        });
        showToast(`🎉 Milestone Executed! +${action.xpReward} XP 🔥`);
        if (onAddXp) onAddXp(action.xpReward, `Completed Mentor Action: ${action.title}`);
      }
    } catch {
      // Local state fallback
      setReport(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          dailyActionPlan: prev.dailyActionPlan.map(a => a.id === action.id ? { ...a, isCompleted: true } : a)
        };
      });
      showToast(`🎉 Milestone Completed! +${action.xpReward} XP 🔥`);
      if (onAddXp) onAddXp(action.xpReward, action.title);
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: MentorChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'STUDENT',
      message: textToSend.trim(),
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const payload: MentorChatExchangeDto = {
        message: textToSend.trim(),
        persona: activePersona
      };

      const res = await fetch('http://localhost:5000/api/ai-mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data;

        const aiMsg: MentorChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'AI_MENTOR',
          message: data.reply,
          timestamp: new Date().toISOString(),
          suggestedActions: data.suggestedActions
        };

        setChatMessages(prev => [...prev, aiMsg]);
      }
    } catch {
      const fallbackAiMsg: MentorChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'AI_MENTOR',
        message: `I have analyzed your request regarding "${textToSend}". Stay consistent with your daily study goals and make sure to review your weak topics!`,
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, fallbackAiMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.95), rgba(147, 51, 234, 0.95))',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(168, 85, 247, 0.4)',
          fontWeight: '600',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          animation: 'fadeIn 0.3s ease'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header Banner & Persona Switcher */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(20, 15, 35, 0.95) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>✨</span>
            <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Personal Mentor 360°
            </h1>
            <span style={{
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#c084fc',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Holistic Guidance Engine
            </span>
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', maxWidth: '740px', lineHeight: '1.5' }}>
            {report ? report.personalizedGreeting : 'Central intelligence correlating study habits, SM-2 memory retention, mock test analytics, career skill gaps, and countdown deadlines into daily optimal execution.'}
          </p>
        </div>

        {/* Persona Switcher Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Coaching Persona:
          </span>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '4px',
            display: 'flex',
            gap: '4px'
          }}>
            {[
              { id: 'STRATEGIC_COACH', label: '🎯 Strategic Coach' },
              { id: 'EMPATHETIC_SUPPORT', label: '🧘 Empathetic' },
              { id: 'DRILL_INSTRUCTOR', label: '⚡ Drill Master' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id as MentorPersonaType)}
                style={{
                  background: activePersona === p.id ? 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' : 'transparent',
                  color: activePersona === p.id ? '#fff' : '#94a3b8',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4-Metric Telemetry Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        {/* Momentum Score */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          borderRadius: '16px',
          padding: '1.25rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 24px rgba(168, 85, 247, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#c084fc', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🌟 Momentum Index
            </span>
            <span style={{ fontSize: '1.25rem' }}>🚀</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#e9d5ff' }}>
            {report ? report.overallStudentHealthScore : 91} <span style={{ fontSize: '1rem', color: '#a855f7' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Peak Performance • 7-Day Active Streak 🔥
          </div>
        </div>

        {/* Burnout Vitality */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '1.25rem',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🧘 Cognitive Vitality
            </span>
            <span style={{ fontSize: '1.25rem' }}>🌿</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#6ee7b7' }}>
            88% <span style={{ fontSize: '0.9rem', color: '#34d399' }}>Optimal</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            3.2h Study • 7.6h Sleep & Rest
          </div>
        </div>

        {/* Daily Action Progress */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '1.25rem',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#60a5fa', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🎯 Daily Action Plan
            </span>
            <span style={{ fontSize: '1.25rem' }}>📋</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#93c5fd' }}>
            {report ? report.dailyActionPlan.filter(a => a.isCompleted).length : 0} / 3
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            High-leverage tasks mapped for today
          </div>
        </div>

        {/* Streak Forecast */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '16px',
          padding: '1.25rem',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🔮 Streak Forecast
            </span>
            <span style={{ fontSize: '1.25rem' }}>⚡</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fde68a', paddingTop: '4px' }}>
            99% 14-Day
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            High habit consistency probability
          </div>
        </div>
      </div>

      {/* Main Grid: Daily Action Plan (Left 7 Cols) + 24/7 AI Mentor Chat (Right 5 Cols) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Action Plan & Cross-Module Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Daily 3-Step Action Plan */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '18px',
            padding: '1.5rem',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc' }}>
                  🎯 Daily 3-Step High-Leverage Action Plan
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                  Mathematically prioritized based on exam point-bleed, memory decay, and application deadlines.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {report?.dailyActionPlan.map((action, index) => (
                <div
                  key={action.id}
                  style={{
                    background: action.isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.7)',
                    border: action.isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    opacity: action.isCompleted ? 0.8 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{
                        background: action.isCompleted ? '#10b981' : 'rgba(168, 85, 247, 0.2)',
                        color: action.isCompleted ? '#fff' : '#c084fc',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        flexShrink: 0
                      }}>
                        {action.isCompleted ? '✓' : index + 1}
                      </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: '#cbd5e1',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '700'
                          }}>
                            {action.pillar.replace('_', ' ')}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            ⏱️ {action.estimatedMinutes} mins
                          </span>
                          <span style={{
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '700'
                          }}>
                            +{action.xpReward} XP
                          </span>
                        </div>
                        <h4 style={{
                          margin: 0,
                          fontSize: '1rem',
                          fontWeight: '700',
                          color: action.isCompleted ? '#94a3b8' : '#f8fafc',
                          textDecoration: action.isCompleted ? 'line-through' : 'none'
                        }}>
                          {action.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCompleteAction(action)}
                      style={{
                        background: action.isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        color: action.isCompleted ? '#34d399' : '#cbd5e1',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {action.isCompleted ? '✅ Completed' : 'Mark Done'}
                    </button>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.4' }}>
                    {action.description}
                  </p>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.78rem'
                  }}>
                    <span style={{ color: '#c084fc' }}>
                      💡 <em>{action.reasoning}</em>
                    </span>
                    {onNavigateView && (
                      <button
                        onClick={() => onNavigateView(action.deepLinkView)}
                        style={{
                          background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Launch Module ➔
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Module Synthesis & Root-Cause Insights */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '18px',
            padding: '1.5rem',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc' }}>
              🧠 Cross-Module Intelligence Insights
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {report?.crossModuleInsights.map(ins => (
                <div
                  key={ins.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: '#f1f5f9', fontSize: '0.9rem' }}>
                      {ins.title}
                    </span>
                    <span style={{
                      background: 'rgba(168, 85, 247, 0.15)',
                      color: '#c084fc',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: '700'
                    }}>
                      {ins.impactPotential.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    <strong>Observation:</strong> {ins.observation}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#fbbf24' }}>
                    <strong>Root Cause:</strong> {ins.rootCauseAnalysis}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#34d399' }}>
                    <strong>Intervention:</strong> {ins.recommendedIntervention}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 24/7 AI Mentor Interactive Chat */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '18px',
          padding: '1.5rem',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          height: '650px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
        }}>
          {/* Chat Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem' }}>💬</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: '700' }}>
                  24/7 Mentor Advisor
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: '600' }}>
                  Active Persona: {activePersona.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '600' }}>Connected</span>
            </div>
          </div>

          {/* Preset Prompts Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '0.75rem' }}>
            {[
              '🎯 What is my #1 priority?',
              '🧠 Fix DP weak area before GATE',
              '🧘 Check my burnout telemetry',
              '💼 Google SWE interview readiness'
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            paddingRight: '4px'
          }}>
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'STUDENT' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  background: msg.sender === 'STUDENT'
                    ? 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
                    : 'rgba(30, 41, 59, 0.75)',
                  border: msg.sender === 'STUDENT' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: msg.sender === 'STUDENT' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  color: '#fff',
                  lineHeight: '1.45',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <div>{msg.message}</div>
                {msg.actionLink && onNavigateView && (
                  <button
                    onClick={() => onNavigateView(msg.actionLink!.view)}
                    style={{
                      marginTop: '6px',
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {msg.actionLink.label}
                  </button>
                )}
                <div style={{ fontSize: '0.65rem', color: msg.sender === 'STUDENT' ? 'rgba(255, 255, 255, 0.7)' : '#64748b', textAlign: 'right', marginTop: '4px' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {isThinking && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(30, 41, 59, 0.75)', padding: '8px 14px', borderRadius: '12px', color: '#c084fc', fontSize: '0.8rem' }}>
                ✨ Synthesizing cross-module guidance...
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
          >
            <input
              type="text"
              placeholder="Ask your AI Mentor about study plans, exams, jobs..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '0 16px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiMentorView;
