import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Award,
  CheckCircle2,
  Briefcase,
  Play
} from 'lucide-react';
import {
  InterviewTrack,
  MockInterviewSession,
  StartInterviewDto,
  SubmitInterviewResponseDto
} from '@studentlife/shared';

interface AiMockInterviewViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const AiMockInterviewView: React.FC<AiMockInterviewViewProps> = ({ onAddXp }) => {
  const [selectedTrack, setSelectedTrack] = useState<InterviewTrack>('SDE_TECH');
  const [candidateName, setCandidateName] = useState<string>('Student Aspirant');
  const [session, setSession] = useState<MockInterviewSession | null>(null);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [spokenAnswer, setSpokenAnswer] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);

  const handleStartInterview = async () => {
    try {
      setIsStarting(true);
      const dto: StartInterviewDto = {
        track: selectedTrack,
        candidateName
      };

      const res = await fetch('/api/mock-interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSession(data.data);
        setSpokenAnswer('');
      }
    } catch (err) {
      console.error('Failed to start interview', err);
    } finally {
      setIsStarting(false);
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      speechRecognition?.stop();
      setIsListening(false);
    } else {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRec) {
        alert('Web Speech API is not supported in this browser. You can type your answer directly!');
        return;
      }

      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSpokenAnswer(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
      setSpeechRecognition(recognition);
      setIsListening(true);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !spokenAnswer.trim()) return;
    const currentQ = session.questions[session.currentQuestionIndex];
    if (!currentQ) return;

    try {
      setIsSubmitting(true);
      if (isListening) {
        speechRecognition?.stop();
        setIsListening(false);
      }

      const dto: SubmitInterviewResponseDto = {
        sessionId: session.id,
        questionId: currentQ.id,
        spokenAnswer
      };

      const res = await fetch('/api/mock-interview/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSession(data.data.session);
        setSpokenAnswer('');
        if (data.data.session.isCompleted) {
          onAddXp?.(75, `Completed ${selectedTrack} AI Mock Interview Board`);
        }
      }
    } catch (err) {
      console.error('Failed to submit response', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Voice Mock Interview & Viva Coach</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> STAR Method Evaluator
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Simulate high-stakes SDE technical rounds and UPSC personality boards with real-time speech evaluation and STAR rating breakdown.
            </p>
          </div>
        </div>

        {session && (
          <button
            onClick={() => setSession(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700"
          >
            End / Switch Track
          </button>
        )}
      </div>

      {!session ? (
        /* Track Configurator Screen */
        <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Briefcase className="w-5 h-5 text-amber-400" />
            Select Your Target Mock Interview Board
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                track: 'SDE_TECH' as InterviewTrack,
                title: 'FAANG & Startup SDE Board',
                desc: 'Graph algorithms, distributed caching, concurrency & system design architecture.',
                badge: 'Tech Placement'
              },
              {
                track: 'UPSC_PERSONALITY' as InterviewTrack,
                title: 'Civil Services (IAS/IPS) Board',
                desc: 'Administrative ethics, constitutional morality, geopolitical debates & crisis management.',
                badge: 'UPSC CSE'
              },
              {
                track: 'DATA_SCIENCE_AI' as InterviewTrack,
                title: 'AI & Machine Learning Specialist',
                desc: 'Deep learning backpropagation, LLM fine-tuning, regression metrics & MLOps pipelines.',
                badge: 'AI Roles'
              },
              {
                track: 'COLLEGE_VIVA' as InterviewTrack,
                title: 'University Viva & Project Defense',
                desc: 'Final year thesis defense, database normalization & architectural trade-offs.',
                badge: 'College Exam'
              }
            ].map(item => (
              <button
                key={item.track}
                onClick={() => setSelectedTrack(item.track)}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  selectedTrack === item.track
                    ? 'bg-gradient-to-br from-indigo-950/70 to-slate-900 border-amber-400 shadow-xl shadow-amber-950/40 scale-[1.02]'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{item.title}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-400">Candidate Name</label>
            <input
              type="text"
              value={candidateName}
              onChange={e => setCandidateName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={handleStartInterview}
            disabled={isStarting}
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isStarting ? 'Initiating Board...' : 'Begin Live Mock Interview'}
          </button>
        </div>
      ) : (
        /* Active Interview Simulator Screen */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Center: Question & Speech Capture Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {!session.isCompleted ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
                
                {/* Question Header */}
                <div className="border-b border-slate-800 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                      Question {session.currentQuestionIndex + 1} of {session.questions.length} • {session.track}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Category: {session.questions[session.currentQuestionIndex]?.category}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                    "{session.questions[session.currentQuestionIndex]?.questionText}"
                  </h2>
                </div>

                {/* Speech Recording / Text Response Area */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Your Oral Response:</span>
                    <button
                      onClick={handleToggleListening}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                        isListening
                          ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-500/40'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                      {isListening ? 'Listening (Speak Now)...' : 'Enable Microphone'}
                    </button>
                  </div>

                  <textarea
                    rows={6}
                    value={spokenAnswer}
                    onChange={e => setSpokenAnswer(e.target.value)}
                    placeholder="Speak your answer with the mic or type your STAR response directly here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 text-sm focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500 italic">
                    Tip: Structure your response with Situation, Task, Action, and quantifiable Result (STAR).
                  </span>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !spokenAnswer.trim()}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 disabled:opacity-40 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isSubmitting ? 'Evaluating STAR...' : 'Submit Response'}
                  </button>
                </div>
              </div>
            ) : (
              /* Completed Scorecard Hero */
              <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-8 shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white text-3xl shadow-xl shadow-rose-500/30">
                  🏆
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white">Interview Board Completed!</h2>
                  <p className="text-sm text-slate-400">Candidate: {session.candidateName} • Track: {session.track}</p>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-sm mx-auto">
                  <div className="text-xs text-slate-400 uppercase tracking-widest">Overall Performance Score</div>
                  <div className="text-4xl font-black text-amber-400 font-mono mt-1">
                    {session.totalScore} / 100
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold mt-2">
                    ✅ Passed Benchmark with High Hireability Rating
                  </div>
                </div>

                <button
                  onClick={() => setSession(null)}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Start Another Round
                </button>
              </div>
            )}
          </div>

          {/* Right: Real-time STAR Evaluations Log (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Award className="w-4 h-4 text-amber-400" />
                STAR Scorecard Log ({session.evaluations.length})
              </h3>

              {session.evaluations.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {session.evaluations.map((ev, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">Q{idx + 1} Score:</span>
                        <span className="font-mono font-black text-amber-400 text-sm">{ev.overallScore}/100</span>
                      </div>

                      {/* STAR Grid */}
                      <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-mono">
                        <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                          <div className="text-slate-400">S</div>
                          <div className="font-bold text-cyan-300">{ev.starMethodScore.situation}</div>
                        </div>
                        <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                          <div className="text-slate-400">T</div>
                          <div className="font-bold text-cyan-300">{ev.starMethodScore.task}</div>
                        </div>
                        <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                          <div className="text-slate-400">A</div>
                          <div className="font-bold text-cyan-300">{ev.starMethodScore.action}</div>
                        </div>
                        <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                          <div className="text-slate-400">R</div>
                          <div className="font-bold text-cyan-300">{ev.starMethodScore.result}</div>
                        </div>
                      </div>

                      <div className="text-[11px] text-emerald-300 bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/20">
                        <strong>Strengths:</strong> {ev.strengths[0]}
                      </div>

                      <div className="text-[11px] text-amber-200 bg-amber-950/30 p-2 rounded-lg border border-amber-500/20">
                        <strong>Improve:</strong> {ev.improvements[0]}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  Submit an answer to see your real-time STAR breakdown here!
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
export default AiMockInterviewView;
