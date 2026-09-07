import React, { useState, useEffect } from 'react';
import { Activity, Radio, Cpu, Orbit } from 'lucide-react';

export const LiveTelemetryTicker: React.FC = () => {
  const [ligoStrain, setLigoStrain] = useState('1.04e-21');
  const [hftBtcSpread, setHftBtcSpread] = useState('0.15');
  const [tokamakQ, setTokamakQ] = useState('10.42');
  const [bciSnr, setBciSnr] = useState('18.6');
  const [isLive, setIsLive] = useState(true);

  // Periodic telemetry simulation fluctuation
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      // Fluctuations
      setLigoStrain((1.0 + (Math.random() * 0.15 - 0.05)).toFixed(2) + 'e-21');
      setHftBtcSpread((0.10 + Math.random() * 0.12).toFixed(2));
      setTokamakQ((10.3 + Math.random() * 0.3).toFixed(2));
      setBciSnr((18.0 + Math.random() * 1.5).toFixed(1));
    }, 2500);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="w-full bg-slate-950/90 border-t border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-xs backdrop-blur-md z-40">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        {/* Live Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
            Live Telemetry
          </span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        {/* LIGO Gravitational Wave Strain */}
        <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>LIGO Strain h(t):</span>
          <span className="font-mono text-cyan-300 font-medium">{ligoStrain}</span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        {/* HFT Limit Order Book Spread */}
        <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>HFT L2 Spread:</span>
          <span className="font-mono text-emerald-300 font-medium">${hftBtcSpread}</span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        {/* Fusion Tokamak Q */}
        <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
          <Orbit className="w-3 h-3 text-amber-400" />
          <span>Tokamak Q-Factor:</span>
          <span className="font-mono text-amber-300 font-medium">{tokamakQ}</span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        {/* BCI Neuro-Speller SNR */}
        <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
          <Cpu className="w-3 h-3 text-purple-400" />
          <span>BCI P300 SNR:</span>
          <span className="font-mono text-purple-300 font-medium">{bciSnr} dB</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
            isLive 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'bg-slate-800 text-slate-500 border border-slate-700'
          }`}
        >
          {isLive ? 'STREAMING' : 'PAUSED'}
        </button>
      </div>
    </div>
  );
};
