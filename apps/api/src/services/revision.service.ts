import {
  RevisionItem,
  RevisionOverviewStats,
  ReviewItemDto,
  RevisionRating,
} from '@studentlife/shared';

const userRevisionQueueDb = new Map<string, RevisionItem[]>();
const userStatsDb = new Map<string, { reviewedToday: number; streak: number }>();

const DEFAULT_DEMO_REVISION_ITEMS: RevisionItem[] = [
  {
    id: 'rev-item-1',
    userId: 'demo-student-uuid-01',
    subjectName: 'Data Structures & Algorithms',
    subjectColor: '#6366f1',
    topicTitle: 'Dynamic Programming: 0/1 Knapsack & Subset Sum',
    type: 'TOPIC',
    currentIntervalDays: 4,
    easeFactor: 2.5,
    retentionScorePercent: 62,
    dueDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    daysOverdueOrRemaining: 2,
    urgency: 'OVERDUE',
    repetitionCount: 2,
    lastReviewedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    keySummary: 'State recurrence: dp[w] = max(dp[w], val[i] + dp[w - wt[i]]). Reverse loop avoids duplicate item reuse.',
  },
  {
    id: 'rev-item-2',
    userId: 'demo-student-uuid-01',
    subjectName: 'System Design',
    subjectColor: '#06b6d4',
    topicTitle: 'Distributed Caching (Cache-Aside vs Write-Through)',
    type: 'NOTE',
    currentIntervalDays: 7,
    easeFactor: 2.6,
    retentionScorePercent: 78,
    dueDate: new Date().toISOString().split('T')[0],
    daysOverdueOrRemaining: 0,
    urgency: 'DUE_TODAY',
    repetitionCount: 3,
    lastReviewedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    keySummary: 'Cache-Aside: app queries cache, on miss fetches DB and updates cache. Invalidate on write to prevent stale data.',
  },
  {
    id: 'rev-item-3',
    userId: 'demo-student-uuid-01',
    subjectName: 'Computer Networks',
    subjectColor: '#10b981',
    topicTitle: 'TCP 3-Way Handshake & Congestion Control',
    type: 'FLASHCARD',
    currentIntervalDays: 14,
    easeFactor: 2.7,
    retentionScorePercent: 88,
    dueDate: new Date().toISOString().split('T')[0],
    daysOverdueOrRemaining: 0,
    urgency: 'DUE_TODAY',
    repetitionCount: 4,
    lastReviewedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    keySummary: 'SYN -> SYN-ACK -> ACK. Synchronizes ISNs and prevents phantom connections.',
  },
  {
    id: 'rev-item-4',
    userId: 'demo-student-uuid-01',
    subjectName: 'Engineering Mathematics',
    subjectColor: '#a855f7',
    topicTitle: 'Linear Algebra: Eigenvalues & Diagonalization',
    type: 'TOPIC',
    currentIntervalDays: 10,
    easeFactor: 2.3,
    retentionScorePercent: 92,
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    daysOverdueOrRemaining: 3,
    urgency: 'UPCOMING',
    repetitionCount: 3,
    lastReviewedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    keySummary: 'det(A - λI) = 0. Diagonalizable if algebraic multiplicity equals geometric multiplicity for all eigenvalues.',
  },
];

userRevisionQueueDb.set('demo-student-uuid-01', DEFAULT_DEMO_REVISION_ITEMS);
userStatsDb.set('demo-student-uuid-01', { reviewedToday: 2, streak: 7 });

export class RevisionService {
  static async getQueue(userId: string): Promise<RevisionItem[]> {
    return userRevisionQueueDb.get(userId) || DEFAULT_DEMO_REVISION_ITEMS;
  }

  static async getStats(userId: string): Promise<RevisionOverviewStats> {
    const queue = userRevisionQueueDb.get(userId) || DEFAULT_DEMO_REVISION_ITEMS;
    const userStats = userStatsDb.get(userId) || { reviewedToday: 2, streak: 7 };

    const overdueCount = queue.filter((item) => item.urgency === 'OVERDUE').length;
    const dueTodayCount = queue.filter((item) => item.urgency === 'DUE_TODAY').length;
    const upcomingCount = queue.filter((item) => item.urgency === 'UPCOMING').length;

    const totalRetention = queue.reduce((acc, curr) => acc + curr.retentionScorePercent, 0);
    const averageRetention = queue.length > 0 ? Math.round(totalRetention / queue.length) : 85;

    let risk: 'LOW' | 'MODERATE' | 'CRITICAL' = 'LOW';
    if (overdueCount >= 3 || averageRetention < 70) {
      risk = 'CRITICAL';
    } else if (overdueCount > 0 || averageRetention < 80) {
      risk = 'MODERATE';
    }

    return {
      totalItemsDueToday: overdueCount + dueTodayCount,
      overdueCount,
      upcomingCount,
      averageRetentionScore: averageRetention,
      streakDays: userStats.streak,
      reviewedTodayCount: userStats.reviewedToday,
      memoryDecayRisk: risk,
    };
  }

  static async reviewItem(
    userId: string,
    dto: ReviewItemDto
  ): Promise<{ item: RevisionItem; xpEarned: number }> {
    const queue = userRevisionQueueDb.get(userId) || DEFAULT_DEMO_REVISION_ITEMS;
    const itemIndex = queue.findIndex((i) => i.id === dto.itemId);

    if (itemIndex === -1) {
      const error: any = new Error('Revision item not found');
      error.statusCode = 404;
      throw error;
    }

    const current = queue[itemIndex];
    const q = this.mapRatingToQuality(dto.rating);

    // SuperMemo SM-2 Formula
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const newEaseFactor = Math.max(
      1.3,
      current.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    );

    let nextInterval = 1;
    let newRepetition = current.repetitionCount;
    let newRetention = 100;

    if (q < 3) {
      // Again (Failed recall)
      newRepetition = 0;
      nextInterval = 1;
      newRetention = 50;
    } else {
      if (newRepetition === 0) {
        nextInterval = 1;
      } else if (newRepetition === 1) {
        nextInterval = 6;
      } else {
        nextInterval = Math.max(1, Math.round(current.currentIntervalDays * newEaseFactor));
      }
      newRepetition += 1;
      newRetention = Math.min(100, 85 + (q - 3) * 5);
    }

    const nextDueDate = new Date(Date.now() + nextInterval * 86400000)
      .toISOString()
      .split('T')[0];

    const updatedItem: RevisionItem = {
      ...current,
      easeFactor: Number(newEaseFactor.toFixed(2)),
      currentIntervalDays: nextInterval,
      repetitionCount: newRepetition,
      retentionScorePercent: newRetention,
      dueDate: nextDueDate,
      daysOverdueOrRemaining: nextInterval,
      urgency: 'UPCOMING',
      lastReviewedAt: new Date().toISOString(),
    };

    queue[itemIndex] = updatedItem;
    userRevisionQueueDb.set(userId, queue);

    // Update stats
    const stats = userStatsDb.get(userId) || { reviewedToday: 0, streak: 7 };
    stats.reviewedToday += 1;
    userStatsDb.set(userId, stats);

    const xpEarned = dto.rating === 'EASY' ? 25 : dto.rating === 'GOOD' ? 20 : 15;

    return {
      item: updatedItem,
      xpEarned,
    };
  }

  private static mapRatingToQuality(rating: RevisionRating): number {
    switch (rating) {
      case 'AGAIN':
        return 1;
      case 'HARD':
        return 3;
      case 'GOOD':
        return 4;
      case 'EASY':
        return 5;
      default:
        return 4;
    }
  }
}
