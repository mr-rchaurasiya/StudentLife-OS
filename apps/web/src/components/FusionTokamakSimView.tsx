import React, { useState, useEffect } from 'react';
import {
  Flame,
  Zap,
  Gauge,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Radio
} from 'lucide-react';
import type { FusionReactionOutput } from '@studentlife/shared';

interface FusionTokamakSimViewProps {
  onAddXp?: (amount: number) => void;
}

export const FusionTokamakSimView: React.FC<FusionTokamakSimViewProps> = ({ onAddXp }) => {
  const [reactorName, setReactorName] = useState('SPARC-Grade D-T Tokamak');
  const [coreIonTemp, setCoreIonTemp] = useState<number>(18.5); // keV (~185M K)
  const [electronDensity, setElectronDensity] = useState<number>(1.4); // x 10^20 m^-3
  const [confinementTime, setConfinementTime] = useState<number>(3.8); // seconds
  const [auxHeatingMw, setAuxHeatingMw] = useState<number>(40); // MW
  const [simOutput, setSimOutput] = useState<FusionReactionOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'PLASMA_CORE' | 'LAWSON_CRITERION' | 'MAGNETIC_COILS'>('PLASMA_CORE');

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fusion-tokamak/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokamakReactorName: reactorName,
          parameters: {
            coreIonTemperatureKeV: coreIonTemp,
            electronDensityM3: electronDensity * 1e20,
            energyConfinementTimeSeconds: confinementTime,
            toroidalMagneticFieldTesla: 12.2,
            plasmaCurrentMegaAmps: 8.7,
            qFactorSafetySafety: 3.2
          },
          auxiliaryHeatingPowerMw: auxHeatingMw
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimOutput(data.data);
        if (onAddXp) onAddXp(60);
      }
    } catch (e) {
      console.error('Failed to run fusion tokamak simulation', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-950/40 via-red-950/40 to-amber-950/40 border border-orange-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Flame className="w-64 h-64 text-orange-400" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 uppercase tracking-wider">
                Phase 91 • Nuclear Fusion & Plasma Physics
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                <Flame className="w-3.5 h-3.5" /> Deuterium-Tritium Magnetic Confinement
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
              3D Computational Fusion Plasma & Tokamak Magnetic Trap
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Model high-temperature D-T fusion reactions, evaluate the Lawson triple-product ignition criterion ($n\tau_E T$), toroidal/poloidal magnetic coils, and energetic alpha heating power.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runSimulation}
              disabled={loading}
              className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Ignite Plasma Core
            </button>
          </div>
        </div>
      </div>

      {/* Reactor Preset Selectors */}
      <div className="flex flex-wrap gap-2">
        {[
          { name: 'SPARC-Grade D-T Tokamak', temp: 18.5, dens: 1.4, tau: 3.8 },
          { name: 'ITER High-Confinement H-Mode', temp: 22.0, dens: 1.8, tau: 4.5 },
          { name: 'STEP Spherical Tokamak', temp: 15.0, dens: 2.1, tau: 2.9 }
        ].map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setReactorName(preset.name);
              setCoreIonTemp(preset.temp);
              setElectronDensity(preset.dens);
              setConfinementTime(preset.tau);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              reactorName === preset.name
                ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Control Sliders: Magnetic & Thermodynamic Parameters */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Ion Temp ($T_i$): <span className="text-orange-400">{coreIonTemp} keV (~{Math.round(coreIonTemp * 11.6)}M K)</span>
          </label>
          <input
            type="range"
            min="5.0"
            max="35.0"
            step="0.5"
            value={coreIonTemp}
            onChange={(e) => setCoreIonTemp(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Density ($n_e$): <span className="text-amber-400">{electronDensity} × 10²⁰ m⁻³</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={electronDensity}
            onChange={(e) => setElectronDensity(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Confinement ($\tau_E$): <span className="text-teal-400">{confinementTime} s</span>
          </label>
          <input
            type="range"
            min="1.0"
            max="8.0"
            step="0.2"
            value={confinementTime}
            onChange={(e) => setConfinementTime(Number(e.target.value))}
            className="w-full accent-teal-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Aux Input (P_in): <span className="text-indigo-400">{auxHeatingMw} MW</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={auxHeatingMw}
            onChange={(e) => setAuxHeatingMw(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {simOutput && (
        <>
          {/* Key Physics Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Fusion Gain ($Q$)</span>
                <Sparkles className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-3xl font-black text-orange-400">Q = {simOutput.fusionGainQFactor}</div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">
                {simOutput.fusionGainQFactor >= 10 ? 'Net Commercial Power Output ⚡' : 'Scientific Breakeven ($Q > 1$)'}
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Triple Product</span>
                <Gauge className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-300">{simOutput.tripleProductKeVSM3} <span className="text-xs text-slate-400">keV·s·m⁻³</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Lawson Ignition Index</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Fusion Power Output</span>
                <Zap className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-3xl font-black text-rose-400">{simOutput.totalThermalPowerMegawatts} MW</div>
              <p className="text-[11px] text-rose-300 mt-1">Alpha Heating: {simOutput.alphaParticleHeatingMw} MW</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Plasma Regime</span>
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-base font-bold text-teal-300 mt-1">{simOutput.plasmaStabilityStatus.replace(/_/g, ' ')}</div>
              <p className="text-[11px] text-teal-400 mt-1">High Confinement (H-Mode)</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('PLASMA_CORE')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'PLASMA_CORE'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> D-T Nuclear Fusion Core
            </button>
            <button
              onClick={() => setActiveTab('LAWSON_CRITERION')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'LAWSON_CRITERION'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" /> Lawson Criterion ($n\tau_E T$)
            </button>
            <button
              onClick={() => setActiveTab('MAGNETIC_COILS')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'MAGNETIC_COILS'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" /> HTS Magnetics & Poloidal Trap
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'PLASMA_CORE' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4 text-center py-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-300 mx-auto flex items-center justify-center shadow-2xl shadow-orange-500/30 animate-pulse">
                <Flame className="w-12 h-12 text-slate-950" />
              </div>
              <h3 className="text-xl font-bold text-white mt-4">²H + ³H ➔ ⁴He (3.5 MeV) + n (14.1 MeV)</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Deuterium and Tritium ions collide at relativistic velocities inside the toroidal vacuum vessel, producing energetic helium alpha particles that sustain self-heating without external auxiliary RF drive.
              </p>
            </div>
          )}

          {activeTab === 'LAWSON_CRITERION' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-orange-400" />
                Lawson Criterion & Ignition Regimes
              </h3>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
                <p><strong>Calculated Triple Product:</strong> {simOutput.tripleProductKeVSM3} × 10²⁰ keV·s·m⁻³</p>
                <p><strong>Ignition Threshold:</strong> 30.0 × 10²⁰ keV·s·m⁻³ (Lawson Ignition Line)</p>
                <p className="text-emerald-400 font-semibold flex items-center gap-1 pt-2">
                  <CheckCircle2 className="w-4 h-4" /> {simOutput.lawsonCriterionAchieved ? 'Self-Sustaining Burning Plasma Regime Achieved!' : 'Sub-Ignition Breakeven (Q > 1)'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'MAGNETIC_COILS' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-orange-400" />
                High-Temperature Superconducting (HTS) Coil Telemetry
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Toroidal Field ($B_T$)</span>
                  <span className="text-lg font-bold text-orange-400">12.2 Tesla</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Plasma Current ($I_p$)</span>
                  <span className="text-lg font-bold text-amber-300">8.7 MegaAmps</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Safety Factor ($q_{95}$)</span>
                  <span className="text-lg font-bold text-teal-300">3.2 (Kink Stable)</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
