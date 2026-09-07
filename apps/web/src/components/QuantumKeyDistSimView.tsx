import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Key,
  RefreshCw,
  Lock,
  Zap,
  Eye,
  CheckCircle2,
  XCircle,
  Hash
} from 'lucide-react';
import type { QkdTransmissionReport } from '@studentlife/shared';

interface QuantumKeyDistSimViewProps {
  onAddXp?: (amount: number) => void;
}

export const QuantumKeyDistSimView: React.FC<QuantumKeyDistSimViewProps> = ({ onAddXp }) => {
  const [photonsCount, setPhotonsCount] = useState<number>(16);
  const [eveEavesdropping, setEveEavesdropping] = useState<boolean>(false);
  const [qkdReport, setQkdReport] = useState<QkdTransmissionReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [plainMessage, setPlainMessage] = useState<string>('CONFIDENTIAL_RESEARCH_PAYLOAD');

  const runSimulation = async (enableEve: boolean) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/quantum-qkd/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photonsCount,
          enableEveEavesdropping: enableEve,
          channelNoisePercent: 0.02
        })
      });
      if (res.ok) {
        const data = await res.json();
        setQkdReport(data.data);
        if (onAddXp) onAddXp(50);
      }
    } catch (e) {
      console.error('Failed to run QKD simulation', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(eveEavesdropping);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/40 to-cyan-900/40 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Lock className="w-64 h-64 text-emerald-400" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Phase 87 • Quantum Cryptography
              </span>
              <span className="flex items-center gap-1 text-xs text-teal-400 font-medium">
                <Key className="w-3.5 h-3.5" /> BB84 Protocol Simulator
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Key className="w-8 h-8 text-emerald-400" />
              Quantum Key Distribution (QKD) & BB84 Simulator
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Simulate unconditional information-theoretic security using Alice-Bob photon polarizations, Eve eavesdropping detection via QBER error spikes, and One-Time Pad ciphers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => runSimulation(eveEavesdropping)}
              disabled={loading}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Send Quantum Stream
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel: Eve Toggle & Message Input */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-4 space-y-1">
          <label className="text-xs font-semibold text-slate-300 block">Photons Transmitted (N)</label>
          <select
            value={photonsCount}
            onChange={(e) => {
              const val = Number(e.target.value);
              setPhotonsCount(val);
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
          >
            <option value={12}>12 Photons (Quick Stream)</option>
            <option value={16}>16 Photons (Standard)</option>
            <option value={24}>24 Photons (High Sifted Length)</option>
          </select>
        </div>

        <div className="md:col-span-5 space-y-1">
          <label className="text-xs font-semibold text-slate-300 block">Sample Secret Message</label>
          <input
            type="text"
            value={plainMessage}
            onChange={(e) => setPlainMessage(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-3 flex items-center justify-center pt-4 sm:pt-0">
          <button
            onClick={() => {
              const nextEve = !eveEavesdropping;
              setEveEavesdropping(nextEve);
              runSimulation(nextEve);
            }}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
              eveEavesdropping
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/10'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            {eveEavesdropping ? 'Eve Eavesdropping: ACTIVE 🚨' : 'Eve Eavesdropping: OFF 🛡️'}
          </button>
        </div>
      </div>

      {qkdReport && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Channel Security</span>
                {qkdReport.eavesdropperDetected ? (
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className={`text-xl font-black ${qkdReport.eavesdropperDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
                {qkdReport.eavesdropperDetected ? 'EVE INTERCEPTED' : 'SECURE QUANTUM'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {qkdReport.eavesdropperDetected ? 'Quantum state collapsed!' : 'No observer interference'}
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">QBER Error Rate</span>
                <Zap className="w-4 h-4 text-teal-400" />
              </div>
              <div className={`text-3xl font-black ${qkdReport.qberPercent > 11 ? 'text-rose-400' : 'text-teal-300'}`}>
                {qkdReport.qberPercent}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">Threshold Ceiling: 11.0%</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Sifted Key Length</span>
                <Key className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white">{qkdReport.siftedKeyLength} Bits</div>
              <p className="text-[11px] text-cyan-400 mt-1">Basis Matched Photons</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Derived OTP Key</span>
                <Hash className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-mono font-black text-amber-300">{qkdReport.finalSecretKeyHex}</div>
              <p className="text-[11px] text-slate-400 mt-1">Unbreakable One-Time Pad</p>
            </div>
          </div>

          {/* Photon Transmission Table (BB84 Matrix) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              Quantum Photon Basis State Matrix (BB84 Transmission Log)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Alice Bit</th>
                    <th className="py-2.5 px-3">Alice Basis</th>
                    {eveEavesdropping && <th className="py-2.5 px-3 text-rose-400">Eve Basis</th>}
                    <th className="py-2.5 px-3">Bob Basis</th>
                    <th className="py-2.5 px-3">Bob Measured</th>
                    <th className="py-2.5 px-3">Basis Match</th>
                    <th className="py-2.5 px-3">Sifted Key?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {qkdReport.samplePhotons.map((p) => (
                    <tr
                      key={p.index}
                      className={p.isSiftedKeyBit ? 'bg-emerald-950/20' : 'text-slate-500'}
                    >
                      <td className="py-2.5 px-3">{p.index}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-200">{p.aliceBit}</td>
                      <td className="py-2.5 px-3 text-cyan-300">{p.aliceBasis === 'RECTILINEAR' ? '+ (0°/90°)' : '× (45°/135°)'}</td>
                      {eveEavesdropping && (
                        <td className="py-2.5 px-3 text-rose-400 font-bold">
                          {p.eveBasis === 'RECTILINEAR' ? '+ (0°/90°)' : '× (45°/135°)'}
                        </td>
                      )}
                      <td className="py-2.5 px-3 text-indigo-300">{p.bobBasis === 'RECTILINEAR' ? '+ (0°/90°)' : '× (45°/135°)'}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-200">{p.bobMeasuredBit}</td>
                      <td className="py-2.5 px-3">
                        {p.basisMatched ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                          </span>
                        ) : (
                          <span className="text-slate-600 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Discard
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {p.isSiftedKeyBit ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            Bit: {p.bobMeasuredBit}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
