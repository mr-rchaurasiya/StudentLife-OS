import React, { useState } from 'react';
import { StudentProfile } from '@studentlife/shared';
import { useLanguage } from '../context/LanguageContext';
import {
  Flame,
  Zap,
  Target,
  Clock,
  Edit3,
  Award,
  Sparkles,
  BookMarked,
  CheckCircle2,
} from 'lucide-react';

interface StudentCardWidgetProps {
  profile: StudentProfile | null;
  onEditProfile: () => void;
  onClaimStreak: () => Promise<void>;
  isClaimingStreak: boolean;
}

export const StudentCardWidget: React.FC<StudentCardWidgetProps> = ({
  profile,
  onEditProfile,
  onClaimStreak,
  isClaimingStreak,
}) => {
  const { t } = useLanguage();
  const [streakClaimedFeedback, setStreakClaimedFeedback] = useState(false);

  if (!profile) return null;

  const currentLevelXpProgress = Math.min(100, Math.round(((profile.xpPoints % 250) / 250) * 100));

  const handleStreakClick = async () => {
    await onClaimStreak();
    setStreakClaimedFeedback(true);
    setTimeout(() => setStreakClaimedFeedback(false), 3000);
  };

  return (
    <div
      className="glass-panel glow-hover"
      style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
      }}
    >
      {/* Top Banner Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
              <Award size={12} /> {t('level_scholar', { level: profile.level })}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {profile.xpPoints} {t('total_xp')}
            </span>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{profile.collegeOrSchool || 'Student Workspace'}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {profile.degreeOrGrade || 'Undergraduate'} &bull; Year {profile.academicYear || 1}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Claim Daily Streak Button */}
          <button
            onClick={handleStreakClick}
            disabled={isClaimingStreak}
            className="btn"
            style={{
              padding: '8px 14px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#fbbf24',
              fontSize: '0.8rem',
            }}
          >
            <Flame size={16} color="#f59e0b" className="pulse-circle" />
            {streakClaimedFeedback ? (
              <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> +50 XP
              </span>
            ) : (
              `${profile.streakCount} ${t('day_streak')}`
            )}
          </button>

          <button
            onClick={onEditProfile}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          >
            <Edit3 size={14} /> {t('edit_profile')}
          </button>
        </div>
      </div>

      {/* XP Level Progress Bar */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={14} color="var(--accent-primary)" /> XP to Level {profile.level + 1}
          </span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {profile.xpToNextLevel} {t('xp_needed')} ({currentLevelXpProgress}%)
          </span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${currentLevelXpProgress}%`,
              height: '100%',
              background: 'var(--gradient-primary)',
              borderRadius: '4px',
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>

      {/* Profile Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        {/* Daily Study Goal */}
        <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <Clock size={14} color="var(--accent-secondary)" /> {t('daily_study_target')}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            {Math.floor(profile.dailyStudyGoalMinutes / 60)}h {profile.dailyStudyGoalMinutes % 60 > 0 ? `${profile.dailyStudyGoalMinutes % 60}m` : ''} / day
          </div>
        </div>

        {/* Target Exams */}
        <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <Target size={14} color="var(--accent-rose)" /> {t('target_exams')}
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {profile.targetExams.length > 0 ? profile.targetExams.join(', ') : 'No target exams set'}
          </div>
        </div>

        {/* Career Aspirations */}
        <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <Sparkles size={14} color="var(--accent-purple)" /> {t('dream_career')}
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {profile.careerAspirations.length > 0 ? profile.careerAspirations.join(', ') : 'Undecided'}
          </div>
        </div>
      </div>

      {/* Skill Tags Row */}
      {profile.skillTags.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BookMarked size={13} /> {t('skills')}:
          </span>
          {profile.skillTags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.7rem',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                color: '#a5b4fc',
                fontWeight: 600,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
