import {
  NeuromorphicSimulationResult,
  RunSnnSimulationDto
} from '@studentlife/shared';

export class NeuromorphicSnnService {
  private defaultResult: NeuromorphicSimulationResult = {
    id: 'snn-sim-demo-01',
    architectureName: 'LIF Feedforward Sensory Cortex Layer',
    totalSpikesFired: 142,
    energyConsumptionJoules: 3.42e-9, // 3.42 nanoJoules
    sparsityPercent: 91.8,
    neuromorphicHardwareChip: 'INTEL_LOIHI_2',
    voltageTraceMv: [
      { timeMs: 0, voltageMv: -70.0, spiked: false },
      { timeMs: 5, voltageMv: -64.2, spiked: false },
      { timeMs: 10, voltageMv: -56.8, spiked: false },
      { timeMs: 14, voltageMv: -50.0, spiked: true },
      { timeMs: 15, voltageMv: -75.0, spiked: false },
      { timeMs: 20, voltageMv: -68.4, spiked: false },
      { timeMs: 25, voltageMv: -61.2, spiked: false },
      { timeMs: 28, voltageMv: -50.0, spiked: true },
      { timeMs: 30, voltageMv: -75.0, spiked: false },
      { timeMs: 35, voltageMv: -66.1, spiked: false },
      { timeMs: 40, voltageMv: -59.3, spiked: false },
      { timeMs: 44, voltageMv: -50.0, spiked: true },
      { timeMs: 45, voltageMv: -75.0, spiked: false },
      { timeMs: 50, voltageMv: -69.0, spiked: false },
    ],
    synapticUpdates: [
      { synapseId: 'syn-w1', preSpikeTimeMs: 12, postSpikeTimeMs: 14, deltaWeight: +0.14, currentWeight: 0.84 },
      { synapseId: 'syn-w2', preSpikeTimeMs: 16, postSpikeTimeMs: 14, deltaWeight: -0.09, currentWeight: 0.41 },
      { synapseId: 'syn-w3', preSpikeTimeMs: 26, postSpikeTimeMs: 28, deltaWeight: +0.18, currentWeight: 0.92 },
      { synapseId: 'syn-w4', preSpikeTimeMs: 41, postSpikeTimeMs: 44, deltaWeight: +0.12, currentWeight: 0.78 }
    ]
  };

  async getLatestSimulation(): Promise<NeuromorphicSimulationResult> {
    return this.defaultResult;
  }

  async runSimulation(dto: RunSnnSimulationDto): Promise<NeuromorphicSimulationResult> {
    const trace: { timeMs: number; voltageMv: number; spiked: boolean }[] = [];
    let currentV = dto.neuronConfig.restingPotentialMv || -70.0;
    const threshold = dto.neuronConfig.thresholdPotentialMv || -50.0;
    const resting = dto.neuronConfig.restingPotentialMv || -70.0;
    const tau = dto.neuronConfig.decayConstantTauMs || 20.0;
    let spikeCount = 0;
    const dt = 2; // 2 ms steps

    for (let t = 0; t <= dto.simulationDurationMs; t += dt) {
      // dv/dt = (-(v - resting) + R*I) / tau
      const inputDrive = dto.inputCurrentNanoAmps * 12.0;
      currentV += (-(currentV - resting) + inputDrive) * (dt / tau);

      if (currentV >= threshold) {
        trace.push({ timeMs: t, voltageMv: 30.0, spiked: true });
        currentV = resting - 5.0; // Hyperpolarization
        spikeCount++;
      } else {
        trace.push({ timeMs: t, voltageMv: Math.round(currentV * 10) / 10, spiked: false });
      }
    }

    return {
      id: `snn-sim-${Date.now()}`,
      architectureName: dto.architectureName,
      totalSpikesFired: spikeCount,
      energyConsumptionJoules: (spikeCount * 2.4e-11) + 1.2e-10,
      sparsityPercent: Math.min(99.0, Math.max(75.0, 100 - (spikeCount / (dto.simulationDurationMs / dt)) * 100)),
      voltageTraceMv: trace,
      synapticUpdates: [
        { synapseId: 'syn-stdp-01', preSpikeTimeMs: 14, postSpikeTimeMs: 18, deltaWeight: 0.15, currentWeight: 0.85 },
        { synapseId: 'syn-stdp-02', preSpikeTimeMs: 22, postSpikeTimeMs: 20, deltaWeight: -0.08, currentWeight: 0.42 },
      ],
      neuromorphicHardwareChip: 'INTEL_LOIHI_2'
    };
  }
}
