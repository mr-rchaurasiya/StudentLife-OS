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
  Volume2
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
  const currentSlide = activeDeck?.slides[currentSlideIndex] || activeDeck?.slides[0];

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
      utterance.onend = () => setIsPlayingVoiceover(false);
      utterance.onerror = () => setIsPlayingVoiceover(false);
      setIsPlayingVoiceover(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextSlide = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingVoiceover(false);
    if (activeDeck && currentSlideIndex < activeDeck.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingVoiceover(false);
    setCurrentSlideIndex(prev => Math.max(0, prev - 1));
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
        onAddXp?.(30, 'Generated AI Slide Deck');
      }
    } catch (err) {
      console.error('Failed to generate slides', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Synthesizing AI Slide Presentation Generator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Animated Slide & Visual Generator</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto Slide Synthesizer
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Transform lecture notes into visual presentation slides with synchronized AI audio narration walkthroughs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-pink-500/25"
          >
            <Plus className="w-4 h-4" />
            Synthesize Slide Deck
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Deck Library (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-pink-400" />
              Presentation Decks ({decks.length})
            </h3>
            <div className="space-y-2">
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
                    className={`w-full text-left p-3 rounded-xl transition-all border flex flex-col gap-1 ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-950/60 to-slate-900 border-pink-500/50 shadow-md shadow-pink-950/50'
                        : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isActive ? 'bg-pink-500/20 text-pink-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {deck.subject}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {deck.slides.length} Slides
                      </span>
                    </div>
                    <div className={`font-semibold text-sm line-clamp-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {deck.topic}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Slide Presentation Theater (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          {activeDeck && currentSlide ? (
            <div className="space-y-4">
              
              {/* 16:9 Presentation Stage */}
              <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 border-2 border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl min-h-[460px] flex flex-col justify-between overflow-hidden">
                
                {/* Background Accent Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Slide Header */}
                <div className="space-y-2 border-b border-slate-800/80 pb-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest">
                      {activeDeck.subject} • Slide {currentSlide.slideNumber} of {activeDeck.slides.length}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">16:9 Presentation Mode</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentSlide.title}
                  </h2>
                  {currentSlide.subtitle && (
                    <p className="text-sm text-slate-400 font-medium">
                      {currentSlide.subtitle}
                    </p>
                  )}
                </div>

                {/* Slide Elements Body */}
                <div className="space-y-4 my-6 relative z-10">
                  {currentSlide.elements.map((el, i) => {
                    if (el.type === 'HEADING') {
                      return (
                        <h4 key={i} className="text-base font-bold text-cyan-300 border-l-4 border-cyan-400 pl-3">
                          {el.content}
                        </h4>
                      );
                    }
                    if (el.type === 'BULLET') {
                      return (
                        <div key={i} className="flex items-start gap-3 text-sm text-slate-200">
                          <span className="w-2 h-2 rounded-full bg-pink-400 mt-2 shrink-0" />
                          <span className="leading-relaxed">{el.content}</span>
                        </div>
                      );
                    }
                    if (el.type === 'FORMULA') {
                      return (
                        <div key={i} className="bg-slate-950/90 border border-pink-500/30 p-3.5 rounded-xl text-xs font-mono text-pink-300 shadow-md">
                          📐 {el.content}
                        </div>
                      );
                    }
                    if (el.type === 'CODE_BLOCK') {
                      return (
                        <div key={i} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs font-mono text-emerald-300 whitespace-pre-wrap">
                          {el.content}
                        </div>
                      );
                    }
                    return (
                      <div key={i} className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 p-3.5 rounded-xl text-xs text-indigo-200">
                        💡 {el.content}
                      </div>
                    );
                  })}
                </div>

                {/* Voiceover Script Subtitle Strip */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePlayVoiceover}
                      className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/20"
                    >
                      {isPlayingVoiceover ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <div>
                      <div className="text-[10px] text-pink-400 font-bold uppercase flex items-center gap-1">
                        <Volume2 className="w-3 h-3" /> AI Voiceover Narration
                      </div>
                      <p className="text-xs text-slate-300 italic line-clamp-1">
                        "{currentSlide.voiceoverNarration}"
                      </p>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentSlideIndex === 0}
                      onClick={handlePrevSlide}
                      className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 rounded-xl border border-slate-800"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono font-bold text-slate-400 px-2">
                      {currentSlideIndex + 1} / {activeDeck.slides.length}
                    </span>
                    <button
                      disabled={currentSlideIndex === activeDeck.slides.length - 1}
                      onClick={handleNextSlide}
                      className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 rounded-xl border border-slate-800"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              No slide deck selected. Create one with the top button!
            </div>
          )}
        </div>

      </div>

      {/* Modal: Generate Deck */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Presentation className="w-5 h-5 text-pink-400" />
              Synthesize AI Slide Deck
            </h3>
            <form onSubmit={handleGenerateDeck} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Presentation Topic</label>
                <input
                  type="text"
                  required
                  value={topicInput}
                  onChange={e => setTopicInput(e.target.value)}
                  placeholder="e.g. Graph Algorithms / Fundamental Rights"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subjectInput}
                  onChange={e => setSubjectInput(e.target.value)}
                  placeholder="e.g. Computer Science / Polity"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-pink-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl text-xs font-semibold shadow-md disabled:opacity-50"
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
