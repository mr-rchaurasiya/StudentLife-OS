import {
  SpeedReaderSession,
  StartSpeedReaderDto,
  RsvpWordToken,
} from '@studentlife/shared';

export class SpeedReaderService {
  private sessions: Map<string, SpeedReaderSession> = new Map();

  constructor() {
    this.seedDefaultSession();
  }

  private seedDefaultSession() {
    const text = `Distributed systems achieve resilience through consensus algorithms like Raft and Paxos. By decoupling leader election from log replication, modern cloud databases ensure high availability even during network partitions. Asymptotic analysis guarantees that quorum intersection eliminates split-brain anomalies under synchronous bounds.`;
    const tokens = this.tokenizeText(text);

    const defaultSession: SpeedReaderSession = {
      id: 'session-default-01',
      documentTitle: 'Principles of Fault-Tolerant Distributed Consensus',
      targetWpm: 450,
      tokens,
      totalWords: tokens.length,
      comprehensionQuiz: [
        {
          question: 'What mechanism prevents split-brain anomalies in distributed consensus?',
          options: [
            'Quorum intersection of majority nodes',
            'Asynchronous leader-less round robin',
            'Hardware watchdog resets only',
            'Single-node serialized locking',
          ],
          correctOptionIndex: 0,
        },
        {
          question: 'What is decoupled in the Raft consensus algorithm for resilience?',
          options: [
            'Leader election and log replication',
            'Data storage and RAM caching',
            'Network routing and DNS mapping',
            'Client authentication and SSL handshakes',
          ],
          correctOptionIndex: 0,
        },
      ],
    };

    this.sessions.set(defaultSession.id, defaultSession);
  }

  async getSession(sessionId: string): Promise<SpeedReaderSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return Array.from(this.sessions.values())[0];
    }
    return session;
  }

  async startSession(dto: StartSpeedReaderDto): Promise<SpeedReaderSession> {
    const sessionId = `rsvp-${Date.now()}`;
    const text = dto.rawArticleText.trim();
    const tokens = this.tokenizeText(text);

    const newSession: SpeedReaderSession = {
      id: sessionId,
      documentTitle: dto.documentTitle.trim(),
      targetWpm: dto.targetWpm || 450,
      tokens,
      totalWords: tokens.length,
      comprehensionQuiz: [
        {
          question: `What is the primary thesis described in "${dto.documentTitle}"?`,
          options: [
            'Foundational architectural principles and asymptotic trade-offs',
            'Hardware replacement guidelines',
            'Legacy mainframe configurations',
            'Monolithic file storage formats',
          ],
          correctOptionIndex: 0,
        },
      ],
    };

    this.sessions.set(sessionId, newSession);
    return newSession;
  }

  private tokenizeText(rawText: string): RsvpWordToken[] {
    const words = rawText.split(/\s+/).filter((w) => w.length > 0);
    return words.map((w) => {
      const len = w.length;
      // Optimal Recognition Point is typically at 30-35% into the word
      const orpIndex = Math.max(0, Math.floor((len - 1) * 0.35));
      const prefix = w.slice(0, orpIndex);
      const pivotChar = w.charAt(orpIndex);
      const suffix = w.slice(orpIndex + 1);

      return {
        word: w,
        orpIndex,
        prefix,
        pivotChar,
        suffix,
      };
    });
  }
}

export const speedReaderService = new SpeedReaderService();
