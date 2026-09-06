import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Sparkles,
  Printer,
  Sliders,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  BookOpen,
  Eye,
  EyeOff,
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';
import {
  CustomMockPaper,
  GenerateMockPaperDto
} from '@studentlife/shared';

export const CustomPaperGeneratorView: React.FC = () => {
  const [papers, setPapers] = useState<CustomMockPaper[]>([]);
  const [activePaperId, setActivePaperId] = useState<string>('paper-jee-adv-2026-01');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showSolutions, setShowSolutions] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);

  // Generator Wizard Form State
  const [examType, setExamType] = useState<string>('JEE Advanced');
  const [subject, setSubject] = useState<string>('Physics & Mathematics');
  const [topicsInput, setTopicsInput] = useState<string>('Rotational Dynamics, Calculus Definite Integrals, Electromagnetism');
  const [totalQuestions, setTotalQuestions] = useState<number>(6);
  const [easyPct, setEasyPct] = useState<number>(30);
  const [mediumPct, setMediumPct] = useState<number>(50);
  const [hardPct, setHardPct] = useState<number>(20);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/custom-paper/papers');
      const data = await res.json();
      if (data.success && data.data) {
        setPapers(data.data);
        if (data.data.length > 0 && !activePaperId) {
          setActivePaperId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load papers', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      const dto: GenerateMockPaperDto = {
        examType,
        subject,
        topics: topicsInput.split(',').map(t => t.trim()).filter(Boolean),
        totalQuestions,
        difficultyDistribution: {
          easyPct,
          mediumPct,
          hardPct
        },
        includeSolutions: true
      };

      const res = await fetch('/api/custom-paper/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });

      const json = await res.json();
      if (json.success && json.data) {
        setPapers(prev => [json.data, ...prev]);
        setActivePaperId(json.data.id);
        setSelectedAnswers({});
        setTestSubmitted(false);
        setShowSolutions(false);
      }
    } catch (err) {
      console.error('Failed to generate paper', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const activePaper = papers.find(p => p.id === activePaperId) || papers[0];

  const handleSelectOption = (questionId: string, opt: string) => {
    if (testSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: opt
    }));
  };

  const calculateScore = () => {
    if (!activePaper) return { score: 0, correct: 0, incorrect: 0, unattempted: 0 };
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    activePaper.sections.forEach(sec => {
      sec.questions.forEach(q => {
        const userAns = selectedAnswers[q.id];
        if (!userAns) {
          unattempted++;
        } else if (userAns === q.correctAnswer || (q.options && userAns.startsWith(q.correctAnswer.slice(0, 10)))) {
          correct++;
          score += q.marks;
        } else {
          incorrect++;
          score -= q.negativeMarks;
        }
      });
    });

    return { score, correct, incorrect, unattempted };
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Loading AI Mock Paper & Test Series Generator...</p>
        </div>
      </div>
    );
  }

  const scoreStats = testSubmitted ? calculateScore() : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Custom Mock Paper & Test Series</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Exam Grade Synthesizer
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Generate full-length customized test series with negative marking schemes, difficulty ratios, and instant step-by-step LaTeX solutions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSolutions(!showSolutions)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium text-sm transition-all shadow-md"
          >
            {showSolutions ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4 text-cyan-400" />}
            {showSolutions ? 'Hide Solutions' : 'Reveal Solution Key'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-rose-500/25"
          >
            <Printer className="w-4 h-4" />
            Print / PDF Paper
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Paper Generator Settings & Paper Library (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Custom Paper Synthesizer Form */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-amber-400" />
              AI Paper Synthesizer
            </h3>

            <form onSubmit={handleGeneratePaper} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Target Exam Domain</label>
                <select
                  value={examType}
                  onChange={e => setExamType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="JEE Advanced">JEE Advanced (Engineering)</option>
                  <option value="NEET UG">NEET UG (Medical)</option>
                  <option value="UPSC Prelims">UPSC Civil Services (GS Prelims)</option>
                  <option value="GATE CS">GATE CS & IT</option>
                  <option value="CBSE 12th Board">CBSE Class 12th Board</option>
                  <option value="SSC CGL">SSC CGL / Banking PO</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Physics, Data Structures, Economy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">High-Yield Topics (Comma-separated)</label>
                <input
                  type="text"
                  value={topicsInput}
                  onChange={e => setTopicsInput(e.target.value)}
                  placeholder="e.g. Thermodynamics, Modern Physics"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Total Questions</label>
                  <select
                    value={totalQuestions}
                    onChange={e => setTotalQuestions(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value={4}>4 Questions (Micro Mock)</option>
                    <option value={6}>6 Questions (Speed Test)</option>
                    <option value={10}>10 Questions (Sectional Mock)</option>
                    <option value={15}>15 Questions (Grand Mock)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Hardness Ratio</label>
                  <div className="text-[11px] text-slate-400 bg-slate-950 border border-slate-800 rounded-xl p-2 flex items-center justify-between">
                    <span className="text-emerald-400">{easyPct}% E</span>
                    <span className="text-amber-400">{mediumPct}% M</span>
                    <span className="text-rose-400">{hardPct}% H</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Difficulty Distribution Slider</span>
                  <span className="text-slate-300 font-mono">E:{easyPct} M:{mediumPct} H:{hardPct}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hardPct}
                  onChange={e => {
                    const h = Number(e.target.value);
                    const rem = 100 - h;
                    setHardPct(h);
                    setMediumPct(Math.round(rem * 0.6));
                    setEasyPct(Math.round(rem * 0.4));
                  }}
                  className="w-full accent-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Synthesizing Test Paper...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Synthesize Custom Mock Paper
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Saved Papers List */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Generated Test Series ({papers.length})
            </h3>
            <div className="space-y-2">
              {papers.map(p => {
                const isActive = p.id === activePaper?.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePaperId(p.id);
                      setSelectedAnswers({});
                      setTestSubmitted(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all border flex flex-col gap-1 ${
                      isActive
                        ? 'bg-gradient-to-r from-rose-950/60 to-slate-900 border-rose-500/50 shadow-md shadow-rose-950/50'
                        : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isActive ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.examType}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {p.totalMarks} Marks • {p.durationMinutes}m
                      </span>
                    </div>
                    <div className={`font-semibold text-sm line-clamp-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {p.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {p.totalQuestions} Questions • {p.subject}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Mock Paper Printable Sheet & Interactive Exam Simulator (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activePaper ? (
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6">
              
              {/* Formal Exam Paper Header */}
              <div className="border-2 border-dashed border-slate-700/80 rounded-xl p-5 bg-slate-950/60 space-y-3 text-center">
                <div className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                  {activePaper.examType.toUpperCase()} ALL-INDIA STANDARDIZED ASSESSMENT
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {activePaper.title}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-1 border-t border-slate-800">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Duration: {activePaper.durationMinutes} Minutes
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Maximum Marks: {activePaper.totalMarks}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Target className="w-3.5 h-3.5 text-rose-400" />
                    Total Questions: {activePaper.totalQuestions}
                  </span>
                </div>
              </div>

              {/* Score card when submitted */}
              {testSubmitted && scoreStats && (
                <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/40 rounded-xl p-4 flex flex-wrap items-center justify-around gap-4 text-center">
                  <div>
                    <div className="text-xs text-slate-400">Total Score</div>
                    <div className="text-2xl font-black text-cyan-300">
                      {scoreStats.score} / {activePaper.totalMarks}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Accuracy</div>
                    <div className="text-2xl font-black text-emerald-400">
                      {scoreStats.correct + scoreStats.incorrect > 0
                        ? Math.round((scoreStats.correct / (scoreStats.correct + scoreStats.incorrect)) * 100)
                        : 0}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Correct / Wrong</div>
                    <div className="text-base font-bold text-white font-mono">
                      <span className="text-emerald-400">{scoreStats.correct} Correct</span> | <span className="text-rose-400">{scoreStats.incorrect} Wrong</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setTestSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-semibold"
                  >
                    Reset & Retake
                  </button>
                </div>
              )}

              {/* Sections and Questions */}
              <div className="space-y-8">
                {activePaper.sections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-4">
                    <div className="bg-slate-800/70 px-4 py-2.5 rounded-xl border border-slate-700 text-sm font-bold text-slate-200 flex items-center justify-between">
                      <span>{section.title}</span>
                      <span className="text-xs text-amber-300 font-mono">Weightage: {section.weightageMarks} Marks</span>
                    </div>

                    <div className="space-y-6">
                      {section.questions.map((q, qIdx) => {
                        return (
                          <div
                            key={q.id}
                            className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all"
                          >
                            {/* Question Meta header */}
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-300 font-mono font-bold flex items-center justify-center">
                                  {q.questionNumber || qIdx + 1}
                                </span>
                                <span className="text-slate-400 font-medium">Topic: {q.topic}</span>
                              </div>
                              <div className="flex items-center gap-2 font-mono">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  q.difficulty === 'EASY' ? 'bg-emerald-500/20 text-emerald-300' :
                                  q.difficulty === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' :
                                  'bg-rose-500/20 text-rose-300'
                                }`}>
                                  {q.difficulty}
                                </span>
                                <span className="text-slate-500">+{q.marks} / -{q.negativeMarks}</span>
                              </div>
                            </div>

                            {/* Question Text */}
                            <div className="text-sm sm:text-base font-medium text-slate-200 whitespace-pre-wrap leading-relaxed">
                              {q.questionText}
                            </div>

                            {/* Options if MCQ */}
                            {q.options && q.options.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                {q.options.map((opt, optIdx) => {
                                  const isOptionChosen = selectedAnswers[q.id] === opt;
                                  let optStyles = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300';

                                  if (testSubmitted) {
                                    if (opt === q.correctAnswer || opt.startsWith(q.correctAnswer.slice(0, 10))) {
                                      optStyles = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200';
                                    } else if (isOptionChosen) {
                                      optStyles = 'bg-rose-950/60 border-rose-500/60 text-rose-200';
                                    }
                                  } else if (isOptionChosen) {
                                    optStyles = 'bg-amber-500/20 border-amber-500/60 text-amber-200 shadow-md shadow-amber-950/40';
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => handleSelectOption(q.id, opt)}
                                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2 ${optStyles}`}
                                    >
                                      <span className="font-mono font-bold text-slate-500">
                                        {String.fromCharCode(65 + optIdx)}.
                                      </span>
                                      <span className="flex-1">{opt}</span>
                                      {testSubmitted && (opt === q.correctAnswer || opt.startsWith(q.correctAnswer.slice(0, 10))) && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Solution breakdown (if revealed or submitted) */}
                            {(showSolutions || testSubmitted) && (
                              <div className="mt-3 p-3.5 bg-slate-900/90 border border-indigo-500/20 rounded-xl text-xs space-y-2 animate-in fade-in">
                                <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  Detailed LaTeX Solution & Conceptual Derivation:
                                </div>
                                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-sans bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                                  {q.detailedSolution}
                                </div>
                                <div className="text-[11px] text-amber-300 font-mono">
                                  Correct Key: {q.correctAnswer}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit / Finish Test Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Answer all questions before submitting to calculate final rank and percentile.</span>
                </div>

                <div className="flex items-center gap-3">
                  {!testSubmitted ? (
                    <button
                      onClick={() => setTestSubmitted(true)}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Submit & Grade Test
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSolutions(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Inspect Full Solutions
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              No paper selected. Synthesize a new paper from the panel on the left!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
export default CustomPaperGeneratorView;
