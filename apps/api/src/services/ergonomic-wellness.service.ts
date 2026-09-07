import { ErgonomicWellnessProfile, LogErgonomicSessionDto } from '@studentlife/shared';

export class ErgonomicWellnessService {
  private static profile: ErgonomicWellnessProfile = {
    digitalEyeStrainScore: 32,
    blinkRatePerMinute: 16,
    currentPostureStatus: 'GOOD_UPRIGHT',
    screenDistanceCm: 55,
    screenTimeMinutesToday: 185,
    eyeBreaksCompleted: 5,
    stretchesCompleted: 3,
    activeAlerts: [
      '20-20-20 Rule: Look at an object 20 feet away for 20 seconds in 8 minutes.',
      'Optimal Ergonomics: Keep eyes aligned with top third of screen.'
    ]
  };

  public static getProfile(): ErgonomicWellnessProfile {
    return this.profile;
  }

  public static logSession(dto: LogErgonomicSessionDto): ErgonomicWellnessProfile {
    if (dto.blinkRatePerMinute !== undefined) {
      this.profile.blinkRatePerMinute = dto.blinkRatePerMinute;
      if (dto.blinkRatePerMinute < 10) {
        this.profile.digitalEyeStrainScore = Math.min(100, this.profile.digitalEyeStrainScore + 10);
      } else {
        this.profile.digitalEyeStrainScore = Math.max(0, this.profile.digitalEyeStrainScore - 5);
      }
    }

    if (dto.postureStatus) {
      this.profile.currentPostureStatus = dto.postureStatus;
    }

    if (dto.distanceCm !== undefined) {
      this.profile.screenDistanceCm = dto.distanceCm;
    }

    return this.profile;
  }

  public static recordAction(action: 'EYE_BREAK' | 'STRETCH'): ErgonomicWellnessProfile {
    if (action === 'EYE_BREAK') {
      this.profile.eyeBreaksCompleted += 1;
      this.profile.digitalEyeStrainScore = Math.max(0, this.profile.digitalEyeStrainScore - 15);
    } else {
      this.profile.stretchesCompleted += 1;
      this.profile.currentPostureStatus = 'GOOD_UPRIGHT';
    }
    return this.profile;
  }
}
