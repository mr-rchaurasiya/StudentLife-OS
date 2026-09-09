import React, { useState, useEffect } from 'react';
import { DailyStudyDigestResult } from '@studentlife/shared';
import {
  Sun,
  Flame,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Bell,
  Clock,
  ArrowRight,
  X
} from 'lucide-react';

interface DailyStudyDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddXp?: (xp: number, reason: string) => void;
  onNavigateView?: (view: string) => void;
}

const FALLBACK_DIGEST: DailyStudyDigestResult = {
  date: new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }),
  greeting: 'Good morning, Scholar! ☀️ Ready to crush your goals today?',
  motivationalQuote: {
    quote: 'Small daily disciplines repeated with consistency lead to monumental achievements over time.',
    author: 'Robin Sharma'
  },
  totalTasksToday: 4,
  highPriorityTasks: [
    {
      id: 'task-1',
      title: 'Practice 5 Hard LeetCode DP Problems (Knapsack/LCS)',
      subjectName: 'Algorithms & Data Structures',
      dueTime: '10:00 AM'
    },
    {
      id: 'task-2',
      title: 'Derive Maxwell Equations & Boundary Value Conditions',
      subjectName: 'Electromagnetic Theory',
      dueTime: '02:30 PM'
    },
    {
      id: 'task-3',
      title: 'Review Indian Polity Preamble & Fundamental Rights',
      subjectName: 'UPSC GS-1 Polity',
      dueTime: '06:00 PM'
    }
  ],
  flashcardsDueCount: 14,
  upcomingExamClocks: [
    {
      title: 'Tech Placement Assessment Season',
      daysRemaining: 39
    },
    {
      title: 'University Final Semester Exams',
      daysRemaining: 74
    },
    {
      title: 'GATE 2027 National Entrance',
      daysRemaining: 158
    }
  ],
  currentStreakDays: 7,
  targetFocusMinutes: 180
};

export const DailyStudyDigestModal: React.FC<DailyStudyDigestModalProps> = ({
  isOpen,
  onClose,
  onAddXp,
  onNavigateView
}) => {
  const [digest, setDigest] = useState<DailyStudyDigestResult>(FALLBACK_DIGEST);
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [hasClaimedXp, setHasClaimedXp] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/notifications/digest')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setDigest(data.data);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleEnablePush = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setIsPushEnabled(true);
        new Notification('StudentLife OS Notifications Active! 🚀', {
          body: 'You will receive timely focus reminders and morning study digests.',
          icon: '/manifest.json'
        });
        onAddXp?.(30, 'Enabled Push Notifications');
      } else {
        alert('Notification permission was not granted.');
      }
    } else {
      alert('Push notifications not supported in this browser.');
    }
  };

  const handleClaimMorningXp = () => {
    if (!hasClaimedXp) {
      setHasClaimedXp(true);
      onAddXp?.(25, 'Claimed Morning Study Digest XP');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          backgroundColor: '#0f172a',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '24px',
          maxWidth: '680px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header Ribbon */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(99, 102, 241, 0.2) 50%, rgba(168, 85, 247, 0.2) 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div 
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
                flexShrink: 0
              }}
            >
              <Sun size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fbbf24' }}>
                  Daily Study Digest
                </span>
                <span style={{ color: '#64748b' }}>&bull;</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{digest.date}</span>
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                {digest.greeting}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.85rem' }}>
          {/* Quote of the Day */}
          <div 
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.8) 0%, rgba(30, 27, 75, 0.4) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}
          >
            <p style={{ margin: 0, fontSize: '0.88rem', fontStyle: 'italic', color: '#c7d2fe', lineHeight: 1.6, fontWeight: 500 }}>
              &ldquo;{digest.motivationalQuote.quote}&rdquo;
            </p>
            <p style={{ margin: '8px 0 0 0', textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
              &mdash; {digest.motivationalQuote.author}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Flame size={22} color="#fbbf24" style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Streak</span>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>{digest.currentStreakDays} Days 🔥</div>
              </div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={22} color="#38bdf8" style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Goal</span>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>{digest.targetFocusMinutes} Mins</div>
              </div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(168, 85, 247, 0.25)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={22} color="#c084fc" style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Due Cards</span>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#c084fc', fontFamily: 'monospace' }}>{digest.flashcardsDueCount} SM-2</div>
              </div>
            </div>
          </div>

          {/* Priority Tasks for Today */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Calendar size={16} color="#818cf8" />
                Today&apos;s Priority Schedule ({digest.highPriorityTasks.length} Tasks)
              </h3>
              <button
                onClick={() => {
                  onClose();
                  onNavigateView?.('PLANNER');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#818cf8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Open Planner <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {digest.highPriorityTasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6366f1', flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{t.title}</h4>
                      <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '2px 0 0 0' }}>{t.subjectName}</p>
                    </div>
                  </div>
                  <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', fontSize: '0.7rem', color: '#cbd5e1', fontFamily: 'monospace' }}>
                    {t.dueTime}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Countdown Radar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Clock size={16} color="#fbbf24" />
              Approaching Exam Milestones
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
              {digest.upcomingExamClocks.map((exam, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exam.title}</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>{exam.daysRemaining}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>days left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div 
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(2, 6, 23, 0.9)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <button
            onClick={handleEnablePush}
            disabled={isPushEnabled}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: isPushEnabled ? 'default' : 'pointer',
              border: isPushEnabled ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(255, 255, 255, 0.12)',
              backgroundColor: isPushEnabled ? 'rgba(52, 211, 153, 0.12)' : 'rgba(255, 255, 255, 0.06)',
              color: isPushEnabled ? '#34d399' : '#cbd5e1'
            }}
          >
            <Bell size={13} />
            {isPushEnabled ? 'Push Alerts Enabled ✓' : 'Enable Push Alerts (+30 XP)'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleClaimMorningXp}
              disabled={hasClaimedXp}
              className="glow-hover"
              style={{
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: hasClaimedXp ? 'default' : 'pointer',
                border: hasClaimedXp ? '1px solid rgba(52, 211, 153, 0.4)' : 'none',
                background: hasClaimedXp ? 'rgba(6, 78, 59, 0.4)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: hasClaimedXp ? '#a7f3d0' : '#020617',
                boxShadow: hasClaimedXp ? 'none' : '0 4px 14px rgba(245, 158, 11, 0.3)'
              }}
            >
              {hasClaimedXp ? <CheckCircle2 size={14} /> : <Sparkles size={14} />}
              {hasClaimedXp ? 'XP Claimed (+25 XP)' : 'Claim Daily XP (+25 XP)'}
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigateView?.('STUDY_ROOMS');
              }}
              className="glow-hover"
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
              }}
            >
              Start Focus Session 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyStudyDigestModal;
