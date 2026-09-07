import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Activity,
  Waves,
  Headphones,
  Flame,
  BrainCircuit,
  Info
} from 'lucide-react';
import { NeuralFlowTelemetry, AdjustBinauralFrequencyDto } from '@studentlife/shared';

interface NeuralFlowTelemetryViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const NeuralFlowTelemetryView: React.FC<NeuralFlowTelemetryViewProps> = ({ onAddXp }) => {
  const [telemetry, setTelemetry] = useState<NeuralFlowTelemetry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeBand, setActiveBand] = useState<'ALPHA' | 'BETA' | 'THETA' | 'GAMMA'>('GAMMA');
  const [isModulating, setIsModulating] = useState<boolean>(false);

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const fetchTelemetry = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/neural-flow/telemetry');
      const data = await res.json();
      if (data.success && data.data) {
        setTelemetry(data.data);
        setActiveBand(data.data.dominantWaveBand);
      }
    } catch (err) {
      console.error('Failed to fetch neural flow telemetry', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustBand = async (band: 'ALPHA' | 'BETA' | 'THETA' | 'GAMMA') => {
    try {
      setIsModulating(true);
      setActiveBand(band);
      const dto: AdjustBinauralFrequencyDto = { targetWaveBand: band };
      const res = await fetch('/api/neural-flow/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTelemetry(data.data);
        onAddXp?.(20, `Tuned Neural Flow to ${band} Waveform`);
      }
    } catch (err) {
      console.error('Failed to adjust neural frequency', err);
    } finally {
      setIsModulating(false);
    }
  };

  if (isLoading || !telemetry) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <BrainCircuit size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Initializing Neural Biometric Flow & Spectral Telemetry Engine...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' }}>
              <Sparkles size={12} /> PHASE 57 &bull; NEURAL FLOW & ATTENTION TELEMETRY
            </span>
            <span className="badge badge-completed">Real-Time EEG Spectral Predictor</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Neural Biometric Flow <span className="gradient-text">& Attention Telemetry 🧠</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Multi-band brainwave spectral analysis, automated 40Hz Gamma focus tuning, and real-time cognitive fatigue management.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} color="#f43f5e" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>FLOW SCORE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                {telemetry.flowStateScore}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Wave Bands Spectrum & Dynamic Modulator */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '20px' }}>
        {/* Left: 4-Band Spectral Power Density */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#ec4899" />
            Spectral Power Density Bands
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Gamma */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: activeBand === 'GAMMA' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(15, 23, 42, 0.6)',
              border: activeBand === 'GAMMA' ? '1px solid #ec4899' : '1px solid var(--border-glass)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f472b6' }}>GAMMA (30–50 Hz)</span>
                <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>Hyper-Focus</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {telemetry.waves.gammaBandHz.toFixed(1)} Hz
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Complex algorithmic problem solving & cross-modal synthesis.
              </div>
            </div>

            {/* Beta */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: activeBand === 'BETA' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.6)',
              border: activeBand === 'BETA' ? '1px solid #3b82f6' : '1px solid var(--border-glass)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#60a5fa' }}>BETA (13–30 Hz)</span>
                <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>Active Analytical</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {telemetry.waves.betaBandHz.toFixed(1)} Hz
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Active calculation & timed mock test execution.
              </div>
            </div>

            {/* Alpha */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: activeBand === 'ALPHA' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(15, 23, 42, 0.6)',
              border: activeBand === 'ALPHA' ? '1px solid #22c55e' : '1px solid var(--border-glass)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4ade80' }}>ALPHA (8–12 Hz)</span>
                <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>Relaxed Alertness</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {telemetry.waves.alphaBandHz.toFixed(1)} Hz
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Long-term memory retention & spaced revision.
              </div>
            </div>

            {/* Theta */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: activeBand === 'THETA' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(15, 23, 42, 0.6)',
              border: activeBand === 'THETA' ? '1px solid #a855f7' : '1px solid var(--border-glass)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#c084fc' }}>THETA (4–8 Hz)</span>
                <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>Deep Intuition</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {telemetry.waves.thetaBandHz.toFixed(1)} Hz
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Creative architecture ideation & intuitive leaps.
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Modulation Insight */}
          <div style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(9, 13, 22, 0.8)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Info size={20} color="#ec4899" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {telemetry.recommendedModulation}
            </div>
          </div>
        </div>

        {/* Right: Dynamic Tone Modulator Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Headphones size={18} color="#2dd4bf" />
              Dynamic Binaural Tone Modulator
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(['GAMMA', 'BETA', 'ALPHA', 'THETA'] as const).map((band) => (
                <button
                  key={band}
                  disabled={isModulating}
                  onClick={() => handleAdjustBand(band)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: activeBand === band ? '1px solid #ec4899' : '1px solid var(--border-glass)',
                    backgroundColor: activeBand === band ? 'rgba(236, 72, 153, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                    color: activeBand === band ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Waves size={16} color={activeBand === band ? '#ec4899' : 'var(--text-muted)'} />
                    Tune {band} Resonance
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                    {band === 'GAMMA' ? '40.0 Hz' : band === 'BETA' ? '20.0 Hz' : band === 'ALPHA' ? '10.0 Hz' : '6.0 Hz'}
                  </span>
                </button>
              ))}
            </div>

            {/* Cognitive Stats */}
            <div style={{
              marginTop: '8px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-glass)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>FOCUS IMMERSION</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2dd4bf' }}>
                  {telemetry.focusImmersionMinutes} mins
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>COGNITIVE FATIGUE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: telemetry.cognitiveFatiguePercent > 40 ? '#f43f5e' : '#34d399' }}>
                  {telemetry.cognitiveFatiguePercent}% (Low)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
