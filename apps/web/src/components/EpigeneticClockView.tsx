import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Activity,
  Award
} from 'lucide-react';
import { EpigeneticClockReport } from '@studentlife/shared';

interface Props {
  onAddXp?: (amount: number) => void;
}

export const EpigeneticClockView: React.FC<Props> = ({ onAddXp }) => {
  const [chronoAge, setChronoAge] = useState(22);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [cardioMins, setCardioMins] = useState(150);
  const [dietScore, setDietScore] = useState(8);
  const [stressScore, setStressScore] = useState(4);
  const [isLoading, setIsLoading] = useState(false);

  const [report, setReport] = useState<EpigeneticClockReport>({
    id: 'epi-init',
    chronologicalAgeYears: 22,
    epigeneticAgeHorvathYears: 19.8,
    epigeneticAgeHannumYears: 20.1,
    biologicalAgeAccelerationYears: -2.2,
    vitalityScorePercent: 92,
    analyzedCpgSites: [
      { cpgId: 'cg02228185', geneSymbol: 'ASPA', betaValuePercentage: 24.5, biologicalImpact: 'DNA_REPAIR' },
      { cpgId: 'cg25809905', geneSymbol: 'ELOVL2', betaValuePercentage: 18.2, biologicalImpact: 'METABOLIC_EFFICIENCY' },
      { cpgId: 'cg16867657', geneSymbol: 'KLF14', betaValuePercentage: 42.1, biologicalImpact: 'INFLAMMATION_REGULATION' },
      { cpgId: 'cg09809672', geneSymbol: 'EDARADD', betaValuePercentage: 12.8, biologicalImpact: 'CELLULAR_SENESCENCE' }
    ],
    recommendedLifestyleInterventions: [
      'Maintain 7.5+ hours of consistent deep REM circadian sleep',
      'Incorporate 150 mins Zone-2 mitochondrial aerobic training weekly',
      'Adopt polyphenol-rich antioxidant foods (matcha, berries, leafy greens)'
    ]
  });

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/epigenetic-clock/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chronologicalAgeYears: chronoAge,
          dailySleepHours: sleepHours,
          weeklyCardioMinutes: cardioMins,
          mediterraneanDietAdherenceScore: dietScore,
          stressIndex: stressScore
        })
      });
      if (res.ok) {
        const data: EpigeneticClockReport = await res.json();
        setReport(data);
        if (onAddXp) onAddXp(65);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-pink-950/80 border border-rose-500/30 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5" />
              Phase 98 • Epigenetic DNA Methylation & Biological Longevity Clock
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Horvath-Hannum DNA Methylation Clock
              <span className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Cellular Epigenetics
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Quantify biological age acceleration ($\Delta \text&#123;Age&#125;$), analyze CpG island methylation beta-values, and optimize sleep/exercise habits to reverse cellular senescence.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-medium shadow-lg shadow-rose-500/25 transition-all text-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Computing Epigenetics...' : 'Analyze Epigenetic Age'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lifestyle Biomarker Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              Student Lifestyle Biomarkers
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Chronological Age</span>
                  <span className="text-white font-mono font-bold">{chronoAge} Years</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={45}
                  value={chronoAge}
                  onChange={(e) => setChronoAge(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Daily Deep Sleep (Hours)</span>
                  <span className="text-rose-300 font-mono font-bold">{sleepHours} hrs</span>
                </div>
                <input
                  type="range"
                  min={4.0}
                  max={10.0}
                  step={0.5}
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Weekly Aerobic Cardio (Minutes)</span>
                  <span className="text-pink-300 font-mono font-bold">{cardioMins} mins</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={15}
                  value={cardioMins}
                  onChange={(e) => setCardioMins(parseInt(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Mediterranean Diet Adherence</span>
                  <span className="text-emerald-300 font-mono font-bold">{dietScore}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={dietScore}
                  onChange={(e) => setDietScore(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Cortisol & Exam Stress Index</span>
                  <span className="text-amber-300 font-mono font-bold">{stressScore}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={stressScore}
                  onChange={(e) => setStressScore(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Vitality Score Gauge */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-rose-400" />
              <span className="text-slate-300 font-semibold">Cellular Vitality Index:</span>
            </div>
            <span className="text-rose-400 font-mono font-bold text-sm">{report.vitalityScorePercent}%</span>
          </div>
        </div>

        {/* Right Column: Epigenetic Results & CpG Sites */}
        <div className="lg:col-span-7 space-y-4">
          {/* Age Divergence Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Horvath Epigenetic Age</div>
              <div className="text-xl font-bold text-rose-300">{report.epigeneticAgeHorvathYears} Yrs</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Biological Acceleration</div>
              <div className={`text-xl font-bold ${report.biologicalAgeAccelerationYears <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {report.biologicalAgeAccelerationYears > 0 ? `+${report.biologicalAgeAccelerationYears}` : report.biologicalAgeAccelerationYears} Yrs
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Hannum Epigenetic Age</div>
              <div className="text-xl font-bold text-pink-300">{report.epigeneticAgeHannumYears} Yrs</div>
            </div>
          </div>

          {/* CpG Island Methylation Beta-Values */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              CpG Island Methylation Beta-Values
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {report.analyzedCpgSites.map((site) => (
                <div key={site.cpgId} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{site.geneSymbol}</span>
                    <span className="text-[10px] text-rose-400 font-mono font-semibold">{site.betaValuePercentage}% β</span>
                  </div>
                  <div className="text-[10px] text-slate-400">ID: {site.cpgId}</div>
                  <div className="text-[10px] text-emerald-400">{site.biologicalImpact.replace(/_/g, ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpigeneticClockView;
