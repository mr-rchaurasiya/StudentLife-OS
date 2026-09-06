import {
  QuizBattleMatch,
  BattleQuestion,
  BattlePlayer,
  FindBattleMatchDto,
  SubmitBattleAnswerDto
} from '@studentlife/shared';

class QuizBattleService {
  private matches: Record<string, QuizBattleMatch> = {};

  private questionPool: Record<string, BattleQuestion[]> = {
    dsa: [
      {
        id: 'bq-dsa-1',
        questionText: 'What is the tight worst-case time complexity of Bellman-Ford single-source shortest path algorithm on a graph with V vertices and E edges?',
        options: ['O(V * E)', 'O((V + E) log V)', 'O(V^3)', 'O(E log V)'],
        correctIndex: 0,
        timeLimitSeconds: 15,
        points: 100,
        latexSnippet: 'O(V \\cdot E)',
        explanation: 'Bellman-Ford relaxes all E edges (V-1) times, yielding O(V * E) time.'
      },
      {
        id: 'bq-dsa-2',
        questionText: 'Which data structure is primarily utilized in implementing Kahn\'s Algorithm for Topological Sort?',
        options: ['Min-Heap', 'Queue / Deque + In-degree array', 'Disjoint Set Union (DSU)', 'Red-Black Tree'],
        correctIndex: 1,
        timeLimitSeconds: 15,
        points: 100,
        explanation: 'Kahn algorithm uses in-degree tracking array and a Queue to process 0 in-degree nodes.'
      },
      {
        id: 'bq-dsa-3',
        questionText: 'What is the space complexity of counting connected components in an undirected graph with N nodes using Disjoint Set Union (DSU) with path compression?',
        options: ['O(N^2)', 'O(N)', 'O(N log N)', 'O(1)'],
        correctIndex: 1,
        timeLimitSeconds: 15,
        points: 100,
        latexSnippet: 'O(N) \\text{ space for parent and rank arrays}',
        explanation: 'DSU requires two arrays of size N: parent[] and rank[], giving O(N) auxiliary space.'
      }
    ],
    jee: [
      {
        id: 'bq-jee-1',
        questionText: 'A solid cylinder and a hollow cylinder of identical mass and radius roll down an inclined plane without slipping from rest. Which reaches the bottom first?',
        options: ['Solid Cylinder', 'Hollow Cylinder', 'Both at identical time', 'Depends on inclination angle'],
        correctIndex: 0,
        timeLimitSeconds: 15,
        points: 100,
        latexSnippet: 'a = \\frac{g \\sin \\theta}{1 + I / MR^2}',
        explanation: 'Solid cylinder has smaller moment of inertia (0.5 MR^2 vs MR^2), resulting in higher linear acceleration.'
      },
      {
        id: 'bq-jee-2',
        questionText: 'What is the value of definite integral \\int_{-\\pi/2}^{\\pi/2} \\sin^5(x) \\cos^2(x) \\, dx ?',
        options: ['0', '2/35', '1', '\\pi / 4'],
        correctIndex: 0,
        timeLimitSeconds: 15,
        points: 100,
        latexSnippet: 'f(-x) = -f(x) \\implies \\int_{-a}^{a} f(x) dx = 0',
        explanation: 'The integrand is an Odd Function: sin^5(-x) = -sin^5(x). Integral across symmetric bounds is exactly 0.'
      }
    ],
    upsc: [
      {
        id: 'bq-upsc-1',
        questionText: 'Under which Article of the Indian Constitution does the Supreme Court have the power to issue writs for enforcement of Fundamental Rights?',
        options: ['Article 32', 'Article 226', 'Article 143', 'Article 131'],
        correctIndex: 0,
        timeLimitSeconds: 15,
        points: 100,
        explanation: 'Article 32 gives the Right to Constitutional Remedies under Supreme Court jurisdiction.'
      },
      {
        id: 'bq-upsc-2',
        questionText: 'Which Constitutional Amendment Act reduced the voting age in India from 21 years to 18 years?',
        options: ['61st Amendment (1988)', '42nd Amendment (1976)', '44th Amendment (1978)', '73rd Amendment (1992)'],
        correctIndex: 0,
        timeLimitSeconds: 15,
        points: 100,
        explanation: 'The 61st Constitutional Amendment Act 1988 lowered the voting age for Lok Sabha and Assemblies from 21 to 18.'
      }
    ]
  };

