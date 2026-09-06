import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  School,
  Sliders,
  X
} from 'lucide-react';
import {
  RankPredictionResult,
  MistakeEntry,
  PredictRankDto
} from '@studentlife/shared';

export const RankPredictorMistakeVaultView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'RANK_PREDICTOR' | 'MISTAKE_VAULT'>('RANK_PREDICTOR');
  const [examType, setExamType] = useState<string>('JEE Advanced');
  const [physicsAccuracy, setPhysicsAccuracy] = useState<number>(82);
  const [mathAccuracy, setMathAccuracy] = useState<number>(75);
  const [chemistryAccuracy, setChemistryAccuracy] = useState<number>(88);
  const [avgSpeed, setAvgSpeed] = useState<number>(75);
  
  const [prediction, setPrediction] = useState<RankPredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);
  
  // Retest Modal state
  const [activeRetestMistake, setActiveRetestMistake] = useState<MistakeEntry | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [retestResult, setRetestResult] = useState<{ isCorrect: boolean; message: string } | null>(null);

  useEffect(() => {
    handlePredictRank();
    fetchMistakes();
  }, []);

  const handlePredictRank = async () => {
    try {
      setIsPredicting(true);
      const dto: PredictRankDto = {
        examType,
        subjectScores: [
          { subject: 'Section A', accuracyPercent: physicsAccuracy, avgSpeedSecondsPerQuestion: avgSpeed, attemptCount: 40 },
          { subject: 'Section B', accuracyPercent: mathAccuracy, avgSpeedSecondsPerQuestion: avgSpeed, attemptCount: 35 },
          { subject: 'Section C', accuracyPercent: chemistryAccuracy, avgSpeedSecondsPerQuestion: avgSpeed, attemptCount: 45 },
        ]
      };

      const res = await fetch('/api/rank-predictor/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPrediction(data.data);
      }
    } catch (err) {
      console.error('Failed to predict rank', err);
    } finally {
      setIsPredicting(false);
    }
  };

  const fetchMistakes = async () => {
    try {
      const res = await fetch('/api/rank-predictor/mistakes');
      const data = await res.json();
      if (data.success && data.data) {
        setMistakes(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch mistakes', err);
    }
  };

  const handleRetestSubmit = async () => {
    if (!activeRetestMistake || !selectedOption) return;
    try {
      const res = await fetch('/api/rank-predictor/mistakes/retest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mistakeId: activeRetestMistake.id,
          userAnswer: selectedOption
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const isCorrect = data.data.isCorrect;
        setRetestResult({
          isCorrect,
          message: isCorrect
            ? '🎯 Awesome! Conceptual gap resolved. Spaced interval extended by +7 days.'
            : '❌ Still incorrect. Re-read the explanation carefully.'
        });
        fetchMistakes();
      }
    } catch (err) {
      console.error('Failed to submit retest', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">AIR Predictor & Mistake Vault</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Predictive Intelligence
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Machine Learning rank & cutoff feasibility predictor paired with an automated Spaced Mistake Vault.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('RANK_PREDICTOR')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'RANK_PREDICTOR'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            AIR & Cutoff Predictor
          </button>
          <button
            onClick={() => setActiveTab('MISTAKE_VAULT')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'MISTAKE_VAULT'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Mistake Vault ({mistakes.filter(m => !m.isResolved).length})
          </button>
        </div>
      </div>

      {activeTab === 'RANK_PREDICTOR' ? (
        /* AIR Rank Predictor Screen */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Adjusters (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sliders className="w-4 h-4 text-amber-400" />
                Performance Parameters
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Target Exam Domain</label>
                  <select
                    value={examType}
                    onChange={e => setExamType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="JEE Advanced">JEE Advanced (Engineering)</option>
                    <option value="NEET UG">NEET UG (Medical)</option>
                    <option value="UPSC Civil Services">UPSC Civil Services (IAS/IPS)</option>
                    <option value="GATE Computer Science">GATE Computer Science & IT</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subject 1 Accuracy:</span>
                    <span className="text-cyan-300 font-mono font-bold">{physicsAccuracy}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={physicsAccuracy}
                    onChange={e => setPhysicsAccuracy(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subject 2 Accuracy:</span>
                    <span className="text-amber-300 font-mono font-bold">{mathAccuracy}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={mathAccuracy}
                    onChange={e => setMathAccuracy(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subject 3 Accuracy:</span>
                    <span className="text-emerald-300 font-mono font-bold">{chemistryAccuracy}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={chemistryAccuracy}
                    onChange={e => setChemistryAccuracy(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Speed per Question:</span>
                    <span className="text-rose-300 font-mono font-bold">{avgSpeed}s</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="180"
                    value={avgSpeed}
                    onChange={e => setAvgSpeed(Number(e.target.value))}
                    className="w-full accent-rose-400"
                  />
                </div>

                <button
                  onClick={handlePredictRank}
                  disabled={isPredicting}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isPredicting ? 'Recalculating...' : 'Recalculate AIR & Cutoffs'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Prediction Results (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {prediction && (
              <div className="space-y-6">
                {/* Score Card Hero */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl flex flex-wrap items-center justify-around gap-6 text-center">
                  <div>
                    <div className="text-xs text-slate-400">Predicted Percentile</div>
                    <div className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono mt-1">
                      {prediction.predictedPercentile}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Predicted All-India Rank (AIR)</div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-1">
                      #{prediction.predictedAIRRange.minRank.toLocaleString()} – #{prediction.predictedAIRRange.maxRank.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Estimated Raw Score</div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
                      {prediction.estimatedScore} / {prediction.totalMarks}
                    </div>
                  </div>
                </div>

                {/* College Admission Cutoff Feasibility Radar */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                    <School className="w-4 h-4 text-cyan-400" />
                    Target Institution & Cutoff Matchmaker
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {prediction.eligibleInstitutions.map((inst, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 text-xs truncate max-w-[180px]">{inst.college}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            inst.admissionProbability === 'HIGH' ? 'bg-emerald-500/20 text-emerald-300' :
                            inst.admissionProbability === 'MODERATE' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-rose-500/20 text-rose-300'
                          }`}>
                            {inst.admissionProbability}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{inst.branch}</div>
                        <div className="text-[10px] text-cyan-400 font-mono">Cutoff: {inst.cutoffPercentile}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Mistake Vault / Error Notebook Screen */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Automated Mistake Vault & Error Notebook ({mistakes.length} Logged)
            </h3>
            <span className="text-xs text-slate-400">Questions you got wrong in mock tests & battles</span>
          </div>

          <div className="space-y-4">
            {mistakes.map(m => (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  m.isResolved
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                      {m.examOrSubject} • {m.topic}
                    </span>
                    <span className="text-rose-400 font-mono text-[10px] font-bold">
                      Failed {m.failedCount}x
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.isResolved ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Concept Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveRetestMistake(m);
                          setSelectedOption('');
                          setRetestResult(null);
                        }}
                        className="px-3 py-1 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Re-Test Now
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-sm font-medium text-slate-200">
                  {m.questionText}
                </div>

                <div className="text-xs text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="text-rose-400">Your wrong attempt: <span className="line-through">{m.userWrongAnswer}</span></div>
                  <div className="text-emerald-400">Correct solution: <strong>{m.correctAnswer}</strong></div>
                  <div className="text-slate-300 italic pt-1 border-t border-slate-800">{m.explanation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Retest Modal */}
      {activeRetestMistake && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                Re-Test Conceptual Gap
              </h3>
              <button onClick={() => setActiveRetestMistake(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm font-medium text-slate-200">
              {activeRetestMistake.questionText}
            </p>

            {activeRetestMistake.options && (
              <div className="space-y-2">
                {activeRetestMistake.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedOption(opt)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      selectedOption === opt
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {retestResult && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                retestResult.isCorrect ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
              }`}>
                {retestResult.message}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveRetestMistake(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                Close
              </button>
              <button
                onClick={handleRetestSubmit}
                disabled={!selectedOption}
                className="px-5 py-2 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
              >
                Submit & Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RankPredictorMistakeVaultView;
