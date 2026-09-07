import {
  GroupVivaSession,
  StartSwarmSessionDto,
  PostSwarmQueryDto,
  SubmitVivaAnswerDto,
  StudyBuddyPeer,
  SwarmMessage,
} from '@studentlife/shared';

export class AiStudySwarmService {
  private defaultPeers: StudyBuddyPeer[] = [
    {
      id: 'peer-1',
      name: 'Arjun Verma',
      avatarEmoji: '⚡',
      persona: 'THEORY_ARCHITECT',
      specialty: 'First-principles proofs & deep conceptual scaffolding',
      confidenceLevel: 94,
    },
    {
      id: 'peer-2',
      name: 'Dr. Sarah Lin',
      avatarEmoji: '📐',
      persona: 'NUMERICAL_WIZARD',
      specialty: 'Edge-case math derivations, complexity bounds & calculus',
      confidenceLevel: 97,
    },
    {
      id: 'peer-3',
      name: 'Devon Vance',
      avatarEmoji: '🕵️',
      persona: 'SOCRATIC_SCEPTIC',
      specialty: 'Adversarial counter-examples & misconception auditing',
      confidenceLevel: 91,
    },
  ];

  private activeSessions: Map<string, GroupVivaSession> = new Map();

  constructor() {
    this.seedDefaultSession();
  }

  private seedDefaultSession() {
    const sessionId = 'swarm-default-01';
    const initialMessages: SwarmMessage[] = [
      {
        id: 'msg-1',
        senderId: 'peer-1',
        senderName: 'Arjun Verma (Theory)',
        senderRole: 'PEER',
        content: 'Welcome to our collaborative study circle! Let’s break down "Distributed Consensus & Raft vs Paxos" into its core state transitions.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: 'msg-2',
        senderId: 'peer-2',
        senderName: 'Dr. Sarah Lin (Numericals)',
        senderRole: 'PEER',
        content: 'Mathematically, quorum safety requires majority overlap: Q1 ∩ Q2 ≠ ∅. For N nodes, we need strictly floor(N/2)+1 nodes.',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        mathSnippet: 'Quorum Condition: |Q_1 \\cap Q_2| \\ge 1 \\implies f < \\frac{N}{2}',
      },
      {
        id: 'msg-3',
        senderId: 'peer-3',
        senderName: 'Devon Vance (Sceptic)',
        senderRole: 'PEER',
        content: 'Careful! What happens during a network split where the old leader is isolated in a minority partition? Does it still accept writes?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: 'msg-prof',
        senderId: 'prof-1',
        senderName: 'Prof. K. Subramaniam (Examiner)',
        senderRole: 'PROFESSOR',
        content: 'Viva Question for Candidate: Explain the Split-Brain scenario in Raft and how term numbers prevent stale leaders from committing log entries.',
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      },
    ];

    this.activeSessions.set(sessionId, {
      id: sessionId,
      subjectTopic: 'Distributed Systems: Raft Consensus & Byzantine Fault Tolerance',
      peers: this.defaultPeers,
      messages: initialMessages,
      currentQuestion: 'Explain the Split-Brain scenario in Raft and how term numbers prevent stale leaders from committing log entries.',
      isActive: true,
    });
  }

