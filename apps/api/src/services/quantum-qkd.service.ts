import {
  QkdTransmissionReport,
  QkdPhotonState,
  SimulateQkdProtocolDto
} from '@studentlife/shared';

export class QuantumQkdService {
  async simulateQkd(dto: SimulateQkdProtocolDto): Promise<QkdTransmissionReport> {
    const total = dto.photonsCount || 16;
    const eveActive = !!dto.enableEveEavesdropping;
    const noise = dto.channelNoisePercent || 0.02;

    const samplePhotons: QkdPhotonState[] = [];
    const siftedBits: number[] = [];
    let bitErrors = 0;

    for (let i = 0; i < total; i++) {
      const aliceBit: 0 | 1 = Math.random() > 0.5 ? 1 : 0;
      const aliceBasis: 'RECTILINEAR' | 'DIAGONAL' = Math.random() > 0.5 ? 'RECTILINEAR' : 'DIAGONAL';
      
      let measuredBit = aliceBit;
      let eveBasis: 'RECTILINEAR' | 'DIAGONAL' | undefined = undefined;

      if (eveActive) {
        eveBasis = Math.random() > 0.5 ? 'RECTILINEAR' : 'DIAGONAL';
        // Eve collapses the quantum wavefunction
        if (eveBasis !== aliceBasis) {
          measuredBit = Math.random() > 0.5 ? 1 : 0; // Wavefunction disturbance!
        }
      }

      const bobBasis: 'RECTILINEAR' | 'DIAGONAL' = Math.random() > 0.5 ? 'RECTILINEAR' : 'DIAGONAL';
      let bobBit: 0 | 1 = measuredBit;

      if (bobBasis !== (eveActive ? eveBasis : aliceBasis)) {
        bobBit = Math.random() > 0.5 ? 1 : 0;
      }

      const basisMatched = aliceBasis === bobBasis;
      const isSifted = basisMatched;

      if (isSifted) {
        siftedBits.push(bobBit);
        if (bobBit !== aliceBit || Math.random() < noise) {
          bitErrors++;
        }
      }

      samplePhotons.push({
        index: i + 1,
        aliceBit,
        aliceBasis,
        eveIntercepted: eveActive,
        eveBasis,
        bobBasis,
        bobMeasuredBit: bobBit,
        basisMatched,
        isSiftedKeyBit: isSifted
      });
    }

    const siftedLen = siftedBits.length;
    const qber = siftedLen > 0 ? Math.round((bitErrors / siftedLen) * 1000) / 10 : 0;
    const isCompromised = qber > 11.0 || (eveActive && qber > 5.0);

    const secretKey = siftedBits.slice(0, 16).map(b => b.toString()).join('') || '1101001011001101';

    return {
      id: `qkd-rep-${Date.now()}`,
      protocol: 'BB84',
      totalPhotonsSent: total,
      siftedKeyLength: siftedLen,
      qberPercent: qber,
      eavesdropperDetected: isCompromised,
      securityVerdict: isCompromised ? 'COMPROMISED_EAVESDROPPER_DETECTED' : 'SECURE_CHANNEL',
      samplePhotons,
      finalSecretKeyHex: `0x${parseInt(secretKey, 2).toString(16).toUpperCase().padStart(4, '0')}`,
      encryptedSampleCipherHex: '0x7F4A9BC0E21D'
    };
  }
}
