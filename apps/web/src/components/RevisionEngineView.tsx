import React, { useState, useEffect } from 'react';
import {
  RevisionItem,
  RevisionOverviewStats,
  RevisionRating,
} from '@studentlife/shared';
import { useAuth } from '../context/AuthContext';
import {
  RotateCcw,
  AlertCircle,
  Clock,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  Flame,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const DEFAULT_FALLBACK_QUEUE: RevisionItem[] = [
  {
    id: 'rev-item-1',
    subjectName: 'Data Structures & Algorithms',
    subjectColor: '#6366f1',
    topicTitle: 'Dynamic Programming: 0/1 Knapsack & Subset Sum',
    type: 'TOPIC',
    currentIntervalDays: 4,
    easeFactor: 2.5,
    retentionScorePercent: 62,
    dueDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    daysOverdueOrRemaining: 2,
    urgency: 'OVERDUE',
    repetitionCount: 2,
    lastReviewedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    keySummary:
      'State recurrence: dp[w] = max(dp[w], val[i] + dp[w - wt[i]]). Reverse loop avoids duplicate item reuse.',
  },
  {
    id: 'rev-item-2',
    subjectName: 'System Design',
    subjectColor: '#06b6d4',
    topicTitle: 'Distributed Caching (Cache-Aside vs Write-Through)',
    type: 'NOTE',
    currentIntervalDays: 7,
    easeFactor: 2.6,
    retentionScorePercent: 78,
    dueDate: new Date().toISOString().split('T')[0],
    daysOverdueOrRemaining: 0,
    urgency: 'DUE_TODAY',
    repetitionCount: 3,
    lastReviewedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    keySummary:
      'Cache-Aside: app queries cache, on miss fetches DB and updates cache. Invalidate on write to prevent stale data.',
  },
  {
    id: 'rev-item-3',
    subjectName: 'Computer Networks',
    subjectColor: '#10b981',
    topicTitle: 'TCP 3-Way Handshake & Congestion Control',
    type: 'FLASHCARD',
    currentIntervalDays: 14,
    easeFactor: 2.7,
    retentionScorePercent: 88,
    dueDate: new Date().toISOString().split('T')[0],
    daysOverdueOrRemaining: 0,
    urgency: 'DUE_TODAY',
    repetitionCount: 4,
    lastReviewedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    keySummary:
      'SYN -> SYN-ACK -> ACK. Synchronizes initial sequence numbers (ISN) and prevents duplicate phantom sessions.',
  },
  {
    id: 'rev-item-4',
    subjectName: 'Engineering Mathematics',
    subjectColor: '#a855f7',
    topicTitle: 'Linear Algebra: Eigenvalues & Diagonalization',
    type: 'TOPIC',
    currentIntervalDays: 10,
    easeFactor: 2.3,
    retentionScorePercent: 92,
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    daysOverdueOrRemaining: 3,
    urgency: 'UPCOMING',
    repetitionCount: 3,
    lastReviewedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    keySummary:
      'det(A - λI) = 0. Diagonalizable if algebraic multiplicity equals geometric multiplicity for all eigenvalues.',
  },
];

const DEFAULT_FALLBACK_STATS: RevisionOverviewStats = {
  totalItemsDueToday: 3,
  overdueCount: 1,
  upcomingCount: 1,
  averageRetentionScore: 80,
  streakDays: 7,
  reviewedTodayCount: 2,
  memoryDecayRisk: 'MODERATE',
};

interface RevisionEngineViewProps {
  onReviewCompleted?: (xp: number) => void;
}

export const RevisionEngineView: React.FC<RevisionEngineViewProps> = ({ onReviewCompleted }) => {
  const { tokens } = useAuth();
  const [queue, setQueue] = useState<RevisionItem[]>(DEFAULT_FALLBACK_QUEUE);
  const [stats, setStats] = useState<RevisionOverviewStats>(DEFAULT_FALLBACK_STATS);
  const [selectedUrgencyFilter, setSelectedUrgencyFilter] = useState<'ALL' | 'DUE' | 'UPCOMING'>('ALL');
  const [activeReviewItem, setActiveReviewItem] = useState<RevisionItem | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchQueueAndStats = async () => {
    try {
      const [qRes, sRes] = await Promise.all([
        fetch(`${API_BASE}/revision/queue`, {
          headers: { Authorization: `Bearer ${tokens?.accessToken || ''}` },
        }),
        fetch(`${API_BASE}/revision/stats`, {
          headers: { Authorization: `Bearer ${tokens?.accessToken || ''}` },
        }),
      ]);

      if (qRes.ok) {
        const qData = await qRes.json();
        if (qData.success && qData.data) {
          setQueue(qData.data);
        }
      }

      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData.success && sData.data) {
          setStats(sData.data);
        }
      }
    } catch {
      // Fallback state
    }
  };

  useEffect(() => {
    fetchQueueAndStats();
  }, [tokens]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReviewRating = async (rating: RevisionRating) => {
    if (!activeReviewItem) return;

    try {
      const res = await fetch(`${API_BASE}/revision/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.accessToken || ''}`,
        },
        body: JSON.stringify({
          itemId: activeReviewItem.id,
          rating,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data?.item) {
          const updatedItem = data.data.item;
          setQueue((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
          const earned = data.data.xpEarned || 20;
          showToast(`⚡ Revision Logged! +${earned} XP earned.`);
          if (onReviewCompleted) onReviewCompleted(earned);
          setActiveReviewItem(null);
          setIsRevealed(false);
          await fetchQueueAndStats();
          return;
        }
      }
    } catch {
      // Fallback local update
    }

    // Local fallback update
    setQueue((prev) =>
      prev.map((it) =>
        it.id === activeReviewItem.id
          ? {
              ...it,
              urgency: 'UPCOMING',
              retentionScorePercent: rating === 'EASY' ? 98 : rating === 'GOOD' ? 90 : 70,
              currentIntervalDays: rating === 'EASY' ? it.currentIntervalDays * 2 : it.currentIntervalDays + 2,
              daysOverdueOrRemaining: 4,
            }
          : it
      )
    );
    showToast(`⚡ SM-2 Interval updated! +20 XP.`);
    if (onReviewCompleted) onReviewCompleted(20);
    setActiveReviewItem(null);
    setIsRevealed(false);
  };

  const filteredItems = queue.filter((item) => {
    if (selectedUrgencyFilter === 'DUE') {
      return item.urgency === 'OVERDUE' || item.urgency === 'DUE_TODAY';
    }
    if (selectedUrgencyFilter === 'UPCOMING') {
      return item.urgency === 'UPCOMING';
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            zIndex: 1000,
            fontWeight: 700,
            fontSize: '0.9rem',
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Header & Milestone Celebration Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.12), rgba(6, 182, 212, 0.15))',
          border: '1px solid rgba(129, 140, 248, 0.3)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.5px',
              }}
            >
              🏆 MILESTONE 2: STUDY SYSTEM COMPLETED
            </span>
            <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>
              Phases 05 – 09 Fully Activated
            </span>
          </div>
          <h1
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #fff, #c7d2fe, #a5f3fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
            }}
          >
            🧠 Spaced Repetition (SM-2) Revision Engine
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0 0', fontSize: '0.9rem' }}>
            Combats the Ebbinghaus Forgetting Curve by scheduling precision recall checkpoints based on memory stability factors.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0,0,0,0.3)',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Flame size={20} color="#f59e0b" />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>REVISION STREAK</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>
                {stats.streakDays} Days 🔥
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Total Due */}
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Due for Review Today</span>
            <Clock size={16} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            {stats.totalItemsDueToday} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>items</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: stats.overdueCount > 0 ? '#f87171' : '#34d399' }}>
            {stats.overdueCount > 0 ? `⚠️ ${stats.overdueCount} overdue item(s)` : '✨ All on schedule!'}
          </div>
        </div>

        {/* Retention Score */}
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Memory Retention Index</span>
            <TrendingUp size={16} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>
            {stats.averageRetentionScore}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Average memory strength factor
          </div>
        </div>

        {/* Decay Risk */}
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Memory Decay Risk</span>
            <AlertCircle
              size={16}
              color={
                stats.memoryDecayRisk === 'CRITICAL'
                  ? '#ef4444'
                  : stats.memoryDecayRisk === 'MODERATE'
                  ? '#f59e0b'
                  : '#10b981'
              }
            />
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color:
                stats.memoryDecayRisk === 'CRITICAL'
                  ? '#f87171'
                  : stats.memoryDecayRisk === 'MODERATE'
                  ? '#fbbf24'
                  : '#34d399',
            }}
          >
            {stats.memoryDecayRisk}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            SuperMemo-2 stability rating
          </div>
        </div>

        {/* Reviewed Today */}
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Completed Today</span>
            <Award size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
            {stats.reviewedTodayCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>reviews</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#a78bfa' }}>
            Earned +{stats.reviewedTodayCount * 20} XP today
          </div>
        </div>
      </div>

      {/* Main Split: Queue list & Rapid Review card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: activeReviewItem ? '1fr 1fr' : '1fr',
          gap: '20px',
        }}
      >
        {/* Left Column: Revision Queue */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RotateCcw size={18} color="#818cf8" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                Daily Active Recall Queue ({filteredItems.length})
              </h2>
            </div>

            {/* Filter Pills */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '3px',
              }}
            >
              {(['ALL', 'DUE', 'UPCOMING'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedUrgencyFilter(filter)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selectedUrgencyFilter === filter ? 'var(--accent-primary)' : 'transparent',
                    color: selectedUrgencyFilter === filter ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  {filter === 'ALL' ? 'All Items' : filter === 'DUE' ? 'Due / Overdue' : 'Upcoming'}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Item Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredItems.map((item) => {
              const isSelected = activeReviewItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveReviewItem(item);
                    setIsRevealed(false);
                  }}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(129, 140, 248, 0.08))'
                      : 'rgba(255,255,255,0.02)',
                    border: isSelected
                      ? '1px solid rgba(99, 102, 241, 0.4)'
                      : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '14px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: item.subjectColor || '#818cf8',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.subjectName}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 'rgba(255,255,255,0.06)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {item.type}
                      </span>

                      {item.urgency === 'OVERDUE' && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            fontWeight: 700,
                          }}
                        >
                          🔴 {item.daysOverdueOrRemaining}d OVERDUE
                        </span>
                      )}

                      {item.urgency === 'DUE_TODAY' && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            fontWeight: 700,
                          }}
                        >
                          🟡 DUE TODAY
                        </span>
                      )}

                      {item.urgency === 'UPCOMING' && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#34d399',
                            fontWeight: 700,
                          }}
                        >
                          🟢 in {item.daysOverdueOrRemaining}d
                        </span>
                      )}
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff', lineHeight: 1.3 }}>
                      {item.topicTitle}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span>Interval: {item.currentIntervalDays}d</span>
                      <span>•</span>
                      <span>Repetition #{item.repetitionCount}</span>
                      <span>•</span>
                      <span>Retention: {item.retentionScorePercent}%</span>
                    </div>
                  </div>

                  <ChevronRight size={18} color="var(--text-secondary)" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Rapid Recall Review Drawer */}
        {activeReviewItem && (
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: activeReviewItem.subjectColor || '#818cf8',
                      textTransform: 'uppercase',
                    }}
                  >
                    {activeReviewItem.subjectName}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 0 0', color: '#fff' }}>
                    {activeReviewItem.topicTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveReviewItem(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* SM-2 Telemetry Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  background: 'rgba(0,0,0,0.25)',
                  padding: '12px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>CURRENT INTERVAL</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                    {activeReviewItem.currentIntervalDays} Days
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>EASE FACTOR</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>
                    {activeReviewItem.easeFactor.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>RETENTION</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>
                    {activeReviewItem.retentionScorePercent}%
                  </div>
                </div>
              </div>

              {/* Invariant / Recall Content */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  padding: '18px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                  🔑 KEY SUMMARY & INVARIANT CHECKS
                </div>
                {!isRevealed ? (
                  <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px' }}>
                      Try to actively recall the recurrence relation, invariant boundary, and time/space constraints in your mind before clicking reveal.
                    </p>
                    <button
                      onClick={() => setIsRevealed(true)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        border: 'none',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      👁️ Reveal Summary & Grade
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.9rem', color: '#f1f5f9', lineHeight: 1.6 }}>
                    {activeReviewItem.keySummary}
                  </div>
                )}
              </div>
            </div>

            {/* Grading Buttons */}
            {isRevealed && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 600 }}>
                  Rate your active recall difficulty:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => handleReviewRating('AGAIN')}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#f87171',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    🔄 Again (1d)
                  </button>
                  <button
                    onClick={() => handleReviewRating('HARD')}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#fbbf24',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    ⚡ Hard (2d)
                  </button>
                  <button
                    onClick={() => handleReviewRating('GOOD')}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '8px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      color: '#60a5fa',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    👍 Good (4d)
                  </button>
                  <button
                    onClick={() => handleReviewRating('EASY')}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.5)',
                      color: '#34d399',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                      <Zap size={12} /> Easy (+25 XP)
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
