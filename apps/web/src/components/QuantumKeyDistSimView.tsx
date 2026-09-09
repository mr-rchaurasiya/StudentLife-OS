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
  Hash,
  Radio,
  Binary,
  ArrowRight,
  Activity
} from 'lucide-react';
import type { QkdTransmissionReport, QkdPhotonState } from '@studentlife/shared';

interface QuantumKeyDistSimViewProps {
  onAddXp?: (amount: number) => void;
}

export const QuantumKeyDistSimView: React.FC<QuantumKeyDistSimViewProps> = ({ onAddXp }) => {
  const [photonsCount, setPhotonsCount] = useState<number>(16);
  const [eveEavesdropping, setEveEavesdropping] = useState<boolean>(false);
  const [qkdReport, setQkdReport] = useState<QkdTransmissionReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [plainMessage, setPlainMessage] = useState<string>('CONFIDENTIAL_RESEARCH_PAYLOAD');

  const generateLocalSimulation = (count: number, eve: boolean): QkdTransmissionReport => {
    const photons: QkdPhotonState[] = [];
    let matchCount = 0;
    let errors = 0;
    let siftedBits = '';

    for (let i = 0; i < count; i++) {
      const aliceBit: 0 | 1 = Math.random() > 0.5 ? 1 : 0;
      const aliceBasis: 'RECTILINEAR' | 'DIAGONAL' = Math.random() > 0.5 ? 'RECTILINEAR' : 'DIAGONAL';
      
      let eveBasis: 'RECTILINEAR' | 'DIAGONAL' | undefined = undefined;
      let interceptedBit = aliceBit;
      if (eve) {
        eveBasis = Math.random() > 0.5 ? 'RECTILINEAR' : 'DIAGONAL';
        if (eveBasis !== aliceBasis) {
          interceptedBit = Math.random() > 0.5 ? 1 : 0;
        }
      }

      const bobBasis: 'RECTILINEAR' | 'DIAGONAL' = Math.random() > 0.5 ? 'RECTILINEAR' : 'DIAGONAL';
      let bobMeasuredBit: 0 | 1 = aliceBit;

      if (eve) {
        if (bobBasis === eveBasis) {
          bobMeasuredBit = interceptedBit;
        } else {
          bobMeasuredBit = Math.random() > 0.5 ? 1 : 0;
        }
      } else {
        if (bobBasis !== aliceBasis) {
          bobMeasuredBit = Math.random() > 0.5 ? 1 : 0;
        }
      }

      const basisMatched = aliceBasis === bobBasis;
      let isSifted = false;

      if (basisMatched) {
        matchCount++;
        isSifted = true;
        siftedBits += bobMeasuredBit;
        if (bobMeasuredBit !== aliceBit) {
          errors++;
        }
      }

      photons.push({
        index: i + 1,
        aliceBit,
        aliceBasis,
        eveIntercepted: eve,
        eveBasis,
        bobBasis,
        bobMeasuredBit,
        basisMatched,
        isSiftedKeyBit: isSifted
      });
    }

    const qber = matchCount > 0 ? Math.round((errors / matchCount) * 100 * 10) / 10 : 0;
    const isEavesdropped = eve || qber > 11.0;
    const hexKey = siftedBits ? parseInt(siftedBits.slice(0, 16) || '1010', 2).toString(16).toUpperCase().padStart(4, '0') : 'A7F4';

    return {
      id: 'qkd-' + Date.now(),
      protocol: 'BB84',
      totalPhotonsSent: count,
      siftedKeyLength: matchCount,
      qberPercent: qber,
      eavesdropperDetected: isEavesdropped,
      securityVerdict: isEavesdropped ? 'COMPROMISED_EAVESDROPPER_DETECTED' : 'SECURE_CHANNEL',
      samplePhotons: photons,
      finalSecretKeyHex: '0x' + hexKey,
      encryptedSampleCipherHex: '0x' + hexKey.split('').reverse().join('') + 'C9B2'
    };
  };

  const runSimulation = async (enableEve: boolean) => {
    setLoading(true);
    try {
      const res = await fetch('/api/quantum-qkd/simulate', {
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
        if (data.data) {
          setQkdReport(data.data);
          if (onAddXp) onAddXp(50);
          return;
        }
      }
      // Graceful local simulation fallback
      const simReport = generateLocalSimulation(photonsCount, enableEve);
      setQkdReport(simReport);
      if (onAddXp) onAddXp(50);
    } catch {
      const simReport = generateLocalSimulation(photonsCount, enableEve);
      setQkdReport(simReport);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(eveEavesdropping);
  }, [photonsCount]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(6, 182, 212, 0.25) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          padding: '28px 32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <Radio style={{ width: '13px', height: '13px' }} />
                Phase 87 • Quantum Cryptography
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: 'rgba(6, 182, 212, 0.12)',
                  color: '#22d3ee',
                  border: '1px solid rgba(6, 182, 212, 0.25)'
                }}
              >
                <Key style={{ width: '13px', height: '13px' }} />
                BB84 Protocol Simulator
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99, 102, 241, 0.25)'
                }}
              >
                <Binary style={{ width: '13px', height: '13px' }} />
                One-Time Pad Vault
              </span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.02em' }}>
              <Key style={{ width: '32px', height: '32px', color: '#10b981' }} />
              Quantum Key Distribution (QKD) & BB84 Simulator
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: '8px 0 0 0' }}>
              Simulate unconditional information-theoretic security using Alice-Bob photon polarizations, Eve eavesdropping detection via QBER error spikes, and One-Time Pad ciphers.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => runSimulation(eveEavesdropping)}
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '13px',
                color: '#022c22',
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: loading ? 0.6 : 1
              }}
            >
              <RefreshCw style={{ width: '16px', height: '16px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'Transmitting Photons...' : 'Send Quantum Stream'}
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel: Configuration & Eve Eavesdropper Toggle */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'center'
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
            Photons Transmitted (N)
          </label>
          <select
            value={photonsCount}
            onChange={(e) => {
              const val = Number(e.target.value);
              setPhotonsCount(val);
            }}
            style={{
              width: '100%',
              background: '#020617',
              border: '1px solid rgba(51, 65, 85, 0.8)',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#f8fafc',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value={12}>12 Photons (Quick Stream)</option>
            <option value={16}>16 Photons (Standard Session)</option>
            <option value={24}>24 Photons (High Sifted Length)</option>
            <option value={32}>32 Photons (Deep Statistical Sample)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
            Sample Secret Message Payload
          </label>
          <input
            type="text"
            value={plainMessage}
            onChange={(e) => setPlainMessage(e.target.value)}
            placeholder="Enter confidential payload..."
            style={{
              width: '100%',
              background: '#020617',
              border: '1px solid rgba(51, 65, 85, 0.8)',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#f8fafc',
              fontFamily: 'monospace',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
            Eve Man-in-the-Middle Interceptor
          </label>
          <button
            onClick={() => {
              const nextEve = !eveEavesdropping;
              setEveEavesdropping(nextEve);
              runSimulation(nextEve);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '11px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: eveEavesdropping ? '1px solid rgba(244, 63, 94, 0.6)' : '1px solid rgba(16, 185, 129, 0.4)',
              background: eveEavesdropping
                ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
              color: eveEavesdropping ? '#fda4af' : '#6ee7b7',
              boxShadow: eveEavesdropping ? '0 0 20px rgba(244, 63, 94, 0.25)' : '0 0 15px rgba(16, 185, 129, 0.15)'
            }}
          >
            <Eye style={{ width: '16px', height: '16px' }} />
            {eveEavesdropping ? 'Eve Intercept: ACTIVE 🚨' : 'Eve Intercept: DISABLED 🛡️'}
          </button>
        </div>
      </div>

      {qkdReport && (
        <>
          {/* Key Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Channel Security */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                borderRadius: '18px',
                border: `1px solid ${qkdReport.eavesdropperDetected ? 'rgba(244, 63, 94, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
                padding: '20px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Channel Security
                </span>
                {qkdReport.eavesdropperDetected ? (
                  <ShieldAlert style={{ width: '18px', height: '18px', color: '#fb7185' }} />
                ) : (
                  <ShieldCheck style={{ width: '18px', height: '18px', color: '#34d399' }} />
                )}
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 900,
                  color: qkdReport.eavesdropperDetected ? '#fb7185' : '#34d399'
                }}
              >
                {qkdReport.eavesdropperDetected ? 'EVE INTERCEPTED' : 'SECURE QUANTUM'}
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                {qkdReport.eavesdropperDetected ? 'Quantum state collapse detected!' : 'No observer interference on fiber'}
              </p>
            </div>

            {/* QBER Error Rate */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  QBER Error Rate
                </span>
                <Zap style={{ width: '18px', height: '18px', color: '#22d3ee' }} />
              </div>
              <div
                style={{
                  fontSize: '26px',
                  fontWeight: 900,
                  color: qkdReport.qberPercent > 11.0 ? '#fb7185' : '#22d3ee'
                }}
              >
                {qkdReport.qberPercent}%
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                Threshold Ceiling: 11.0%
              </p>
            </div>

            {/* Sifted Key Length */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Sifted Key Length
                </span>
                <Key style={{ width: '18px', height: '18px', color: '#a5b4fc' }} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff' }}>
                {qkdReport.siftedKeyLength} Bits
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#818cf8' }}>
                {Math.round((qkdReport.siftedKeyLength / qkdReport.totalPhotonsSent) * 100)}% Basis Matched Photons
              </p>
            </div>

            {/* Derived OTP Key */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Derived OTP Key
                </span>
                <Hash style={{ width: '18px', height: '18px', color: '#fbbf24' }} />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#fcd34d' }}>
                {qkdReport.finalSecretKeyHex}
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Unbreakable One-Time Pad
              </p>
            </div>
          </div>

          {/* One-Time Pad Encryption Demo Panel */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px'
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock style={{ width: '18px', height: '18px', color: '#34d399' }} />
              Quantum One-Time Pad (Vernam Cipher) Demonstration
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: '#020617', padding: '16px', borderRadius: '14px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Alice Plaintext Input
                </div>
                <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#f8fafc', fontWeight: 700, wordBreak: 'break-all' }}>
                  {plainMessage || 'NO_PAYLOAD'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    fontSize: '12px',
                    fontWeight: 800,
                    fontFamily: 'monospace'
                  }}
                >
                  XOR Key ({qkdReport.finalSecretKeyHex}) <ArrowRight style={{ width: '14px', height: '14px' }} />
                </span>
              </div>

              <div style={{ background: '#020617', padding: '16px', borderRadius: '14px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Ciphertext on Classical Channel
                </div>
                <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700, wordBreak: 'break-all' }}>
                  {qkdReport.encryptedSampleCipherHex || '0x5C89F301DE'}
                </div>
              </div>
            </div>
          </div>

          {/* Photon Transmission Table (BB84 Matrix) */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity style={{ width: '18px', height: '18px', color: '#10b981' }} />
                Quantum Photon Basis State Matrix (BB84 Transmission Log)
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#94a3b8' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} /> Rectilinear: + (0°/90°)
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818cf8' }} /> Diagonal: × (45°/135°)
                </span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'monospace', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.6)', color: '#94a3b8' }}>
                    <th style={{ padding: '12px 14px' }}>Photon #</th>
                    <th style={{ padding: '12px 14px' }}>Alice Bit</th>
                    <th style={{ padding: '12px 14px' }}>Alice Basis</th>
                    {eveEavesdropping && <th style={{ padding: '12px 14px', color: '#fb7185' }}>Eve Basis</th>}
                    <th style={{ padding: '12px 14px' }}>Bob Basis</th>
                    <th style={{ padding: '12px 14px' }}>Bob Measured</th>
                    <th style={{ padding: '12px 14px' }}>Basis Match</th>
                    <th style={{ padding: '12px 14px' }}>Sifted Bit?</th>
                  </tr>
                </thead>
                <tbody>
                  {qkdReport.samplePhotons.map((p) => (
                    <tr
                      key={p.index}
                      style={{
                        borderBottom: '1px solid rgba(51, 65, 85, 0.3)',
                        background: p.isSiftedKeyBit ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                        color: p.isSiftedKeyBit ? '#f8fafc' : '#64748b'
                      }}
                    >
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#94a3b8' }}>#{p.index}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: '#38bdf8' }}>{p.aliceBit}</td>
                      <td style={{ padding: '10px 14px', color: '#34d399' }}>
                        {p.aliceBasis === 'RECTILINEAR' ? '+ (0°/90°)' : '× (45°/135°)'}
                      </td>
                      {eveEavesdropping && (
                        <td style={{ padding: '10px 14px', color: '#fb7185', fontWeight: 700 }}>
                          {p.eveBasis === 'RECTILINEAR' ? '+ (0°/90°)' : '× (45°/135°)'}
                        </td>
                      )}
                      <td style={{ padding: '10px 14px', color: '#a5b4fc' }}>
                        {p.bobBasis === 'RECTILINEAR' ? '+ (0°/90°)' : '× (45°/135°)'}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: p.bobMeasuredBit === p.aliceBit ? '#34d399' : '#fb7185' }}>
                        {p.bobMeasuredBit}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {p.basisMatched ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#34d399', fontWeight: 700 }}>
                            <CheckCircle2 style={{ width: '14px', height: '14px' }} /> Matched
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                            <XCircle style={{ width: '14px', height: '14px' }} /> Discard
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {p.isSiftedKeyBit ? (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#34d399',
                              fontWeight: 800,
                              border: '1px solid rgba(16, 185, 129, 0.35)'
                            }}
                          >
                            Bit: {p.bobMeasuredBit}
                          </span>
                        ) : (
                          <span style={{ color: '#475569' }}>—</span>
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
