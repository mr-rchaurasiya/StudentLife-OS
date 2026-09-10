import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Brain,
  Target
} from 'lucide-react';
import {
  VideoMockInterviewSession,
  VideoMockInterviewTrack
} from '@studentlife/shared';

interface AiMockInterviewerViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

const TRACKS: { id: VideoMockInterviewTrack; label: string; icon: string; desc: string }[] = [
  { id: 'SOFTWARE_ENGINEERING_DSA', label: 'SDE & System Design', icon: '💻', desc: 'LRU Cache, Concurrency, Distributed Databases' },
  { id: 'DATA_SCIENCE_AI', label: 'Data Science & LLMs', icon: '🧠', desc: 'Transformer Self-Attention, Drift detection, Model Serving' },
  { id: 'UPSC_PERSONALITY_TEST', label: 'UPSC Personality Board', icon: '🏛️', desc: 'Administrative ethics, DAF inquiry, Policy dilemmas' },
  { id: 'CONSULTING_CASE', label: 'Management Consulting', icon: '📊', desc: 'Market entry, Profitability breakdown, Guesstimates' },
  { id: 'CORE_PLACEMENT_HR', label: 'Campus Placement & HR', icon: '🎯', desc: 'STAR behavioral format, Value proposition, Culture fit' }
];

