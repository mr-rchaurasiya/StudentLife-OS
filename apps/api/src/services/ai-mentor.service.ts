import {
  MentorHolisticReport,
  MentorActionItem,
  BurnoutHealthIndex,
  CrossModuleInsight,
  MentorPersonaType,
  MentorChatExchangeDto,
  MentorChatResponse
} from '@studentlife/shared';
import { LlmService } from './llm.service';

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

  public static async processMentorChat(dto: MentorChatExchangeDto): Promise<MentorChatResponse> {
    const query = dto.message.trim();
    const persona = dto.persona || this.activePersona;
    this.activePersona = persona;

    const suggestedActions: MentorActionItem[] = [];
    let quote = 'Continuous effort—not strength or intelligence—is the key to unlocking our potential. — Winston Churchill';

    const systemPrompt = `You are an expert AI Personal Mentor & Academic Coach in StudentLife OS with persona: "${persona}".
Provide motivating, direct, highly structured guidance with clear markdown, bullet points, and LaTeX mathematics where applicable.
Help the student with study schedules, mathematics/engineering derivations, UPSC/competitive exam strategies, coding/DSA, and stress management in Hindi or English as requested.`;

    const reply = await LlmService.generateResponse(query, {
      systemPrompt,
      persona
    });

    const lower = query.toLowerCase();
    if (lower.includes('dp') || lower.includes('algorithm') || lower.includes('math') || lower.includes('exam')) {
      suggestedActions.push(this.dailyActionPlan[0]);
    }
    if (lower.includes('revise') || lower.includes('flashcard') || lower.includes('notes')) {
      suggestedActions.push(this.dailyActionPlan[1]);
    }
    if (lower.includes('career') || lower.includes('job') || lower.includes('google') || lower.includes('resume')) {
      suggestedActions.push(this.dailyActionPlan[2]);
    }

    return {
      reply,
      persona,
      suggestedActions,
      encouragementQuote: quote
    };
  }
}
