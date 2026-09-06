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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl relative overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
        {/* Header Ribbon */}
        <div className="relative bg-gradient-to-r from-amber-500/20 via-indigo-600/20 to-purple-600/20 border-b border-slate-800 p-6 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Daily Study Digest</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-medium">{digest.date}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">{digest.greeting}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Quote of the Day */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950/90 to-indigo-950/40 border border-indigo-500/30 shadow-inner">
            <p className="text-sm italic text-indigo-200 leading-relaxed font-medium">
              "{digest.motivationalQuote.quote}"
            </p>
            <p className="text-right text-[11px] text-slate-400 mt-2 font-semibold">
              — {digest.motivationalQuote.author}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <Flame className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Streak</span>
                <div className="text-base font-black text-amber-400">{digest.currentStreakDays} Days 🔥</div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Goal</span>
                <div className="text-base font-black text-cyan-300">{digest.targetFocusMinutes} Mins</div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <Layers className="w-5 h-5 text-purple-400" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Due Cards</span>
                <div className="text-base font-black text-purple-300">{digest.flashcardsDueCount} SM-2</div>
              </div>
            </div>
          </div>

          {/* Priority Tasks for Today */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Today's Priority Schedule ({digest.highPriorityTasks.length} Tasks)
              </h3>
              <button
                onClick={() => {
                  onClose();
                  onNavigateView?.('PLANNER');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                Open Planner <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {digest.highPriorityTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100">{t.title}</h4>
                      <p className="text-[11px] text-slate-400">{t.subjectName}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-mono">
                    {t.dueTime}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Countdown Radar */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Approaching Exam Milestones
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {digest.upcomingExamClocks.map((exam, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
                >
                  <span className="text-[11px] font-semibold text-slate-300 line-clamp-1">{exam.title}</span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-lg font-black text-amber-400 font-mono">{exam.daysRemaining}</span>
                    <span className="text-[10px] text-slate-400">days left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleEnablePush}
            disabled={isPushEnabled}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              isPushEnabled
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            {isPushEnabled ? 'Push Alerts Enabled ✓' : 'Enable Push Alerts (+30 XP)'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClaimMorningXp}
              disabled={hasClaimedXp}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                hasClaimedXp
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              }`}
            >
              {hasClaimedXp ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              {hasClaimedXp ? 'XP Claimed (+25 XP)' : 'Claim Daily XP (+25 XP)'}
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigateView?.('STUDY_ROOMS');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition"
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
