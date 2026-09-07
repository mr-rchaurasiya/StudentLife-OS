import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Swords,
  Timer,
  CheckCircle2,
  XCircle,
  Crown
} from 'lucide-react';
import type { OlympiadMatchState, SubmitOlympiadAnswerDto } from '@studentlife/shared';

interface KnowledgeOlympiadViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const KnowledgeOlympiadView: React.FC<KnowledgeOlympiadViewProps> = ({ onAddXp }) => {
  const [match, setMatch] = useState<OlympiadMatchState | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState<number>(10000);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchMatch();
  }, []);

  const fetchMatch = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/knowledge-olympiad/match');
      const data = await res.json();
      if (data.success && data.data) {
        setMatch(data.data);
        resetTimer();
      }
    } catch {
      // Fallback
    }
  };

  const resetTimer = () => {
    startTimeRef.current = Date.now();
    setTimeLeftMs(10000);
    setSelectedOption(null);
    setIsAnswering(false);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setTimeLeftMs(prev => {
        if (prev <= 100) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          return 0;
        }
        return prev - 100;
      });
    }, 100);
  };

  const handleSubmitAnswer = async (optIdx: number) => {
    if (!match || isAnswering) return;
    setIsAnswering(true);
    setSelectedOption(optIdx);

    const buzzerTimeMs = Date.now() - startTimeRef.current;
    const currentQ = match.questions[match.currentQuestionIndex];
    if (!currentQ) return;

    const payload: SubmitOlympiadAnswerDto = {
      matchId: match.matchId,
      questionId: currentQ.id,
      selectedOptionIndex: optIdx,
      buzzerTimeMs
    };

    try {
      const res = await fetch('http://localhost:5000/api/knowledge-olympiad/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTimeout(() => {
          setMatch(data.data);
          resetTimer();
          if (optIdx === currentQ.correctIndex) {
            onAddXp?.(40, `Olympiad Speed Buzzer Correct (+${currentQ.points} Pts)`);
          }
        }, 1200);
      }
    } catch {
      setIsAnswering(false);
    }
  };

  const currentQ = match && match.questions[match.currentQuestionIndex] ? match.questions[match.currentQuestionIndex] : null;
  const timerPercent = Math.max(0, Math.min(100, (timeLeftMs / 10000) * 100));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-orange-950/50 to-slate-900 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Phase 80 • Collegiate Grandmaster
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800/80 border border-slate-700 text-slate-400 text-xs rounded-md">
                Inter-Collegiate Knowledge Olympiad
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Multi-Campus Knowledge Olympiad Arena
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Live inter-collegiate competitive buzzer rounds with sub-50ms latency compensation, TrueSkill/Elo ranking ladders, and category-based speed battles.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-medium">Elo Rating</div>
              <div className="text-xl font-black text-amber-400">
                {match ? match.playerElo : 2185} <span className="text-xs text-slate-400">GM</span>
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-medium">League Tier</div>
              <div className="text-xl font-black text-emerald-400">
                {match ? match.league : 'GRANDMASTER'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Match Scoreboard */}
      {match && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-slate-800 pb-5">
            {/* Player Side */}
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 text-center space-y-1">
              <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">Your Team</div>
              <div className="text-base font-black text-white">{match.playerCollege}</div>
              <div className="text-2xl font-black text-amber-400">{match.playerScore} <span className="text-xs text-slate-500">Pts</span></div>
            </div>

            {/* VS & Match Meta */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-700 rounded-full text-xs font-bold text-slate-300">
                <Swords className="w-3.5 h-3.5 text-rose-400" />
                Round {match.currentQuestionIndex + 1} of {match.totalQuestions}
              </div>
              <div className="text-xs text-slate-500 font-mono">Grandmaster Arena #80</div>
            </div>

            {/* Opponent Side */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center space-y-1">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Opponent</div>
              <div className="text-base font-black text-white">{match.opponentCollege}</div>
              <div className="text-2xl font-black text-slate-300">{match.opponentScore} <span className="text-xs text-slate-500">Pts</span></div>
            </div>
          </div>

          {/* Question & Buzzer Panel */}
          {match.matchStatus !== 'MATCH_CONCLUDED' && currentQ ? (
            <div className="space-y-6">
              {/* Question Category & Timer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg font-bold">
                    {currentQ.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300 font-mono font-bold">
                    <Timer className="w-4 h-4 text-rose-400" />
                    {(timeLeftMs / 1000).toFixed(1)}s Buzzer
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-100"
                    style={{ width: `${timerPercent}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="text-lg sm:text-xl font-bold text-white font-serif leading-relaxed text-center py-2">
                "{currentQ.questionText}"
              </div>

              {/* Option Buzzers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  const isCorrect = isAnswering && oIdx === currentQ.correctIndex;
                  const isWrong = isAnswering && isSelected && oIdx !== currentQ.correctIndex;

                  return (
                    <button
                      key={oIdx}
                      onClick={() => !isAnswering && handleSubmitAnswer(oIdx)}
                      disabled={isAnswering || timeLeftMs === 0}
                      className={`p-4 rounded-xl border text-left transition flex items-center justify-between gap-3 text-xs font-medium ${
                        isCorrect
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-lg'
                          : isWrong
                          ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                          : isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                          : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-amber-500/60 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-[11px] text-amber-400 shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isWrong && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-4">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black text-white">
                {match.playerScore >= match.opponentScore ? 'VICTORY! Match Concluded 🏆' : 'DEFEAT — Good Match!'}
              </h3>
              <p className="text-sm text-slate-400">
                Final Score: <span className="text-amber-400 font-bold">{match.playerScore}</span> vs <span className="text-slate-300 font-bold">{match.opponentScore}</span> • New Elo: <span className="text-emerald-400 font-bold">{match.playerElo}</span>
              </p>
              <button
                onClick={fetchMatch}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition"
              >
                Queue Next Inter-Collegiate Match
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
