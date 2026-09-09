import React, { useState, useEffect } from 'react';
import {
  Presentation,
  Sparkles,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Plus,
  BookOpen,
  Volume2,
  X,
  RefreshCw
} from 'lucide-react';
import {
  SlideDeck,
  GenerateSlidesDto
} from '@studentlife/shared';

interface AiSlideGeneratorViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const AiSlideGeneratorView: React.FC<AiSlideGeneratorViewProps> = ({ onAddXp }) => {
  const [decks, setDecks] = useState<SlideDeck[]>([]);
  const [activeDeckId, setActiveDeckId] = useState<string>('deck-dsa-trees');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlayingVoiceover, setIsPlayingVoiceover] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [topicInput, setTopicInput] = useState<string>('Dynamic Programming & Bellman-Ford');
  const [subjectInput, setSubjectInput] = useState<string>('Computer Science');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    fetchDecks();
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const fetchDecks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/slide-generator/decks');
      const data = await res.json();
      if (data.success && data.data) {
        setDecks(data.data);
        if (data.data.length > 0 && !activeDeckId) {
          setActiveDeckId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load decks', err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeDeck = decks.find(d => d.id === activeDeckId) || decks[0];
  const currentSlide = activeDeck?.slides[currentSlideIndex];

  const handleNextSlide = () => {
    if (activeDeck && currentSlideIndex < activeDeck.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingVoiceover(false);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingVoiceover(false);
    }
  };

  const handlePlayVoiceover = () => {
    if (!currentSlide || !('speechSynthesis' in window)) return;

    if (isPlayingVoiceover) {
      window.speechSynthesis.cancel();
      setIsPlayingVoiceover(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentSlide.voiceoverNarration);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      utterance.onstart = () => setIsPlayingVoiceover(true);
      utterance.onend = () => setIsPlayingVoiceover(false);
      utterance.onerror = () => setIsPlayingVoiceover(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleGenerateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      const dto: GenerateSlidesDto = {
        topic: topicInput,
        subject: subjectInput,
        slideCount: 4
      };

      const res = await fetch('/api/slide-generator/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDecks(prev => [data.data, ...prev]);
        setActiveDeckId(data.data.id);
        setCurrentSlideIndex(0);
        setShowCreateModal(false);
        setTopicInput('');
        setSubjectInput('');
        onAddXp?.(30, 'Generated AI Animated Slide Deck');
      }
    } catch (err) {
      console.error('Failed to generate deck', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <RefreshCw size={36} color="#ec4899" className="animate-spin" />
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Synthesizing AI Slide Presentation Generator...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      {/* Top Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.18) 0%, rgba(244, 63, 94, 0.18) 50%, rgba(15, 23, 42, 0.95) 100%)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(236, 72, 153, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 0 35px rgba(236, 72, 153, 0.15)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div 
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(236, 72, 153, 0.35)',
                flexShrink: 0
              }}
            >
              <Presentation size={28} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                  AI Animated Slide &amp; Visual Generator
                </h1>
                <span 
                  style={{
                    backgroundColor: 'rgba(236, 72, 153, 0.2)',
                    color: '#fbcfe8',
                    border: '1px solid rgba(236, 72, 153, 0.4)',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Sparkles size={12} color="#f472b6" /> Auto Slide Synthesizer
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                Transform lecture notes into visual presentation slides with synchronized AI audio narration walkthroughs.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowCreateModal(true)}
              className="glow-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(236, 72, 153, 0.35)'
              }}
            >
              <Plus size={16} />
              Synthesize Slide Deck
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Side: Deck Library (3 cols) */}
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
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
            <BookOpen size={16} color="#f472b6" />
            Presentation Decks ({decks.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {decks.map(deck => {
              const isActive = deck.id === activeDeck?.id;
              return (
                <button
                  key={deck.id}
                  onClick={() => {
                    setActiveDeckId(deck.id);
                    setCurrentSlideIndex(0);
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    setIsPlayingVoiceover(false);
                  }}
                  className="glow-hover"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '14px',
                    borderRadius: '14px',
                    border: isActive ? '1px solid rgba(236, 72, 153, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: isActive ? 'rgba(236, 72, 153, 0.18)' : 'rgba(2, 6, 23, 0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 14px rgba(236, 72, 153, 0.25)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span 
                      style={{
                        backgroundColor: isActive ? 'rgba(236, 72, 153, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#fbcfe8' : '#cbd5e1',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        fontWeight: 800
                      }}
                    >
                      {deck.subject}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                      {deck.slides.length} Slides
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isActive ? '#ffffff' : '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {deck.topic}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Slide Presentation Theater (9 cols) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeDeck && currentSlide ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* 16:9 Presentation Stage */}
              <div 
                className="glass-panel"
                style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.95) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(30, 27, 75, 0.5) 100%)',
                  border: '1.5px solid rgba(236, 72, 153, 0.35)',
                  borderRadius: '24px',
                  padding: '32px',
                  boxShadow: '0 16px 45px rgba(0, 0, 0, 0.4)',
                  minHeight: '440px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden'
                }}
              >
                {/* Slide Header */}
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {activeDeck.subject} &bull; Slide {currentSlide.slideNumber} of {activeDeck.slides.length}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>16:9 Presentation View</span>
                  </div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                    {currentSlide.title}
                  </h2>
                  {currentSlide.subtitle && (
                    <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
                      {currentSlide.subtitle}
                    </p>
                  )}
                </div>

                {/* Slide Elements Body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '24px 0' }}>
                  {currentSlide.elements.map((el, i) => {
                    if (el.type === 'HEADING') {
                      return (
                        <h4 key={i} style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', borderLeft: '4px solid #38bdf8', paddingLeft: '12px', margin: 0 }}>
                          {el.content}
                        </h4>
                      );
                    }
                    if (el.type === 'BULLET') {
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ec4899', marginTop: '6px', flexShrink: 0 }} />
                          <span>{el.content}</span>
                        </div>
                      );
                    }
                    if (el.type === 'FORMULA') {
                      return (
                        <div key={i} style={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '12px 16px', borderRadius: '12px', fontSize: '0.82rem', fontFamily: 'monospace', color: '#fbcfe8' }}>
                          📐 {el.content}
                        </div>
                      );
                    }
                    if (el.type === 'CODE_BLOCK') {
                      return (
                        <div key={i} style={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px 16px', borderRadius: '12px', fontSize: '0.8rem', fontFamily: 'monospace', color: '#34d399', whiteSpace: 'pre-wrap' }}>
                          {el.content}
                        </div>
                      );
                    }
                    return (
                      <div key={i} style={{ background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '12px 16px', borderRadius: '12px', fontSize: '0.82rem', color: '#c7d2fe' }}>
                        💡 {el.content}
                      </div>
                    );
                  })}
                </div>

                {/* Voiceover Script Subtitle Strip */}
                <div 
                  style={{
                    backgroundColor: 'rgba(2, 6, 23, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
                    <button
                      onClick={handlePlayVoiceover}
                      className="glow-hover"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(236, 72, 153, 0.35)',
                        flexShrink: 0
                      }}
                    >
                      {isPlayingVoiceover ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
                    </button>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#f472b6', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Volume2 size={12} /> AI Voiceover Narration
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#cbd5e1', fontStyle: 'italic', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '380px' }}>
                        &ldquo;{currentSlide.voiceoverNarration}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Slide Prev/Next Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      disabled={currentSlideIndex === 0}
                      onClick={handlePrevSlide}
                      style={{
                        padding: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: '#f8fafc',
                        cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentSlideIndex === 0 ? 0.4 : 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 700, color: '#94a3b8', padding: '0 4px' }}>
                      {currentSlideIndex + 1} / {activeDeck.slides.length}
                    </span>
                    <button
                      disabled={currentSlideIndex === activeDeck.slides.length - 1}
                      onClick={handleNextSlide}
                      style={{
                        padding: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: '#f8fafc',
                        cursor: currentSlideIndex === activeDeck.slides.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: currentSlideIndex === activeDeck.slides.length - 1 ? 0.4 : 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div 
              className="glass-panel"
              style={{ padding: '48px', borderRadius: '24px', textAlign: 'center', color: '#64748b' }}
            >
              No slide deck selected. Create one with the top button!
            </div>
          )}
        </div>

      </div>

      {/* Modal: Generate Deck */}
      {showCreateModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="glass-panel"
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(236, 72, 153, 0.4)',
              borderRadius: '24px',
              maxWidth: '500px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Presentation size={20} color="#f472b6" />
                Synthesize AI Slide Deck
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGenerateDeck} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                  Presentation Topic
                </label>
                <input
                  type="text"
                  required
                  value={topicInput}
                  onChange={e => setTopicInput(e.target.value)}
                  placeholder="e.g. Graph Algorithms / Fundamental Rights"
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(2, 6, 23, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subjectInput}
                  onChange={e => setSubjectInput(e.target.value)}
                  placeholder="e.g. Computer Science / Polity"
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(2, 6, 23, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="glow-hover"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    opacity: isGenerating ? 0.6 : 1,
                    boxShadow: '0 4px 14px rgba(236, 72, 153, 0.35)'
                  }}
                >
                  {isGenerating ? 'Synthesizing Decks...' : 'Generate Deck'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiSlideGeneratorView;
