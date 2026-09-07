import {
  FusionReactionOutput,
  SimulateTokamakPlasmaDto
} from '@studentlife/shared';

export class FusionTokamakService {
  async simulateTokamak(dto: SimulateTokamakPlasmaDto): Promise<FusionReactionOutput> {
    const temp = dto.parameters.coreIonTemperatureKeV || 15.0; // keV
    const density = dto.parameters.electronDensityM3 || 1.2e20;
    const tau = dto.parameters.energyConfinementTimeSeconds || 3.8;
    const auxPower = dto.auxiliaryHeatingPowerMw || 50;

    // Triple product n * T * tau (keV * s * m^-3)
    const tripleProduct = (density / 1e20) * temp * tau; // scaled
    // Fusion power scaling (empirical DT scaling)
    const fusionPower = (tripleProduct / 30) * 450;
    const Q = Math.round((fusionPower / auxPower) * 100) / 100;
    const alphaHeating = Math.round(fusionPower * 0.2 * 10) / 10;
    const isLawson = tripleProduct >= 30.0; // Ignition / net-gain threshold

    return {
      id: `fusion-sim-${Date.now()}`,
      tokamakReactorName: dto.tokamakReactorName || 'SPARC-Grade D-T Tokamak',
      fusionGainQFactor: Math.max(0.2, Q),
      tripleProductKeVSM3: Math.round(tripleProduct * 10) / 10,
      lawsonCriterionAchieved: isLawson,
      totalThermalPowerMegawatts: Math.round(fusionPower),
      alphaParticleHeatingMw: alphaHeating,
      plasmaStabilityStatus: Q >= 10 ? 'STABLE_H_MODE' : Q >= 1 ? 'EDGE_LOCALIZED_MODE' : 'DISRUPTION_RISK'
    };
  }
}