  private simulatedOpponents: BattlePlayer[] = [
    {
      id: 'bot-1',
      name: 'Karan Patel',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      college: 'IIT Bombay (CSE)',
      score: 0,
      streakCombo: 0,
      isAnswered: false
    },
    {
      id: 'bot-2',
      name: 'Shreya Iyer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      college: 'AIIMS New Delhi',
      score: 0,
      streakCombo: 0,
      isAnswered: false
    },
    {
      id: 'bot-3',
      name: 'Aditya Rao',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      college: 'BITS Pilani',
      score: 0,
      streakCombo: 0,
      isAnswered: false
    }
  ];

  public findMatch(dto: FindBattleMatchDto): QuizBattleMatch {
    const subjectKey = dto.subject?.toLowerCase().includes('jee') || dto.subject?.toLowerCase().includes('physics')
      ? 'jee'
      : dto.subject?.toLowerCase().includes('upsc') || dto.subject?.toLowerCase().includes('polity')
      ? 'upsc'
      : 'dsa';

    const questions = this.questionPool[subjectKey] || this.questionPool.dsa;
    const opponent = this.simulatedOpponents[Math.floor(Math.random() * this.simulatedOpponents.length)];

    const matchId = `match-${Date.now()}`;
    const match: QuizBattleMatch = {
      id: matchId,
      subject: dto.subject || 'Algorithms & Problem Solving',
      topic: 'Live 1v1 Speed Duel',
      roundNumber: 1,
      totalRounds: questions.length,
      status: 'IN_BATTLE',
      currentQuestionIndex: 0,
      questions,
      player1: {
        id: dto.user?.id || 'player-user',
        name: dto.user?.name || 'You',
        avatar: dto.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        college: dto.user?.college || 'StudentLife Scholar',
        score: 0,
        streakCombo: 0,
        isAnswered: false
      },
      player2: {
        ...opponent,
        score: 0,
        streakCombo: 0,
        isAnswered: false
      },
      xpWager: dto.xpWager || 50,
      xpReward: (dto.xpWager || 50) * 2
    };

    this.matches[matchId] = match;
    return match;
  }

  public submitAnswer(dto: SubmitBattleAnswerDto): QuizBattleMatch | undefined {
    const match = this.matches[dto.matchId];
    if (!match) return undefined;

    const currentQ = match.questions[dto.questionIndex];
    if (!currentQ) return match;

    const isCorrect = dto.answerIndex === currentQ.correctIndex;
    const speedBonus = Math.max(0, Math.round((currentQ.timeLimitSeconds - dto.timeTakenSeconds) * 8));

    // Update Player 1
    if (isCorrect) {
      const comboMultiplier = match.player1.streakCombo + 1;
      match.player1.streakCombo += 1;
      match.player1.score += currentQ.points + speedBonus + (comboMultiplier > 1 ? comboMultiplier * 30 : 0);
    } else {
      match.player1.streakCombo = 0;
    }
    match.player1.isAnswered = true;
    match.player1.currentAnswerIndex = dto.answerIndex;
    match.player1.timeTakenSeconds = dto.timeTakenSeconds;

    // Simulate Opponent answer (80% accuracy)
    const opponentCorrect = Math.random() < 0.8;
    const opponentTime = Math.floor(Math.random() * 8) + 3;
    if (opponentCorrect) {
      match.player2.streakCombo += 1;
      match.player2.score += currentQ.points + Math.max(0, (currentQ.timeLimitSeconds - opponentTime) * 6);
      match.player2.currentAnswerIndex = currentQ.correctIndex;
    } else {
      match.player2.streakCombo = 0;
      match.player2.currentAnswerIndex = (currentQ.correctIndex + 1) % currentQ.options.length;
    }
    match.player2.isAnswered = true;
    match.player2.timeTakenSeconds = opponentTime;

    // Check if match completed or next question
    if (dto.questionIndex + 1 >= match.totalRounds) {
      match.status = 'MATCH_FINISHED';
      match.winnerId = match.player1.score >= match.player2.score ? match.player1.id : match.player2.id;
    } else {
      match.status = 'ROUND_SUMMARY';
    }

    return match;
  }

  public nextRound(matchId: string): QuizBattleMatch | undefined {
    const match = this.matches[matchId];
    if (!match) return undefined;

    match.currentQuestionIndex += 1;
    match.roundNumber += 1;
    match.status = 'IN_BATTLE';
    match.player1.isAnswered = false;
    match.player2.isAnswered = false;
    delete match.player1.currentAnswerIndex;
    delete match.player2.currentAnswerIndex;

    return match;
  }
}

export const quizBattleService = new QuizBattleService();
