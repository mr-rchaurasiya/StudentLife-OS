import React, { useState, useEffect } from 'react';
import {
  Cpu,
  RotateCcw,
  Zap,
  Layers,
  CheckCircle2,
  Atom
} from 'lucide-react';
import { QuantumCircuitState, QuantumGateType, SimulateCircuitDto } from '@studentlife/shared';

interface QuantumLabViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const QuantumLabView: React.FC<QuantumLabViewProps> = ({ onAddXp }) => {
  const [qubitCount, setQubitCount] = useState<number>(2);
  const [gates, setGates] = useState<{ qubitIndex: number; gate: QuantumGateType; stepIndex: number }[]>([
    { qubitIndex: 0, gate: 'H', stepIndex: 0 },
    { qubitIndex: 1, gate: 'CNOT', stepIndex: 1 },
  ]);
  const [circuitState, setCircuitState] = useState<QuantumCircuitState | null>(null);

  useEffect(() => {
    runSimulation({ qubitCount: 2, gates });
  }, []);

  const runSimulation = async (dto: SimulateCircuitDto) => {
    try {
      const res = await fetch('/api/quantum-lab/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCircuitState(json.data);
      }
    } catch (err) {
      console.error('Failed to run quantum simulation', err);
    }
  };

  const handleAddGate = (qubitIndex: number, gate: QuantumGateType) => {
    const newGates = [...gates, { qubitIndex, gate, stepIndex: gates.length }];
    setGates(newGates);
    runSimulation({ qubitCount, gates: newGates });
    onAddXp?.(10, `Applied Quantum Gate [${gate}] on Qubit q[${qubitIndex}]`);
  };

  const handleClearCircuit = () => {
    setGates([]);
    runSimulation({ qubitCount, gates: [] });
  };

