import React, { useState } from 'react';
import { StudentCardWidget } from './StudentCardWidget';
import { FocusTimerWidget } from './FocusTimerWidget';
import { StudentProfile, DashboardSummaryData } from '@studentlife/shared';
import {
  Clock,
  Target,
  RotateCw,
  Sparkles,
  ArrowUpRight,
  Quote,
  Calendar,
  FileText,
  BrainCircuit,
  MessageSquare,
} from 'lucide-react';

interface DashboardCockpitProps {
  profile: StudentProfile;
  summary: DashboardSummaryData;
  onEditProfile: () => void;
  onClaimStreak: () => Promise<void>;
  isClaimingStreak: boolean;
  onFocusSessionComplete: (durationMinutes: number, sessionType: 'FOCUS_25' | 'FOCUS_50') => Promise<void>;
  onOpenRoadmap: () => void;
}

export const DashboardCockpit: React.FC<DashboardCockpitProps> = ({
  profile,
  summary,
  onEditProfile,
  onClaimStreak,
  isClaimingStreak,
  onFocusSessionComplete,
  onOpenRoadmap,
}) => {
  const [aiPromptResponse, setAiPromptResponse] = useState<string | null>(null);

  const handleQuickAiAction = (action: string) => {
    if (action === 'summary') {
      setAiPromptResponse('AI Assistant: Ready to ingest PDF! Phase 08 (AI Study Assistant) connects document OCR and auto-summarization.');
    } else if (action === 'flashcards') {
      setAiPromptResponse('AI Assistant: Flashcard Generator initialized! 10 active recall cards will be scheduled in Phase 09 Revision Engine.');
    } else {
      setAiPromptResponse('AI Mentor: Connected to student model. Recommending 45m on Weak Topics (Dynamic Programming) today.');
    }
    setTimeout(() => setAiPromptResponse(null), 6000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner: Student Card */}
      <StudentCardWidget
        profile={profile}
        onEditProfile={onEditProfile}
        onClaimStreak={onClaimStreak}
        isClaimingStreak={isClaimingStreak}
      />

      {/* Main Grid: Left Column (Focus & Progress) | Right Column (Exams, Revision & AI) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* Left Column: Focus Timer & Today's Study Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Focus Timer Widget */}
          <FocusTimerWidget onSessionComplete={onFocusSessionComplete} />

          {/* Today's Study Target Progress Card */}
          <div className="glass-panel glow-hover" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}>
                  <Clock size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Today's Study Commitment</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Daily target telemetry</p>
                </div>
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                {summary.todayGoalProgressPercent}%
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Time Studied Today:</span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {Math.floor(summary.todayStudiedMinutes / 60)}h {summary.todayStudiedMinutes % 60}m
              </strong>
            </div>

            <div style={{ width: '100%', height: '8px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
              <div
                style={{
                  width: `${summary.todayGoalProgressPercent}%`,
                  height: '100%',
                  background: 'var(--gradient-accent)',
                  borderRadius: '4px',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Target: {Math.floor(summary.dailyGoalMinutes / 60)}h {summary.dailyGoalMinutes % 60 > 0 ? `${summary.dailyGoalMinutes % 60}m` : ''}</span>
              <span>Remaining: {Math.max(0, summary.dailyGoalMinutes - summary.todayStudiedMinutes)} mins</span>
            </div>
          </div>

        </div>

        {/* Right Column: Exam Countdown & Spaced Repetition Due */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Target Exam Countdowns Card */}
          <div className="glass-panel glow-hover" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e' }}>
                  <Target size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Target Exam Countdowns</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Milestone countdown tracker</p>
                </div>
              </div>
              <button
                onClick={onOpenRoadmap}
                style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
              >
                View Prep Hub <ArrowUpRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {summary.countdowns.map((exam) => (
                <div
                  key={exam.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{exam.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <Calendar size={11} /> {exam.examDate} &bull; {exam.targetScoreGoal}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: exam.daysRemaining < 60 ? '#f43f5e' : '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                      {exam.daysRemaining}d
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>remaining</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spaced Repetition Due Today Card */}
          <div className="glass-panel glow-hover" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                  <RotateCw size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Spaced Repetition Due</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>SM-2 memory retention engine</p>
                </div>
              </div>
              <span className="badge badge-completed" style={{ fontSize: '0.65rem' }}>
                {summary.revisionQueue.length} Topics Queued
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {summary.revisionQueue.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.colorCode }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.topicTitle}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.subjectName}</div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: item.urgency === 'OVERDUE' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: item.urgency === 'OVERDUE' ? '#f87171' : '#34d399',
                    }}
                  >
                    {item.urgency.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Quick Fast AI Actions Launcher Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <BrainCircuit size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>AI Study & Mentor Shortcuts</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Instant context-aware acceleration tools</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleQuickAiAction('summary')}
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <FileText size={14} color="#38bdf8" /> Summarize Notes
            </button>
            <button
              onClick={() => handleQuickAiAction('flashcards')}
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <Sparkles size={14} color="#c084fc" /> Generate Flashcards
            </button>
            <button
              onClick={() => handleQuickAiAction('mentor')}
              className="btn btn-primary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <MessageSquare size={14} /> Ask AI Mentor
            </button>
          </div>
        </div>

        {/* AI Action Toast */}
        {aiPromptResponse && (
          <div
            style={{
              marginTop: '14px',
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-glow)',
              fontSize: '0.8rem',
              color: '#a5b4fc',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Sparkles size={14} /> {aiPromptResponse}
          </div>
        )}
      </div>

      {/* Motivational Quote Card */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          borderLeft: '3px solid var(--accent-primary)',
        }}
      >
        <Quote size={24} color="var(--accent-primary)" style={{ opacity: 0.7, flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>
            "{summary.motivationalQuote.quote}"
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
            &mdash; {summary.motivationalQuote.author}
          </span>
        </div>
      </div>

    </div>
  );
};
