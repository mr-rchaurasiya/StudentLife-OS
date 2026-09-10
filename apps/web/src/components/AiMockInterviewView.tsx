import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Award,
  CheckCircle2,
  Briefcase,
  Play,
  RotateCcw,
  User
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
  const [micLanguage, setMicLanguage] = useState<'en-IN' | 'hi-IN' | 'en-US'>('en-IN');
  const [micStatusMsg, setMicStatusMsg] = useState<string>('');

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
        setMicStatusMsg('');
      }
    } catch (err) {
      console.error('Failed to start interview', err);
    } finally {
      setIsStarting(false);
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      try {
        speechRecognition?.stop();
      } catch {}
      setIsListening(false);
      setMicStatusMsg('Microphone paused.');
    } else {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRec) {
        alert('Web Speech Recognition is not supported in this browser. Please use Chrome/Edge or type your answer directly!');
        return;
      }

      try {
        const recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = micLanguage;

        recognition.onstart = () => {
          setIsListening(true);
          setMicStatusMsg('🎤 Listening live... speak clearly into your mic.');
        };

        recognition.onresult = (event: any) => {
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript + ' ';
          }
          if (fullTranscript.trim()) {
            setSpokenAnswer(fullTranscript.trim());
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition warning/error:', e.error);
          if (e.error === 'not-allowed') {
            setMicStatusMsg('⚠️ Microphone permission was blocked. Please enable mic access in your browser address bar, or type below.');
          } else if (e.error === 'no-speech') {
            setMicStatusMsg('⚠️ No speech detected yet. Keep speaking or type below.');
          } else {
            setMicStatusMsg(`Speech note: ${e.error || 'Check mic connection'}`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        setSpeechRecognition(recognition);
      } catch (err: any) {
        console.error('Recognition start error:', err);
        setMicStatusMsg('Could not access microphone. Please type your response directly.');
        setIsListening(false);
      }
    }
  };

  const handleFillSampleAnswer = () => {
    const currentQ = session?.questions[session.currentQuestionIndex];
    const sample = currentQ?.expectedPoints?.length
      ? `In my previous project, regarding ${currentQ.questionText.slice(0, 45)}... I took the initiative to design a scalable solution incorporating ${currentQ.expectedPoints.slice(0, 2).join(' and ')}. As a result, we improved reliability and achieved high operational performance.`
      : `Situation: During our production deployment, we needed to optimize latency. Task: I was responsible for refactoring the bottleneck service. Action: I implemented caching, asynchronous workers, and thorough integration tests. Result: We reduced response time from 420ms to 85ms and scaled to 50,000 active users.`;
    setSpokenAnswer(sample);
    setMicStatusMsg('✨ Sample response inserted! Click "Submit Response" to evaluate.');
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

  const TRACKS = [
    {
      track: 'SDE_TECH' as InterviewTrack,
      title: 'FAANG & Startup SDE Board',
      desc: 'Graph algorithms, distributed caching, concurrency & system design architecture.',
      badge: 'Tech Placement 💻',
      color: '#6366f1'
    },
    {
      track: 'UPSC_PERSONALITY' as InterviewTrack,
      title: 'Civil Services (IAS/IPS) Board',
      desc: 'Administrative ethics, constitutional morality, geopolitical debates & crisis management.',
      badge: 'UPSC CSE 🏛️',
      color: '#f59e0b'
    },
    {
      track: 'DATA_SCIENCE_AI' as InterviewTrack,
      title: 'AI & Machine Learning Specialist',
      desc: 'Deep learning backpropagation, LLM fine-tuning, regression metrics & MLOps pipelines.',
      badge: 'AI Roles 🤖',
      color: '#06b6d4'
    },
    {
      track: 'COLLEGE_VIVA' as InterviewTrack,
      title: 'University Viva & Project Defense',
      desc: 'Final year thesis defense, database normalization & architectural trade-offs.',
      badge: 'College Exam 🎓',
      color: '#a855f7'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.28) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(225, 29, 72, 0.28) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          padding: '28px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)',
              flexShrink: 0
            }}
          >
            <Briefcase size={28} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                AI Voice Mock Interview & Viva Coach
              </h1>
              <span
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#fef08a',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Sparkles size={12} color="#facc15" /> STAR Method Evaluator
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Simulate high-stakes SDE technical rounds and UPSC personality boards with real-time speech evaluation and STAR rating breakdown.
            </p>
          </div>
        </div>

        {session && (
          <button
            onClick={() => setSession(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              position: 'relative',
              zIndex: 1
            }}
          >
            <RotateCcw size={14} /> End / Switch Track
          </button>
        )}
      </div>

      {!session ? (
        /* Track Configurator Screen */
        <div
          style={{
            maxWidth: '920px',
            width: '100%',
            margin: '0 auto',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <Briefcase size={20} color="#fbbf24" />
              Select Your Target Mock Interview Board
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Choose a customized board profile with targeted technical questions and evaluation rubrics.
            </p>
          </div>

          {/* 4 Interactive Board Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
            {TRACKS.map((item) => {
              const isSelected = selectedTrack === item.track;
              return (
                <button
                  key={item.track}
                  onClick={() => setSelectedTrack(item.track)}
                  style={{
                    padding: '20px',
                    borderRadius: '18px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    border: isSelected ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(15, 23, 42, 0.95) 100%)'
                      : 'rgba(2, 6, 23, 0.55)',
                    boxShadow: isSelected ? '0 8px 24px rgba(245, 158, 11, 0.25)' : 'none',
                    transform: isSelected ? 'translateY(-2px)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.98rem', color: isSelected ? '#ffffff' : '#e2e8f0' }}>
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                        color: isSelected ? '#fef08a' : '#94a3b8',
                        border: isSelected ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="#fbbf24" /> Candidate Name
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Enter candidate name (e.g. Student Aspirant)"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'rgba(2, 6, 23, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                padding: '12px 16px',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            onClick={handleStartInterview}
            disabled={isStarting}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #e11d48 50%, #6366f1 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 24px rgba(225, 29, 72, 0.35)',
              transition: 'all 0.2s',
              opacity: isStarting ? 0.7 : 1
            }}
          >
            <Play size={18} />
            {isStarting ? 'Initiating Mock Board...' : 'Begin Live Mock Interview'}
          </button>
        </div>
      ) : (
        /* Active Interview Simulator Screen */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
          
          {/* Center: Question & Speech Capture Canvas (8 cols) */}
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!session.isCompleted ? (
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '32px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(16px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
              >
                {/* Question Header */}
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Question {session.currentQuestionIndex + 1} of {session.questions.length} &bull; {session.track}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                      Category: {session.questions[session.currentQuestionIndex]?.category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.4, margin: 0 }}>
                    "{session.questions[session.currentQuestionIndex]?.questionText}"
                  </h2>
                </div>

                {/* Speech Recording / Text Response Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700 }}>
                        Your Oral Response (STAR Format):
                      </span>
                      {/* Language Accent Selector */}
                      <select
                        value={micLanguage}
                        onChange={(e) => setMicLanguage(e.target.value as any)}
                        style={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          color: '#94a3b8',
                          fontSize: '0.72rem',
                          padding: '3px 6px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="en-IN">🇮🇳 English (India)</option>
                        <option value="hi-IN">🇮🇳 Hindi</option>
                        <option value="en-US">🇺🇸 English (US)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={handleFillSampleAnswer}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          color: '#fef08a'
                        }}
                      >
                        <Sparkles size={14} color="#facc15" /> Fill Sample Answer
                      </button>

                      <button
                        onClick={handleToggleListening}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '12px',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: isListening ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                          backgroundColor: isListening ? '#e11d48' : 'rgba(255, 255, 255, 0.08)',
                          color: '#ffffff',
                          boxShadow: isListening ? '0 0 16px rgba(225, 29, 72, 0.6)' : 'none'
                        }}
                      >
                        {isListening ? <Mic size={15} /> : <MicOff size={15} />}
                        {isListening ? 'Listening (Speak Now)...' : 'Enable Microphone'}
                      </button>
                    </div>
                  </div>

                  {micStatusMsg && (
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      backgroundColor: isListening ? 'rgba(225, 29, 72, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                      border: isListening ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                      color: isListening ? '#fda4af' : '#fef08a',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}>
                      {micStatusMsg}
                    </div>
                  )}

                  <textarea
                    rows={6}
                    value={spokenAnswer}
                    onChange={(e) => setSpokenAnswer(e.target.value)}
                    placeholder="Speak your answer into the microphone or type your response directly here (Situation, Task, Action, Result)..."
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: 'rgba(2, 6, 23, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '16px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                    💡 Tip: Frame answer with Situation, Task, Action, and quantifiable Result (STAR).
                  </span>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !spokenAnswer.trim()}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
                      transition: 'all 0.2s',
                      opacity: isSubmitting || !spokenAnswer.trim() ? 0.45 : 1
                    }}
                  >
                    <CheckCircle2 size={16} />
                    {isSubmitting ? 'Evaluating STAR...' : 'Submit Response'}
                  </button>
                </div>
              </div>
            ) : (
              /* Completed Scorecard Hero */
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '24px',
                  padding: '40px',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  backdropFilter: 'blur(16px)'
                }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    margin: '0 auto',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)'
                  }}
                >
                  🏆
                </div>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    Interview Board Completed!
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '6px 0 0 0' }}>
                    Candidate: <strong style={{ color: '#ffffff' }}>{session.candidateName}</strong> &bull; Track: <strong style={{ color: '#fef08a' }}>{session.track}</strong>
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(2, 6, 23, 0.7)',
                    padding: '24px',
                    borderRadius: '18px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    maxWidth: '380px',
                    margin: '0 auto',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Overall Performance Score
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace', margin: '6px 0' }}>
                    {session.totalScore} <span style={{ fontSize: '1.25rem', color: '#94a3b8' }}>/ 100</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
                    ✅ Passed Benchmark with High Hireability Rating
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setSession(null)}
                    style={{
                      padding: '12px 28px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.35)'
                    }}
                  >
                    Start Another Round
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Real-time STAR Evaluations Log (4 cols) */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                backdropFilter: 'blur(16px)'
              }}
            >
              <h3
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  margin: '0 0 16px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Award size={16} color="#fbbf24" />
                STAR Scorecard Log ({session.evaluations.length})
              </h3>

              {session.evaluations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
                  {session.evaluations.map((ev, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: 'rgba(2, 6, 23, 0.65)',
                        padding: '14px',
                        borderRadius: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.8rem' }}>
                          Question {idx + 1} Score:
                        </span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#fbbf24', fontSize: '0.9rem' }}>
                          {ev.overallScore} / 100
                        </span>
                      </div>

                      {/* STAR 4-Quadrant Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '6px 2px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                          <div style={{ color: '#94a3b8' }}>S</div>
                          <div style={{ fontWeight: 800, color: '#67e8f9', marginTop: '2px' }}>{ev.starMethodScore.situation}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '6px 2px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                          <div style={{ color: '#94a3b8' }}>T</div>
                          <div style={{ fontWeight: 800, color: '#67e8f9', marginTop: '2px' }}>{ev.starMethodScore.task}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '6px 2px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                          <div style={{ color: '#94a3b8' }}>A</div>
                          <div style={{ fontWeight: 800, color: '#67e8f9', marginTop: '2px' }}>{ev.starMethodScore.action}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '6px 2px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                          <div style={{ color: '#94a3b8' }}>R</div>
                          <div style={{ fontWeight: 800, color: '#67e8f9', marginTop: '2px' }}>{ev.starMethodScore.result}</div>
                        </div>
                      </div>

                      {ev.strengths.length > 0 && (
                        <div style={{ fontSize: '0.75rem', color: '#d1fae5', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', lineHeight: 1.4 }}>
                          <strong style={{ color: '#34d399' }}>Strengths:</strong> {ev.strengths[0]}
                        </div>
                      )}

                      {ev.improvements.length > 0 && (
                        <div style={{ fontSize: '0.75rem', color: '#fef3c7', backgroundColor: 'rgba(245, 158, 11, 0.12)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)', lineHeight: 1.4 }}>
                          <strong style={{ color: '#fbbf24' }}>Improve:</strong> {ev.improvements[0]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b', fontSize: '0.78rem' }}>
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
