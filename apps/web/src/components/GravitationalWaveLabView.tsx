import React, { useState } from 'react';
import {
  Waves,
  Sparkles,
  Activity,
  Compass
} from 'lucide-react';
import { GravitationalWaveEvent } from '@studentlife/shared';

interface Props {
  onAddXp?: (amount: number) => void;
}

const PRESET_EVENTS = [
  { name: 'GW150914 (First Binary Black Hole Discovery)', m1: 36.0, m2: 29.0, dist: 410 },
  { name: 'GW170817 (Binary Neutron Star Kilonova)', m1: 1.46, m2: 1.27, dist: 40 },
  { name: 'GW190521 (Intermediate-Mass Black Hole)', m1: 85.0, m2: 66.0, dist: 5300 }
];

export const GravitationalWaveLabView: React.FC<Props> = ({ onAddXp }) => {
  const [primaryMass, setPrimaryMass] = useState(36.0);
  const [secondaryMass, setSecondaryMass] = useState(29.0);
  const [luminosityDist, setLuminosityDist] = useState(410);
  const [isLoading, setIsLoading] = useState(false);

  const [eventData, setEventData] = useState<GravitationalWaveEvent>({
    id: 'gw-init',
    eventName: 'GW150914 (First Binary Black Hole Discovery)',
    primaryMassSolar: 36.0,
    secondaryMassSolar: 29.0,
    chirpMassSolar: 28.1,
    luminosityDistanceMpc: 410,
    peakGravitationalPowerWatts: 3.6e49,
    remnantBlackHoleMassSolar: 62.0,
    energyRadiatedSolarMasses: 3.0,
    detectorNetwork: ['LIGO Hanford (H1)', 'LIGO Livingston (L1)', 'Virgo (V1)'],
    strainWaveform: [
      { timeMs: -30, strainH10Minus21: 0.15, frequencyHz: 45 },
      { timeMs: -20, strainH10Minus21: -0.32, frequencyHz: 65 },
      { timeMs: -10, strainH10Minus21: 0.68, frequencyHz: 120 },
      { timeMs: -5, strainH10Minus21: -0.95, frequencyHz: 180 },
      { timeMs: 0, strainH10Minus21: 1.25, frequencyHz: 250 },
      { timeMs: 5, strainH10Minus21: -0.62, frequencyHz: 250 },
      { timeMs: 10, strainH10Minus21: 0.18, frequencyHz: 250 },
      { timeMs: 15, strainH10Minus21: -0.04, frequencyHz: 250 }
    ]
  });

  const handleSimulate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gravitational-waves/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryMassSolar: primaryMass,
          secondaryMassSolar: secondaryMass,
          luminosityDistanceMpc: luminosityDist
        })
      });
      if (res.ok) {
        const data: GravitationalWaveEvent = await res.json();
        setEventData(data);
        if (onAddXp) onAddXp(75);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  // SVG Waveform Plot Coordinates
  const svgWidth = 600;
  const svgHeight = 200;
  const padding = 35;
  const minTime = -40;
  const maxTime = 15;
  const minStrain = -1.5;
  const maxStrain = 1.5;

  const getX = (t: number) => padding + ((t - minTime) / (maxTime - minTime)) * (svgWidth - 2 * padding);
  const getY = (s: number) => svgHeight - padding - ((s - minStrain) / (maxStrain - minStrain)) * (svgHeight - 2 * padding);

  const pathPoints = eventData.strainWaveform
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(pt.timeMs)} ${getY(pt.strainH10Minus21)}`)
    .join(' ');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950/70 via-slate-900 to-indigo-950/80 border border-violet-500/30 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold uppercase tracking-wider">
              <Waves className="w-3.5 h-3.5" />
              Phase 96 • Gravitational Wave Interferometry & Black Hole Merger Ringdown
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              LIGO/Virgo Spacetime Strain Laboratory
              <span className="text-xs px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/40">
                General Relativity Sim
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Model quadupolar spacetime perturbations $h(t)$, calculate Chirp Mass $\mathcal&#123;M&#125; = (m_1 m_2)^&#123;3/5&#125; / (m_1+m_2)^&#123;1/5&#125;$, and extract quasinormal ringdown waveforms from binary black hole collisions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulate}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white font-medium shadow-lg shadow-violet-500/25 transition-all text-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Computing Strain...' : 'Simulate Merger Chirp'}
            </button>
          </div>
        </div>
      </div>

      {/* Preset Pickers */}
      <div className="flex flex-wrap gap-2">
        {PRESET_EVENTS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrimaryMass(preset.m1);
              setSecondaryMass(preset.m2);
              setLuminosityDist(preset.dist);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              primaryMass === preset.m1 && secondaryMass === preset.m2
                ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Binary Mass Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-violet-400" />
              Binary Progenitor Masses (M_☉)
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Primary Mass (m₁)</span>
                  <span className="text-violet-300 font-mono font-bold">{primaryMass} M_☉</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={100.0}
                  step={0.5}
                  value={primaryMass}
                  onChange={(e) => setPrimaryMass(parseFloat(e.target.value))}
                  className="w-full accent-violet-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Secondary Mass (m₂)</span>
                  <span className="text-indigo-300 font-mono font-bold">{secondaryMass} M_☉</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={100.0}
                  step={0.5}
                  value={secondaryMass}
                  onChange={(e) => setSecondaryMass(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Luminosity Distance</span>
                  <span className="text-pink-300 font-mono font-bold">{luminosityDist} Mpc</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={6000}
                  step={20}
                  value={luminosityDist}
                  onChange={(e) => setLuminosityDist(parseInt(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Chirp Mass Gauge */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Astrophysical Chirp Mass (ℳ)
            </h3>

            <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/30 text-center space-y-1">
              <div className="text-2xl font-black text-white">
                {eventData.chirpMassSolar} <span className="text-xs text-violet-400">M_☉</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Radiated Energy: <span className="text-emerald-400 font-bold">{eventData.energyRadiatedSolarMasses} M_☉ c²</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Strain Waveform SVG & Spectrogram */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Waves className="w-4 h-4 text-violet-400" />
                Differential Spacetime Strain Waveform h(t) [× 10⁻²¹]
              </h3>
              <span className="text-xs text-violet-400 font-mono">Peak Power: 3.6 × 10⁴⁹ W</span>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 overflow-x-auto">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44">
                {/* Zero Strain Baseline */}
                <line x1={padding} y1={getY(0)} x2={svgWidth - padding} y2={getY(0)} stroke="#334155" strokeDasharray="3 3" />
                <line x1={getX(0)} y1={padding} x2={getX(0)} y2={svgHeight - padding} stroke="#6366f1" strokeDasharray="2 2" />

                {/* Strain Waveform Path */}
                <path d={pathPoints} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Data Points */}
                {eventData.strainWaveform.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={getX(pt.timeMs)}
                    cy={getY(pt.strainH10Minus21)}
                    r="3"
                    fill="#c084fc"
                  />
                ))}

                {/* Labels */}
                <text x={padding} y={svgHeight - 10} fill="#64748b" fontSize="10">Inspiral (-40ms)</text>
                <text x={getX(0) - 15} y={padding + 12} fill="#e879f9" fontSize="10" fontWeight="bold">Merger (t=0)</text>
                <text x={svgWidth - padding - 75} y={svgHeight - 10} fill="#64748b" fontSize="10">Ringdown (+15ms)</text>
              </svg>
            </div>
          </div>

          {/* Remnant Properties */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Remnant Black Hole</div>
              <div className="text-xl font-bold text-violet-300">{eventData.remnantBlackHoleMassSolar} M_☉</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Peak Luminosity</div>
              <div className="text-xl font-bold text-amber-300">5.3 × 10³ erg/s</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Detector Triad</div>
              <div className="text-xl font-bold text-emerald-300">H1 + L1 + V1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GravitationalWaveLabView;
