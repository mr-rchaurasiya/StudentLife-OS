import React, { useState } from 'react';
import {
  Waves,
  Sparkles,
  Activity,
  Compass,
  Radio
} from 'lucide-react';
import { GravitationalWaveEvent } from '@studentlife/shared';

interface Props {
  onAddXp?: (amount: number, reason?: string) => void;
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
        if (onAddXp) onAddXp(60, 'Simulated Gravitational Wave Inspiral & Ringdown');
      }
    } catch {
      // Local fallback calculation
      const m1 = primaryMass;
      const m2 = secondaryMass;
      const chirpMass = Math.round((Math.pow(m1 * m2, 0.6) / Math.pow(m1 + m2, 0.2)) * 10) / 10;
      const totalM = m1 + m2;
      const radiated = Math.round(totalM * 0.048 * 10) / 10;
      setEventData({
        id: `gw-${Date.now()}`,
        eventName: `GW-${Math.round(totalM)}M-Simulated`,
        primaryMassSolar: m1,
        secondaryMassSolar: m2,
        chirpMassSolar: chirpMass,
        luminosityDistanceMpc: luminosityDist,
        peakGravitationalPowerWatts: 3.6e49,
        remnantBlackHoleMassSolar: Math.round((totalM - radiated) * 10) / 10,
        energyRadiatedSolarMasses: radiated,
        detectorNetwork: ['LIGO Hanford (H1)', 'LIGO Livingston (L1)', 'Virgo (V1)'],
        strainWaveform: eventData.strainWaveform
      });
      if (onAddXp) onAddXp(60, 'Simulated Gravitational Wave Inspiral & Ringdown');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(30, 27, 75, 0.85) 50%, rgba(15, 23, 42, 0.95) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ maxWidth: '700px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span 
              className="badge" 
              style={{ 
                backgroundColor: 'rgba(139, 92, 246, 0.25)', 
                color: '#c084fc', 
                border: '1px solid rgba(139, 92, 246, 0.4)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Waves size={14} color="#c084fc" />
              PHASE 96 &bull; RELATIVISTIC ASTROPHYSICS
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
            Gravitational Wave Interferometry & <span style={{ background: 'linear-gradient(135deg, #a78bfa, #c084fc, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Black Hole Ringdown</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            Synthesize General Relativity quadrupole radiation strain h(t), solve binary chirp masses, and explore LIGO/Virgo quasinormal ringdown modes.
          </p>
        </div>

        <button
          onClick={handleSimulate}
          disabled={isLoading}
          className="glow-hover"
          style={{
            padding: '12px 24px',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)'
          }}
        >
          <Sparkles size={16} color="#ffffff" />
          {isLoading ? 'Synthesizing...' : 'Run Merger Simulation'}
        </button>
      </div>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Astrophysical Presets:</span>
        {PRESET_EVENTS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrimaryMass(preset.m1);
              setSecondaryMass(preset.m2);
              setLuminosityDist(preset.dist);
            }}
            className="glow-hover"
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: primaryMass === preset.m1 && secondaryMass === preset.m2 ? '1px solid rgba(139, 92, 246, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: primaryMass === preset.m1 && secondaryMass === preset.m2 ? 'rgba(124, 58, 237, 0.3)' : 'rgba(15, 23, 42, 0.6)',
              color: primaryMass === preset.m1 && secondaryMass === preset.m2 ? '#e9d5ff' : '#94a3b8'
            }}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Controls Column */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} color="#a78bfa" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
              Binary Progenitor Masses & Distance
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Primary Mass (m₁)</span>
                <span style={{ color: '#c084fc', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{primaryMass} M☉</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={100.0}
                step={0.5}
                value={primaryMass}
                onChange={(e) => setPrimaryMass(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#8b5cf6' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Secondary Mass (m₂)</span>
                <span style={{ color: '#818cf8', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{secondaryMass} M☉</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={100.0}
                step={0.5}
                value={secondaryMass}
                onChange={(e) => setSecondaryMass(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#6366f1' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Luminosity Distance (d_L)</span>
                <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{luminosityDist} Mpc</span>
              </div>
              <input
                type="range"
                min={10}
                max={6000}
                step={10}
                value={luminosityDist}
                onChange={(e) => setLuminosityDist(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#06b6d4' }}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Active Multi-Messenger Detectors:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {eventData.detectorNetwork.map((det, idx) => (
                <span 
                  key={idx}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(124, 58, 237, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    color: '#ddd6fe',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Radio size={12} color="#a78bfa" />
                  {det}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Telemetry Output Column */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#34d399" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
              Relativistic Astrophysical Output Metrics
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Chirp Mass (ℳ)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                {eventData.chirpMassSolar} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>M☉</span>
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Remnant BH Mass</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                {eventData.remnantBlackHoleMassSolar} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>M☉</span>
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Radiated GW Energy</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                {eventData.energyRadiatedSolarMasses} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>M☉c²</span>
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Peak GW Power</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>
                3.6×10⁴⁹ <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>W</span>
              </div>
            </div>
          </div>

          {/* Waveform Visualization Bars */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Inspiral-Merger-Ringdown Strain h(t) Profile:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', padding: '0 8px', backgroundColor: 'rgba(9, 13, 22, 0.9)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              {eventData.strainWaveform.map((pt, idx) => {
                const height = Math.min(50, Math.max(8, Math.abs(pt.strainH10Minus21) * 35));
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div 
                      style={{ 
                        width: '8px', 
                        height: `${height}px`, 
                        borderRadius: '4px', 
                        backgroundColor: pt.timeMs === 0 ? '#f43f5e' : pt.timeMs < 0 ? '#a78bfa' : '#38bdf8' 
                      }} 
                    />
                    <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{pt.timeMs}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GravitationalWaveLabView;
