import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame, Sparkles } from 'lucide-react';

interface FocusTimerWidgetProps {
  onSessionComplete: (durationMinutes: number, sessionType: 'FOCUS_25' | 'FOCUS_50') => Promise<void>;
}

export const FocusTimerWidget: React.FC<FocusTimerWidgetProps> = ({ onSessionComplete }) => {
  const [sessionType, setSessionType] = useState<'FOCUS_25' | 'FOCUS_50' | 'BREAK_5'>('FOCUS_25');
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(3);
  const [xpNotification, setXpNotification] = useState<number | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      handleFinishSession();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const handleFinishSession = async () => {
    if (sessionType === 'FOCUS_25' || sessionType === 'FOCUS_50') {
      const minutes = sessionType === 'FOCUS_50' ? 50 : 25;
      const xp = sessionType === 'FOCUS_50' ? 50 : 25;
      setCompletedSessionsCount((c) => c + 1);
      setXpNotification(xp);
      await onSessionComplete(minutes, sessionType);
      setTimeout(() => setXpNotification(null), 4000);
    }
    resetTimer(sessionType);
  };

  const switchMode = (mode: 'FOCUS_25' | 'FOCUS_50' | 'BREAK_5') => {
    setIsActive(false);
    setSessionType(mode);
    let seconds = 25 * 60;
    if (mode === 'FOCUS_50') seconds = 50 * 60;
    if (mode === 'BREAK_5') seconds = 5 * 60;
    setTotalSeconds(seconds);
    setSecondsRemaining(seconds);
  };

  const resetTimer = (mode = sessionType) => {
    setIsActive(false);
    let seconds = 25 * 60;
    if (mode === 'FOCUS_50') seconds = 50 * 60;
    if (mode === 'BREAK_5') seconds = 5 * 60;
    setSecondsRemaining(seconds);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100);

  return (
    <div
      className="glass-panel glow-hover"
      style={{
        padding: '24px',
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8',
            }}
          >
            <Flame size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Smart Focus Engine</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Pomodoro Deep Work Protocol</p>
          </div>
        </div>

        <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>
          {completedSessionsCount} Sessions Today
        </span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="glass-pill" style={{ padding: '4px', display: 'flex', gap: '4px', marginBottom: '20px' }}>
        <button
          onClick={() => switchMode('FOCUS_25')}
          style={{
            flex: 1,
            padding: '6px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: sessionType === 'FOCUS_25' ? 'var(--accent-primary)' : 'transparent',
            color: sessionType === 'FOCUS_25' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          25m Focus
        </button>
        <button
          onClick={() => switchMode('FOCUS_50')}
          style={{
            flex: 1,
            padding: '6px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: sessionType === 'FOCUS_50' ? 'var(--accent-purple)' : 'transparent',
            color: sessionType === 'FOCUS_50' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          50m Deep
        </button>
        <button
          onClick={() => switchMode('BREAK_5')}
          style={{
            flex: 1,
            padding: '6px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: sessionType === 'BREAK_5' ? 'var(--accent-emerald)' : 'transparent',
            color: sessionType === 'BREAK_5' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          5m Break
        </button>
      </div>

      {/* Circular / Big Timer Display */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '3.2rem',
            fontWeight: 800,
            letterSpacing: '2px',
            color: isActive ? 'var(--accent-secondary)' : 'var(--text-primary)',
            textShadow: isActive ? '0 0 20px rgba(6, 182, 212, 0.4)' : 'none',
            transition: 'color 0.3s ease',
          }}
        >
          {formatTime(secondsRemaining)}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {isActive ? '🔥 Session in Progress — Stay in the zone' : 'Ready to start'}
        </div>
      </div>

      {/* Progress Line */}
      <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' }}>
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: sessionType === 'BREAK_5' ? 'var(--accent-emerald)' : 'var(--gradient-primary)',
            borderRadius: '3px',
            transition: 'width 1s linear',
          }}
        />
      </div>

      {/* Timer Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button
          onClick={() => setIsActive(!isActive)}
          className="btn btn-primary"
          style={{ padding: '10px 24px', minWidth: '120px' }}
        >
          {isActive ? (
            <>
              <Pause size={16} /> Pause
            </>
          ) : (
            <>
              <Play size={16} /> Start Focus
            </>
          )}
        </button>
        <button
          onClick={() => resetTimer()}
          className="btn btn-secondary"
          style={{ padding: '10px 14px' }}
          title="Reset Timer"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* XP Reward Toast */}
      {xpNotification && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(16, 185, 129, 0.9)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
            animation: 'pulseGlow 1s ease',
          }}
        >
          <Sparkles size={14} /> +{xpNotification} XP Focus Block Completed!
        </div>
      )}
    </div>
  );
};