  const handleLoadPreset = (preset: 'BELL_STATE' | 'SUPERPOSITION' | 'GHZ_STATE') => {
    if (preset === 'SUPERPOSITION') {
      setQubitCount(1);
      setGates([{ qubitIndex: 0, gate: 'H', stepIndex: 0 }]);
      runSimulation({ qubitCount: 1, gates: [{ qubitIndex: 0, gate: 'H', stepIndex: 0 }], preset });
    } else if (preset === 'BELL_STATE') {
      setQubitCount(2);
      setGates([
        { qubitIndex: 0, gate: 'H', stepIndex: 0 },
        { qubitIndex: 1, gate: 'CNOT', stepIndex: 1 },
      ]);
      runSimulation({
        qubitCount: 2,
        gates: [
          { qubitIndex: 0, gate: 'H', stepIndex: 0 },
          { qubitIndex: 1, gate: 'CNOT', stepIndex: 1 },
        ],
        preset,
      });
    } else if (preset === 'GHZ_STATE') {
      setQubitCount(3);
      setGates([
        { qubitIndex: 0, gate: 'H', stepIndex: 0 },
        { qubitIndex: 1, gate: 'CNOT', stepIndex: 1 },
        { qubitIndex: 2, gate: 'CNOT', stepIndex: 2 },
      ]);
      runSimulation({
        qubitCount: 3,
        gates: [
          { qubitIndex: 0, gate: 'H', stepIndex: 0 },
          { qubitIndex: 1, gate: 'CNOT', stepIndex: 1 },
          { qubitIndex: 2, gate: 'CNOT', stepIndex: 2 },
        ],
        preset,
      });
    }
    onAddXp?.(30, `Loaded Quantum Algorithm Preset: ${preset}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div className="glass-panel glow-hover" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
        borderLeft: '4px solid #a855f7',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-completed">
                <Atom size={13} /> PHASE 70: QUANTUM CIRCUIT & BLOCH SPHERE
              </span>
              <span className="badge badge-active">QISKIT-GRADE STATE VECTOR ENGINE</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Interactive Quantum Circuit & <span className="gradient-text">Bloch Sphere 3D Lab</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Simulate superposition, Bell state EPR pair entanglement, and quantum gate operations with real-time state vector amplitudes.
            </p>
          </div>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              onClick={() => handleLoadPreset('SUPERPOSITION')}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              |+⟩ Superposition
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleLoadPreset('BELL_STATE')}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              |Φ⁺⟩ Bell State
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleLoadPreset('GHZ_STATE')}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              |GHZ⟩ 3-Qubit State
            </button>
          </div>
        </div>
      </div>

      {/* Main Simulation View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        {/* Left Column: Circuit Gate Sequencer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} color="#c084fc" /> Quantum Circuit Wireboard ({qubitCount} Qubits)
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={handleClearCircuit}
                  style={{ fontSize: '0.75rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RotateCcw size={12} /> Reset Wires
                </button>
              </div>
            </div>

            {/* Qubit Wires */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', margin: '20px 0' }}>
              {Array.from({ length: qubitCount }).map((_, qIndex) => {
                const qGates = gates.filter((g) => g.qubitIndex === qIndex);
                return (
                  <div
                    key={qIndex}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <div style={{
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9rem',
                      color: '#a855f7',
                      minWidth: '55px',
                    }}>
                      q[{qIndex}] |0⟩
                    </div>

                    {/* Wire line */}
                    <div style={{ flex: 1, height: '2px', backgroundColor: '#334155', position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {qGates.map((g, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: g.gate === 'H' ? '#6366f1' : g.gate === 'CNOT' ? '#ec4899' : '#06b6d4',
                            color: '#fff',
                            fontWeight: 800,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                          }}
                        >
                          {g.gate}
                        </div>
                      ))}
                    </div>

                    {/* Add Gate Buttons for this Wire */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {(['H', 'X', 'Y', 'Z', 'CNOT', 'T'] as QuantumGateType[]).map((gateType) => (
                        <button
                          key={gateType}
                          onClick={() => handleAddGate(qIndex, gateType)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid var(--border-glass)',
                            color: '#e2e8f0',
                            cursor: 'pointer',
                          }}
                        >
                          +{gateType}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Probability Distribution */}
          {circuitState && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} color="#38bdf8" /> Computational Basis State Probabilities |ψ|²
                </h3>
                <span className="badge badge-completed">
                  Entanglement Metric: {circuitState.entanglementMetric * 100}%
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${circuitState.stateVectorProbabilities.length}, 1fr)`, gap: '12px' }}>
                {circuitState.stateVectorProbabilities.map((stateProb) => (
                  <div
                    key={stateProb.stateBinary}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-glass)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8', marginBottom: '8px' }}>
                      {stateProb.stateBinary}
                    </div>

                    {/* Probability Bar */}
                    <div style={{ height: '80px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', margin: '8px 0' }}>
                      <div
                        style={{
                          width: '32px',
                          height: `${Math.max(4, stateProb.probability * 80)}px`,
                          background: stateProb.probability > 0 ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.05)',
                          borderRadius: '4px',
                          transition: 'all 0.4s ease',
                        }}
                      />
                    </div>

                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                      {(stateProb.probability * 100).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Phase: {stateProb.phaseDegrees}°</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Bloch Sphere State Vectors */}
        {circuitState && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Layers size={18} color="#a855f7" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Bloch Sphere Vector Projections</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {circuitState.blochVectors.map((bv, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--border-glass)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 800, color: '#c084fc', fontSize: '0.85rem' }}>
                        Qubit q[{idx}] Bloch Vector
                      </span>
                      <span className="badge" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
                        θ={bv.thetaDegrees}°, φ={bv.phiDegrees}°
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      marginBottom: '10px',
                    }}>
                      <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(0,0,0,0.3)', color: '#38bdf8' }}>
                        X: {bv.x}
                      </div>
                      <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(0,0,0,0.3)', color: '#34d399' }}>
                        Y: {bv.y}
                      </div>
                      <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(0,0,0,0.3)', color: '#fbbf24' }}>
                        Z: {bv.z}
                      </div>
                    </div>

                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: '#a5b4fc',
                    }}>
                      State: {bv.stateFormula}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithm Info */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#34d399" /> Algorithm Telemetry
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {circuitState.presetAlgorithmName || 'Custom Quantum Gate Sequence'}. All state vectors are normalized under the Hilbert space constraint: ||ψ|| = 1.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
