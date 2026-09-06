import React, { useState, useEffect } from 'react';
import {
  QuizBattleMatch,
  BattleQuestion
} from '@studentlife/shared';
import {
  Swords,
  Flame,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  Zap,
  ArrowRight,
  Radio,
  Award
} from 'lucide-react';

interface QuizBattleArenaViewProps {
  onAddXp?: (xp: number, reason: string) => void;
  onNavigateView?: (view: string) => void;
}

export const QuizBattleArenaView: React.FC<QuizBattleArenaViewProps> = ({
  onAddXp
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'dsa' | 'jee' | 'upsc'>('dsa');
  const [xpWager, setXpWager] = useState<number>(50);
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [activeMatch, setActiveMatch] = useState<QuizBattleMatch | null>(null);

  // In-battle state
  const [secondsLeft, setSecondsLeft] = useState<number>(15);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [hasClaimedVictoryXp, setHasClaimedVictoryXp] = useState(false);

  // Timer effect during active round
  useEffect(() => {
    if (!activeMatch || activeMatch.status !== 'IN_BATTLE' || selectedAnswerIndex !== null) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Auto timeout submit
          handleAnswerSelect(-1, 15);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeMatch, selectedAnswerIndex]);

  const handleStartMatchmaking = async () => {
    setIsMatchmaking(true);
    setHasClaimedVictoryXp(false);

    try {
      const res = await fetch('/api/quiz-battle/find-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          xpWager,
          user: {
            name: 'You (Student)',
            college: 'StudentLife Scholar'
          }
        })
      });
      const data = await res.json();
      setTimeout(() => {
        setIsMatchmaking(false);
        if (data.success && data.data) {
          setActiveMatch(data.data);
          setSecondsLeft(15);
          setSelectedAnswerIndex(null);
        }
      }, 1200);
    } catch {
      setIsMatchmaking(false);
    }
  };

  const handleAnswerSelect = async (index: number, timeTaken?: number) => {
    if (!activeMatch || selectedAnswerIndex !== null) return;

    const time = timeTaken !== undefined ? timeTaken : 15 - secondsLeft;
    setSelectedAnswerIndex(index);

    try {
      const res = await fetch('/api/quiz-battle/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: activeMatch.id,
          playerId: activeMatch.player1.id,
          questionIndex: activeMatch.currentQuestionIndex,
          answerIndex: index,
          timeTakenSeconds: time
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActiveMatch(data.data);
      }
    } catch {
      // Fallback
    }
  };

  const handleNextRound = async () => {
    if (!activeMatch) return;

    try {
      const res = await fetch(`/api/quiz-battle/matches/${activeMatch.id}/next-round`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActiveMatch(data.data);
        setSecondsLeft(15);
        setSelectedAnswerIndex(null);
      }
    } catch {
      // Fallback
    }
  };

  const handleClaimVictoryReward = () => {
    if (!hasClaimedVictoryXp && activeMatch) {
      setHasClaimedVictoryXp(true);
      onAddXp?.(activeMatch.xpReward, `Won 1v1 Quiz Battle Duel: ${activeMatch.subject}`);
    }
  };

  const currentQ: BattleQuestion | undefined = activeMatch?.questions[activeMatch.currentQuestionIndex];

  // ----------------------------------------------------
  // VIEW: MATCHMAKING RADAR
  // ----------------------------------------------------
  if (isMatchmaking) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl animate-fadeIn">
        <div className="relative my-8">
          <div className="w-36 h-36 rounded-full border-4 border-indigo-500/30 animate-ping absolute inset-0" />
          <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-indigo-600/50">
            <Swords className="w-16 h-16 text-white animate-bounce" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">Finding Student Opponent in India...</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">
          Matching with peer in <strong>{selectedSubject.toUpperCase()}</strong> division for a {xpWager} XP stake duel.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-xs text-indigo-300 font-semibold border border-slate-700">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          Average wait time: &lt; 2 seconds
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: LIVE 1V1 BATTLE SCREEN
  // ----------------------------------------------------
  if (activeMatch && (activeMatch.status === 'IN_BATTLE' || activeMatch.status === 'ROUND_SUMMARY')) {
    const isRoundSummary = activeMatch.status === 'ROUND_SUMMARY';
    const isP1Correct = selectedAnswerIndex === currentQ?.correctIndex;

    return (
      <div className="space-y-6 animate-fadeIn pb-16">
        {/* Head-to-Head Top Score Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Player 1 (You) */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={activeMatch.player1.avatar}
                  alt={activeMatch.player1.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-lg"
                />
                {activeMatch.player1.streakCombo > 1 && (
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-[10px] font-black text-slate-950 flex items-center gap-0.5 shadow">
                    <Flame className="w-3 h-3 fill-slate-950" /> x{activeMatch.player1.streakCombo}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-white">{activeMatch.player1.name}</h3>
                  <span className="text-[10px] text-indigo-400 font-semibold">(You)</span>
                </div>
                <p className="text-xs text-slate-400">{activeMatch.player1.college}</p>
                <div className="text-xl font-black text-indigo-400 font-mono mt-0.5">
                  {activeMatch.player1.score} PTS
                </div>
              </div>
            </div>

            {/* VS Badge & Countdown */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="px-3 py-1 rounded-full bg-slate-800 text-[11px] font-bold text-slate-300 border border-slate-700 uppercase tracking-wider mb-2">
                Round {activeMatch.roundNumber} / {activeMatch.totalRounds}
              </div>

              {!isRoundSummary ? (
                <div className="flex items-center gap-2">
                  <Clock className={`w-5 h-5 ${secondsLeft <= 5 ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
                  <span className={`text-3xl font-black font-mono ${
                    secondsLeft <= 5 ? 'text-rose-400' : 'text-white'
                  }`}>
                    {secondsLeft}s
                  </span>
                </div>
              ) : (
                <span className="text-xs font-bold text-emerald-400 uppercase">Round Complete</span>
              )}
            </div>

            {/* Player 2 (Opponent) */}
            <div className="flex items-center justify-end gap-4 text-right">
              <div>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[10px] text-rose-400 font-semibold">(Opponent)</span>
                  <h3 className="text-base font-bold text-white">{activeMatch.player2.name}</h3>
                </div>
                <p className="text-xs text-slate-400">{activeMatch.player2.college}</p>
                <div className="text-xl font-black text-rose-400 font-mono mt-0.5">
                  {activeMatch.player2.score} PTS
                </div>
              </div>
              <div className="relative">
                <img
                  src={activeMatch.player2.avatar}
                  alt={activeMatch.player2.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-500 shadow-lg"
                />
                {activeMatch.player2.streakCombo > 1 && (
                  <span className="absolute -top-2 -left-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-[10px] font-black text-slate-950 flex items-center gap-0.5 shadow">
                    <Flame className="w-3 h-3 fill-slate-950" /> x{activeMatch.player2.streakCombo}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Linear Timer Bar */}
          {!isRoundSummary && (
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-6">
              <div
                className={`h-full transition-all duration-1000 ${
                  secondsLeft <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                }`}
                style={{ width: `${(secondsLeft / 15) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Question & 4 Interactive Options */}
        {currentQ && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                {activeMatch.subject}
              </span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> +{currentQ.points} Base PTS + Speed Bonus
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed">
              {currentQ.questionText}
            </h2>

            {currentQ.latexSnippet && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 font-mono text-xs text-indigo-300">
                <code>{currentQ.latexSnippet}</code>
              </div>
            )}

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelectedByUser = selectedAnswerIndex === idx;
                const isCorrectOption = currentQ.correctIndex === idx;
                const showResults = isRoundSummary || selectedAnswerIndex !== null;

                let btnStyle = 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/50 text-slate-200';
                if (showResults) {
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
                  } else if (isSelectedByUser) {
                    btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 ring-2 ring-rose-500/30';
                  } else {
                    btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedAnswerIndex !== null}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`p-4 rounded-2xl border text-left text-xs font-semibold transition-all duration-200 flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {showResults && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {showResults && isSelectedByUser && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Round Summary Card & Advance Action */}
            {isRoundSummary && (
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 animate-scaleUp">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isP1Correct ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> You answered correctly!
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Incorrect answer.
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{currentQ.explanation}</p>
                </div>

                <button
                  onClick={handleNextRound}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
                >
                  Next Round <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: FINAL MATCH VICTORY / DEFEAT SHOWCASE
  // ----------------------------------------------------
  if (activeMatch && activeMatch.status === 'MATCH_FINISHED') {
    const isWinner = activeMatch.winnerId === activeMatch.player1.id;

    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl animate-fadeIn space-y-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/40 animate-bounce">
          <Trophy className="w-12 h-12 text-slate-950" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Battle Result</span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-1">
            {isWinner ? '🎉 VICTORY! YOU WON THE DUEL!' : '⚡ DEFEAT! WELL FOUGHT!'}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Final Score: <strong>{activeMatch.player1.score} PTS</strong> vs {activeMatch.player2.score} PTS
          </p>
        </div>

        {/* Reward Claim */}
        {isWinner && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 max-w-sm w-full">
            <span className="text-xs font-bold text-amber-300">Reward: +{activeMatch.xpReward} XP</span>
            <button
              onClick={handleClaimVictoryReward}
              disabled={hasClaimedVictoryXp}
              className={`w-full mt-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                hasClaimedVictoryXp
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg'
              }`}
            >
              {hasClaimedVictoryXp ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              {hasClaimedVictoryXp ? 'XP Claimed ✓' : `Claim +${activeMatch.xpReward} XP`}
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setActiveMatch(null)}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
          >
            <RotateCcw className="w-4 h-4" /> Play Another Duel
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: ARENA LOBBY & DOMAIN SELECTOR
  // ----------------------------------------------------
  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <Swords className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              Phase 33 • 1v1 Peer Quiz Arena & Speed Battles
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Challenge Students in Live 1v1 Duels ⚔️
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Put your knowledge and speed to the test. Match with students across India in 60-second
              rapid-fire rounds, build combo streaks, and win XP stakes.
            </p>
          </div>
        </div>

        {/* Live Arena Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Duelers</span>
            <div className="text-xl font-bold text-rose-400 mt-0.5">142 Online</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Time Per Round</span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">15 Seconds</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Combo Multiplier</span>
            <div className="text-xl font-bold text-purple-400 mt-0.5">Up to x3 🔥</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Win Reward</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">2x XP Wager</div>
          </div>
        </div>
      </div>

      {/* Matchmaking Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Domain Cards */}
        {[
          {
            key: 'dsa' as const,
            title: 'Algorithms & Data Structures',
            desc: 'Graph algorithms, Tree DP, Big-O complexities, Bit manipulation',
            badge: 'GATE & FAANG',
            color: 'indigo'
          },
          {
            key: 'jee' as const,
            title: 'Calculus & JEE Physics',
            desc: 'Definite integrals, rotational mechanics, electromagnetism',
            badge: 'JEE Advanced',
            color: 'purple'
          },
          {
            key: 'upsc' as const,
            title: 'UPSC Polity & Constitution',
            desc: 'Constitutional amendments, articles, landmark judgments',
            badge: 'UPSC CSE GS-1',
            color: 'rose'
          }
        ].map((domain) => (
          <div
            key={domain.key}
            onClick={() => setSelectedSubject(domain.key)}
            className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
              selectedSubject === domain.key
                ? 'bg-gradient-to-b from-slate-900 to-rose-950/30 border-rose-500/60 shadow-xl shadow-rose-500/10 scale-[1.02]'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {domain.badge}
                </span>
                {selectedSubject === domain.key && (
                  <CheckCircle2 className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">{domain.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{domain.desc}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Round Format:</span>
              <strong className="text-rose-300">3 Rapid Questions</strong>
            </div>
          </div>
        ))}
      </div>

      {/* XP Stake & Match Launcher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Award className="w-8 h-8 text-amber-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Select XP Wager Stake:</h4>
            <p className="text-xs text-slate-400">Winner receives double the wager amount (+2x)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {[50, 100, 250].map((stake) => (
            <button
              key={stake}
              onClick={() => setXpWager(stake)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                xpWager === stake
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {stake} XP
            </button>
          ))}

          <button
            onClick={handleStartMatchmaking}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-sm shadow-xl shadow-rose-600/30 flex items-center gap-2 transition transform active:scale-95"
          >
            <Swords className="w-4 h-4" /> Find 1v1 Battle
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizBattleArenaView;
