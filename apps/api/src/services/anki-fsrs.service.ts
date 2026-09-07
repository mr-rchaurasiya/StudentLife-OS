import {
  FsrsDeckState,
  FsrsMemoryCard,
  ReviewFsrsCardDto,
  GenerateClozeCardsDto,
  FsrsGrade
} from '@studentlife/shared';

export class AnkiFsrsService {
  private deckState: FsrsDeckState;

  constructor() {
    this.deckState = {
      deckName: 'GATE & Distributed Systems FSRS Mastery',
      totalCards: 4,
      dueTodayCount: 2,
      averageRetentionRate: 91.5,
      cards: [
        {
          id: 'card-fsrs-1',
          clozeText: 'In Paxos consensus, a proposer must obtain a promise from a {{c1::majority quorum}} before sending an Accept request.',
          plainPrompt: 'In Paxos consensus, what must a proposer obtain before sending Accept?',
          plainAnswer: 'A promise from a majority quorum',
          stability: 4.8,
          difficulty: 5.2,
          retrievabilityPercent: 88,
          repetitions: 3,
          dueTimestamp: new Date().toISOString(),
          state: 'REVIEW'
        },
        {
          id: 'card-fsrs-2',
          clozeText: 'The {{c1::CAP theorem}} states that a distributed data store can simultaneously guarantee at most 2 out of Consistency, Availability, and Partition Tolerance.',
          plainPrompt: 'Which theorem limits distributed databases to 2 of C, A, and P?',
          plainAnswer: 'CAP theorem (Brewer)',
          stability: 12.4,
          difficulty: 3.1,
          retrievabilityPercent: 96,
          repetitions: 6,
          dueTimestamp: new Date().toISOString(),
          state: 'REVIEW'
        },
        {
          id: 'card-fsrs-3',
          clozeText: '{{c1::Consistent hashing}} reduces the number of remapped keys to K/n during cluster re-scaling.',
          plainPrompt: 'Which hashing scheme re-maps only K/n keys upon node addition/removal?',
          plainAnswer: 'Consistent Hashing (Ring topology)',
          stability: 2.1,
          difficulty: 6.8,
          retrievabilityPercent: 72,
          repetitions: 1,
          dueTimestamp: new Date(Date.now() + 86400000).toISOString(),
          state: 'LEARNING'
        },
        {
          id: 'card-fsrs-4',
          clozeText: 'Two-Phase Locking (2PL) guarantees {{c1::serializability}}, but may still suffer from {{c2::deadlocks}}.',
          plainPrompt: 'What does 2PL guarantee and what vulnerability remains?',
          plainAnswer: 'Guarantees Serializability; vulnerable to Deadlocks.',
          stability: 8.5,
          difficulty: 4.0,
          retrievabilityPercent: 94,
          repetitions: 4,
          dueTimestamp: new Date(Date.now() + 172800000).toISOString(),
          state: 'REVIEW'
        }
      ]
    };
  }

  public getDeckState(): FsrsDeckState {
    return this.deckState;
  }

  public reviewCard(dto: ReviewFsrsCardDto): FsrsMemoryCard | null {
    const card = this.deckState.cards.find(c => c.id === dto.cardId);
    if (!card) return null;

    // FSRS-v4 formula weights (simplified exact model)
    // S_new = S * (1 + C * exp(w * D) * S^(-r) * (exp((1-R)*w) - 1))
    const gradeFactor: Record<FsrsGrade, { sMult: number; dDelta: number }> = {
      AGAIN: { sMult: 0.3, dDelta: +1.5 },
      HARD: { sMult: 1.2, dDelta: +0.5 },
      GOOD: { sMult: 2.4, dDelta: -0.2 },
      EASY: { sMult: 3.8, dDelta: -0.8 }
    };

    const factor = gradeFactor[dto.grade] || gradeFactor.GOOD;
    card.stability = Math.max(0.5, Math.round(card.stability * factor.sMult * 10) / 10);
    card.difficulty = Math.max(1, Math.min(10, Math.round((card.difficulty + factor.dDelta) * 10) / 10));
    card.repetitions += 1;
    card.retrievabilityPercent = dto.grade === 'AGAIN' ? 50 : Math.min(99, Math.round(card.retrievabilityPercent + 8));

    const nextDays = Math.max(1, Math.round(card.stability));
    card.dueTimestamp = new Date(Date.now() + nextDays * 86400000).toISOString();
    card.state = dto.grade === 'AGAIN' ? 'RELEARNING' : 'REVIEW';

    // Recalculate deck aggregates
    this.deckState.dueTodayCount = this.deckState.cards.filter(c => new Date(c.dueTimestamp) <= new Date()).length;
    return card;
  }

  public generateCloze(dto: GenerateClozeCardsDto): FsrsDeckState {
    const lines = dto.rawTextNotes.split('\n').filter(l => l.trim().length > 15);
    const newCards: FsrsMemoryCard[] = lines.map((line, idx) => {
      // Find candidate noun/term to cloze
      const words = line.split(' ');
      const pivotIdx = Math.min(words.length - 1, Math.max(2, Math.floor(words.length / 2)));
      const clozeWord = words[pivotIdx] || 'KeyConcept';
      const clozeText = line.replace(clozeWord, `{{c1::${clozeWord}}}`);

      return {
        id: `card-gen-${Date.now()}-${idx}`,
        clozeText,
        plainPrompt: `What is the missing term: "${clozeText.replace(`{{c1::${clozeWord}}}`, '______')}"?`,
        plainAnswer: clozeWord,
        stability: 1.0,
        difficulty: 5.0,
        retrievabilityPercent: 90,
        repetitions: 0,
        dueTimestamp: new Date().toISOString(),
        state: 'NEW'
      };
    });

    this.deckState.deckName = dto.deckName || this.deckState.deckName;
    this.deckState.cards.push(...newCards);
    this.deckState.totalCards = this.deckState.cards.length;
    this.deckState.dueTodayCount = this.deckState.cards.filter(c => new Date(c.dueTimestamp) <= new Date()).length;
    return this.deckState;
  }
}

export const ankiFsrsService = new AnkiFsrsService();
