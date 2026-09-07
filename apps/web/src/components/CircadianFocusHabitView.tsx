import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Droplets,
  Eye,
  Activity,
  Clock,
  Zap
} from 'lucide-react';
import {
  CircadianProfile,
  UpdateHabitDto
} from '@studentlife/shared';

interface CircadianFocusHabitViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const CircadianFocusHabitView: React.FC<CircadianFocusHabitViewProps> = ({ onAddXp }) => {
  const [profile, setProfile] = useState<CircadianProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [breakTimer, setBreakTimer] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/circadian-focus/profile');
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data);
      }
    } catch (err) {
      console.error('Failed to load circadian profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateHabit = async (dto: UpdateHabitDto) => {
    try {
      const res = await fetch('/api/circadian-focus/habit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data);
        if (dto.action === 'DRINK_WATER') {
          onAddXp?.(10, 'Hydration Goal Logged 💧');
        } else if (dto.action === 'TAKE_SCREEN_BREAK') {
          setBreakTimer('👀 20-20-20 Eye Rest active: Look at something 20 feet away for 20 seconds!');
          setTimeout(() => setBreakTimer(null), 8000);
          onAddXp?.(15, 'Took Mindful 20-20-20 Eye Break');
        }
      }
    } catch (err) {
      console.error('Failed to update habit', err);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Calibrating Circadian Biological Focus Optimizer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Circadian Peak-Focus & Habit Engine</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Cognitive Bio-Rhythm
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Align your difficult mathematical problem-solving with your biological peak-cortisol windows and maintain healthy study habits.
            </p>
          </div>
        </div>

        {/* Chronotype Switcher */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => handleUpdateHabit({ action: 'SET_CHRONOTYPE', value: 'EARLY_BIRD' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              profile.chronotype === 'EARLY_BIRD'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Early Bird (Lark)
          </button>
          <button
            onClick={() => handleUpdateHabit({ action: 'SET_CHRONOTYPE', value: 'NIGHT_OWL' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              profile.chronotype === 'NIGHT_OWL'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Night Owl
          </button>
        </div>
      </div>

      {breakTimer && (
        <div className="bg-gradient-to-r from-cyan-950 to-indigo-950 border border-cyan-400/40 p-3.5 rounded-xl text-xs text-cyan-200 font-semibold flex items-center justify-between shadow-lg animate-bounce">
          <span>{breakTimer}</span>
          <span className="text-emerald-400 font-mono">+15 XP</span>
        </div>
      )}

      {/* Hero Bio-Windows Radar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Peak Cognitive Window
          </div>
          <div className="text-base font-bold text-white leading-snug">
            {profile.bestHoursForMathAndCoding}
          </div>
          <div className="text-xs text-slate-400">Best for: Hard Math, Dynamic Programming, Physics Numericals.</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Consolidation & Revision Window
          </div>
          <div className="text-base font-bold text-white leading-snug">
            {profile.bestHoursForRevision}
          </div>
          <div className="text-xs text-slate-400">Best for: SM-2 Spaced Flashcards, Audio Podcasts, Reading.</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <Moon className="w-3.5 h-3.5" /> Sleep & Memory Recovery
          </div>
          <div className="text-base font-bold text-white leading-snug">
            {profile.recommendedSleepWindow}
          </div>
          <div className="text-xs text-slate-400">Restores hippocampal synaptic plasticity.</div>
        </div>
      </div>

      {/* Main Grid: Circadian Schedule Strip (8 cols) + Healthy Habit Dock (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Schedule Slots (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-amber-400" />
              Daily Circadian Energy Schedule
            </h3>

            <div className="space-y-3">
              {profile.dailySlots.map((slot, idx) => {
                let badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';
                if (slot.energyLevel === 'PEAK_COGNITIVE') {
                  badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                } else if (slot.energyLevel === 'MODERATE_FOCUS') {
                  badgeStyle = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
                } else if (slot.energyLevel === 'RECOVERY') {
                  badgeStyle = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
                }

                return (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-xs">{slot.timeWindow}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeStyle}`}>
                          {slot.energyLevel.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed">
                        {slot.recommendedActivities.join(' • ')}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 shrink-0">
                      {slot.recommendedSubjectTypes.map((sub, i) => (
                        <span key={i} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Healthy Habits Dock (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Hydration Tracker */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                Hydration Tracker
              </h3>
              <span className="font-mono font-bold text-xs text-cyan-300">
                {profile.waterIntakeGlassesToday} / {profile.waterGoalGlasses} Glasses
              </span>
            </div>

            <div className="flex items-center justify-between gap-1">
              {Array.from({ length: profile.waterGoalGlasses }).map((_, i) => (
                <div
                  key={i}
                  className={`w-7 h-9 rounded-lg border flex items-center justify-center text-xs transition-all ${
                    i < profile.waterIntakeGlassesToday
                      ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/50'
                      : 'bg-slate-950 border-slate-800 text-slate-700'
                  }`}
                >
                  💧
                </div>
              ))}
            </div>

            <button
              onClick={() => handleUpdateHabit({ action: 'DRINK_WATER' })}
              className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
            >
              <Droplets className="w-3.5 h-3.5" /> Log 1 Glass Water (+10 XP)
            </button>
          </div>

          {/* Eye Strain & 20-20-20 Rest */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                20-20-20 Screen Rest
              </h3>
              <span className="text-xs font-mono text-emerald-400">{profile.screenBreaksTaken} Breaks Today</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every 20 mins of screen study, look at an object 20 feet away for 20 seconds to prevent digital eye strain and maintain focus.
            </p>
            <button
              onClick={() => handleUpdateHabit({ action: 'TAKE_SCREEN_BREAK' })}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
            >
              <Eye className="w-3.5 h-3.5" /> Take 20-Sec Rest Break (+15 XP)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
export default CircadianFocusHabitView;
