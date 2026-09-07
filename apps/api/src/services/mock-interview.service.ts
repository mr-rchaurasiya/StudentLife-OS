import {
  MockInterviewSession,
  StartInterviewDto,
  SubmitInterviewResponseDto,
  InterviewAnswerEvaluation,
  InterviewTrack
} from '@studentlife/shared';

export class MockInterviewService {
  private sessions: Map<string, MockInterviewSession> = new Map();

  public startSession(dto: StartInterviewDto): MockInterviewSession {
    const sessionId = `interview-${Date.now()}`;
    const questions = this.generateQuestionsForTrack(dto.track);

    const session: MockInterviewSession = {
      id: sessionId,
      track: dto.track,
      candidateName: dto.candidateName || 'Student Aspirant',
      currentQuestionIndex: 0,
      questions,
      evaluations: [],
      isCompleted: false,
      totalScore: 0,
      createdAt: new Date().toISOString()
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  public submitResponse(dto: SubmitInterviewResponseDto): { session: MockInterviewSession; evaluation: InterviewAnswerEvaluation } {
    const session = this.sessions.get(dto.sessionId);
    if (!session) throw new Error('Interview session not found');

    const question = session.questions.find(q => q.id === dto.questionId);
    if (!question) throw new Error('Question not found');

    const answer = dto.spokenAnswer.trim();
    const wordCount = answer.split(/\s+/).length;

    // Evaluate STAR & depth
    const hasStructure = wordCount > 25;
    const hasKeywords = question.hintKeywords.some(kw => answer.toLowerCase().includes(kw.toLowerCase()));

    const situationScore = hasStructure ? 22 : 14;
    const taskScore = hasKeywords ? 23 : 15;
    const actionScore = hasStructure && hasKeywords ? 24 : 16;
    const resultScore = wordCount > 40 ? 21 : 12;

    const overallScore = Math.min(98, situationScore + taskScore + actionScore + resultScore);

    const evaluation: InterviewAnswerEvaluation = {
      questionId: dto.questionId,
      userSpeechAnswer: answer,
      overallScore,
      clarityScore: Math.min(100, Math.round(overallScore * 1.05)),
      starMethodScore: {
        situation: situationScore,
        task: taskScore,
        action: actionScore,
        result: resultScore
      },
      strengths: [
        'Good structured opening statement',
        hasKeywords ? 'Used exact industry-standard keywords and domain terms' : 'Communicated core objective clearly',
        'Professional tone and clear articulation'
      ],
      improvements: [
        wordCount < 40 ? 'Elaborate more on the quantitative Result (e.g. % performance gain or concrete outcome)' : 'Include potential edge-case trade-offs',
        'State any alternative technical architecture you considered'
      ],
      suggestedAnswer: `Ideal Response Benchmark: "In my recent project, the Situation was handling high concurrency. My Task was optimizing latency below 50ms. I took Action by implementing a Redis Cache-Aside pattern and Sharded database queries. As a Result, throughput surged by 40% with zero downtime."`
    };

    session.evaluations.push(evaluation);
    session.currentQuestionIndex += 1;

    if (session.currentQuestionIndex >= session.questions.length) {
      session.isCompleted = true;
      const total = session.evaluations.reduce((acc, ev) => acc + ev.overallScore, 0);
      session.totalScore = Math.round(total / session.evaluations.length);
    }

    return { session, evaluation };
  }

  public getSessionById(id: string): MockInterviewSession | undefined {
    return this.sessions.get(id);
  }

  private generateQuestionsForTrack(track: InterviewTrack) {
    switch (track) {
      case 'SDE_TECH':
        return [
          {
            id: 'q-sde-1',
            questionNumber: 1,
            category: 'Data Structures & Algorithms',
            questionText: 'Can you walk me through how you would design a system to detect cycles in a directed graph in O(V+E) time, and how you would prevent memory overhead?',
            hintKeywords: ['DFS', 'visited array', 'recursion stack', 'Kahn Algorithm', 'in-degree'],
            expectedPoints: ['Three-color DFS marking (WHITE, GRAY, BLACK)', 'Topological sort cycle detection']
          },
          {
            id: 'q-sde-2',
            questionNumber: 2,
            category: 'System Design & Distributed Caching',
            questionText: 'How would you handle cache stampede and thundering herd problem when a high-traffic celebrity profile updates on social media?',
            hintKeywords: ['Cache-aside', 'Mutex lock', 'Probabilistic early expiration (XFetch)', 'CDN stale-while-revalidate'],
            expectedPoints: ['Distributed locking with Redis Redlock', 'Background cron pre-warming']
          }
        ];

      case 'UPSC_PERSONALITY':
        return [
          {
            id: 'q-upsc-1',
            questionNumber: 1,
            category: 'Administrative Ethics & Governance',
            questionText: 'As a District Magistrate, you face public protests against a critical green infrastructure project due to displacement fears. How would you balance sustainable development with citizen rehabilitation?',
            hintKeywords: ['Public consultation', 'Transparent compensation', 'Social impact assessment', 'Gram Sabha consent'],
            expectedPoints: ['LARR Act provisions', 'Trust building through multi-stakeholder dialogue']
          },
          {
            id: 'q-upsc-2',
            questionNumber: 2,
            category: 'Constitutional Morality',
            questionText: 'Explain how the doctrine of Basic Structure preserves Constitutional Supremacy over Parliamentary Sovereignty in India.',
            hintKeywords: ['Kesavananda Bharati', 'Judicial Review', 'Article 368', 'Checks and balances'],
            expectedPoints: ['Harmonious interpretation of Fundamental Rights vs DPSPs']
          }
        ];

      default:
        return [
          {
            id: 'q-gen-1',
            questionNumber: 1,
            category: 'Core Engineering Principles',
            questionText: 'Tell me about a complex project you worked on, a major technical bug or design flaw you encountered, and how you systematically debugged it.',
            hintKeywords: ['Root cause analysis', 'Profiling', 'Trade-offs', 'STAR framework'],
            expectedPoints: ['Clear timeline and quantifiable outcome']
          }
        ];
    }
  }
}

export const mockInterviewService = new MockInterviewService();
