import React, { useState, useEffect } from 'react';
import { Activity, Radio, Cpu, Orbit } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LiveTelemetryTicker: React.FC = () => {
  const { t } = useLanguage();
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
    <div
      style={{
        width: '100%',
        backgroundColor: 'rgba(9, 13, 22, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '7px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.74rem',
        backdropFilter: 'blur(12px)',
        gap: '12px',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', overflowX: 'auto', flexWrap: 'wrap' }}>
        {/* Live Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
            <span
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: '#34d399',
                opacity: 0.75,
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}
            />
            <span
              style={{
                position: 'relative',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981'
              }}
            />
          </span>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
            {t('live_telemetry')}
          </span>
        </div>

        <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* LIGO Gravitational Wave Strain */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
          <Radio size={12} color="#22d3ee" />
          <span>LIGO Strain h(t):</span>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#67e8f9', fontWeight: 600 }}>{ligoStrain}</span>
        </div>

        <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* HFT Limit Order Book Spread */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
          <Activity size={12} color="#34d399" />
          <span>HFT L2 Spread:</span>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#6ee7b7', fontWeight: 600 }}>${hftBtcSpread}</span>
        </div>

        <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Fusion Tokamak Q */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
          <Orbit size={12} color="#fbbf24" />
          <span>Tokamak Q-Factor:</span>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#fde047', fontWeight: 600 }}>{tokamakQ}</span>
        </div>

        <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* BCI Neuro-Speller SNR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
          <Cpu size={12} color="#c084fc" />
          <span>BCI P300 SNR:</span>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#d8b4fe', fontWeight: 600 }}>{bciSnr} dB</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => setIsLive(!isLive)}
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono, monospace)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            color: isLive ? '#34d399' : '#94a3b8',
            border: isLive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {isLive ? t('streaming') : t('paused')}
        </button>
      </div>
    </div>
  );
};
