import {
  GravitationalWaveEvent,
  SimulateGwMergerDto,
  WaveformStrainDataPoint
} from '@studentlife/shared';

export class GravitationalWavesService {
  async simulateMerger(dto: SimulateGwMergerDto): Promise<GravitationalWaveEvent> {
    const m1 = dto.primaryMassSolar || 36.0;
    const m2 = dto.secondaryMassSolar || 29.0;
    const distanceMpc = dto.luminosityDistanceMpc || 410;

    // Chirp Mass: M_chirp = (m1*m2)^(3/5) / (m1+m2)^(1/5)
    const chirpMass = Math.round((Math.pow(m1 * m2, 0.6) / Math.pow(m1 + m2, 0.2)) * 10) / 10;
    
    // Radiated energy (~5% of total mass)
    const totalMass = m1 + m2;
    const radiatedEnergy = Math.round(totalMass * 0.048 * 10) / 10;
    const remnantMass = Math.round((totalMass - radiatedEnergy) * 10) / 10;

    // Generate Inspiral-Merger-Ringdown (IMR) waveform strain
    const waveform: WaveformStrainDataPoint[] = [];
    for (let t = -40; t <= 15; t += 1) {
      let strain = 0;
      let freq = 35;
      if (t < 0) {
        // Inspiral chirp increasing in frequency and amplitude
        const progress = (40 + t) / 40;
        strain = Math.sin((t / 2) * (1 + progress * 2)) * Math.pow(progress, 1.8) * 1.15;
        freq = Math.round(35 + Math.pow(progress, 3) * 215);
      } else if (t === 0) {
        // Peak merger
        strain = 1.25;
        freq = 250;
      } else {
        // Ringdown quasinormal mode exponential decay
        const decay = Math.exp(-t / 3.2);
        strain = Math.cos(t * 1.2) * decay * 1.25;
        freq = 250;
      }

      waveform.push({
        timeMs: t,
        strainH10Minus21: Math.round(strain * 1000) / 1000,
        frequencyHz: freq
      });
    }

    return {
      id: `gw-event-${Date.now()}`,
      eventName: `GW-${Math.round(m1 + m2)}M-BBH (Binary Black Hole Merger)`,
      primaryMassSolar: m1,
      secondaryMassSolar: m2,
      chirpMassSolar: chirpMass,
      luminosityDistanceMpc: distanceMpc,
      peakGravitationalPowerWatts: 3.6e49, // ~3.6 x 10^49 Watts
      remnantBlackHoleMassSolar: remnantMass,
      energyRadiatedSolarMasses: radiatedEnergy,
      detectorNetwork: ['LIGO Hanford (H1)', 'LIGO Livingston (L1)', 'Virgo (V1)'],
      strainWaveform: waveform
    };
  }
}
