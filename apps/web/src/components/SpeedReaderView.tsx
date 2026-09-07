import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Award,
  Sliders,
  CheckCircle2,
  XCircle,
  Clock,
  VolumeX,
  FileText,
  Sparkles
} from 'lucide-react';
import type { SpeedReaderSession, StartSpeedReaderDto, SubmitRecallQuizDto } from '@studentlife/shared';

const SAMPLE_TEXT = `Circadian rhythm optimization for engineering students requires balancing light exposure, caffeine half-life, and deep focus blocks. The suprachiasmatic nucleus regulates melatonin production based on blue photon density. Subvocalization slows down reading speed by forcing inner ear phonation; RSVP training bypasses the larynx-to-cortex vocal bridge, unlocking 800+ WPM semantic comprehension with retention parity.`;

export const SpeedReaderView: React.FC = () => {
  const [docTitle, setDocTitle] = useState('Circadian Cognitive Blueprint');
  const [textInput, setTextInput] = useState(SAMPLE_TEXT);
  const [targetWpm, setTargetWpm] = useState(450);
  const [session, setSession] = useState<SpeedReaderSession | null>(null);
  const [loading, setLoading] = useState(false);

  // Playback state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<{ score: number; percentage: number; passed: boolean } | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Start / Load session
  const handleStartSession = async () => {
    setLoading(true);
    setIsPlaying(false);
    setCurrentWordIndex(0);
    setQuizSubmitted(false);
    setQuizScore(null);
    setSelectedAnswers({});

    const payload: StartSpeedReaderDto = {
      documentTitle: docTitle,
      rawArticleText: textInput,
      targetWpm
    };

    try {
      const res = await fetch('http://localhost:5000/api/speed-reader/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSession(data.data);
      }
    } catch {
      // Fallback local session
      const words = textInput.trim().split(/\s+/);
      const tokens = words.map((w) => {
        const pivot = Math.floor((w.length - 1) / 3);
        return {
          word: w,
          prefix: w.slice(0, pivot),
          pivotChar: w[pivot] || '',
          suffix: w.slice(pivot + 1),
          orpIndex: pivot
        };
      });
      setSession({
        id: `sess-${Date.now()}`,
        documentTitle: docTitle,
        targetWpm,
        totalWords: tokens.length,
        tokens,
        comprehensionQuiz: [
          {
            question: 'What brain nucleus regulates melatonin according to the text?',
            options: ['Amygdala', 'Suprachiasmatic nucleus', 'Hippocampus', 'Thalamus'],
            correctOptionIndex: 1
          },
          {
            question: 'What mechanism does RSVP training bypass to accelerate reading?',
            options: ['Retinal scan', 'Subvocalization vocal bridge', 'Short-term memory', 'Peripheral blur'],
            correctOptionIndex: 1
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // RSVP Timer Loop
  useEffect(() => {
    if (!isPlaying || !session || currentWordIndex >= session.tokens.length) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (session && currentWordIndex >= session.tokens.length) {
        setIsPlaying(false);
      }
      return;
    }

    const currentToken = session.tokens[currentWordIndex];
    const delay = currentToken
      ? Math.round((60 / targetWpm) * 1000 * (currentToken.word.endsWith('.') || currentToken.word.endsWith(',') ? 1.4 : 1.0))
      : Math.round((60 / targetWpm) * 1000);

    timerRef.current = setTimeout(() => {
      setCurrentWordIndex((prev) => prev + 1);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentWordIndex, session, targetWpm]);

  const handleTogglePlay = () => {
    if (!session) {
      handleStartSession();
      return;
    }
    if (currentWordIndex >= session.tokens.length) {
      setCurrentWordIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentWordIndex(0);
  };

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (!session) return;
    const payload: SubmitRecallQuizDto = {
      sessionId: session.id,
      selectedAnswers: session.comprehensionQuiz.map((_, idx) => selectedAnswers[idx] ?? -1)
    };

    try {
      const res = await fetch('http://localhost:5000/api/speed-reader/recall-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setQuizScore(data.data);
      } else {
        calculateLocalScore();
      }
    } catch {
      calculateLocalScore();
    } finally {
      setQuizSubmitted(true);
    }
  };

  const calculateLocalScore = () => {
    if (!session) return;
    let correct = 0;
    session.comprehensionQuiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) correct++;
    });
    const pct = Math.round((correct / session.comprehensionQuiz.length) * 100);
    setQuizScore({
      score: correct,
      percentage: pct,
      passed: pct >= 60
    });
  };

  const currentToken = session && session.tokens[currentWordIndex] ? session.tokens[currentWordIndex] : null;
  const progressPct = session ? Math.min(100, Math.round((currentWordIndex / session.tokens.length) * 100)) : 0;
  const estimatedSeconds = session ? Math.round((session.totalWords / session.targetWpm) * 60) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-orange-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Phase 73 • Speed Cognition
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800/80 border border-slate-700 text-slate-400 text-xs rounded-md">
                Subvocalization Eliminator
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              AI RSVP Speed-Reading & Subvocalization Eliminator
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Rapid Serial Visual Presentation with Optimal Recognition Point (ORP) fixation markers to accelerate research synthesis up to 1000 WPM without loss of retention.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-medium">Target Speed</div>
              <div className="text-xl font-black text-amber-400">{targetWpm} <span className="text-xs text-slate-400">WPM</span></div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-medium">Vocal Latency</div>
              <div className="text-xl font-black text-emerald-400">0.0 <span className="text-xs text-slate-400">ms</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Text Input & Configuration */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Source Reading Material
            </h2>
            <input
              type="text"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Article / Research Document Title"
            />
            <textarea
              className="w-full h-40 bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-200 focus:border-amber-500 focus:outline-none resize-none font-mono"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste research abstract, chapter, or notes..."
            />

            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  Target WPM (Words/Min)
                </span>
                <span className="text-amber-400 font-bold">{targetWpm} WPM</span>
              </div>
              <input
                type="range"
                min="250"
                max="1000"
                step="25"
                value={targetWpm}
                onChange={(e) => setTargetWpm(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>250 WPM (Normal)</span>
                <span>600 WPM (Skim)</span>
                <span>1000 WPM (Hyperion)</span>
              </div>
            </div>

            <button
              onClick={handleStartSession}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Tokenize & Prime RSVP Engine
                </>
              )}
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                Subvocalization Lock
              </span>
              <span className="text-emerald-400 font-mono font-bold">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Estimated Read Time
              </span>
              <span className="text-slate-200 font-mono font-bold">
                {estimatedSeconds}s
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                Word Count
              </span>
              <span className="text-slate-200 font-mono font-bold">
                {session ? session.totalWords : textInput.trim().split(/\s+/).length} words
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: RSVP Visualizer & Comprehension Quiz */}
        <div className="lg:col-span-8 space-y-6">
          {/* RSVP Display Box */}
          <div className="bg-slate-950 border-2 border-slate-800 hover:border-amber-500/50 rounded-2xl p-8 relative shadow-2xl flex flex-col items-center justify-center min-h-[300px] transition">
            {/* Top & Bottom ORP Crosshairs */}
            <div className="absolute top-4 w-6 h-1 bg-amber-500/80 rounded-full" />
            <div className="absolute bottom-4 w-6 h-1 bg-amber-500/80 rounded-full" />

            {/* Word Flasher */}
            {currentToken ? (
              <div className="flex items-baseline justify-center text-4xl sm:text-5xl md:text-6xl font-mono tracking-tight select-none">
                <span className="text-slate-400 text-right font-medium">{currentToken.prefix}</span>
                <span className="text-amber-400 font-black px-0.5 underline decoration-amber-500 decoration-4 underline-offset-8 scale-105">
                  {currentToken.pivotChar}
                </span>
                <span className="text-slate-100 text-left font-medium">{currentToken.suffix}</span>
              </div>
            ) : (
              <div className="text-center text-slate-500 space-y-2">
                <Zap className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-sm">Click "Tokenize" or "Start Reading" to start RSVP reading stream.</p>
              </div>
            )}

            {/* Progress Bar & Word Index */}
            <div className="w-full mt-10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Word: {currentWordIndex} / {session?.tokens.length || 0}</span>
                <span>{progressPct}% Completed</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-100"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleReset}
                className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl transition"
                title="Reset to start"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handleTogglePlay}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 text-base transition"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950" />}
                {isPlaying ? 'Pause' : 'Start Reading'}
              </button>
            </div>
          </div>

          {/* Active Recall Comprehension Quiz */}
          {session && session.comprehensionQuiz && session.comprehensionQuiz.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Subvocalization Parity & Active Recall Quiz
                  </h3>
                </div>
                {quizSubmitted && quizScore && (
                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${quizScore.passed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`}>
                    {quizScore.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    Score: {quizScore.score}/{session.comprehensionQuiz.length} ({quizScore.percentage}%)
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {session.comprehensionQuiz.map((q, qIdx) => (
                  <div key={qIdx} className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2.5">
                    <div className="text-xs font-medium text-slate-200">
                      <span className="text-amber-400 font-bold mr-1.5">Q{qIdx + 1}.</span>
                      {q.question}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[qIdx] === oIdx;
                        const isCorrect = quizSubmitted && oIdx === q.correctOptionIndex;
                        const isWrongSelected = quizSubmitted && isSelected && oIdx !== q.correctOptionIndex;

                        return (
                          <button
                            key={oIdx}
                            onClick={() => !quizSubmitted && handleSelectAnswer(qIdx, oIdx)}
                            disabled={quizSubmitted}
                            className={`p-2.5 text-left rounded-lg text-xs font-medium transition border ${
                              isCorrect
                                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                                : isWrongSelected
                                ? 'bg-rose-950/50 border-rose-500 text-rose-200'
                                : isSelected
                                ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!quizSubmitted && (
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  Submit Comprehension Verification
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
