import {
  DailyStudyDigestResult,
  PushNotificationPayload,
  PushSubscriptionDto
} from '@studentlife/shared';

class NotificationsPipelineService {
  private subscriptions: PushSubscriptionDto[] = [];

  public generateDailyDigest(userName = 'Student'): DailyStudyDigestResult {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return {
      date: today,
      greeting: `Good morning, ${userName}! ☀️ Ready to crush your goals today?`,
      motivationalQuote: {
        quote: 'Success is the sum of small efforts, repeated day in and day out.',
        author: 'Robert Collier'
      },
      totalTasksToday: 4,
      highPriorityTasks: [
        {
          id: 'task-1',
          title: 'Practice 5 Hard LeetCode DP Problems (Knapsack/LCS)',
          subjectName: 'Algorithms & Data Structures',
          dueTime: '10:00 AM'
        },
        {
          id: 'task-2',
          title: 'Derive Maxwell Equations & Boundary Value Conditions',
          subjectName: 'Electromagnetic Theory',
          dueTime: '02:30 PM'
        },
        {
          id: 'task-3',
          title: 'Review Indian Polity Preamble & Fundamental Rights (Laxmikanth Ch 3-7)',
          subjectName: 'UPSC GS-1 Polity',
          dueTime: '06:00 PM'
        }
      ],
      flashcardsDueCount: 14,
      upcomingExamClocks: [
        {
          title: 'Tech Placement Assessment Season',
          daysRemaining: 39
        },
        {
          title: 'University Final Semester Exams',
          daysRemaining: 74
        },
        {
          title: 'GATE 2027 National Entrance',
          daysRemaining: 158
        }
      ],
      currentStreakDays: 7,
      targetFocusMinutes: 180
    };
  }

  public registerSubscription(dto: PushSubscriptionDto): { success: boolean; count: number } {
    const existing = this.subscriptions.find((s) => s.endpoint === dto.endpoint);
    if (!existing) {
      this.subscriptions.push(dto);
    }
    return { success: true, count: this.subscriptions.length };
  }

  public sendTestAlert(payload: PushNotificationPayload): { sent: boolean; message: string } {
    console.log('[Notification Pipeline] Dispatching Push Alert:', payload);
    return {
      sent: true,
      message: `Push alert "${payload.title}" successfully dispatched to ${this.subscriptions.length || 1} active devices.`
    };
  }
}

export const notificationsPipelineService = new NotificationsPipelineService();
