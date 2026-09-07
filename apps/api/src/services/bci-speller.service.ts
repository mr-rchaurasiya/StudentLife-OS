import {
  P300SpellerSession,
  ProcessBciEpochDto
} from '@studentlife/shared';

export class BciSpellerService {
  async processEpoch(dto: ProcessBciEpochDto): Promise<P300SpellerSession> {
    const target = dto.targetWord || 'NEURAL';
    const current = dto.currentSpelledText || 'NEU';
    const nextChar = target[current.length] || 'R';
    const updatedSpelled = current + nextChar;

    const erpWaveform: { timeMs: number; czMv: number; pzMv: number; ozMv: number }[] = [];
    for (let t = 0; t <= 600; t += 20) {
      // P300 positive wave peak at ~300ms
      const p300Component = 8.5 * Math.exp(-Math.pow((t - 300) / 60, 2));
      const baselineNoise = (Math.sin(t / 15) * 1.2);
      erpWaveform.push({
        timeMs: t,
        czMv: Math.round((p300Component * 0.9 + baselineNoise) * 10) / 10,
        pzMv: Math.round((p300Component * 1.1 + baselineNoise) * 10) / 10, // Parietal leads show strongest P300
        ozMv: Math.round((p300Component * 0.4 + baselineNoise) * 10) / 10
      });
    }

    return {
      id: `bci-sess-${Date.now()}`,
      targetWord: target,
      spelledWord: updatedSpelled,
      wordsPerMinute: 8.4,
      p300AmplitudeMicroVolts: 9.8,
      classificationConfidencePercent: 96.4,
      erpWaveform,
      activeElectrodeMontage: ['Cz (Central)', 'Pz (Parietal - Peak P300)', 'Oz (Occipital)', 'Fz (Frontal Ref)']
    };
  }
}
