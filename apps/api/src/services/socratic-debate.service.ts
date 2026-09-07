import {
  DebateSession,
  StartDebateDto,
  SubmitArgumentDto,
  DebateScorecard
} from '@studentlife/shared';

export class SocraticDebateService {
  private static sessions: Record<string, DebateSession> = {
    'session-demo': {
      id: 'session-demo',
      topicMotion: 'Artificial General Intelligence Should Be Open-Sourced Without Centralized Licensing',
      persona: 'STRICT_EXAMINER',
      createdAt: new Date().toISOString(),
      isCompleted: false,
      turns: [
        {
          speaker: 'AI',
          content: 'I will be your adversarial examiner today. You claim AGI should be completely open-sourced. How do you address the existential proliferation risk where malicious actors fine-tune models for biological synthesis or automated zero-day cyber attacks without safeguards?',
          timestamp: '10:00 AM'
        }
      ]
    }
  };

  public static startDebate(dto: StartDebateDto): DebateSession {
    const newId = `session-${Date.now()}`;
    let openingChallenge = 'State your primary thesis and foundational premises with empirical evidence.';
    if (dto.persona === 'STRICT_EXAMINER') {
      openingChallenge = `Welcome to the examination board. Defend the motion: "${dto.topicMotion}". What is your strongest falsifiable argument against the mainstream consensus?`;
    } else if (dto.persona === 'SKEPTICAL_PEER') {
      openingChallenge = `I disagree with "${dto.topicMotion}". Let's see if your reasoning holds up. What is your primary premise?`;
    } else {
      openingChallenge = `Greetings, truth-seeker. Let us dialectically examine "${dto.topicMotion}". By what definitions and first principles do you construct this belief?`;
    }

    const session: DebateSession = {
      id: newId,
      topicMotion: dto.topicMotion,
      persona: dto.persona,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      turns: [
        {
          speaker: 'AI',
          content: openingChallenge,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    this.sessions[newId] = session;
    return session;
  }

  public static submitArgument(dto: SubmitArgumentDto): DebateSession {
    const session = this.sessions[dto.sessionId];
    if (!session) {
      throw new Error('Debate session not found');
    }

    // Analyze User Argument
    const userArg = dto.userArgument;
    let fallacy: string | undefined;
    let strength = 78;

    if (userArg.toLowerCase().includes('everyone knows') || userArg.toLowerCase().includes('obviously')) {
      fallacy = 'Appeal to Common Belief / Begging the Question';
      strength = 60;
    } else if (userArg.length > 80) {
      strength = 88;
    }

    session.turns.push({
      speaker: 'USER',
      content: userArg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fallacyDetected: fallacy,
      strengthScore: strength
    });

    // Generate Adversarial AI Rebuttal
    let aiRebuttal = `Interesting premise. However, consider the edge case where your assumption fails under asymmetric information or resource constraints. What mechanism prevents system failure then?`;
    if (session.turns.length >= 5) {
      session.isCompleted = true;
      const scorecard: DebateScorecard = {
        logicalCoherence: 86,
        evidenceWeight: 82,
        fallacyResistance: fallacy ? 74 : 92,
        persuasiveness: 88,
        overallScore: 87,
        summaryFeedback: 'Strong dialectical defense. You maintained core premises under adversarial pressure with good structural rigor.'
      };
      session.scorecard = scorecard;
      aiRebuttal = `We have reached the conclusion of our debate session. Your argumentation demonstrated high logical coherence and resilient counter-rebuttals. Review your formal debate scorecard below.`;
    }

    session.turns.push({
      speaker: 'AI',
      content: aiRebuttal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    return session;
  }

  public static getSession(id: string): DebateSession | null {
    return this.sessions[id] || null;
  }
}
