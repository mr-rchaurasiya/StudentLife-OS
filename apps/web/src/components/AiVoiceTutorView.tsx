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
  Radio,
  Send
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      {/* Top Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18) 0%, rgba(99, 102, 241, 0.18) 50%, rgba(15, 23, 42, 0.95) 100%)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 0 35px rgba(168, 85, 247, 0.15)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div 
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(168, 85, 247, 0.35)',
                flexShrink: 0
              }}
            >
              <Radio size={28} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                  Speak &amp; Learn in Real-Time 🎙️
                </h1>
                <span 
                  style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                    color: '#e9d5ff',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Sparkles size={12} color="#c084fc" /> Phase 31 &bull; AI Voice Tutor Engine
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                Have hands-free conversations with your AI Mentor. Speak doubts naturally in Hindi or English, listen to spoken explanations, and practice verbal flashcard drills.
              </p>
            </div>
          </div>

          {/* Voice Output Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                if (isSpeaking) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }
                setTtsEnabled(!ttsEnabled);
              }}
              className="glow-hover"
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: ttsEnabled ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: ttsEnabled ? 'rgba(168, 85, 247, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                color: ttsEnabled ? '#d8b4fe' : '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {ttsEnabled ? <Volume2 size={16} color="#c084fc" /> : <VolumeX size={16} />}
              {ttsEnabled ? 'Voice Output ON' : 'Muted'}
            </button>
          </div>
        </div>

        {/* Persona & Language Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Tutor Persona:</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(['Socratic Tutor', 'Rapid Exam Driller', 'Calm Explainer'] as const).map((p) => {
                const isActive = persona === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPersona(p)}
                    className="glow-hover"
                    style={{
                      padding: '6px 14px',
                      borderRadius: '10px',
                      border: isActive ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
                      backgroundColor: isActive ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(2, 6, 23, 0.7)',
                      background: isActive ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(2, 6, 23, 0.7)',
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 4px 12px rgba(168, 85, 247, 0.3)' : 'none'
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Language:</span>
            <select
              value={languageMode}
              onChange={(e) => setLanguageMode(e.target.value as VoiceLanguageMode)}
              style={{
                backgroundColor: 'rgba(2, 6, 23, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                color: '#f8fafc',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="bilingual">🇮🇳 Hinglish (Bilingual)</option>
              <option value="en-US">🇺🇸 English (US)</option>
              <option value="hi-IN">🇮🇳 Pure Hindi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Visualizer Stage & Live Conversation Transcript */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Glowing Voice Orb & Oral Flashcard Deck */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Animated 3D Visualizer Orb Card */}
          <div 
            className="glass-panel"
            style={{
              padding: '28px 24px',
              borderRadius: '24px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Glowing Orb Animation */}
            <div style={{ position: 'relative', margin: '20px 0 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.4s ease',
                  background: isListening
                    ? 'linear-gradient(135deg, #f43f5e, #ec4899, #a855f7)'
                    : isSpeaking
                    ? 'linear-gradient(135deg, #38bdf8, #6366f1, #a855f7)'
                    : 'linear-gradient(135deg, #a855f7, #6366f1)',
                  boxShadow: isListening
                    ? '0 0 45px rgba(244, 63, 94, 0.55)'
                    : isSpeaking
                    ? '0 0 45px rgba(56, 189, 248, 0.55)'
                    : '0 0 25px rgba(168, 85, 247, 0.35)',
                  transform: isListening ? 'scale(1.08)' : isSpeaking ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <div 
                  style={{
                    width: '92px',
                    height: '92px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(2, 6, 23, 0.9)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}
                >
                  {isListening ? (
                    <Mic size={38} color="#f43f5e" className="animate-pulse" />
                  ) : isSpeaking ? (
                    <Volume2 size={38} color="#38bdf8" className="animate-pulse" />
                  ) : (
                    <Brain size={38} color="#c084fc" />
                  )}
                </div>
              </div>
            </div>

            {/* Status Label */}
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
              {isListening
                ? '🎙️ Listening to you...'
                : isSpeaking
                ? '🔊 Speaking explanation...'
                : 'Ready to Converse'}
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 20px 0', maxWidth: '280px', lineHeight: 1.4 }}>
              {isListening
                ? 'Speak clearly into your microphone now'
                : 'Tap microphone button or select an oral drill below'}
            </p>

            {/* Primary Action Button */}
            <button
              onClick={toggleListening}
              className="glow-hover"
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '16px',
                border: 'none',
                background: isListening
                  ? 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)'
                  : 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isListening ? '0 8px 24px rgba(225, 29, 72, 0.4)' : '0 8px 24px rgba(168, 85, 247, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              {isListening ? 'Done Speaking (Submit)' : 'Start Speaking'}
            </button>
          </div>

          {/* Quick Oral Flashcards Selector */}
          <div 
            className="glass-panel"
            style={{
              padding: '20px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Zap size={16} color="#fbbf24" />
                Hands-Free Active Recall Drills
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800 }}>+35 XP / Drill</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {drillsList.map((drill) => {
                const isActive = activeDrill?.id === drill.id;
                return (
                  <div
                    key={drill.id}
                    onClick={() => handleStartDrill(drill)}
                    className="glow-hover"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: isActive ? '1px solid rgba(168, 85, 247, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                      backgroundColor: isActive ? 'rgba(168, 85, 247, 0.18)' : 'rgba(2, 6, 23, 0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 4px 14px rgba(168, 85, 247, 0.2)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                      <span style={{ fontWeight: 800, color: '#c084fc' }}>{drill.subject}</span>
                      <span style={{ color: '#94a3b8' }}>{drill.topic}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
                      {drill.question}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Spoken Transcript Stream */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            display: 'flex',
            flexDirection: 'column',
            height: '660px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="#c084fc" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Live Voice Transcript &amp; Reasoning
              </h3>
            </div>
            <button
              onClick={() => setMessages(INITIAL_MESSAGES)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={13} /> Clear
            </button>
          </div>

          {/* Transcript Feed */}
          <div ref={chatScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {msg.role === 'assistant' && (
                  <div 
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(168, 85, 247, 0.2)',
                      border: '1px solid rgba(168, 85, 247, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#c084fc',
                      flexShrink: 0
                    }}
                  >
                    <Brain size={18} />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '80%',
                    padding: '16px',
                    borderRadius: '16px',
                    backgroundColor: msg.role === 'user' ? '#7c3aed' : 'rgba(2, 6, 23, 0.85)',
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: msg.role === 'user' ? '#ffffff' : '#f1f5f9',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '6px', fontSize: '0.7rem', color: msg.role === 'user' ? '#e9d5ff' : '#94a3b8' }}>
                    <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: msg.role === 'user' ? '#ffffff' : '#c084fc' }}>
                      {msg.role === 'user' ? 'You (Spoken)' : `AI Tutor (${persona})`}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.55 }}>{msg.text}</p>

                  {/* LaTeX Derivation Box if present */}
                  {msg.latexSnippet && (
                    <div style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(168, 85, 247, 0.3)', fontFamily: 'monospace', fontSize: '0.78rem', color: '#d8b4fe' }}>
                      <strong>LaTeX Expression: </strong>
                      <code>{msg.latexSnippet}</code>
                    </div>
                  )}

                  {/* Follow-up / Action prompt */}
                  {msg.followUpSuggestion && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      <Sparkles size={13} />
                      {msg.followUpSuggestion}
                    </div>
                  )}

                  {/* Audio replay button */}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      style={{
                        marginTop: '10px',
                        background: 'none',
                        border: 'none',
                        color: '#38bdf8',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: 0
                      }}
                    >
                      <Volume2 size={13} /> Re-listen to Voice
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Live Buffer while user is speaking */}
            {isListening && transcriptBuffer && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ maxWidth: '75%', padding: '14px', borderRadius: '14px', backgroundColor: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.4)', color: '#e9d5ff' }}>
                  <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, color: '#c084fc', display: 'block', marginBottom: '4px' }}>Transcribing Live...</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontStyle: 'italic' }}>&ldquo;{transcriptBuffer}&rdquo;</p>
                </div>
              </div>
            )}

            {isEvaluating && (
              <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#c7d2fe', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Brain size={16} className="animate-spin" color="#a855f7" />
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
            style={{ paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '10px' }}
          >
            <input
              type="text"
              value={transcriptBuffer}
              onChange={(e) => setTranscriptBuffer(e.target.value)}
              placeholder="Or type your question / oral answer here..."
              style={{
                flex: 1,
                backgroundColor: 'rgba(2, 6, 23, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '10px 16px',
                color: '#f8fafc',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              className="glow-hover"
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Send size={15} /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiVoiceTutorView;