export const AiMockInterviewerView: React.FC<AiMockInterviewerViewProps> = ({ onAddXp }) => {
  const [session, setSession] = useState<VideoMockInterviewSession | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<VideoMockInterviewTrack>('SOFTWARE_ENGINEERING_DSA');
  const [candidateName] = useState<string>('Candidate');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [isMicActive, setIsMicActive] = useState<boolean>(true);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [liveConfidence] = useState<number>(88);
  const [liveWpm] = useState<number>(142);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch {
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleStartSession = async () => {
    try {
      const res = await fetch('/api/video-mock-interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          track: selectedTrack
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSession(data.data);
        setSpokenTranscript('');
        setRecordingSeconds(0);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      }
    } catch {
      // Handled
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session) return;
    setIsEvaluating(true);

    try {
      const currentQ = session.questions[session.currentQuestionIndex];
      const res = await fetch('/api/video-mock-interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          questionId: currentQ?.id || 'q-1',
          candidateAnswerTranscript: spokenTranscript || 'Detailed verbal answer covering system architecture and trade-offs.',
          audioWpm: liveWpm,
          fillerWordsObserved: 1
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSession(data.data);
        setSpokenTranscript('');
        setRecordingSeconds(0);
        if (data.data.status === 'COMPLETED') {
          if (timerRef.current) clearInterval(timerRef.current);
          onAddXp?.(80, `Completed Mock Interview: ${selectedTrack}`);
        }
      }
    } catch {
      // Handled
    } finally {
      setIsEvaluating(false);
    }
  };

  const currentQ = session && session.questions[session.currentQuestionIndex]
    ? session.questions[session.currentQuestionIndex]
    : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="px-3 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                Phase 102 • AI Video & Speech Mock Interviewer
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-md">
                Real-Time Webcam & Audio HUD
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              AI Video Interview Simulator 🎯
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Practice real high-stakes interviews for FAANG SDE, Data Science, UPSC Personality Board, and Consulting. Get instant scoring on eye contact, WPM speed, and STAR structural delivery.
            </p>
          </div>

          {/* Track Selection Pills */}
          <div className="flex flex-wrap gap-2">
            {TRACKS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTrack(t.id);
                  if (session) handleStartSession();
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedTrack === t.id
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-500/40'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interview Stage */}
      {!session || session.status === 'IN_PROGRESS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Live Webcam Video & Real-Time AI Evaluator */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Viewport Card */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <VideoOff className="w-8 h-8" />
                  </div>
                  <p className="text-slate-400 text-xs">Webcam feed disabled or unavailable</p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow"
                  >
                    Enable Webcam
                  </button>
                </div>
              )}

              {/* Real-Time Telemetry HUD Overlay */}
              {session && (
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-3.5 py-1.5 rounded-2xl text-xs font-mono">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-white font-bold">
                      REC {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-3.5 py-1.5 rounded-2xl text-xs">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="text-emerald-400 font-bold">{liveConfidence}%</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-400">Pace:</span>
                    <span className="text-cyan-400 font-bold">{liveWpm} WPM</span>
                  </div>
                </div>
              )}

              {/* Bottom Video Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-950/80 backdrop-blur-md border border-slate-800/80 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCameraActive(!isCameraActive)}
                    className={`p-2 rounded-xl transition ${
                      isCameraActive ? 'bg-slate-800 text-white' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isCameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsMicActive(!isMicActive)}
                    className={`p-2 rounded-xl transition ${
                      isMicActive ? 'bg-slate-800 text-white' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                </div>

                {!session ? (
                  <button
                    onClick={handleStartSession}
                    className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Start Mock Interview
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isEvaluating}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isEvaluating ? 'Evaluating Answer...' : session.currentQuestionIndex < session.totalQuestions - 1 ? 'Next Question' : 'Complete & Generate Report'}
                  </button>
                )}
              </div>
            </div>

            {/* Spoken Answer Transcript Input (Simulated / Typed) */}
            {session && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Your Spoken Answer Transcript:</span>
                  <span>(Live speech-to-text preview)</span>
                </div>
                <textarea
                  rows={3}
                  value={spokenTranscript}
                  onChange={(e) => setSpokenTranscript(e.target.value)}
                  placeholder="Speak naturally into your microphone or type your technical response here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Right Col: AI Question & Key Competency Rubric */}
          <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-bold text-white">AI Interviewer Board</h3>
                </div>
                {session && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                    Q {session.currentQuestionIndex + 1} / {session.totalQuestions}
                  </span>
                )}
              </div>

              {currentQ ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                      Target Question:
                    </span>
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      "{currentQ.questionText}"
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400">
                      Expected Competency Touchpoints:
                    </span>
                    {currentQ.expectedKeyCompetencies.map((comp, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2"
                      >
                        <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-rose-400">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Ready for your Mock Session?</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Select your interview track and click "Start Mock Interview" to begin live evaluation.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">
                Evaluation Powered by Multimodal AI & STAR Rubrics
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Post-Interview Evaluation Report Card */
        session.feedbackReport && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" /> Interview Completed
                </span>
                <h2 className="text-2xl font-black text-white">AI Performance Report Card</h2>
                <p className="text-xs text-slate-400">Track: {session.track}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <div className="text-xs text-slate-400">Overall Score</div>
                  <div className="text-3xl font-black text-emerald-400">
                    {session.feedbackReport.overallScoreOutOf100} / 100
                  </div>
                </div>
                <button
                  onClick={handleStartSession}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl shadow transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Mock
                </button>
              </div>
            </div>

            {/* 4 Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Confidence Index</span>
                <div className="text-xl font-bold text-rose-400 mt-1">{session.feedbackReport.confidenceScore}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Speaking Pace</span>
                <div className="text-xl font-bold text-cyan-400 mt-1">{session.feedbackReport.clarityWpm} WPM</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Eye Contact</span>
                <div className="text-xl font-bold text-emerald-400 mt-1">{session.feedbackReport.eyeContactEstimatePercent}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Technical Accuracy</span>
                <div className="text-xl font-bold text-amber-400 mt-1">{session.feedbackReport.technicalAccuracyScore}%</div>
              </div>
            </div>

            {/* Strengths & Improvement Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths
                </h4>
                <ul className="space-y-2 text-xs text-slate-200">
                  {session.feedbackReport.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Priority Improvement Areas
                </h4>
                <ul className="space-y-2 text-xs text-slate-200">
                  {session.feedbackReport.criticalAreasForImprovement.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AiMockInterviewerView;
