import {
  MentalSanctumState,
  ResilienceCheckinDto,
  AnxietyReframingRecord,
  BreathingPaceMode,
} from '@studentlife/shared';

export class MentalResilienceService {
  private state: MentalSanctumState;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): MentalSanctumState {
    const initialReframes: AnxietyReframingRecord[] = [
      {
        id: 'reframe-1',
        catastrophizingThought: 'If I don’t score in the 99th percentile on GATE/Semester exams, my whole engineering career is ruined.',
        cognitiveDistortionTag: 'Catastrophizing & Black-or-White Thinking',
        socraticReframe: 'Exam percentiles measure single-day preparation calibration, not total engineering capability or career ceiling. Tens of thousands of top engineers build world-class systems without top 1% percentiles.',
        empowermentAction: 'Schedule a focused 45-minute practice block on weak sub-topics rather than dwelling on outcome anxiety.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: 'reframe-2',
        catastrophizingThought: 'Everyone else in my batch knows more than me and I will freeze during tomorrow’s Viva.',
        cognitiveDistortionTag: 'Imposter Syndrome & Mind Reading',
        socraticReframe: 'Confidence is not the absence of doubt, but the willingness to reason through problems methodically step-by-step.',
        empowermentAction: 'Run through 3 fundamental definition cards in the AI Voice Tutor and perform 2 minutes of 4-7-8 deep breathing.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
    ];

    return {
      currentReadinessIndex: 82,
      dailyCheckinsCompleted: 3,
      reframedThoughts: initialReframes,
      activeBreathingMode: 'CALMING_4_7_8',
    };
  }

  async getSanctumState(): Promise<MentalSanctumState> {
    return this.state;
  }

  async checkInResilience(dto: ResilienceCheckinDto): Promise<MentalSanctumState> {
    const worry = dto.rawWorryText.trim();
    const stress = dto.currentStressScore; // 1 to 10

    const newRecord: AnxietyReframingRecord = {
      id: `reframe-${Date.now()}`,
      catastrophizingThought: worry,
      cognitiveDistortionTag: stress > 7 ? 'High-Stress Emotional Reasoning' : 'Anticipatory Performance Anxiety',
      socraticReframe: `Your concern regarding "${dto.triggerSource}" is valid, but your mind is magnifying risk while minimizing your past preparation and resilience. Break down the task into micro-actions of 15 minutes each.`,
      empowermentAction: 'Take 4 cycles of 4-7-8 paced breathing, drink a glass of water, and review 1 core concept note.',
      createdAt: new Date().toISOString(),
    };

    this.state.reframedThoughts.unshift(newRecord);
    this.state.dailyCheckinsCompleted += 1;
    this.state.currentReadinessIndex = Math.min(99, Math.max(65, 100 - (stress * 3) + (this.state.dailyCheckinsCompleted * 4)));
    return this.state;
  }

  async setBreathingMode(mode: BreathingPaceMode): Promise<MentalSanctumState> {
    this.state.activeBreathingMode = mode;
    return this.state;
  }
}

export const mentalResilienceService = new MentalResilienceService();
