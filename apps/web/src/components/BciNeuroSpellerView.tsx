import React, { useState, useEffect } from 'react';
import {
  Activity,
  RefreshCw,
  Eye
} from 'lucide-react';
import type { P300SpellerSession } from '@studentlife/shared';

interface BciNeuroSpellerViewProps {
  onAddXp?: (amount: number) => void;
}

const SPELLER_GRID = [
  ['A', 'B', 'C', 'D', 'E', 'F'],
  ['G', 'H', 'I', 'J', 'K', 'L'],
  ['M', 'N', 'O', 'P', 'Q', 'R'],
  ['S', 'T', 'U', 'V', 'W', 'X'],
  ['Y', 'Z', '1', '2', '3', '4'],
  ['5', '6', '7', '8', '9', '_']
];

export const BciNeuroSpellerView: React.FC<BciNeuroSpellerViewProps> = ({ onAddXp }) => {
  const [targetWord, setTargetWord] = useState('BRAIN');
  const [spelledText, setSpelledText] = useState('B');
  const [session, setSession] = useState<P300SpellerSession | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [flashingRow, setFlashingRow] = useState<number | null>(null);
  const [flashingCol, setFlashingCol] = useState<number | null>(null);

  const processBciEpoch = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/bci-speller/process-epoch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetWord,
          currentSpelledText: spelledText,
          samplingRateHz: 250
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSession(data.data);
        setSpelledText(data.data.spelledWord);
        if (onAddXp) onAddXp(50);
      }
    } catch (e) {
      console.error('Failed to process BCI epoch', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    processBciEpoch();

    // Visual matrix flash interval
    const interval = setInterval(() => {
      const isRow = Math.random() > 0.5;
      if (isRow) {
        setFlashingRow(Math.floor(Math.random() * 6));
        setFlashingCol(null);
      } else {
        setFlashingCol(Math.floor(Math.random() * 6));
        setFlashingRow(null);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/40 via-cyan-950/40 to-blue-950/40 border border-teal-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Activity className="w-64 h-64 text-teal-400" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                Phase 92 • Brain-Computer Interface (BCI)
              </span>
              <span className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
                <Activity className="w-3.5 h-3.5" /> P300 Event-Related Potential Speller
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-teal-400" />
              BCI P300 Neuro-Speller & Neural Interface Matrix
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Type hands-free using real-time EEG P300 event-related potential (ERP) peak detection. Watch target rows/columns flash to evoke visual oddball action potentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={processBciEpoch}
              disabled={loading}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Decode Next Letter
            </button>
          </div>
        </div>
      </div>

      {/* Target Word Input & Decoded Display */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-semibold text-slate-300 block">Target Word Intent</label>
          <input
            type="text"
            value={targetWord}
            onChange={(e) => setTargetWord(e.target.value.toUpperCase())}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono tracking-widest focus:border-teal-500 focus:outline-none uppercase"
          />
        </div>

        <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block mb-1 uppercase font-semibold">Brain-Decoded Text Buffer</span>
          <span className="text-2xl font-mono font-black text-teal-300 tracking-widest">
            {spelledText} <span className="animate-pulse text-cyan-400">|</span>
          </span>
        </div>
      </div>

      {/* Main Workspace: 6x6 Matrix & ERP Waveform */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 6x6 Speller Matrix */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-400" />
              6×6 Alphanumeric Flashing Grid
            </h3>
            <span className="text-xs text-cyan-400 font-mono">Oddball Paradigm</span>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {SPELLER_GRID.map((row, rIdx) =>
              row.map((char, cIdx) => {
                const isFlashing = flashingRow === rIdx || flashingCol === cIdx;
                const isDecoded = spelledText.includes(char);
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`h-14 rounded-xl flex items-center justify-center font-mono font-black text-lg transition-all duration-100 ${
                      isFlashing
                        ? 'bg-gradient-to-tr from-cyan-400 to-white text-slate-950 scale-105 shadow-lg shadow-cyan-400/40 z-10'
                        : isDecoded
                        ? 'bg-teal-950/40 border border-teal-500/50 text-teal-300'
                        : 'bg-slate-950 border border-slate-800 text-slate-300'
                    }`}
                  >
                    {char}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Real-Time P300 ERP Waveform */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              P300 Event-Related Potential (ERP) Leads
            </h3>
            <span className="text-xs font-mono text-teal-300">Pz Electrode Lead</span>
          </div>

          {session && (
            <div className="space-y-4">
              {/* Waveform Visualization Bars */}
              <div className="h-44 flex items-end gap-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
                {session.erpWaveform.map((pt, idx) => {
                  const heightPercent = Math.max(5, Math.min(100, ((pt.pzMv + 5) / 18) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div
                        className={`w-full rounded-t transition-all ${
                          pt.timeMs >= 260 && pt.timeMs <= 340
                            ? 'bg-gradient-to-t from-cyan-500 to-teal-300 animate-pulse'
                            : 'bg-slate-700/60'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                        title={`t=${pt.timeMs}ms | Pz=${pt.pzMv}uV`}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>0 ms (Flash Stimulus)</span>
                <span className="text-cyan-300 font-bold">▲ ~300ms Positive P300 ERP Peak (+9.8 µV)</span>
                <span>600 ms</span>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Classifier Confidence</span>
                  <span className="text-base font-bold text-emerald-400">{session.classificationConfidencePercent}%</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Spelling Speed</span>
                  <span className="text-base font-bold text-cyan-300">{session.wordsPerMinute} WPM (Hands-Free)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
