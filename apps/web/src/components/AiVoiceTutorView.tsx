import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Radio,
  FileText
} from 'lucide-react';
import {
  LiveVoiceTutorSession,
  VoiceTutorLanguage
} from '@studentlife/shared';

interface AiVoiceTutorViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

const PRESET_TOPICS = [
  { domain: 'JEE Advanced Physics', topic: 'Rotational Dynamics & Moment of Inertia', hint: 'Ask: "Derive Moment of Inertia of solid disc and explain rolling without slipping"' },
  { domain: 'GATE CS & Algorithms', topic: 'Dijkstra & Dynamic Programming on Trees', hint: 'Ask: "Explain Dijkstra algorithm time complexity with priority queue"' },
  { domain: 'UPSC Civil Services GS-2', topic: 'Article 32 & Types of Constitutional Writs', hint: 'Ask: "Explain 5 types of Writs under Article 32 in Hinglish"' },
  { domain: 'NEET Medical Biology', topic: 'Endocrine System & Hormonal Feedback Loops', hint: 'Ask: "Explain Hypothalamus and Pituitary negative feedback mechanism"' }
];

export const AiVoiceTutorView: React.FC<AiVoiceTutorViewProps> = ({ onAddXp }) => {
  const [session, setSession] = useState<LiveVoiceTutorSession | null>(null);
  const [language, setLanguage] = useState<VoiceTutorLanguage>('HINGLISH');
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeDomain, setActiveDomain] = useState<string>('JEE Advanced Physics');

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchSession();
    initSpeechRecognition();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/voice-tutor/session?sessionId=sess-voice-demo');
      const data = await res.json();
      if (data.success && data.data) {
        setSession(data.data);
      }
    } catch {
      // Handled via state
    }
  };

  const initSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = language === 'HI' ? 'hi-IN' : language === 'HINGLISH' ? 'en-IN' : 'en-US';

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendQuery(transcript);
        }
        setIsListening(false);
      };

      recog.onerror = () => {
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported on this browser. You can still type your questions!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'HI' ? 'hi-IN' : language === 'HINGLISH' ? 'en-IN' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const speakText = (text: string) => {
    if (isMuted || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\\/g, '').replace(/\{/g, '').replace(/\}/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = language === 'HI' ? 'hi-IN' : 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendQuery = async (customText?: string) => {
    const textToSend = customText || inputText.trim();
    if (!textToSend) return;

    setInputText('');
    try {
      const res = await fetch('/api/voice-tutor/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session?.sessionId || 'sess-voice-demo',
          studentSpokenText: textToSend,
          language,
          subjectDomain: activeDomain
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSession(data.data);
        const lastMsg = data.data.messages[data.data.messages.length - 1];
        if (lastMsg && lastMsg.sender === 'AI_TUTOR') {
          speakText(lastMsg.text);
        }
        onAddXp?.(30, 'Mastered Concept via AI Voice Tutor');
      }
    } catch {
      // Handled
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Phase 101 • Multimodal AI Voice Tutor
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-md">
                Live Speech & Derivations
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Conversational Voice Study Mentor 🎙️
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Speak your doubts in English, Hindi, or Hinglish. AI breaks down proofs, draws whiteboard steps, and explains step-by-step with real-time speech synthesis.
            </p>
          </div>

          {/* Language & Voice Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-slate-900/90 border border-slate-700/80 p-1 rounded-2xl flex items-center gap-1">
              {(['HINGLISH', 'HI', 'EN'] as VoiceTutorLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    language === lang
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'HI' ? '🇮🇳 हिंदी' : lang === 'HINGLISH' ? '⚡ Hinglish' : '🌐 English'}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted && window.speechSynthesis) window.speechSynthesis.cancel();
              }}
              className={`p-3 rounded-2xl border transition ${
                isMuted
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-slate-900/80 border-slate-700 text-indigo-300 hover:bg-slate-800'
              }`}
              title={isMuted ? 'Unmute Audio Speech' : 'Mute Audio Speech'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Quick Topic Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Preset Scenarios:
          </span>
          {PRESET_TOPICS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveDomain(p.domain);
                handleSendQuery(p.hint);
              }}
              className="px-3 py-1 rounded-xl bg-slate-900/80 hover:bg-indigo-950 border border-slate-700 hover:border-indigo-500/50 text-[11px] text-slate-300 hover:text-white transition"
            >
              {p.domain}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Dialogue Stream */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Interactive Voice Dialogue</h2>
            </div>
            <div className="flex items-center gap-2">
              {isSpeaking && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold animate-pulse">
                  🔊 Speaking Audio...
                </span>
              )}
              {isListening && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold animate-pulse">
                  🎙️ Listening to You...
                </span>
              )}
            </div>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
            {session?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'STUDENT' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'AI_TUTOR' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow shrink-0">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'STUDENT'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm space-y-3'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>

                  {/* Latex Equation Snippets */}
                  {msg.latexFormulas && msg.latexFormulas.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                        📐 Equations / Formulas:
                      </span>
                      {msg.latexFormulas.map((f, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-lg bg-indigo-950/30 border border-indigo-500/20 font-mono text-[11px] text-cyan-300"
                        >
                          <code>{f}</code>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Followups */}
                  {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                      {msg.suggestedFollowups.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendQuery(s)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 transition"
                        >
                          👉 {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Mic & Chat Input Bar */}
          <div className="pt-4 border-t border-slate-800">
            {/* Live Audio Visualizer Waves when listening */}
            {isListening && (
              <div className="flex items-center justify-center gap-1.5 py-2 mb-2 bg-rose-950/20 border border-rose-500/30 rounded-xl">
                {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-rose-400 rounded-full animate-pulse"
                    style={{ height: `${h * 0.25}px`, animationDelay: `${i * 80}ms` }}
                  />
                ))}
                <span className="text-xs text-rose-300 font-bold ml-2">Listening to your voice...</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-2xl transition shadow-lg ${
                  isListening
                    ? 'bg-rose-600 text-white animate-bounce shadow-rose-600/40'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
                }`}
                title={isListening ? 'Stop Listening' : 'Speak to Voice Tutor'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                placeholder={isListening ? 'Listening to speech...' : 'Ask a question or speak your doubt...'}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={() => handleSendQuery()}
                className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition shadow-lg shadow-indigo-600/30"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Live Interactive Whiteboard & Derivation Steps */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Live Whiteboard Notes</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                Step {session?.currentBoardStep || 1}
              </span>
            </div>

            <div className="space-y-3">
              {session?.boardWhiteboardNotes.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-200 leading-relaxed font-mono"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Tip: Ask "Explain step 2 again in Hindi" or request another proof!</span>
            </div>

            <button
              onClick={() => onAddXp?.(50, 'Mastered Derivations Block')}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Topic Mastered (+50 XP)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiVoiceTutorView;
