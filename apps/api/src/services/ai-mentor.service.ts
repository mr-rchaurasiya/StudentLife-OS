import {
  MentorHolisticReport,
  MentorActionItem,
  BurnoutHealthIndex,
  CrossModuleInsight,
  MentorPersonaType,
  MentorChatExchangeDto,
  MentorChatResponse
} from '@studentlife/shared';

export class AiMentorService {
  private static activePersona: MentorPersonaType = 'STRATEGIC_COACH';

  private static dailyActionPlan: MentorActionItem[] = [
    {
      id: 'act-1',
      title: 'Targeted Drill: Dynamic Programming (0/1 Knapsack & Grid Paths)',
      description: 'Your diagnostic radar flagged 55% accuracy on DP during GATE Mock #3. Complete 3 PYQ problems to reinforce recurrence relations.',
      pillar: 'EXAM_READINESS',
      estimatedMinutes: 45,
      xpReward: 25,
      isCompleted: false,
      deepLinkView: 'QUESTION_BANK',
      reasoning: 'Directly bridges your largest mock exam penalty area (-4.6 marks lost to DP errors).'
    },
    {
      id: 'act-2',
      title: 'Review 3 Overdue Memory Cards (Redis Eviction & Raft)',
      description: 'SM-2 retention decay is forecast at 68% for distributed caching notes. Rapid recall takes under 6 minutes.',
      pillar: 'STUDY_CONSISTENCY',
      estimatedMinutes: 10,
      xpReward: 20,
      isCompleted: false,
      deepLinkView: 'AI_STUDY',
      reasoning: 'Maintains long-term neural recall before next week’s system design milestone.'
    },
    {
      id: 'act-3',
      title: 'Submit Google Summer 2026 Application Before Priority Cutoff',
      description: 'Your ATS score matches 94% on Google SWE Intern criteria. Only 6 days remain in the early review batch.',
      pillar: 'CAREER_PROGRESSION',
      estimatedMinutes: 20,
      xpReward: 30,
      isCompleted: false,
      deepLinkView: 'DEADLINES',
      reasoning: 'High-leverage career milestone with immediate upcoming deadline.'
    }
  ];

  private static crossModuleInsights: CrossModuleInsight[] = [
    {
      id: 'ins-1',
      pillar: 'EXAM_READINESS',
      title: 'Accuracy vs Speed Imbalance in Algorithms Section',
      observation: 'In Mock Test #2, you answered questions in 72s/q (fast), but suffered 38% error rate on complex recursion.',
      rootCauseAnalysis: 'Rushing through base-case edge conditions without drawing the decision tree.',
      recommendedIntervention: 'Spend 20 extra seconds writing state transitions on scratchpad before coding.',
      impactPotential: 'HIGH_LEVERAGE'
    },
    {
      id: 'ins-2',
      pillar: 'CAREER_PROGRESSION',
      title: 'Resume ATS Alignment with Distributed Systems Roles',
      observation: 'Your ATS score for Stripe Intern is 96%, but Quant role ATS is 86% due to missing C++ low-latency keywords.',
      rootCauseAnalysis: 'Projects emphasize Go/Node.js rather than lockless queues or memory-mapped IO.',
      recommendedIntervention: 'Add your C++ IPC benchmark project to the resume skill categories.',
      impactPotential: 'HIGH_LEVERAGE'
    },
    {
      id: 'ins-3',
      pillar: 'WELLNESS_BURNOUT',
      title: 'Study Load Balancing: 5 Consecutive High-Intensity Days',
      observation: 'Average study time has reached 4.2h/day with 7.5h sleep. Peak mental clarity is sustained.',
      rootCauseAnalysis: 'Pomodoro 25/5 intervals are preventing cognitive exhaustion.',
      recommendedIntervention: 'Schedule a 45-minute offline recovery walk after today’s DP drill.',
      impactPotential: 'MODERATE'
    }
  ];

