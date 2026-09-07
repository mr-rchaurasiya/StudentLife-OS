import { Simulation3DModel, RunSimulationDto } from '@studentlife/shared';

export class HoloSimulationsService {
  private static simulations: Simulation3DModel[] = [
    {
      id: 'sim-cpu-pipeline',
      title: '5-Stage RISC CPU Pipeline & Hazards Simulator',
      category: 'COMPUTER_SCIENCE',
      description: 'Interactive visualization of Instruction Fetch (IF), Instruction Decode (ID), Execute (EX), Memory Access (MEM), and Write Back (WB) stages with branch and data hazard stalls.',
      keyFormulas: [
        'Speedup = (Non-Pipelined CPI * ClockCycle) / (Pipelined CPI * ClockCycle)',
        'Throughput = Instructions / (Cycles + Stalls)',
        'CPI_ideal = 1.0 (with 0 data hazards)'
      ],
      activeStageLabel: 'EX / MEM Interstage Buffer',
      throughputRate: 0.94,
      parameters: [
        { id: 'clockSpeed', name: 'Clock Frequency (GHz)', value: 3.2, min: 1.0, max: 5.0, step: 0.1, unit: 'GHz' },
        { id: 'branchPredictionAccuracy', name: 'Branch Predictor Accuracy', value: 92, min: 50, max: 99, step: 1, unit: '%' },
        { id: 'forwardingEnabled', name: 'Data Forwarding Bypass', value: 1, min: 0, max: 1, step: 1, unit: 'bool' }
      ]
    },
    {
      id: 'sim-pendulum-chaos',
      title: 'Double Pendulum Non-Linear Chaos & Energy Conservation',
      category: 'PHYSICS',
      description: 'Euler-Lagrange kinetic and potential energy simulation exhibiting deterministic chaos and Lyapunov exponents.',
      keyFormulas: [
        'L = T - V (Lagrangian mechanics)',
        'E_total = 1/2*m1*v1^2 + 1/2*m2*v2^2 + m1*g*y1 + m2*g*y2',
        'Theta2ddot ~ f(Theta1, Theta2, l1, l2)'
      ],
      activeStageLabel: 'Phase Space Trajectory Orbit',
      throughputRate: 60.0,
      parameters: [
        { id: 'length1', name: 'Arm 1 Length (m)', value: 1.0, min: 0.2, max: 3.0, step: 0.1, unit: 'm' },
        { id: 'mass2', name: 'Bob 2 Mass (kg)', value: 2.0, min: 0.5, max: 5.0, step: 0.5, unit: 'kg' },
        { id: 'gravity', name: 'Gravitational Constant g', value: 9.8, min: 1.6, max: 24.8, step: 0.1, unit: 'm/s²' }
      ]
    },
    {
      id: 'sim-electromagnetic-wave',
      title: 'Maxwell Vector Field & Poynting Flux Visualizer',
      category: 'PHYSICS',
      description: 'Orthogonal oscillating Electric (E) and Magnetic (B) vector field wave propagation in free space.',
      keyFormulas: [
        'S = (1/mu0) * (E x B) (Poynting Vector)',
        'c = 1 / sqrt(mu0 * epsilon0) ~ 3.0 x 10^8 m/s',
        'k = 2*pi / lambda'
      ],
      activeStageLabel: 'Transverse Wavefront Propagating in +Z',
      throughputRate: 100.0,
      parameters: [
        { id: 'frequency', name: 'Wave Frequency (MHz)', value: 450, min: 100, max: 1000, step: 25, unit: 'MHz' },
        { id: 'amplitude', name: 'Electric Field Amplitude', value: 12, min: 1, max: 30, step: 1, unit: 'V/m' }
      ]
    }
  ];

  public static getSimulations(): Simulation3DModel[] {
    return this.simulations;
  }

  public static runSimulation(dto: RunSimulationDto): Simulation3DModel {
    const sim = this.simulations.find(s => s.id === dto.simulationId) || this.simulations[0];
    const updated = { ...sim };
    if (dto.parameters) {
      updated.parameters = updated.parameters.map(p => ({
        ...p,
        value: dto.parameters[p.id] !== undefined ? dto.parameters[p.id] : p.value
      }));
    }
    return updated;
  }
}
