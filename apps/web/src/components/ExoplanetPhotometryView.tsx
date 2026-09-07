import React, { useState } from 'react';
import {
  Orbit,
  Sparkles,
  Sun,
  Globe,
  Thermometer,
  Zap,
  Activity,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { ExoplanetTransitAnalysis } from '@studentlife/shared';

interface Props {
  onAddXp?: (amount: number) => void;
}

const PRESET_STARS = [
  {
    starName: 'Kepler-186',
    radiusSolar: 0.52,
    tempK: 3755,
    description: 'M1-dwarf star in Cygnus hosting an Earth-sized habitable zone planet'
  },
  {
    starName: 'TRAPPIST-1',
    radiusSolar: 0.12,
    tempK: 2566,
    description: 'Ultra-cool red dwarf harboring 7 temperate terrestrial exoplanets'
  },
  {
    starName: 'HD 209458 (Osiris)',
    radiusSolar: 1.15,
    tempK: 6065,
    description: 'First detected transiting Hot Jupiter with evaporating upper atmosphere'
  }
];

export const ExoplanetPhotometryView: React.FC<Props> = ({ onAddXp }) => {
  const [starName, setStarName] = useState('Kepler-186');
  const [stellarRadius, setStellarRadius] = useState(0.52);
  const [stellarTemp, setStellarTemp] = useState(3755);
  const [isLoading, setIsLoading] = useState(false);

  const [analysis, setAnalysis] = useState<ExoplanetTransitAnalysis>({
    id: 'exo-init',
    starName: 'Kepler-186',
    planetName: 'Kepler-186 f (Earth-Analogue Candidate)',
    transitDepthPpm: 480,
    planetRadiusEarthRadii: 1.17,
    orbitalPeriodDays: 129.9,
    semiMajorAxisAu: 0.432,
    equilibriumTempKelvin: 242,
    isInHabitableZone: true,
    transitLightCurve: [
      { timeHours: -6.0, normalizedFlux: 1.0, fluxError: 0.00004 },
      { timeHours: -4.5, normalizedFlux: 1.0, fluxError: 0.00004 },
      { timeHours: -3.0, normalizedFlux: 0.9998, fluxError: 0.00004 },
      { timeHours: -1.5, normalizedFlux: 0.99955, fluxError: 0.00004 },
      { timeHours: 0.0, normalizedFlux: 0.99952, fluxError: 0.00004 },
      { timeHours: 1.5, normalizedFlux: 0.99955, fluxError: 0.00004 },
      { timeHours: 3.0, normalizedFlux: 0.9998, fluxError: 0.00004 },
      { timeHours: 4.5, normalizedFlux: 1.0, fluxError: 0.00004 },
      { timeHours: 6.0, normalizedFlux: 1.0, fluxError: 0.00004 }
    ]
  });

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/exoplanet-photometry/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          starName,
          stellarRadiusSolar: stellarRadius,
          stellarEffectiveTempK: stellarTemp
        })
      });
      if (res.ok) {
        const data: ExoplanetTransitAnalysis = await res.json();
        setAnalysis(data);
        if (onAddXp) onAddXp(65);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  // Convert light curve to SVG coordinates
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = 40;

  const minTime = -6.0;
  const maxTime = 6.0;
  const minFlux = 0.9994;
  const maxFlux = 1.0002;

  const getX = (t: number) => padding + ((t - minTime) / (maxTime - minTime)) * (svgWidth - 2 * padding);
  const getY = (f: number) => svgHeight - padding - ((f - minFlux) / (maxFlux - minFlux)) * (svgHeight - 2 * padding);

  const pathPoints = analysis.transitLightCurve
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(pt.timeHours)} ${getY(pt.normalizedFlux)}`)
    .join(' ');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/70 border border-sky-500/30 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider">
              <Orbit className="w-3.5 h-3.5" />
              Phase 94 • Exoplanet Transit Photometry & Kepler Light-Curve Extractor
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Kepler Light-Curve & Exoplanet Transit Lab
              <span className="text-xs px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40">
                Photometry Pipeline
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Extract occultation transit flux dips, calculate planetary radii <code className="text-sky-300">R_p = R_* \sqrt&#123;\Delta F&#125;</code>, and model Goldilocks Habitable Zone equilibrium temperatures.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium shadow-lg shadow-sky-500/25 transition-all text-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Processing Light Curve...' : 'Extract Exoplanet Transit'}
            </button>
          </div>
        </div>
      </div>

      {/* Preset Pickers */}
      <div className="flex flex-wrap gap-2">
        {PRESET_STARS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setStarName(preset.starName);
              setStellarRadius(preset.radiusSolar);
              setStellarTemp(preset.tempK);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all text-left ${
              starName === preset.starName
                ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-semibold">{preset.starName}</div>
            <div className="text-[10px] text-slate-500">{preset.description}</div>
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stellar Control Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              Target Star Parameters
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Host Star Identifier</label>
                <input
                  type="text"
                  value={starName}
                  onChange={(e) => setStarName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Stellar Radius (R_☉)</span>
                  <span className="text-sky-300 font-mono font-bold">{stellarRadius} R_☉</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={2.0}
                  step={0.01}
                  value={stellarRadius}
                  onChange={(e) => setStellarRadius(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Effective Temperature (T_eff)</span>
                  <span className="text-amber-300 font-mono font-bold">{stellarTemp} K</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={8000}
                  step={50}
                  value={stellarTemp}
                  onChange={(e) => setStellarTemp(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Habitability Assessment */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              Goldilocks Zone Habitability
            </h3>

            <div className={`p-3 rounded-xl border flex items-center gap-3 ${
              analysis.isInHabitableZone
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
            }`}>
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div className="text-xs">
                <div className="font-bold">
                  {analysis.isInHabitableZone ? 'Within Liquid Water Zone' : 'Extreme Temperature Orbit'}
                </div>
                <div className="text-slate-400 text-[11px]">
                  T_eq: {analysis.equilibriumTempKelvin} K (~{analysis.equilibriumTempKelvin - 273}°C)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Light-Curve & Results */}
        <div className="lg:col-span-8 space-y-4">
          {/* Light-Curve SVG Plot */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                Differential Photometry Transit Light Curve (ΔF/F)
              </h3>
              <span className="text-xs font-mono text-sky-400">Transit Depth: {analysis.transitDepthPpm} ppm</span>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 overflow-x-auto">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48">
                {/* Grid Lines */}
                <line x1={padding} y1={getY(1.0)} x2={svgWidth - padding} y2={getY(1.0)} stroke="#334155" strokeDasharray="4 4" />
                <line x1={padding} y1={getY(0.9995)} x2={svgWidth - padding} y2={getY(0.9995)} stroke="#334155" strokeDasharray="4 4" />
                <line x1={getX(0)} y1={padding} x2={getX(0)} y2={svgHeight - padding} stroke="#1e293b" />

                {/* Transit Dip Area Fill */}
                <path
                  d={`${pathPoints} L ${getX(6.0)} ${svgHeight - padding} L ${getX(-6.0)} ${svgHeight - padding} Z`}
                  fill="url(#transitGrad)"
                  opacity="0.15"
                />

                <defs>
                  <linearGradient id="transitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Transit Model Curve */}
                <path d={pathPoints} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

                {/* Data Points with Error Bars */}
                {analysis.transitLightCurve.map((pt, idx) => (
                  <g key={idx}>
                    <line
                      x1={getX(pt.timeHours)}
                      y1={getY(pt.normalizedFlux + pt.fluxError * 2)}
                      x2={getX(pt.timeHours)}
                      y2={getY(pt.normalizedFlux - pt.fluxError * 2)}
                      stroke="#0284c7"
                      strokeWidth="1"
                    />
                    <circle
                      cx={getX(pt.timeHours)}
                      cy={getY(pt.normalizedFlux)}
                      r="3.5"
                      fill="#e0f2fe"
                      stroke="#0284c7"
                      strokeWidth="1.5"
                    />
                  </g>
                ))}

                {/* Axis Labels */}
                <text x={padding} y={svgHeight - 12} fill="#64748b" fontSize="10">Time (Hours from mid-transit)</text>
                <text x={svgWidth - padding - 80} y={svgHeight - 12} fill="#64748b" fontSize="10">+6.0 hrs</text>
                <text x={padding} y={getY(1.0) - 4} fill="#64748b" fontSize="9">Flux: 1.000</text>
                <text x={padding} y={getY(0.9995) - 4} fill="#38bdf8" fontSize="9">Dip: -{analysis.transitDepthPpm} ppm</text>
              </svg>
            </div>
          </div>

          {/* Extracted Exoplanet Properties */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                Planetary Radius
              </div>
              <div className="text-lg font-bold text-white">
                {analysis.planetRadiusEarthRadii} R_⊕
              </div>
              <div className="text-[10px] text-sky-400">Earth-Size Class</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Orbit className="w-3.5 h-3.5 text-indigo-400" />
                Orbital Period
              </div>
              <div className="text-lg font-bold text-white">
                {analysis.orbitalPeriodDays} d
              </div>
              <div className="text-[10px] text-slate-400">Semi-Major: {analysis.semiMajorAxisAu} AU</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Equilibrium Temp
              </div>
              <div className="text-lg font-bold text-amber-300">
                {analysis.equilibriumTempKelvin} K
              </div>
              <div className="text-[10px] text-slate-400">{analysis.equilibriumTempKelvin - 273} °C</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Habitable Zone
              </div>
              <div className={`text-lg font-bold ${analysis.isInHabitableZone ? 'text-emerald-400' : 'text-red-400'}`}>
                {analysis.isInHabitableZone ? 'YES' : 'NO'}
              </div>
              <div className="text-[10px] text-slate-400">Goldilocks Belt</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExoplanetPhotometryView;