  public static getHolisticReport(persona?: MentorPersonaType): MentorHolisticReport {
    if (persona) {
      this.activePersona = persona;
    }

    const burnoutTelemetry: BurnoutHealthIndex = {
      score: 88,
      riskLevel: 'OPTIMAL',
      todayStudyHours: 3.2,
      weeklyAverageStudyHours: 4.1,
      restAndSleepHours: 7.6,
      fatigueIndexPercent: 22,
      recommendation: 'Cognitive endurance is in the Optimal Zone. Maintain 50-minute deep work blocks with short offline breaks.'
    };

    const greetings = {
      STRATEGIC_COACH: 'Good evening, Alex! Your study momentum is exceptional today (7-day streak 🔥). Let us execute our 3 high-leverage milestones.',
      EMPATHETIC_SUPPORT: 'Hey Alex, you have been putting in tremendous, steady effort. Remember to take a breather between deep sessions—you are on track!',
      DRILL_INSTRUCTOR: 'Focus up, Alex. 158 days to GATE 2027 and 6 days on Google SWE cutoff. No room for passive studying—let us crush the DP drill now!'
    };

    return {
      overallStudentHealthScore: 91,
      momentumStatus: 'PEAK_PERFORMANCE',
      activePersona: this.activePersona,
      burnoutTelemetry,
      dailyActionPlan: this.dailyActionPlan,
      crossModuleInsights: this.crossModuleInsights,
      weeklyStreakForecast: '99% Probability of 14-Day Streak milestone based on current daily habit consistency.',
      personalizedGreeting: greetings[this.activePersona],
      generatedAt: new Date().toISOString()
    };
  }

  public static completeAction(id: string): MentorActionItem | null {
    const act = this.dailyActionPlan.find(a => a.id === id);
    if (!act) return null;

    act.isCompleted = true;
    return act;
  }

  public static processMentorChat(dto: MentorChatExchangeDto): MentorChatResponse {
    const query = dto.message.toLowerCase();
    const persona = dto.persona || this.activePersona;
    this.activePersona = persona;

    let reply = '';
    const suggestedActions: MentorActionItem[] = [];
    let quote = 'Continuous effort—not strength or intelligence—is the key to unlocking our potential. — Winston Churchill';

    if (query.includes('focus') || query.includes('today') || query.includes('what should i do')) {
      if (persona === 'DRILL_INSTRUCTOR') {
        reply = 'Listen up: Your biggest point bleed is Dynamic Programming on GATE papers (-4.6 marks). Stop procrastinating on easy topics and drill 3 hard DP recurrences right now. Then submit your Google SWE resume.';
      } else if (persona === 'EMPATHETIC_SUPPORT') {
        reply = 'You have made great progress this week! To keep things balanced and stress-free, I recommend spending 45 minutes on your DP notes, then doing a quick 5-minute flashcard review before taking a relaxing evening break.';
      } else {
        reply = 'Here is your optimal 3-step strategy for today: 1) Solve 3 PYQ DP problems in Question Bank to fix your 55% accuracy gap. 2) Clear your 3 overdue Spaced Repetition flashcards. 3) Submit your Google SWE internship application before the 6-day priority window closes.';
      }
      suggestedActions.push(this.dailyActionPlan[0], this.dailyActionPlan[1]);
    } else if (query.includes('burnout') || query.includes('tired') || query.includes('stress')) {
      reply = 'Your cognitive vitality telemetry is at 88/100 (Optimal Zone), but 5 continuous days of 4+ hours study requires active recovery. Take a 30-minute offline walk, hydrate, and do not touch LeetCode after 10 PM tonight.';
      quote = 'Rest when you are weary. Refresh and renew yourself, your body, your mind, your spirit. — Ralph Marston';
    } else if (query.includes('gate') || query.includes('mock') || query.includes('exam')) {
      reply = 'Your overall Exam Readiness is at 78% (Estimated 97.4th Percentile). To cross the 99th percentile threshold, focus entirely on the Fast & Inaccurate quadrant: Graph Theory BFS/DFS and OS Deadlock Avoidance.';
      suggestedActions.push(this.dailyActionPlan[0]);
    } else if (query.includes('career') || query.includes('job') || query.includes('internship') || query.includes('resume')) {
      reply = 'Your Distributed Systems profile matches Stripe at 96% and Google at 94%. Make sure to submit to Google within the next 6 days. For Quant roles (86% match), consider adding a C++ low-latency memory pool implementation to your GitHub.';
      suggestedActions.push(this.dailyActionPlan[2]);
    } else {
      reply = `I have analyzed your live metrics across Study, Mock Tests, Career Pathways, and Deadlines. Your momentum index is 91/100. How can I help you optimize your schedule or strategy today?`;
    }

    return {
      reply,
      persona,
      suggestedActions,
      encouragementQuote: quote
    };
  }
}
