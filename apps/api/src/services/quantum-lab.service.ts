import {
  QuantumCircuitState,
  SimulateCircuitDto,
  BlochVector,
  QuantumGateType,
} from '@studentlife/shared';

export class QuantumLabService {
  async simulateCircuit(dto: SimulateCircuitDto): Promise<QuantumCircuitState> {
    const qubitCount = Math.min(4, Math.max(1, dto.qubitCount || 2));
    const gates = dto.gates || [];

    // Check if user requested a preset
    if (dto.preset === 'BELL_STATE') {
      return this.getBellStatePreset();
    }
    if (dto.preset === 'GHZ_STATE') {
      return this.getGhzStatePreset();
    }
    if (dto.preset === 'SUPERPOSITION') {
      return this.getSuperpositionPreset();
    }

    // Default simulation based on gates
    const hasHadamard = gates.some((g) => g.gate === 'H');
    const hasCnot = gates.some((g) => g.gate === 'CNOT');
    const hasX = gates.some((g) => g.gate === 'X');

    const blochVectors: BlochVector[] = [];
    for (let q = 0; q < qubitCount; q++) {
      const qGates = gates.filter((g) => g.qubitIndex === q);
      let theta = 0; // |0> state at North pole
      let phi = 0;

      if (qGates.some((g) => g.gate === 'H')) {
        theta = 90; // equator |+>
      }
      if (qGates.some((g) => g.gate === 'X')) {
        theta = 180; // south pole |1>
      }
      if (qGates.some((g) => g.gate === 'Y')) {
        theta = 90;
        phi = 90;
      }
      if (qGates.some((g) => g.gate === 'Z')) {
        phi = 180;
      }

      const radTheta = (theta * Math.PI) / 180;
      const radPhi = (phi * Math.PI) / 180;

      blochVectors.push({
        thetaDegrees: theta,
        phiDegrees: phi,
        x: parseFloat((Math.sin(radTheta) * Math.cos(radPhi)).toFixed(3)),
        y: parseFloat((Math.sin(radTheta) * Math.sin(radPhi)).toFixed(3)),
        z: parseFloat(Math.cos(radTheta).toFixed(3)),
        stateFormula: theta === 90 ? '\\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)' : theta === 180 ? '|1\\rangle' : '|0\\rangle',
      });
    }

    // State probabilities
    const probabilities = this.calculateProbabilities(qubitCount, hasHadamard, hasCnot, hasX);

    return {
      qubitCount,
      gatesApplied: gates,
      stateVectorProbabilities: probabilities,
      blochVectors,
      entanglementMetric: hasCnot && hasHadamard ? 0.99 : 0.0,
      presetAlgorithmName: 'Custom Quantum Gate Sequence',
    };
  }

  private calculateProbabilities(qubitCount: number, hasH: boolean, hasCnot: boolean, hasX: boolean) {
    if (qubitCount === 2) {
      if (hasH && hasCnot) {
        return [
          { stateBinary: '|00⟩', probability: 0.5, phaseDegrees: 0 },
          { stateBinary: '|01⟩', probability: 0.0, phaseDegrees: 0 },
          { stateBinary: '|10⟩', probability: 0.0, phaseDegrees: 0 },
          { stateBinary: '|11⟩', probability: 0.5, phaseDegrees: 0 },
        ];
      }
      if (hasH) {
        return [
          { stateBinary: '|00⟩', probability: 0.5, phaseDegrees: 0 },
          { stateBinary: '|01⟩', probability: 0.0, phaseDegrees: 0 },
          { stateBinary: '|10⟩', probability: 0.5, phaseDegrees: 0 },
          { stateBinary: '|11⟩', probability: 0.0, phaseDegrees: 0 },
        ];
      }
      if (hasX) {
        return [
          { stateBinary: '|00⟩', probability: 0.0, phaseDegrees: 0 },
          { stateBinary: '|01⟩', probability: 0.0, phaseDegrees: 0 },
          { stateBinary: '|10⟩', probability: 1.0, phaseDegrees: 0 },
          { stateBinary: '|11⟩', probability: 0.0, phaseDegrees: 0 },
        ];
      }
      return [
        { stateBinary: '|00⟩', probability: 1.0, phaseDegrees: 0 },
        { stateBinary: '|01⟩', probability: 0.0, phaseDegrees: 0 },
        { stateBinary: '|10⟩', probability: 0.0, phaseDegrees: 0 },
        { stateBinary: '|11⟩', probability: 0.0, phaseDegrees: 0 },
      ];
    }

    // 1 Qubit
    if (hasH) {
      return [
        { stateBinary: '|0⟩', probability: 0.5, phaseDegrees: 0 },
        { stateBinary: '|1⟩', probability: 0.5, phaseDegrees: 0 },
      ];
    }
    return [
      { stateBinary: '|0⟩', probability: 1.0, phaseDegrees: 0 },
      { stateBinary: '|1⟩', probability: 0.0, phaseDegrees: 0 },
    ];
  }

