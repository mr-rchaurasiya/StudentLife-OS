import React, { useState, useEffect } from 'react';
import {
  GamificationDashboardData,
  LeaderboardFilterScope,
  StudentAchievementBadge
} from '@studentlife/shared';
import {
  Trophy,
  Flame,
  Award
} from 'lucide-react';

interface LeaderboardViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

const FALLBACK_GAMIFICATION_DATA: GamificationDashboardData = {
  currentUserRank: 4,
  totalParticipants: 4820,
  leagueTier: 'GOLD',
  daysRemainingInDivision: 2,
  topThreePodium: [
    {
      rank: 1,
      userId: 'usr-top-1',
      fullName: 'Ananya Sharma',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananya',
      collegeOrSchool: 'IIT Bombay',
      targetExam: 'GATE 2027 (CSE)',
      level: 7,
      weeklyXp: 1450,
      totalXp: 9820,
      streakDays: 42,
      accuracyPercentage: 94,
      studyHoursThisWeek: 36.5,
      leagueTier: 'MASTER',
      topBadgeTitle: '🔥 30-Day Legend',
      isCurrentUser: false
    },
    {
      rank: 2,
      userId: 'usr-top-2',
      fullName: 'Rohan Verma',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rohan',
      collegeOrSchool: 'BITS Pilani',
      targetExam: 'GATE 2027 (CSE)',
      level: 6,
      weeklyXp: 1280,
      totalXp: 8140,
      streakDays: 28,
      accuracyPercentage: 91,
      studyHoursThisWeek: 31.0,
      leagueTier: 'DIAMOND',
      topBadgeTitle: '🎯 Mock Sniper',
      isCurrentUser: false
    },
    {
      rank: 3,
      userId: 'usr-top-3',
      fullName: 'Priya Iyer',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya',
      collegeOrSchool: 'NIT Trichy',
      targetExam: 'UPSC CSE',
      level: 6,
      weeklyXp: 1190,
      totalXp: 7450,
      streakDays: 21,
      accuracyPercentage: 88,
      studyHoursThisWeek: 29.5,
      leagueTier: 'DIAMOND',
      topBadgeTitle: '📚 Syllabus Crusher',
      isCurrentUser: false
    }
  ],
  rankings: [
    {
      rank: 1,
      userId: 'usr-top-1',
      fullName: 'Ananya Sharma',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananya',
      collegeOrSchool: 'IIT Bombay',
      targetExam: 'GATE 2027 (CSE)',
      level: 7,
      weeklyXp: 1450,
      totalXp: 9820,
      streakDays: 42,
      accuracyPercentage: 94,
      studyHoursThisWeek: 36.5,
      leagueTier: 'MASTER',
      topBadgeTitle: '🔥 30-Day Legend',
      isCurrentUser: false
    },
    {
      rank: 2,
      userId: 'usr-top-2',
      fullName: 'Rohan Verma',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rohan',
      collegeOrSchool: 'BITS Pilani',
      targetExam: 'GATE 2027 (CSE)',
      level: 6,
      weeklyXp: 1280,
      totalXp: 8140,
      streakDays: 28,
      accuracyPercentage: 91,
      studyHoursThisWeek: 31.0,
      leagueTier: 'DIAMOND',
      topBadgeTitle: '🎯 Mock Sniper',
      isCurrentUser: false
    },
    {
      rank: 3,
      userId: 'usr-top-3',
      fullName: 'Priya Iyer',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya',
      collegeOrSchool: 'NIT Trichy',
      targetExam: 'UPSC CSE',
      level: 6,
      weeklyXp: 1190,
      totalXp: 7450,
      streakDays: 21,
      accuracyPercentage: 88,
      studyHoursThisWeek: 29.5,
      leagueTier: 'DIAMOND',
      topBadgeTitle: '📚 Syllabus Crusher',
      isCurrentUser: false
    },
    {
      rank: 4,
      userId: 'demo-student-uuid-01',
      fullName: 'Alex Morgan (You)',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=student',
      collegeOrSchool: 'Indian Institute of Technology (IIT)',
      targetExam: 'GATE (CSE / ECE / ME)',
      level: 2,
      weeklyXp: 820,
      totalXp: 420,
      streakDays: 7,
      accuracyPercentage: 78,
      studyHoursThisWeek: 18.2,
      leagueTier: 'GOLD',
      topBadgeTitle: '⚡ Rapid Recall Pro',
      isCurrentUser: true
    },
    {
      rank: 5,
      userId: 'usr-top-5',
      fullName: 'Devansh Kulkarni',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Devansh',
      collegeOrSchool: 'IIT Delhi',
      targetExam: 'JEE Advanced',
      level: 5,
      weeklyXp: 790,
      totalXp: 5800,
      streakDays: 14,
      accuracyPercentage: 85,
      studyHoursThisWeek: 22.0,
      leagueTier: 'GOLD',
      topBadgeTitle: '🧠 Math Virtuoso',
      isCurrentUser: false
    },
    {
      rank: 6,
      userId: 'usr-top-6',
      fullName: 'Sneha Patel',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sneha',
      collegeOrSchool: 'Delhi University',
      targetExam: 'UPSC CSE',
      level: 4,
      weeklyXp: 680,
      totalXp: 4320,
      streakDays: 11,
      accuracyPercentage: 82,
      studyHoursThisWeek: 19.5,
      leagueTier: 'SILVER',
      topBadgeTitle: '📝 Note Master',
      isCurrentUser: false
    }
  ],
  achievements: [
    {
      id: 'bdg-1',
      title: '7-Day Streak Warrior',
      category: 'STREAK',
      description: 'Study for 7 consecutive days without breaking the chain.',
      iconEmoji: '🔥',
      rarity: 'RARE',
      isUnlocked: true,
      unlockedAt: '2026-09-06',
      progressPercent: 100,
      xpBonus: 100
    },
    {
      id: 'bdg-2',
      title: 'Mock Test Grandmaster',
      category: 'EXAMS',
      description: 'Score above 85% accuracy in a full-length timed simulation test.',
      iconEmoji: '🏆',
      rarity: 'EPIC',
      isUnlocked: false,
      progressPercent: 78,
      xpBonus: 250
    },
    {
      id: 'bdg-3',
      title: 'SM-2 Rapid Recall Pro',
      category: 'MASTERY',
      description: 'Maintain 90%+ retention across 20 Spaced Repetition flashcards.',
      iconEmoji: '🧠',
      rarity: 'RARE',
      isUnlocked: true,
      unlockedAt: '2026-09-05',
      progressPercent: 100,
      xpBonus: 150
    },
    {
      id: 'bdg-4',
      title: 'Pomodoro Centurion',
      category: 'FOCUS',
      description: 'Complete 25 focused Pomodoro blocks (500+ deep study minutes).',
      iconEmoji: '⏱️',
      rarity: 'RARE',
      isUnlocked: false,
      progressPercent: 64,
      xpBonus: 120
    },
    {
      id: 'bdg-5',
      title: 'ATS Resume Architect',
      category: 'MASTERY',
      description: 'Attain a 90+ ATS Score on your tailored technical resume.',
      iconEmoji: '📄',
      rarity: 'EPIC',
      isUnlocked: true,
      unlockedAt: '2026-09-06',
      progressPercent: 100,
      xpBonus: 200
    },
    {
      id: 'bdg-6',
      title: 'All-India Top 5% Finisher',
      category: 'EXAMS',
      description: 'Reach the Diamond League in the weekly National division.',
      iconEmoji: '👑',
      rarity: 'LEGENDARY',
      isUnlocked: false,
      progressPercent: 55,
      xpBonus: 500
    }
  ],
  weeklyXpTrajectory: [120, 180, 240, 310, 480, 650, 820]
};

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onAddXp }) => {
  const [data, setData] = useState<GamificationDashboardData>(FALLBACK_GAMIFICATION_DATA);
  const [selectedScope, setSelectedScope] = useState<LeaderboardFilterScope>('ALL_INDIA');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [claimedBadges, setClaimedBadges] = useState<string[]>([]);

  useEffect(() => {
    fetchLeaderboard(selectedScope);
  }, [selectedScope]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchLeaderboard = async (scope: LeaderboardFilterScope) => {
    try {
      const res = await fetch(`/api/gamification/dashboard?scope=${scope}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) setData(json.data);
      }
    } catch {
      // Fallback
    }
  };

  const handleClaimBadge = (badge: StudentAchievementBadge) => {
    if (claimedBadges.includes(badge.id)) return;

    setClaimedBadges((prev) => [...prev, badge.id]);
    showToast(`🎉 Claimed +${badge.xpBonus} XP Bonus for "${badge.title}"! 🔥`);
    if (onAddXp) {
      onAddXp(badge.xpBonus, `Claimed Achievement: ${badge.title}`);
    }
  };

  const podiumOrder = [
    data.topThreePodium[1] || data.rankings[1], // 2nd place (left)
    data.topThreePodium[0] || data.rankings[0], // 1st place (center, highest)
    data.topThreePodium[2] || data.rankings[2]  // 3rd place (right)
  ];

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
            background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.4)',
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
          border: '1px solid rgba(245, 158, 11, 0.3)',
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
            <span style={{ fontSize: '2rem' }}>🏆</span>
            <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: '800', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              All-India Student Leaderboards
            </h1>
            <span
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}
            >
              Gold Division League 🌟
            </span>
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
            Compete with 4,820+ students across study consistency, SM-2 retention, and mock test accuracy. Division resets in <strong>{data.daysRemainingInDivision} days</strong>.
          </p>
        </div>

        {/* User Rank Card */}
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '16px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: '700', textTransform: 'uppercase' }}>Your National Rank</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff' }}>#{data.currentUserRank}</div>
          </div>
          <div style={{ height: '32px', width: '1px', background: 'rgba(255, 255, 255, 0.15)' }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>820 XP This Week 🔥</div>
            <div style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: '700' }}>+80 XP to Diamond Division 💎</div>
          </div>
        </div>
      </div>

      {/* 3D Podium Showcase (Top 3 Students) */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(20, 15, 35, 0.85) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2.5rem 1.5rem 1.5rem',
          backdropFilter: 'blur(16px)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#fff' }}>
            👑 Weekly Champions Podium
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0' }}>
            Top performers in the All-India Gold League Division
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
          {podiumOrder.map((student) => {
            if (!student) return null;
            const isFirst = student.rank === 1;
            const isSecond = student.rank === 2;
            const height = isFirst ? '220px' : isSecond ? '170px' : '140px';
            const pedestalBg = isFirst
              ? 'linear-gradient(180deg, rgba(245, 158, 11, 0.3) 0%, rgba(180, 83, 9, 0.15) 100%)'
              : isSecond
              ? 'linear-gradient(180deg, rgba(203, 213, 225, 0.25) 0%, rgba(100, 116, 139, 0.15) 100%)'
              : 'linear-gradient(180deg, rgba(217, 119, 6, 0.25) 0%, rgba(146, 64, 14, 0.12) 100%)';
            const borderColor = isFirst ? '#f59e0b' : isSecond ? '#cbd5e1' : '#b45309';

            return (
              <div key={student.userId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '160px' }}>
                {/* Crown / Trophy */}
                <div style={{ marginBottom: '8px', position: 'relative' }}>
                  {isFirst && (
                    <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.6rem' }}>
                      👑
                    </div>
                  )}
                  <img
                    src={student.avatarUrl}
                    alt={student.fullName}
                    style={{
                      width: isFirst ? '68px' : '56px',
                      height: isFirst ? '68px' : '56px',
                      borderRadius: '50%',
                      border: `3px solid ${borderColor}`,
                      boxShadow: isFirst ? '0 0 24px rgba(245, 158, 11, 0.6)' : '0 4px 14px rgba(0,0,0,0.5)'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: borderColor,
                      color: isFirst ? '#000' : '#fff',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      borderRadius: '10px',
                      padding: '2px 8px'
                    }}
                  >
                    #{student.rank}
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#fff', marginTop: '10px', textAlign: 'center' }}>
                  {student.fullName}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', marginBottom: '8px' }}>
                  {student.collegeOrSchool}
                </div>

                {/* Pedestal Block */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: '180px',
                    height,
                    background: pedestalBg,
                    border: `1px solid ${borderColor}`,
                    borderBottom: 'none',
                    borderRadius: '16px 16px 0 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    gap: '4px'
                  }}
                >
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: borderColor }}>
                    {student.weeklyXp} XP
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Flame size={12} color="#f97316" /> {student.streakDays} Day Streak
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: '700' }}>
                    {student.accuracyPercentage}% Accuracy
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Column (Rankings Table) | Right Column (Achievements Vault) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Column: Rankings Table with Filter Pills */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(20, 15, 35, 0.9) 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.5rem',
            backdropFilter: 'blur(16px)'
          }}
        >
          {/* Scope Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={18} color="#fbbf24" /> Division Leaderboard
            </h3>

            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.3)', padding: '4px', borderRadius: '12px' }}>
              {(['ALL_INDIA', 'MY_COLLEGE', 'TARGET_EXAM'] as LeaderboardFilterScope[]).map((scope) => (
                <button
                  key={scope}
                  onClick={() => setSelectedScope(scope)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: selectedScope === scope ? 'var(--gradient-primary)' : 'transparent',
                    color: selectedScope === scope ? '#fff' : '#94a3b8',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {scope === 'ALL_INDIA' ? '🌍 All-India' : scope === 'MY_COLLEGE' ? '🏛️ My College' : '🎯 GATE / Tech'}
                </button>
              ))}
            </div>
          </div>

          {/* Table List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.rankings.map((student) => (
              <div
                key={student.userId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: student.isCurrentUser ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: student.isCurrentUser ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '24px',
                      fontSize: '0.85rem',
                      fontWeight: '800',
                      color: student.rank === 1 ? '#fbbf24' : student.rank === 2 ? '#cbd5e1' : student.rank === 3 ? '#b45309' : '#64748b',
                      textAlign: 'center'
                    }}
                  >
                    #{student.rank}
                  </div>
                  <img
                    src={student.avatarUrl}
                    alt={student.fullName}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: student.isCurrentUser ? '#a5b4fc' : '#fff' }}>
                      {student.fullName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {student.collegeOrSchool} &bull; {student.topBadgeTitle}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#fbbf24' }}>
                    {student.weeklyXp} XP
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: '600' }}>
                    {student.streakDays}d Streak 🔥
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Achievements & Digital Badges Vault */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(20, 15, 35, 0.9) 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.5rem',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="#ec4899" /> Achievements Vault
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '700' }}>
              {data.achievements.filter(a => a.isUnlocked).length} / {data.achievements.length} Unlocked
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            {data.achievements.map((badge) => {
              const isClaimed = claimedBadges.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: badge.isUnlocked ? 'rgba(245, 158, 11, 0.08)' : 'rgba(0, 0, 0, 0.3)',
                    border: badge.isUnlocked ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: badge.isUnlocked ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem'
                      }}
                    >
                      {badge.iconEmoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '800', color: badge.isUnlocked ? '#fff' : '#64748b' }}>
                        {badge.title}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                        {badge.description}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Claim Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.65rem', color: '#fbbf24', fontWeight: '700' }}>
                      +{badge.xpBonus} XP Bonus
                    </span>

                    {badge.isUnlocked ? (
                      <button
                        onClick={() => handleClaimBadge(badge)}
                        disabled={isClaimed}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '0.7rem',
                          fontWeight: '800',
                          cursor: isClaimed ? 'default' : 'pointer',
                          background: isClaimed ? 'rgba(255, 255, 255, 0.1)' : 'var(--gradient-primary)',
                          color: isClaimed ? '#94a3b8' : '#fff'
                        }}
                      >
                        {isClaimed ? 'Claimed ✓' : 'Claim XP 🔥'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '600' }}>
                        {badge.progressPercent}% Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
