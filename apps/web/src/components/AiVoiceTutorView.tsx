import React, { useState, useEffect, useRef } from 'react';
import {
  VoiceTutorMessage,
  VoicePersonaType,
  VoiceLanguageMode,
  OralQuizDrill
} from '@studentlife/shared';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  RotateCcw,
  Brain,
  MessageSquare,
  Globe,
  Radio
} from 'lucide-react';

interface AiVoiceTutorViewProps {
  onAddXp?: (xp: number, reason: string) => void;
  onNavigateView?: (view: string) => void;
}

const INITIAL_MESSAGES: VoiceTutorMessage[] = [
  {
    id: 'vt-init',
    role: 'assistant',
    text: 'Namaste! I am your AI Voice Tutor. You can speak your doubts in Hindi or English, ask for derivations, or say "Quiz me" to start hands-free active recall drills!',
    timestamp: 'Just now',
    category: 'EXPLANATION',
    followUpSuggestion: 'Try asking: "Explain 0/1 Knapsack recurrence" or "Quiz me on Calculus"'
  }
];

export const AiVoiceTutorView: React.FC<AiVoiceTutorViewProps> = ({
  onAddXp
}) => {
  const [messages, setMessages] = useState<VoiceTutorMessage[]>(INITIAL_MESSAGES);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcriptBuffer, setTranscriptBuffer] = useState('');
  const [persona, setPersona] = useState<VoicePersonaType>('Socratic Tutor');
  const [languageMode, setLanguageMode] = useState<VoiceLanguageMode>('bilingual');
  const [activeDrill, setActiveDrill] = useState<OralQuizDrill | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [drillsList, setDrillsList] = useState<OralQuizDrill[]>([]);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition & fetch drills on mount
  useEffect(() => {
    fetch('/api/voice-tutor/drills')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setDrillsList(data.data);
        }
      })
      .catch(() => {});

    // Web Speech Recognition API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.lang = languageMode === 'en-US' ? 'en-US' : 'hi-IN';

      recognizer.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscriptBuffer(currentTranscript);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognizer.onerror = (err: any) => {
        console.warn('Speech recognition status:', err.error);
        setIsListening(false);
      };

      recognitionRef.current = recognizer;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [languageMode]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, transcriptBuffer]);

  const speakText = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = languageMode === 'en-US' ? 'en-US' : 'hi-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcriptBuffer.trim()) {
        handleSubmitSpokenQuery(transcriptBuffer.trim());
      }
    } else {
      if (!recognitionRef.current) {
        // Fallback for browsers without webkitSpeechRecognition
        const mockPrompt = prompt('Speech recognition not supported in this browser. Enter your spoken question:');
        if (mockPrompt) {
          handleSubmitSpokenQuery(mockPrompt);
        }
        return;
      }
      setTranscriptBuffer('');
      recognitionRef.current.lang = languageMode === 'en-US' ? 'en-US' : 'hi-IN';
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSubmitSpokenQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: VoiceTutorMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'QUESTION'
    };

    setMessages((prev) => [...prev, userMsg]);
    setTranscriptBuffer('');

    // If currently answering an active oral drill
    if (activeDrill) {
      setIsEvaluating(true);
      try {
        const evalRes = await fetch('/api/voice-tutor/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            drillId: activeDrill.id,
            spokenAnswer: queryText
          })
        });
        const evalData = await evalRes.json();
        if (evalData.success && evalData.data) {
          onAddXp?.(evalData.data.xpEarned, `Oral Recall Drill: ${activeDrill.topic}`);

          const botMsg: VoiceTutorMessage = {
            id: `vt-${Date.now()}`,
            role: 'assistant',
            text: `Evaluation Score: ${evalData.data.scorePercent}%. ${evalData.data.feedback} Full Reference: ${activeDrill.fullExplanation}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            category: 'FEEDBACK'
          };
          setMessages((prev) => [...prev, botMsg]);
          speakText(`Evaluation Score: ${evalData.data.scorePercent} percent. ${evalData.data.feedback}`);
        }
      } catch {
        // Fallback
      } finally {
        setIsEvaluating(false);
      }
      return;
    }

    // Normal voice query
    try {
      const res = await fetch('/api/voice-tutor/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: queryText,
          persona,
          languageMode
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMessages((prev) => [...prev, data.data]);
        speakText(data.data.text);
        onAddXp?.(15, 'Engaged in Voice Tutor Session');
      }
    } catch {
      // Fallback
    }
  };

  const handleStartDrill = (drill: OralQuizDrill) => {
    setActiveDrill(drill);

    const drillMsg: VoiceTutorMessage = {
      id: `drill-prompt-${Date.now()}`,
      role: 'assistant',
      text: `Oral Flashcard: ${drill.question} (Hint: ${drill.hint})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'ORAL_QUIZ_PROMPT'
    };

    setMessages((prev) => [...prev, drillMsg]);
    speakText(`Here is your oral active recall question: ${drill.question}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              Phase 31 • AI Voice Tutor & Hands-Free Oral Drills
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Speak & Learn in Real-Time 🎙️
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Have hands-free conversations with your AI Mentor. Speak doubts naturally in Hindi or English,
              listen to spoken explanations, and practice verbal flashcard drills.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (isSpeaking) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }
                setTtsEnabled(!ttsEnabled);
              }}
              className={`px-3.5 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition ${
                ttsEnabled
                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4" />}
              {ttsEnabled ? 'Voice Output ON' : 'Muted'}
            </button>
          </div>
        </div>

        {/* Persona & Language Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Tutor Persona:</span>
            <div className="flex gap-2">
              {(['Socratic Tutor', 'Rapid Exam Driller', 'Calm Explainer'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    persona === p
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-start md:justify-end">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400 font-medium">Language Mode:</span>
            <select
              value={languageMode}
              onChange={(e) => setLanguageMode(e.target.value as VoiceLanguageMode)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="bilingual">🇮🇳 Hinglish (Bilingual)</option>
              <option value="en-US">🇺🇸 English (US)</option>
              <option value="hi-IN">🇮🇳 Pure Hindi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Visualizer Stage & Live Conversation Transcript */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Glowing Voice Orb & Oral Flashcard Deck */}
        <div className="lg:col-span-1 space-y-6">
          {/* Animated 3D Visualizer Orb */}
          <div className="bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Glowing Orb Animation */}
            <div className="relative my-6 flex items-center justify-center">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isListening
                    ? 'bg-gradient-to-tr from-rose-500 via-purple-600 to-pink-500 animate-pulse shadow-2xl shadow-rose-500/50 scale-110'
                    : isSpeaking
                    ? 'bg-gradient-to-tr from-cyan-400 via-purple-600 to-indigo-500 animate-bounce shadow-2xl shadow-cyan-500/50 scale-105'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-700 shadow-xl shadow-purple-600/30'
                }`}
              >
                <div className="w-24 h-24 rounded-full bg-slate-950/80 backdrop-blur-md flex items-center justify-center text-white">
                  {isListening ? (
                    <Mic className="w-10 h-10 text-rose-400 animate-pulse" />
                  ) : isSpeaking ? (
                    <Volume2 className="w-10 h-10 text-cyan-400 animate-pulse" />
                  ) : (
                    <Brain className="w-10 h-10 text-purple-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Status Label */}
            <div className="text-sm font-bold text-white mb-1">
              {isListening
                ? '🎙️ Listening to you...'
                : isSpeaking
                ? '🔊 Speaking explanation...'
                : 'Ready to Converse'}
            </div>
            <p className="text-xs text-slate-400 mb-6 max-w-xs">
              {isListening
                ? 'Speak clearly into your microphone now'
                : 'Tap microphone button or select an oral drill below'}
            </p>

            {/* Primary Action Button */}
            <button
              onClick={toggleListening}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition transform active:scale-95 ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isListening ? 'Done Speaking (Submit)' : 'Start Speaking'}
            </button>
          </div>

          {/* Quick Oral Flashcards Selector */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Hands-Free Active Recall Drills
              </h3>
              <span className="text-[11px] text-amber-400 font-bold">+35 XP / Drill</span>
            </div>

            <div className="space-y-2">
              {drillsList.map((drill) => (
                <div
                  key={drill.id}
                  onClick={() => handleStartDrill(drill)}
                  className={`p-3 rounded-2xl border transition cursor-pointer ${
                    activeDrill?.id === drill.id
                      ? 'bg-purple-950/40 border-purple-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-purple-300">{drill.subject}</span>
                    <span className="text-[10px] text-slate-400">{drill.topic}</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium line-clamp-2">{drill.question}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Spoken Transcript Stream */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col h-[640px]">
          <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <h3 className="text-base font-bold text-white">Live Voice Transcript & Reasoning</h3>
            </div>
            <button
              onClick={() => setMessages(INITIAL_MESSAGES)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
          </div>

          {/* Transcript Feed */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto py-4 space-y-4 pr-2 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0 text-purple-300">
                    <Brain className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl p-4 rounded-2xl shadow-md ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5 text-[10px] text-slate-400">
                    <span className="font-bold text-purple-300 uppercase tracking-wider">
                      {msg.role === 'user' ? 'You (Spoken)' : `AI Tutor (${persona})`}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="leading-relaxed text-sm">{msg.text}</p>

                  {/* LaTeX Derivation Box if present */}
                  {msg.latexSnippet && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-purple-500/30 font-mono text-xs text-purple-300">
                      <strong>LaTeX Expression: </strong>
                      <code>{msg.latexSnippet}</code>
                    </div>
                  )}

                  {/* Follow-up / Action prompt */}
                  {msg.followUpSuggestion && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-purple-300 flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      {msg.followUpSuggestion}
                    </div>
                  )}

                  {/* Audio replay button */}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="mt-3 text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 font-medium transition"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Re-listen to Voice
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Live Buffer while user is speaking */}
            {isListening && transcriptBuffer && (
              <div className="flex justify-end animate-pulse">
                <div className="max-w-md p-4 rounded-2xl bg-purple-950/50 border border-purple-500/40 text-purple-200">
                  <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1">Transcribing Live...</span>
                  <p className="text-sm italic">"{transcriptBuffer}"</p>
                </div>
              </div>
            )}

            {isEvaluating && (
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
                <Brain className="w-4 h-4 animate-spin text-purple-400" />
                <span>Evaluating your verbal explanation and key concepts...</span>
              </div>
            )}
          </div>

          {/* Text input fallback */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (transcriptBuffer.trim()) {
                handleSubmitSpokenQuery(transcriptBuffer.trim());
              }
            }}
            className="pt-3 border-t border-slate-800 flex gap-2"
          >
            <input
              type="text"
              value={transcriptBuffer}
              onChange={(e) => setTranscriptBuffer(e.target.value)}
              placeholder="Or type your question / oral answer here..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiVoiceTutorView;