  private getBellStatePreset(): QuantumCircuitState {
    const gates: { qubitIndex: number; gate: QuantumGateType; stepIndex: number }[] = [
      { qubitIndex: 0, gate: 'H', stepIndex: 0 },
      { qubitIndex: 1, gate: 'CNOT', stepIndex: 1 },
    ];

    const blochVectors: BlochVector[] = [
      {
        thetaDegrees: 90,
        phiDegrees: 0,
        x: 1,
        y: 0,
        z: 0,
        stateFormula: '|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)',
      },
      {
        thetaDegrees: 90,
        phiDegrees: 0,
        x: 1,
        y: 0,
        z: 0,
        stateFormula: 'Max Entanglement (EPR Pair)',
      },
    ];

    return {
      qubitCount: 2,
      gatesApplied: gates,
      stateVectorProbabilities: [
        { stateBinary: '|00⟩', probability: 0.5, phaseDegrees: 0 },
        { stateBinary: '|01⟩', probability: 0.0, phaseDegrees: 0 },
        { stateBinary: '|10⟩', probability: 0.0, phaseDegrees: 0 },
        { stateBinary: '|11⟩', probability: 0.5, phaseDegrees: 0 },
      ],
      blochVectors,
      entanglementMetric: 1.0,
      presetAlgorithmName: 'Bell State (|Φ⁺⟩ Maximally Entangled EPR Pair)',
    };
  }

  private getSuperpositionPreset(): QuantumCircuitState {
    const gates: { qubitIndex: number; gate: QuantumGateType; stepIndex: number }[] = [
      { qubitIndex: 0, gate: 'H', stepIndex: 0 },
    ];

    const blochVectors: BlochVector[] = [
      {
        thetaDegrees: 90,
        phiDegrees: 0,
        x: 1,
        y: 0,
        z: 0,
        stateFormula: '|+\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)',
      },
    ];

    return {
      qubitCount: 1,
      gatesApplied: gates,
      stateVectorProbabilities: [
        { stateBinary: '|0⟩', probability: 0.5, phaseDegrees: 0 },
        { stateBinary: '|1⟩', probability: 0.5, phaseDegrees: 0 },
      ],
      blochVectors,
      entanglementMetric: 0.0,
      presetAlgorithmName: 'Hadamard Quantum Superposition (|+⟩ State)',
    };
  }

  private getGhzStatePreset(): QuantumCircuitState {
    const gates: { qubitIndex: number; gate: QuantumGateType; stepIndex: number }[] = [
      { qubitIndex: 0, gate: 'H', stepIndex: 0 },
      { qubitIndex: 1, gate: 'CNOT', stepIndex: 1 },
      { qubitIndex: 2, gate: 'CNOT', stepIndex: 2 },
    ];

    const blochVectors: BlochVector[] = [
      { thetaDegrees: 90, phiDegrees: 0, x: 1, y: 0, z: 0, stateFormula: '|GHZ\\rangle' },
      { thetaDegrees: 90, phiDegrees: 0, x: 1, y: 0, z: 0, stateFormula: 'Entangled Q1' },
      { thetaDegrees: 90, phiDegrees: 0, x: 1, y: 0, z: 0, stateFormula: 'Entangled Q2' },
    ];

    return {
      qubitCount: 3,
      gatesApplied: gates,
      stateVectorProbabilities: [
        { stateBinary: '|000⟩', probability: 0.5, phaseDegrees: 0 },
        { stateBinary: '|001⟩', probability: 0.0, phaseDegrees: 0 },
        { stateBinary: '|010⟩', probability: 0.0, phaseDegrees: 0 },
        { stateBinary: '|011⟩', probability: 0.0, phaseDegrees: 0 },
        { stateBinary: '|100⟩', probability: 0.0, phaseDegrees: 0 },
        { stateBinary: '|101⟩', probability: 0.0, phaseDegrees: 0 },
        { stateBinary: '|110⟩', probability: 0.0, phaseDegrees: 0 },
        { stateBinary: '|111⟩', probability: 0.5, phaseDegrees: 0 },
      ],
      blochVectors,
      entanglementMetric: 1.0,
      presetAlgorithmName: 'GHZ State (|000⟩ + |111⟩ 3-Qubit Entanglement)',
    };
  }
}

export const quantumLabService = new QuantumLabService();
