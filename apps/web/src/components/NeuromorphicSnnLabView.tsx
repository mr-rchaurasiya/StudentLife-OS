import React, { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  Cpu,
  RefreshCw,
  Sparkles,
  Sliders,
  Layers,
  CheckCircle2,
  Gauge
} from 'lucide-react';
import type { NeuromorphicSimulationResult } from '@studentlife/shared';

interface NeuromorphicSnnLabViewProps {
  onAddXp?: (amount: number) => void;
}

export const NeuromorphicSnnLabView: React.FC<NeuromorphicSnnLabViewProps> = ({ onAddXp }) => {
  const [neuronType, setNeuronType] = useState<'LIF' | 'IZHIKEVICH' | 'ADAPTIVE_EXPONENTIAL'>('LIF');
  const [inputCurrent, setInputCurrent] = useState<number>(2.5); // nanoAmps
  const [thresholdMv, setThresholdMv] = useState<number>(-50);
  const [durationMs, setDurationMs] = useState<number>(100);
  const [simResult, setSimResult] = useState<NeuromorphicSimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'VOLTAGE_TRACE' | 'STDP_SYNAPSE' | 'CHIP_ARCH'>('VOLTAGE_TRACE');

  const fetchSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/neuromorphic-snn/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          architectureName: `${neuronType} Biological Spiking Cortical Node`,
          neuronConfig: {
            neuronType,
            restingPotentialMv: -70,
            thresholdPotentialMv: thresholdMv,
            decayConstantTauMs: 20,
            refractoryPeriodMs: 4
          },
          inputCurrentNanoAmps: inputCurrent,
          simulationDurationMs: durationMs
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimResult(data.data);
        if (onAddXp) onAddXp(45);
      }
    } catch (e) {
      console.error('Failed to run SNN simulation', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulation();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900/40 via-purple-900/40 to-fuchsia-900/40 border border-violet-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Activity className="w-64 h-64 text-violet-400" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
                Phase 86 • Brain-Inspired Computing
              </span>
              <span className="flex items-center gap-1 text-xs text-fuchsia-400 font-medium">
                <Zap className="w-3.5 h-3.5" /> Event-Driven Neuromorphic
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Cpu className="w-8 h-8 text-violet-400" />
              Neuromorphic Spiking Neural Network (SNN) Lab
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Simulate biological Leaky Integrate-and-Fire (LIF) membrane potentials, STDP (Spike-Timing-Dependent Plasticity) synaptic weights, and sub-nanojoule neuromorphic compute hardware.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSimulation}
              disabled={loading}
              className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-violet-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Re-Simulate Spikes
            </button>
          </div>
        </div>
      </div>

      {/* Control Sliders & Configuration Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Neuron Model</label>
          <select
            value={neuronType}
            onChange={(e) => setNeuronType(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-violet-500 focus:outline-none"
          >
            <option value="LIF">Leaky Integrate & Fire (LIF)</option>
            <option value="IZHIKEVICH">Izhikevich Polychronous</option>
            <option value="ADAPTIVE_EXPONENTIAL">AdEx (Adaptive Exponential)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Input Current: <span className="text-violet-400">{inputCurrent} nA</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="6.0"
            step="0.1"
            value={inputCurrent}
            onChange={(e) => setInputCurrent(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Spike Threshold: <span className="text-fuchsia-400">{thresholdMv} mV</span>
          </label>
          <input
            type="range"
            min="-60"
            max="-40"
            step="1"
            value={thresholdMv}
            onChange={(e) => setThresholdMv(Number(e.target.value))}
            className="w-full accent-fuchsia-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Duration: <span className="text-indigo-400">{durationMs} ms</span>
          </label>
          <input
            type="range"
            min="50"
            max="200"
            step="10"
            value={durationMs}
            onChange={(e) => setDurationMs(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {simResult && (
        <>
          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Spikes Generated</span>
                <Zap className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-3xl font-black text-white">{simResult.totalSpikesFired} ⚡</div>
              <p className="text-[11px] text-violet-400 mt-1 font-mono">Action Potential Pulses</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Energy Dissipation</span>
                <Gauge className="w-4 h-4 text-fuchsia-400" />
              </div>
              <div className="text-2xl font-black text-fuchsia-300">
                {(simResult.energyConsumptionJoules * 1e9).toFixed(2)} <span className="text-xs text-slate-400">nJ</span>
              </div>
              <p className="text-[11px] text-emerald-400 mt-1">1000x lower than GPU FLOPs</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Event Sparsity</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">{simResult.sparsityPercent.toFixed(1)}%</div>
              <p className="text-[11px] text-slate-400 mt-1">Temporal Inactivity Ratio</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Target Hardware</span>
                <Cpu className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl font-black text-indigo-300 mt-1">{simResult.neuromorphicHardwareChip}</div>
              <p className="text-[11px] text-indigo-400 mt-1">Asynchronous Mesh Core</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('VOLTAGE_TRACE')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'VOLTAGE_TRACE'
                  ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Membrane Potential $V(t)$ Waveform
            </button>
            <button
              onClick={() => setActiveTab('STDP_SYNAPSE')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'STDP_SYNAPSE'
                  ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> STDP Hebbian Synapse Plasticity
            </button>
            <button
              onClick={() => setActiveTab('CHIP_ARCH')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'CHIP_ARCH'
                  ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Neuromorphic Chip Architecture
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'VOLTAGE_TRACE' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-violet-400" />
                  Real-Time Membrane Voltage Trace (LIF Dynamic Equation)
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Threshold: {thresholdMv} mV • Resting: -70 mV
                </span>
              </div>

              {/* Graphical Voltage Trace Bars */}
              <div className="h-48 flex items-end gap-1 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
                {simResult.voltageTraceMv.map((point, idx) => {
                  const heightPercent = Math.max(5, Math.min(100, ((point.voltageMv + 80) / 110) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center min-w-[6px] h-full justify-end">
                      <div
                        className={`w-full rounded-t transition-all ${
                          point.spiked
                            ? 'bg-gradient-to-t from-fuchsia-500 to-amber-300 animate-pulse'
                            : 'bg-violet-600/60 hover:bg-violet-500'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                        title={`t=${point.timeMs}ms | V=${point.voltageMv}mV ${point.spiked ? '⚡ SPIKE' : ''}`}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-mono">
                <span>0 ms (Stimulus Start)</span>
                <span className="text-fuchsia-400">⚡ High Peaks Indicate Action Potential Spikes (+30 mV)</span>
                <span>{durationMs} ms (Simulation End)</span>
              </div>
            </div>
          )}

          {activeTab === 'STDP_SYNAPSE' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-violet-400" />
                Spike-Timing-Dependent Plasticity (STDP) Weight Updates
              </h3>
              <p className="text-xs text-slate-400">
                Neurons that fire together wire together. Pre-spike before post-spike produces Long-Term Potentiation (LTP, +ΔW); reverse produces Long-Term Depression (LTD, -ΔW).
              </p>

              <div className="space-y-2">
                {simResult.synapticUpdates.map((syn, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-violet-300 font-bold">{syn.synapseId}</span>
                    <span className="text-slate-400">
                      Pre: <strong className="text-slate-200">{syn.preSpikeTimeMs}ms</strong> ➔ Post: <strong className="text-slate-200">{syn.postSpikeTimeMs}ms</strong>
                    </span>
                    <span className={`font-mono font-bold ${syn.deltaWeight >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {syn.deltaWeight >= 0 ? `+${syn.deltaWeight.toFixed(2)} (LTP)` : `${syn.deltaWeight.toFixed(2)} (LTD)`}
                    </span>
                    <span className="text-slate-300 font-mono">Weight: {syn.currentWeight.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'CHIP_ARCH' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl text-center space-y-4">
              <Cpu className="w-16 h-16 text-violet-400 mx-auto animate-pulse" />
              <h3 className="text-lg font-bold text-white">Intel Loihi 2 / SpiNNaker 2 Architecture Bridge</h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Asynchronous spike routing network-on-chip (NoC) with on-chip programmable learning microcode. Emits micro-currents only when membrane threshold is breached, reducing idle clock power by 99.8%.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Silicon Synthesis Ready
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
