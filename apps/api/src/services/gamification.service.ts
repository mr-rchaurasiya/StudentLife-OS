import {
  LeaderboardEntry,
  StudentAchievementBadge,
  GamificationDashboardData,
  LeaderboardFilterScope,
  WeeklyLeagueTier
} from '@studentlife/shared';

export class GamificationService {
  private static allIndiaLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: 'usr-top-1',
      fullName: 'Ananya Sharma',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananya',
      collegeOrSchool: 'IIT Bombay',
      targetExam: 'GATE 2027 (CSE)',
      level: 7,
      weeklyXp: 1450,
      totalXp: 9820,
      streakDays: 42,
      accuracyPercentage: 94,
      studyHoursThisWeek: 36.5,
      leagueTier: 'MASTER',
      topBadgeTitle: '🔥 30-Day Legend',
      isCurrentUser: false
    },
    {
      rank: 2,
      userId: 'usr-top-2',
      fullName: 'Rohan Verma',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rohan',
      collegeOrSchool: 'BITS Pilani',
      targetExam: 'GATE 2027 (CSE)',
      level: 6,
      weeklyXp: 1280,
      totalXp: 8140,
      streakDays: 28,
      accuracyPercentage: 91,
      studyHoursThisWeek: 31.0,
      leagueTier: 'DIAMOND',
      topBadgeTitle: '🎯 Mock Sniper',
      isCurrentUser: false
    },
    {
      rank: 3,
      userId: 'usr-top-3',
      fullName: 'Priya Iyer',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya',
      collegeOrSchool: 'NIT Trichy',
      targetExam: 'UPSC CSE',
      level: 6,
      weeklyXp: 1190,
      totalXp: 7450,
      streakDays: 21,
      accuracyPercentage: 88,
      studyHoursThisWeek: 29.5,
      leagueTier: 'DIAMOND',
      topBadgeTitle: '📚 Syllabus Crusher',
      isCurrentUser: false
    },
    {
      rank: 4,
      userId: 'demo-student-uuid-01',
      fullName: 'Alex Morgan (You)',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=student',
      collegeOrSchool: 'Indian Institute of Technology (IIT)',
      targetExam: 'GATE (CSE / ECE / ME)',
      level: 2,
      weeklyXp: 820,
      totalXp: 420,
      streakDays: 7,
      accuracyPercentage: 78,
      studyHoursThisWeek: 18.2,
      leagueTier: 'GOLD',
      topBadgeTitle: '⚡ Rapid Recall Pro',
      isCurrentUser: true
    },
    {
      rank: 5,
      userId: 'usr-top-5',
      fullName: 'Devansh Kulkarni',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Devansh',
      collegeOrSchool: 'IIT Delhi',
      targetExam: 'JEE Advanced',
      level: 5,
      weeklyXp: 790,
      totalXp: 5800,
      streakDays: 14,
      accuracyPercentage: 85,
      studyHoursThisWeek: 22.0,
      leagueTier: 'GOLD',
      topBadgeTitle: '🧠 Math Virtuoso',
      isCurrentUser: false
    },
    {
      rank: 6,
      userId: 'usr-top-6',
      fullName: 'Sneha Patel',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sneha',
      collegeOrSchool: 'Delhi University',
      targetExam: 'UPSC CSE',
      level: 4,
      weeklyXp: 680,
      totalXp: 4320,
      streakDays: 11,
      accuracyPercentage: 82,
      studyHoursThisWeek: 19.5,
      leagueTier: 'SILVER',
      topBadgeTitle: '📝 Note Master',
      isCurrentUser: false
    },
    {
      rank: 7,
      userId: 'usr-top-7',
      fullName: 'Karthik Raja',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Karthik',
      collegeOrSchool: 'Anna University',
      targetExam: 'GATE 2027 (CSE)',
      level: 4,
      weeklyXp: 620,
      totalXp: 3900,
      streakDays: 9,
      accuracyPercentage: 79,
      studyHoursThisWeek: 16.0,
      leagueTier: 'SILVER',
      topBadgeTitle: '⏱️ Focus Centurion',
      isCurrentUser: false
    }
  ];

  private static achievementBadges: StudentAchievementBadge[] = [
    {
      id: 'bdg-1',
      title: '7-Day Streak Warrior',
      category: 'STREAK',
      description: 'Study for 7 consecutive days without breaking the chain.',
      iconEmoji: '🔥',
      rarity: 'RARE',
      isUnlocked: true,
      unlockedAt: '2026-09-06',
      progressPercent: 100,
      xpBonus: 100
    },
    {
      id: 'bdg-2',
      title: 'Mock Test Grandmaster',
      category: 'EXAMS',
      description: 'Score above 85% accuracy in a full-length timed simulation test.',
      iconEmoji: '🏆',
      rarity: 'EPIC',
      isUnlocked: false,
      progressPercent: 78,
      xpBonus: 250
    },
    {
      id: 'bdg-3',
      title: 'SM-2 Rapid Recall Pro',
      category: 'MASTERY',
      description: 'Maintain 90%+ retention across 20 Spaced Repetition flashcards.',
      iconEmoji: '🧠',
      rarity: 'RARE',
      isUnlocked: true,
      unlockedAt: '2026-09-05',
      progressPercent: 100,
      xpBonus: 150
    },
    {
      id: 'bdg-4',
      title: 'Pomodoro Centurion',
      category: 'FOCUS',
      description: 'Complete 25 focused Pomodoro blocks (500+ deep study minutes).',
      iconEmoji: '⏱️',
      rarity: 'RARE',
      isUnlocked: false,
      progressPercent: 64,
      xpBonus: 120
    },
    {
      id: 'bdg-5',
      title: 'ATS Resume Architect',
      category: 'MASTERY',
      description: 'Attain a 90+ ATS Score on your tailored technical resume.',
      iconEmoji: '📄',
      rarity: 'EPIC',
      isUnlocked: true,
      unlockedAt: '2026-09-06',
      progressPercent: 100,
      xpBonus: 200
    },
    {
      id: 'bdg-6',
      title: 'Community Scholar',
      category: 'COMMUNITY',
      description: 'Answer 5 peer doubts with verified accepted solutions.',
      iconEmoji: '🤝',
      rarity: 'COMMON',
      isUnlocked: false,
      progressPercent: 40,
      xpBonus: 80
    },
    {
      id: 'bdg-7',
      title: 'All-India Top 5% Finisher',
      category: 'EXAMS',
      description: 'Reach the Diamond League in the weekly National division.',
      iconEmoji: '👑',
      rarity: 'LEGENDARY',
      isUnlocked: false,
      progressPercent: 55,
      xpBonus: 500
    }
  ];

  public static getGamificationData(scope: LeaderboardFilterScope = 'ALL_INDIA'): GamificationDashboardData {
    let filtered = [...this.allIndiaLeaderboard];

    if (scope === 'MY_COLLEGE') {
      filtered = filtered.filter(s => s.collegeOrSchool.includes('IIT') || s.isCurrentUser);
    } else if (scope === 'TARGET_EXAM') {
      filtered = filtered.filter(s => s.targetExam.includes('GATE') || s.isCurrentUser);
    }

    filtered.sort((a, b) => b.weeklyXp - a.weeklyXp);
    filtered.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    const topThree = filtered.slice(0, 3);
    const currentUserIndex = filtered.findIndex(s => s.isCurrentUser);
    const currentUserRank = currentUserIndex !== -1 ? currentUserIndex + 1 : 4;

    return {
      currentUserRank,
      totalParticipants: 4820,
      leagueTier: 'GOLD',
      daysRemainingInDivision: 2,
      topThreePodium: topThree,
      rankings: filtered,
      achievements: this.achievementBadges,
      weeklyXpTrajectory: [120, 180, 240, 310, 480, 650, 820]
    };
  }

  public static claimBadgeBonus(badgeId: string): StudentAchievementBadge | null {
    const badge = this.achievementBadges.find(b => b.id === badgeId);
    if (!badge || !badge.isUnlocked) return null;
    return badge;
  }
}
