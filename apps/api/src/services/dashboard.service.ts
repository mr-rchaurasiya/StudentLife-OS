import {
  DashboardSummaryData,
  ExamCountdownItem,
  RevisionDueItem,
  FocusSessionLog,
} from '@studentlife/shared';
import { ProfileService } from './profile.service';

const focusSessionsDb = new Map<string, FocusSessionLog[]>();

const MOTIVATIONAL_QUOTES = [
  { quote: 'Small daily disciplines repeated with consistency lead to monumental achievements over time.', author: 'Robin Sharma' },
  { quote: 'The secret to getting ahead is getting started. Focus on the next 25 minutes.', author: 'Mark Twain' },
  { quote: 'Success is neither magical nor mysterious. Success is the natural consequence of consistently applying basic fundamentals.', author: 'Jim Rohn' },
  { quote: 'Do not wait; the time will never be just right. Start where you stand.', author: 'Napoleon Hill' },
];

export class DashboardService {
  static async getSummary(userId: string): Promise<DashboardSummaryData> {
    const profile = await ProfileService.getProfileByUserId(userId);
    const userSessions = focusSessionsDb.get(userId) || [];

    // Calculate minutes studied today
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = userSessions.filter(s => s.completedAt.startsWith(today));
    const todayStudiedMinutes = todaySessions.reduce((acc, curr) => acc + curr.durationMinutes, 85); // 85m baseline for demo

    const dailyGoalMinutes = profile.dailyStudyGoalMinutes || 180;
    const todayGoalProgressPercent = Math.min(100, Math.round((todayStudiedMinutes / dailyGoalMinutes) * 100));

    // Dynamic Exam Countdowns based on student's target exams
    const countdowns: ExamCountdownItem[] = [
      {
        id: 'exam-1',
        title: profile.targetExams[0] || 'GATE 2027 (CSE)',
        examDate: '2027-02-14',
        daysRemaining: 158,
        category: 'NATIONAL_COMPETITIVE',
        targetScoreGoal: 'Top 0.5% (AIR < 500)',
      },
      {
        id: 'exam-2',
        title: profile.targetExams[1] || 'University Semester Finals',
        examDate: '2026-11-20',
        daysRemaining: 74,
        category: 'UNIVERSITY_EXAM',
        targetScoreGoal: 'CGPA >= 9.2',
      },
      {
        id: 'exam-3',
        title: 'Tech Placement Coding Assessments',
        examDate: '2026-10-15',
        daysRemaining: 39,
        category: 'CAREER_INTERVIEW',
        targetScoreGoal: 'FAANG / Tier-1 Software Engineer',
      },
    ];

    // Spaced Repetition Due Queue
    const revisionQueue: RevisionDueItem[] = [
      {
        id: 'rev-1',
        subjectName: 'Data Structures & Algorithms',
        topicTitle: 'Dynamic Programming & Memoization Patterns',
        colorCode: '#6366f1',
        intervalDays: 4,
        urgency: 'OVERDUE',
      },
      {
        id: 'rev-2',
        subjectName: 'System Design',
        topicTitle: 'Distributed Caching & Redis Eviction Policies',
        colorCode: '#06b6d4',
        intervalDays: 7,
        urgency: 'DUE_TODAY',
      },
      {
        id: 'rev-3',
        subjectName: 'Computer Networks',
        topicTitle: 'TCP Handshake & Congestion Control Algorithms',
        colorCode: '#10b981',
        intervalDays: 14,
        urgency: 'UPCOMING',
      },
    ];

    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

    return {
      todayStudiedMinutes,
      dailyGoalMinutes,
      todayGoalProgressPercent,
      completedPomodorosToday: todaySessions.length > 0 ? todaySessions.length : 3,
      countdowns,
      revisionQueue,
      motivationalQuote: randomQuote,
    };
  }

  static async logFocusSession(
    userId: string,
    durationMinutes: number,
    sessionType: 'FOCUS_25' | 'FOCUS_50' | 'CUSTOM'
  ): Promise<{ session: FocusSessionLog; xpEarned: number }> {
    const xpEarned = sessionType === 'FOCUS_50' ? 50 : 25;

    const session: FocusSessionLog = {
      id: `sess-${Date.now()}`,
      durationMinutes,
      sessionType,
      completedAt: new Date().toISOString(),
      xpEarned,
    };

    const existing = focusSessionsDb.get(userId) || [];
    existing.push(session);
    focusSessionsDb.set(userId, existing);

    // Award XP to profile
    await ProfileService.awardXp(userId, xpEarned);

    return { session, xpEarned };
  }
}
