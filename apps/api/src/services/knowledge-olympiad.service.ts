import {
  OlympiadMatchState,
  SubmitOlympiadAnswerDto
} from '@studentlife/shared';

export class KnowledgeOlympiadService {
  private activeMatches: Map<string, OlympiadMatchState> = new Map();

  constructor() {
    this.seedDefault();
  }

  private seedDefault() {
    const defaultMatch: OlympiadMatchState = {
      matchId: 'olympiad-match-80',
      league: 'GRANDMASTER',
      playerCollege: 'IIT Bombay (CSE)',
      opponentCollege: 'MIT EECS (Quantum & Systems)',
      playerScore: 240,
      opponentScore: 210,
      playerElo: 2185,
      opponentElo: 2150,
      currentQuestionIndex: 0,
      totalQuestions: 4,
      matchStatus: 'LIVE_BUZZER_ACTIVE',
      questions: [
        {
          id: 'q1',
          category: 'Quantum Computing & Algorithms',
          questionText: 'What is the theoretical quantum speedup achieved by Grover\'s search algorithm over classical unstructured search?',
          options: ['Linear O(N)', 'Quadratic O(√N)', 'Exponential O(2^N)', 'Logarithmic O(log N)'],
          correctIndex: 1,
          points: 100
        },
        {
          id: 'q2',
          category: 'Distributed Systems & Consensus',
          questionText: 'In the Raft consensus algorithm, under what condition can a leader commit a log entry from a previous term?',
          options: [
            'As soon as a majority receives it',
            'Only by committing an entry from its current term that covers it',
            'Immediately upon receiving client ACK',
            'After two full heartbeats without partition'
          ],
          correctIndex: 1,
          points: 120
        },
        {
          id: 'q3',
          category: 'Biophysics & Protein Folding',
          questionText: 'Which mathematical invariant characterizes topological knotting in AlphaFold-predicted peptide backbones?',
          options: ['Alexander Polynomial', 'Betti Numbers', 'Winding Number Index', 'Euler Characteristic'],
          correctIndex: 0,
          points: 140
        },
        {
          id: 'q4',
          category: 'Advanced Linear Algebra',
          questionText: 'For any real matrix A, the non-zero singular values of A are equal to the square roots of the non-zero eigenvalues of which matrix?',
          options: ['A + A^T', 'A^T A', 'det(A) · I', 'A^2'],
          correctIndex: 1,
          points: 110
        }
      ]
    };

    this.activeMatches.set(defaultMatch.matchId, defaultMatch);
  }

  public getMatchState(matchId: string = 'olympiad-match-80'): OlympiadMatchState {
    return this.activeMatches.get(matchId) || Array.from(this.activeMatches.values())[0];
  }

  public submitAnswer(dto: SubmitOlympiadAnswerDto): OlympiadMatchState {
    const match = this.activeMatches.get(dto.matchId) || Array.from(this.activeMatches.values())[0];
    const currentQ = match.questions[match.currentQuestionIndex];

    if (currentQ && dto.selectedOptionIndex === currentQ.correctIndex) {
      // Bonus points for fast buzzer (< 1500ms)
      const speedBonus = dto.buzzerTimeMs < 1500 ? 30 : 0;
      match.playerScore += currentQ.points + speedBonus;
      match.playerElo += 12;
    } else {
      match.playerElo = Math.max(1200, match.playerElo - 8);
    }

    // Advance question or conclude
    if (match.currentQuestionIndex < match.totalQuestions - 1) {
      match.currentQuestionIndex += 1;
      match.matchStatus = 'LIVE_BUZZER_ACTIVE';
    } else {
      match.matchStatus = 'MATCH_CONCLUDED';
    }

    return match;
  }
}

export const knowledgeOlympiadService = new KnowledgeOlympiadService();
