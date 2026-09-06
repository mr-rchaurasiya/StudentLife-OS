import React, { useState, useEffect } from 'react';
import {
  Trees,
  Sparkles,
  Coins,
  Clock,
  Play,
  Square,
  Award,
  Heart,
  Zap,
  Info
} from 'lucide-react';
import {
  FocusGardenState,
  TreeSpecies,
  PlantTreeDto
} from '@studentlife/shared';

interface FocusGardenViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const FocusGardenView: React.FC<FocusGardenViewProps> = ({ onAddXp }) => {
  const [gardenState, setGardenState] = useState<FocusGardenState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSpecies, setSelectedSpecies] = useState<TreeSpecies>('CHERRY_BLOSSOM');
  const [durationPreset, setDurationPreset] = useState<number>(25);
  const [subjectTag, setSubjectTag] = useState<string>('Deep Study');
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);

  useEffect(() => {
    fetchGardenState();
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (isTimerRunning && secondsRemaining === 0) {
      handleCompleteSession(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  const fetchGardenState = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/focus-garden/status');
      const data = await res.json();
      if (data.success && data.data) {
        setGardenState(data.data);
      }
    } catch (err) {
      console.error('Failed to load garden state', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartPlanting = async () => {
    try {
      const dto: PlantTreeDto = {
        species: selectedSpecies,
        durationMinutes: durationPreset,
        subject: subjectTag
      };
      const res = await fetch('/api/focus-garden/plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGardenState(data.data);
        setSecondsRemaining(durationPreset * 60);
        setIsTimerRunning(true);
      }
    } catch (err) {
      console.error('Failed to plant tree', err);
    }
  };

  const handleCompleteSession = async (wasSuccessful: boolean) => {
    setIsTimerRunning(false);
    if (!gardenState?.currentActiveSession) return;

    try {
      const res = await fetch('/api/focus-garden/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treeId: gardenState.currentActiveSession.treeId,
          wasSuccessful
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGardenState(data.data);
        if (wasSuccessful) {
          const xp = durationPreset * 2;
          onAddXp?.(xp, `Grew ${selectedSpecies} Tree in Focus Garden`);
        }
      }
    } catch (err) {
      console.error('Failed to complete tree', err);
    }
  };

  const handlePetInteract = async () => {
    try {
      const res = await fetch('/api/focus-garden/pet/interact', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.data && gardenState) {
        setGardenState({
          ...gardenState,
          pet: data.data
        });
      }
    } catch (err) {
      console.error('Failed to interact with pet', err);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const getTreeEmoji = (species: TreeSpecies, status?: string) => {
    if (status === 'WITHERED') return '🥀';
    switch (species) {
      case 'CHERRY_BLOSSOM': return '🌸';
      case 'GOLDEN_OAK': return '🌳';
      case 'MYSTIC_WILLOW': return '🌿';
      case 'CYBER_PINE': return '🌲';
      case 'EMERALD_BAMBOO': return '🎋';
      default: return '🌱';
    }
  };

  if (isLoading || !gardenState) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Sprouting Focus Garden & Virtual Pet Sanctuary...</p>
        </div>
      </div>
    );
  }

  const { pet, trees, gardenCoins, totalFocusHours, totalForestHarvested } = gardenState;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Trees className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Gamified Focus Garden & Study Pet</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> RPG Focus Sanctuary
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Plant digital seeds, nurture your mythical study companion, and build a flourishing forest as you master deep work sessions.
            </p>
          </div>
        </div>

        {/* Garden Stats Counter */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400">Garden Coins</div>
              <div className="text-sm font-bold text-amber-300 font-mono">{gardenCoins} 🪙</div>
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400">Total Focus</div>
              <div className="text-sm font-bold text-cyan-300 font-mono">{totalFocusHours.toFixed(1)} hrs</div>
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2">
            <Trees className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400">Harvested</div>
              <div className="text-sm font-bold text-emerald-300 font-mono">{totalForestHarvested} Trees</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Planting Station (4 cols) + 3D Forest Island (5 cols) + Pet Sanctuary (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Planting Session Controller (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Focus Planting Station
            </h3>

            {!isTimerRunning ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-2">Select Digital Tree Seed</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { species: 'CHERRY_BLOSSOM' as TreeSpecies, name: 'Sakura Blossom', emoji: '🌸', reward: '+50 XP' },
                      { species: 'GOLDEN_OAK' as TreeSpecies, name: 'Golden Oak', emoji: '🌳', reward: '+100 XP' },
                      { species: 'CYBER_PINE' as TreeSpecies, name: 'Cyber Pine', emoji: '🌲', reward: '+50 XP' },
                      { species: 'MYSTIC_WILLOW' as TreeSpecies, name: 'Mystic Willow', emoji: '🌿', reward: '+180 XP' },
                    ].map(tree => (
                      <button
                        key={tree.species}
                        onClick={() => setSelectedSpecies(tree.species)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                          selectedSpecies === tree.species
                            ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 shadow-md'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        <div className="text-xl">{tree.emoji}</div>
                        <div className="font-bold text-white text-xs">{tree.name}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">{tree.reward}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Focus Duration</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 25, 50, 90].map(mins => (
                      <button
                        key={mins}
                        onClick={() => setDurationPreset(mins)}
                        className={`py-2 rounded-xl font-bold font-mono text-xs border transition-all ${
                          durationPreset === mins
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Subject / Task Goal</label>
                  <input
                    type="text"
                    value={subjectTag}
                    onChange={e => setSubjectTag(e.target.value)}
                    placeholder="e.g. Graph Algorithms / UPSC Polity"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={handleStartPlanting}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Play className="w-4 h-4" />
                  Plant Seed & Begin Deep Focus
                </button>
              </div>
            ) : (
              <div className="space-y-6 text-center py-4">
                <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping"></div>
                  <div className="w-36 h-36 rounded-full bg-emerald-950/40 border-4 border-emerald-500 flex flex-col items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <div className="text-3xl animate-bounce">{getTreeEmoji(selectedSpecies)}</div>
                    <div className="text-2xl font-black text-white font-mono mt-1">
                      {formatTime(secondsRemaining)}
                    </div>
                    <div className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider">
                      Sprouting...
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">{subjectTag}</div>
                  <p className="text-[11px] text-slate-400">
                    Stay on this tab! If you surrender early, your sprout will wither.
                  </p>
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleCompleteSession(false)}
                    className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Square className="w-3.5 h-3.5" />
                    Give Up (Sprout Withers)
                  </button>
                  <button
                    onClick={() => handleCompleteSession(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Harvest Tree Early
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: 3D Forest Island Canvas (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Trees className="w-4 h-4 text-emerald-400" />
                Living Forest Island ({trees.length} Placed)
              </h3>
              <span className="text-xs text-slate-400 font-mono">Grid 4x4</span>
            </div>

            {/* Isometric Island Grid */}
            <div className="relative bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 border border-emerald-500/20 rounded-2xl p-6 min-h-[360px] flex items-center justify-center">
              <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
                {trees.map((tree) => (
                  <div
                    key={tree.id}
                    className={`aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all group relative cursor-pointer ${
                      tree.status === 'HARVESTED'
                        ? 'bg-gradient-to-tr from-emerald-950/60 to-slate-900 border-emerald-500/40 hover:border-emerald-400 hover:scale-110 shadow-lg shadow-emerald-950/50'
                        : tree.status === 'WITHERED'
                        ? 'bg-rose-950/20 border-rose-900/40 opacity-60'
                        : 'bg-amber-950/30 border-amber-500/40 animate-pulse'
                    }`}
                  >
                    <div className="text-2xl">{getTreeEmoji(tree.species, tree.status)}</div>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">{tree.durationMinutes}m</span>

                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col bg-slate-950 border border-slate-800 rounded-xl p-2 text-[10px] text-slate-300 w-36 shadow-2xl z-20 pointer-events-none">
                      <span className="font-bold text-emerald-300">{tree.species}</span>
                      <span>Subject: {tree.focusSubject}</span>
                      <span>Status: {tree.status}</span>
                      <span className="text-amber-300 font-mono">+{tree.earnedCoins} Coins</span>
                    </div>
                  </div>
                ))}

                {/* Empty plots */}
                {Array.from({ length: Math.max(0, 16 - trees.length) }).map((_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="aspect-square rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/30 flex items-center justify-center text-slate-700 hover:border-slate-700 transition-all"
                  >
                    <span className="text-xs opacity-40">🌱</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                Every completed session adds permanent lush greenery to your campus!
              </span>
            </div>
          </div>
        </div>

        {/* Right: Virtual Study Pet Companion (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Heart className="w-4 h-4 text-rose-400" />
              Study Pet Companion
            </h3>

            <div className="text-center space-y-3">
              <div className="relative w-24 h-24 mx-auto bg-gradient-to-tr from-indigo-900/60 to-purple-900/60 border-2 border-indigo-500/40 rounded-full flex items-center justify-center text-5xl shadow-xl shadow-indigo-500/20 group cursor-pointer" onClick={handlePetInteract}>
                {pet.type === 'WISE_OWL' ? '🦉' : pet.type === 'CHILL_CAPYBARA' ? '🦫' : '🐲'}
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full border border-slate-900">
                  Lv.{pet.level}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm">{pet.name}</h4>
                <div className="text-[11px] text-cyan-400 font-semibold flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3" /> Focus Boost: +{pet.activeFocusBoostPercent}% XP
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-1 text-left text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Pet Level {pet.level}</span>
                  <span className="font-mono text-indigo-300">{pet.currentXp} / {pet.xpToNextLevel} XP</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (pet.currentXp / pet.xpToNextLevel) * 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-2">
                  <span>Happiness</span>
                  <span className="text-rose-400 font-mono">{pet.happinessPercent}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${pet.happinessPercent}%` }}
                  />
                </div>
              </div>

              {/* Pet Interaction Button */}
              <button
                onClick={handlePetInteract}
                className="w-full py-2 bg-gradient-to-r from-rose-600/80 to-amber-600/80 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <Heart className="w-3.5 h-3.5" />
                Pet & Feed ({pet.currentMood})
              </button>

              <div className="text-[11px] text-slate-400 italic bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-500/20">
                "Keep focused! Every 25 minutes of deep study gives me XP and levels up our campus garden."
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default FocusGardenView;
