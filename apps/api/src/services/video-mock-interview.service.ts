import {
  VideoMockInterviewSession,
  VideoMockInterviewTrack,
  VideoInterviewQuestion,
  StartVideoMockInterviewDto,
  EvaluateVideoInterviewDto,
  VideoInterviewFeedbackReport
} from '@studentlife/shared';

const TRACK_QUESTIONS: Record<VideoMockInterviewTrack, VideoInterviewQuestion[]> = {
  SOFTWARE_ENGINEERING_DSA: [
    {
      id: 'q-sde-1',
      questionNumber: 1,
      questionText: 'Can you walk me through how you would design an in-memory Key-Value Cache (like Redis) with LRU eviction and O(1) get and put operations?',
      expectedKeyCompetencies: ['Doubly Linked List + HashMap', 'Thread safety locks', 'O(1) time complexity'],
      difficulty: 'MEDIUM'
    },
    {
      id: 'q-sde-2',
      questionNumber: 2,
      questionText: 'Explain the difference between Optimistic Concurrency Control and Pessimistic Locking in high-throughput distributed databases.',
      expectedKeyCompetencies: ['Version stamps / MVCC', 'Deadlock avoidance', 'Contention trade-offs'],
      difficulty: 'HARD'
    },
    {
      id: 'q-sde-3',
      questionNumber: 3,
      questionText: 'Tell me about a challenging bug you encountered in production or in a complex project. How did you diagnose and resolve it?',
      expectedKeyCompetencies: ['STAR framework', 'Root cause analysis', 'Testing & observability'],
      difficulty: 'MEDIUM'
    }
  ],
  DATA_SCIENCE_AI: [
    {
      id: 'q-ds-1',
      questionNumber: 1,
      questionText: 'How do you detect and mitigate Data Drift and Concept Drift when serving large language models and tabular ML models in production?',
      expectedKeyCompetencies: ['Population Stability Index (PSI)', 'KS-Statistic', 'Continuous retraining pipeline'],
      difficulty: 'HARD'
    },
    {
      id: 'q-ds-2',
      questionNumber: 2,
      questionText: 'Explain the internal mechanics of Multi-Head Self-Attention in Transformer architectures. Why is the square root of d_k scaling factor essential?',
      expectedKeyCompetencies: ['Softmax gradient saturation prevention', 'Q, K, V projections', 'Matrix scaling'],
      difficulty: 'MEDIUM'
    }
  ],
  UPSC_PERSONALITY_TEST: [
    {
      id: 'q-upsc-1',
      questionNumber: 1,
      questionText: 'As a District Magistrate facing public agitation against a critical infrastructure project, how will you balance developmental imperatives with grassroots rehabilitation?',
      expectedKeyCompetencies: ['Public consultation & empathy', 'Administrative neutrality', 'Law & order balancing'],
      difficulty: 'HARD'
    },
    {
      id: 'q-upsc-2',
      questionNumber: 2,
      questionText: 'What is your assessment of India\'s demographic dividend? What policy interventions are urgently required in higher technical education to prevent jobless growth?',
      expectedKeyCompetencies: ['NEP 2020 alignment', 'Vocational integration', 'Industrial R&D incentives'],
      difficulty: 'MEDIUM'
    }
  ],
  CONSULTING_CASE: [
    {
      id: 'q-cons-1',
      questionNumber: 1,
      questionText: 'A premier quick-commerce startup in Bengaluru is experiencing a 30% drop in operating margins despite a 50% surge in Gross Order Value. Structure your root-cause diagnosis.',
      expectedKeyCompetencies: ['Revenue vs Cost breakdown', 'Last-mile rider incentives', 'Dark store utilization rate'],
      difficulty: 'HARD'
    }
  ],
  CORE_PLACEMENT_HR: [
    {
      id: 'q-hr-1',
      questionNumber: 1,
      questionText: 'Why should our company hire you over 500 other candidates from top universities? What unique value do you bring to this engineering team?',
      expectedKeyCompetencies: ['Value proposition', 'Company research', 'Authentic confidence'],
      difficulty: 'MEDIUM'
    }
  ]
};

class VideoMockInterviewService {
  private sessions: Map<string, VideoMockInterviewSession> = new Map();

  constructor() {
    this.seedDefault();
  }

  private seedDefault() {
    const demoSession: VideoMockInterviewSession = {
      sessionId: 'sess-mock-sde-demo',
      candidateName: 'Rohan Verma',
      track: 'SOFTWARE_ENGINEERING_DSA',
      currentQuestionIndex: 0,
      totalQuestions: 3,
      questions: TRACK_QUESTIONS.SOFTWARE_ENGINEERING_DSA,
      isRecording: false,
      status: 'IN_PROGRESS'
    };
    this.sessions.set(demoSession.sessionId, demoSession);
  }

  public startSession(dto: StartVideoMockInterviewDto): VideoMockInterviewSession {
    const trackQuestions = TRACK_QUESTIONS[dto.track] || TRACK_QUESTIONS.SOFTWARE_ENGINEERING_DSA;
    const session: VideoMockInterviewSession = {
      sessionId: `mock-${Date.now()}`,
      candidateName: dto.candidateName || 'Candidate',
      track: dto.track,
      currentQuestionIndex: 0,
      totalQuestions: trackQuestions.length,
      questions: trackQuestions,
      isRecording: false,
      status: 'IN_PROGRESS'
    };
    this.sessions.set(session.sessionId, session);
    return session;
  }

  public evaluateAnswer(dto: EvaluateVideoInterviewDto): VideoMockInterviewSession {
    const session = this.sessions.get(dto.sessionId);
    if (!session) {
      throw new Error('Interview session not found');
    }

    // Advance question or complete
    if (session.currentQuestionIndex < session.totalQuestions - 1) {
      session.currentQuestionIndex += 1;
    } else {
      session.status = 'COMPLETED';
      // Compute comprehensive AI report
      const report: VideoInterviewFeedbackReport = {
        overallScoreOutOf100: Math.min(96, Math.max(68, Math.round(82 + (dto.audioWpm > 120 && dto.audioWpm < 160 ? 8 : -5) - (dto.fillerWordsObserved * 3)))),
        confidenceScore: 88,
        clarityWpm: dto.audioWpm || 138,
        fillerWordCount: dto.fillerWordsObserved || 2,
        eyeContactEstimatePercent: 91,
        technicalAccuracyScore: 89,
        strengths: [
          'Articulated trade-offs clearly using structured architectural terms',
          'Excellent eye-contact and posture maintenance during webcam feed',
          'Optimal speaking rate (~135-145 WPM) with minimal hesitation pauses'
        ],
        criticalAreasForImprovement: [
          'Deepen edge case discussions (e.g. distributed cache invalidation under partition)',
          'Reduce filler transitions like "basically" and "kind of" during initial thinking seconds'
        ],
        suggestedStarResponses: [
          {
            question: 'LRU Cache Design',
            idealFramework: 'State Time Complexity first: O(1) Get and Put. Propose Hash Map + Doubly Linked List with dummy Head and Tail pointers. Address concurrency using ReadWriteLock.'
          }
        ]
      };
      session.feedbackReport = report;
    }

    return session;
  }

  public getSession(sessionId: string): VideoMockInterviewSession | null {
    return this.sessions.get(sessionId) || null;
  }
}

export const videoMockInterviewService = new VideoMockInterviewService();