  async getSession(sessionId: string): Promise<GroupVivaSession> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      // return default
      return Array.from(this.activeSessions.values())[0];
    }
    return session;
  }

  async startSession(dto: StartSwarmSessionDto): Promise<GroupVivaSession> {
    const sessionId = `swarm-${Date.now()}`;
    const initialTopic = dto.subjectTopic.trim();

    const welcomeMsg: SwarmMessage = {
      id: `msg-${Date.now()}-1`,
      senderId: 'peer-1',
      senderName: 'Arjun Verma (Theory)',
      senderRole: 'PEER',
      content: `Let's tackle "${initialTopic}" together! I will help formulate the theoretical principles while Sarah handles numeric bounds.`,
      timestamp: new Date().toISOString(),
    };

    const profQuestion: SwarmMessage = {
      id: `msg-${Date.now()}-2`,
      senderId: 'prof-1',
      senderName: 'Prof. K. Subramaniam (Examiner)',
      senderRole: 'PROFESSOR',
      content: `Viva Examination Question: State the primary objective, boundary constraints, and asymptotic trade-offs of ${initialTopic}.`,
      timestamp: new Date(Date.now() + 500).toISOString(),
    };

    const newSession: GroupVivaSession = {
      id: sessionId,
      subjectTopic: initialTopic,
      peers: this.defaultPeers,
      messages: [welcomeMsg, profQuestion],
      currentQuestion: `State the primary objective, boundary constraints, and asymptotic trade-offs of ${initialTopic}.`,
      isActive: true,
    };

    this.activeSessions.set(sessionId, newSession);
    return newSession;
  }

  async postQuery(dto: PostSwarmQueryDto): Promise<GroupVivaSession> {
    const session = await this.getSession(dto.sessionId);

    // User Message
    const userMsg: SwarmMessage = {
      id: `msg-${Date.now()}-u`,
      senderId: 'student-curr',
      senderName: 'You (Candidate)',
      senderRole: 'STUDENT',
      content: dto.questionOrDoubt,
      timestamp: new Date().toISOString(),
    };

    // Autonomous Peer Responses
    const peer1Response: SwarmMessage = {
      id: `msg-${Date.now()}-p1`,
      senderId: 'peer-1',
      senderName: 'Arjun Verma (Theory)',
      senderRole: 'PEER',
      content: `Great angle! Fundamentally regarding "${dto.questionOrDoubt}", the core mechanism relies on invariant preservation across state machine replication.`,
      timestamp: new Date(Date.now() + 600).toISOString(),
    };

    const peer2Response: SwarmMessage = {
      id: `msg-${Date.now()}-p2`,
      senderId: 'peer-2',
      senderName: 'Dr. Sarah Lin (Numericals)',
      senderRole: 'PEER',
      content: `To quantify this: the convergence rate upper bound is bounded by O(log N) RPC round trips under synchronous broadcast.`,
      timestamp: new Date(Date.now() + 1200).toISOString(),
      mathSnippet: '\\mathbb{E}[T_{\\text{election}}] = \\mathcal{O}(\\log N) \\cdot t_{\\text{timeout}}',
    };

    session.messages.push(userMsg, peer1Response, peer2Response);
    return session;
  }

  async submitVivaAnswer(dto: SubmitVivaAnswerDto): Promise<GroupVivaSession> {
    const session = await this.getSession(dto.sessionId);
    const answerLen = dto.studentAnswer.trim().length;

    const score = Math.min(98, Math.max(68, Math.round(70 + (answerLen / 15))));
    const critique = score > 85
      ? 'Outstanding analytical rigor! You clearly distinguished term-based leadership epochs and majority heartbeat acknowledgement.'
      : 'Solid foundational grasp, though you should more explicitly quantify the quorum intersection theorem and candidate election timeouts.';

    const missedPoints = [
      'Mention of Randomized Election Timeouts (150ms–300ms) to prevent split votes',
      'Log Matching Invariant: entries with matching index & term share identical prior history',
    ];

    const grade = {
      scorePercent: score,
      critique,
      missedPoints,
      awardedXp: 45,
    };

    const evalMsg: SwarmMessage = {
      id: `msg-${Date.now()}-eval`,
      senderId: 'prof-1',
      senderName: 'Prof. K. Subramaniam (Examiner)',
      senderRole: 'PROFESSOR',
      content: `Viva Evaluation Result: Score ${score}% / 100%. ${critique}`,
      timestamp: new Date().toISOString(),
    };

    session.studentAnswerGrade = grade;
    session.messages.push(evalMsg);
    return session;
  }
}

export const aiStudySwarmService = new AiStudySwarmService();
