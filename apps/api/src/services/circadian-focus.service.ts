import {
  CircadianProfile,
  UpdateHabitDto
} from '@studentlife/shared';

export class CircadianFocusService {
  private profile: CircadianProfile;

  constructor() {
    this.profile = {
      chronotype: 'EARLY_BIRD',
      bestHoursForMathAndCoding: '07:30 AM – 11:30 AM (Peak Cortisol & Alertness)',
      bestHoursForRevision: '04:00 PM – 07:00 PM (Long-Term Memory Consolidation)',
      recommendedSleepWindow: '10:30 PM – 06:30 AM (8.0 Hours Delta Deep Sleep)',
      waterIntakeGlassesToday: 5,
      waterGoalGlasses: 8,
      screenBreaksTaken: 4,
      focusConsistencyScore: 88,
      dailySlots: [
        {
          timeWindow: '06:00 AM – 09:00 AM',
          energyLevel: 'PEAK_COGNITIVE',
          recommendedActivities: ['Complex Calculus', 'Hard DSA Graphs & Dynamic Programming', 'High-Yield Physics Numerical'],
          recommendedSubjectTypes: ['Mathematics', 'Computer Science', 'Physics']
        },
        {
          timeWindow: '09:30 AM – 01:00 PM',
          energyLevel: 'MODERATE_FOCUS',
          recommendedActivities: ['Syllabus Progress Tracking', 'Mock Test Section Practice', 'System Design Reading'],
          recommendedSubjectTypes: ['Engineering Subjects', 'Polity & Governance']
        },
        {
          timeWindow: '02:00 PM – 04:00 PM',
          energyLevel: 'LOW_ENERGY',
          recommendedActivities: ['Post-Lunch Light Review', 'Video Lectures', 'Flashcard Revision & Audio Podcasts'],
          recommendedSubjectTypes: ['Revision', 'Current Affairs']
        },
        {
          timeWindow: '04:30 PM – 08:00 PM',
          energyLevel: 'PEAK_COGNITIVE',
          recommendedActivities: ['Full Timed Mock Exam Simulation', '1v1 Peer Quiz Arena Speed Battles'],
          recommendedSubjectTypes: ['Mock Tests', 'Exam Drills']
        },
        {
          timeWindow: '08:30 PM – 10:30 PM',
          energyLevel: 'RECOVERY',
          recommendedActivities: ['SuperMemo SM-2 Active Recall Queue', 'Day Planning for Tomorrow', 'Focus Garden Pet Play'],
          recommendedSubjectTypes: ['Planning', 'Light Recall']
        }
      ]
    };
  }

  public getProfile(): CircadianProfile {
    return this.profile;
  }

  public updateHabit(dto: UpdateHabitDto): CircadianProfile {
    switch (dto.action) {
      case 'DRINK_WATER':
        this.profile.waterIntakeGlassesToday = Math.min(12, this.profile.waterIntakeGlassesToday + 1);
        this.profile.focusConsistencyScore = Math.min(100, this.profile.focusConsistencyScore + 2);
        break;
      case 'TAKE_SCREEN_BREAK':
        this.profile.screenBreaksTaken += 1;
        this.profile.focusConsistencyScore = Math.min(100, this.profile.focusConsistencyScore + 3);
        break;
      case 'SET_CHRONOTYPE':
        if (dto.value === 'NIGHT_OWL') {
          this.profile.chronotype = 'NIGHT_OWL';
          this.profile.bestHoursForMathAndCoding = '09:00 PM – 01:30 AM (Peak Silence & Focus)';
          this.profile.bestHoursForRevision = '02:00 PM – 05:00 PM';
          this.profile.recommendedSleepWindow = '02:30 AM – 09:30 AM (7.0 Hours)';
        } else {
          this.profile.chronotype = 'EARLY_BIRD';
          this.profile.bestHoursForMathAndCoding = '07:30 AM – 11:30 AM (Peak Cortisol & Alertness)';
          this.profile.bestHoursForRevision = '04:00 PM – 07:00 PM';
          this.profile.recommendedSleepWindow = '10:30 PM – 06:30 AM (8.0 Hours)';
        }
        break;
    }
    return this.profile;
  }
}

export const circadianFocusService = new CircadianFocusService();
