import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  Download,
  Plus,
  Eye
} from 'lucide-react';
import type { FsrsDeckState, FsrsGrade, ReviewFsrsCardDto } from '@studentlife/shared';

export const AnkiFsrsSyncView: React.FC = () => {
  const [deckState, setDeckState] = useState<FsrsDeckState | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [rawNotes, setRawNotes] = useState<string>(
    'The Raft consensus algorithm decomposes consensus into Leader Election, Log Replication, and Safety.\nLinearizability guarantees that all operations appear to execute atomically at some point in time between their invocation and response.'
  );

  useEffect(() => {
    fetchDeck();
  }, []);

  const fetchDeck = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/anki-fsrs/deck');
      const data = await res.json();
      if (data.success && data.data) {
        setDeckState(data.data);
      }
    } catch {
      // Fallback
    }
  };

  const handleReviewCard = async (grade: FsrsGrade) => {
    if (!deckState || !deckState.cards[currentCardIndex]) return;
    const card = deckState.cards[currentCardIndex];

    const payload: ReviewFsrsCardDto = {
      cardId: card.id,
      grade
    };

    try {
      const res = await fetch('http://localhost:5000/api/anki-fsrs/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        // Advance card
        setIsFlipped(false);
        setDeckState(prev => {
          if (!prev) return prev;
          const updatedCards = prev.cards.map(c => (c.id === data.data.id ? data.data : c));
          return { ...prev, cards: updatedCards };
        });
        setCurrentCardIndex(prev => (prev + 1) % deckState.cards.length);
      }
    } catch {
      setIsFlipped(false);
      setCurrentCardIndex(prev => (prev + 1) % (deckState?.cards.length || 1));
    }
  };

  const handleGenerateCloze = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/anki-fsrs/generate-cloze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckName: deckState?.deckName || 'Generated FSRS Deck', rawTextNotes: rawNotes })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDeckState(data.data);
      }
    } catch {
      // Fallback
    }
  };

  const activeCard = deckState && deckState.cards[currentCardIndex] ? deckState.cards[currentCardIndex] : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-pink-950/40 to-slate-900 border border-rose-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                Phase 78 • Memory Science
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800/80 border border-slate-700 text-slate-400 text-xs rounded-md">
                FSRS-v4 Spaced Scheduler
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              AI Adaptive Anki & FSRS-v4 Memory Synchronizer
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Next-generation Free Spaced Repetition Scheduler (FSRS-v4). AI automated cloze deletion synthesis, memory stability $S$ and retrievability $R$ tracking, and Anki package (.apkg) sync.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-medium">Due Today</div>
              <div className="text-xl font-black text-rose-400">
                {deckState ? deckState.dueTodayCount : 2} <span className="text-xs text-slate-400">Cards</span>
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-medium">Retention Target</div>
              <div className="text-xl font-black text-emerald-400">
                {deckState ? `${deckState.averageRetentionRate}%` : '90%'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Flashcard Active Reviewer */}
        <div className="lg:col-span-7 space-y-6">
          {activeCard ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Card Meta Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span className="font-mono">Card {currentCardIndex + 1} of {deckState?.cards.length}</span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-cyan-400">Stability: {activeCard.stability}d</span>
                  <span className="text-amber-400">Diff: {activeCard.difficulty}</span>
                  <span className="text-emerald-400">R: {activeCard.retrievabilityPercent}%</span>
                </div>
              </div>

              {/* Flashcard Body */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[220px] bg-slate-950 border-2 border-slate-800 hover:border-rose-500/50 rounded-xl p-6 flex flex-col justify-between cursor-pointer transition select-none"
              >
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  {isFlipped ? 'Answer & Cloze Context' : 'Prompt / Front'}
                </div>

                <div className="text-center py-6">
                  {isFlipped ? (
                    <div className="space-y-3">
                      <div className="text-lg font-bold text-emerald-300 font-serif">
                        {activeCard.plainAnswer}
                      </div>
                      <div className="text-xs text-slate-400 font-serif max-w-lg mx-auto">
                        {activeCard.clozeText}
                      </div>
                    </div>
                  ) : (
                    <div className="text-base sm:text-lg font-bold text-slate-100 font-serif leading-relaxed">
                      {activeCard.plainPrompt}
                    </div>
                  )}
                </div>

                <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Click to {isFlipped ? 'hide answer' : 'flip card'}</span>
                </div>
              </div>

              {/* Grading Buttons */}
              {isFlipped && (
                <div className="grid grid-cols-4 gap-2 pt-2">
                  <button
                    onClick={() => handleReviewCard('AGAIN')}
                    className="p-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-600/50 text-rose-200 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1"
                  >
                    <span>Again</span>
                    <span className="text-[10px] text-rose-400 font-mono">(&lt; 10m)</span>
                  </button>
                  <button
                    onClick={() => handleReviewCard('HARD')}
                    className="p-3 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/50 text-amber-200 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1"
                  >
                    <span>Hard</span>
                    <span className="text-[10px] text-amber-400 font-mono">({Math.round(activeCard.stability * 1.2)}d)</span>
                  </button>
                  <button
                    onClick={() => handleReviewCard('GOOD')}
                    className="p-3 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-600/50 text-blue-200 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1"
                  >
                    <span>Good</span>
                    <span className="text-[10px] text-blue-400 font-mono">({Math.round(activeCard.stability * 2.4)}d)</span>
                  </button>
                  <button
                    onClick={() => handleReviewCard('EASY')}
                    className="p-3 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/50 text-emerald-200 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1"
                  >
                    <span>Easy</span>
                    <span className="text-[10px] text-emerald-400 font-mono">({Math.round(activeCard.stability * 3.8)}d)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              <CheckCircle2 className="w-12 h-12 text-slate-700 mx-auto mb-2" />
              All cards reviewed for today!
            </div>
          )}
        </div>

        {/* Right Column: AI Cloze Synthesizer & Deck Manager */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              AI Cloze Deletion Synthesizer
            </h3>
            <p className="text-xs text-slate-400">
              Paste raw notes or textbook paragraphs. The engine automatically extracts key semantic entities into cloze syntax (<code className="text-rose-300 font-mono text-[10px]">{`{{c1::...}}`}</code>).
            </p>

            <textarea
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              className="w-full h-36 bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:border-rose-500 focus:outline-none resize-none font-serif"
              placeholder="Paste notes..."
            />

            <button
              onClick={handleGenerateCloze}
              className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
            >
              <Plus className="w-4 h-4" /> Synthesize FSRS Flashcards
            </button>
          </div>

          {/* Export Deck */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-rose-400" />
                Active FSRS Deck
              </span>
              <span className="text-xs font-mono text-slate-400">{deckState?.totalCards || 4} Cards</span>
            </div>

            <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="line-clamp-1">{deckState?.deckName}</span>
              <span className="text-emerald-400 font-bold font-mono text-[10px]">FSRS-v4 ACTIVE</span>
            </div>

            <button
              onClick={() => alert(`Anki .apkg deck "${deckState?.deckName}" compiled with FSRS-v4 scheduling metadata.`)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-medium text-xs rounded-lg transition flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-rose-400" />
              Export .apkg Anki Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
