import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  Clock,
  BookOpen,
  ListOrdered,
  X,
  RefreshCw,
  Globe,
  Settings,
  Headphones
} from 'lucide-react';
import {
  AiPodcast,
  GeneratePodcastDto
} from '@studentlife/shared';

const LANGUAGE_OPTIONS = [
  { code: 'ALL', label: 'All Languages', flag: '🌐' },
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'hinglish', label: 'Hinglish (Bilingual)', flag: '🇮🇳' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'es-ES', label: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'fr-FR', label: 'Français (French)', flag: '🇫🇷' },
  { code: 'de-DE', label: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'mr-IN', label: 'मराठी (Marathi)', flag: '🇮🇳' }
];

export const AiPodcastStudioView: React.FC = () => {
  const [podcasts, setPodcasts] = useState<AiPodcast[]>([]);
  const [activePodcastId, setActivePodcastId] = useState<string>('podcast-quantum-physics');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTurnIndex, setActiveTurnIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [topicInput, setTopicInput] = useState<string>('Indian Constitution & Fundamental Rights');
  const [languageInput, setLanguageInput] = useState<string>('hinglish');
  const [notesInput, setNotesInput] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [customHost1Voice, setCustomHost1Voice] = useState<string>('');
  const [customHost2Voice, setCustomHost2Voice] = useState<string>('');
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);
  const [voiceTestPlaying, setVoiceTestPlaying] = useState<'host1' | 'host2' | null>(null);

  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    fetchPodcasts();

    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);
        }
      }
    };

    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const fetchPodcasts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/ai-podcast/podcasts');
      const data = await res.json();
      if (data.success && data.data) {
        setPodcasts(data.data);
        if (data.data.length > 0 && !activePodcastId) {
          setActivePodcastId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load podcasts', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPodcasts = selectedLanguageFilter === 'ALL'
    ? podcasts
    : podcasts.filter(p => p.language === selectedLanguageFilter || (selectedLanguageFilter === 'en-US' && !p.language));

  const activePodcast = podcasts.find(p => p.id === activePodcastId) || filteredPodcasts[0] || podcasts[0];

  const getLanguageTag = (langCode?: string) => {
    switch (langCode) {
      case 'hinglish': return '🇮🇳 Hinglish';
      case 'hi-IN': return '🇮🇳 हिन्दी';
      case 'es-ES': return '🇪🇸 Español';
      case 'fr-FR': return '🇫🇷 Français';
      case 'de-DE': return '🇩🇪 Deutsch';
      case 'ta-IN': return '🇮🇳 தமிழ்';
      case 'te-IN': return '🇮🇳 తెలుగు';
      case 'bn-IN': return '🇮🇳 বাংলা';
      case 'mr-IN': return '🇮🇳 मराठी';
      default: return '🇺🇸 English';
    }
  };

  // Helper to select the most natural Indian human voice for Host 1 (Male) and Host 2 (Female)
  const getVoiceForSpeaker = (speaker: 'host1' | 'host2', langCode?: string): SpeechSynthesisVoice | null => {
    if (!availableVoices.length) return null;
    const isHindiOrHinglish = langCode === 'hi-IN' || langCode === 'hinglish';

    if (isHindiOrHinglish) {
      if (speaker === 'host1') {
        if (customHost1Voice) {
          const matched = availableVoices.find(v => v.name === customHost1Voice);
          if (matched) return matched;
        }
        // Look for Indian Hindi Male Voices (Microsoft Hemant, Madhur, Ravi, hi-IN male, en-IN male)
        const hindiMale = availableVoices.find(v => {
          const n = v.name.toLowerCase();
          const l = v.lang.toLowerCase();
          return (
            (l.startsWith('hi') || l === 'en-in') &&
            (n.includes('hemant') || n.includes('madhur') || n.includes('ravi') || n.includes('prabhat') || n.includes('male') || n.includes('hie') || n.includes('hid'))
          );
        });
        if (hindiMale) return hindiMale;

        // Fallback to any Hindi voice
        const anyHindi = availableVoices.find(v => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'));
        if (anyHindi) return anyHindi;

        // Fallback to any Indian English voice
        const anyIndian = availableVoices.find(v => v.lang.toLowerCase() === 'en-in' || v.name.toLowerCase().includes('india'));
        if (anyIndian) return anyIndian;
      } else {
        if (customHost2Voice) {
          const matched = availableVoices.find(v => v.name === customHost2Voice);
          if (matched) return matched;
        }
        // Look for Indian Hindi Female Voices (Microsoft Heera, Kalpana, Swara, Neerja, hi-IN female, Google हिन्दी)
        const hindiFemale = availableVoices.find(v => {
          const n = v.name.toLowerCase();
          const l = v.lang.toLowerCase();
          return (
            (l.startsWith('hi') || l === 'en-in') &&
            (n.includes('heera') || n.includes('kalpana') || n.includes('swara') || n.includes('neerja') || n.includes('female') || n.includes('hif') || n.includes('google हिन्दी'))
          );
        });
        if (hindiFemale) return hindiFemale;

        // Fallback to any Hindi voice
        const anyHindi = availableVoices.find(v => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'));
        if (anyHindi) return anyHindi;

        // Fallback to any Indian English voice
        const anyIndian = availableVoices.find(v => v.lang.toLowerCase() === 'en-in' || v.name.toLowerCase().includes('india'));
        if (anyIndian) return anyIndian;
      }
    } else if (langCode && langCode !== 'en-US') {
      // Exact language match (e.g. es-ES, fr-FR, de-DE, ta-IN, te-IN)
      const prefix = langCode.split('-')[0].toLowerCase();
      const matched = availableVoices.find(v => v.lang.toLowerCase().startsWith(prefix));
      if (matched) return matched;
    } else {
      // English voices
      if (speaker === 'host1') {
        const maleEn = availableVoices.find(v => {
          const n = v.name.toLowerCase();
          return v.lang.toLowerCase().startsWith('en') && (n.includes('david') || n.includes('guy') || n.includes('male') || n.includes('george') || n.includes('natural'));
        });
        if (maleEn) return maleEn;
      } else {
        const femaleEn = availableVoices.find(v => {
          const n = v.name.toLowerCase();
          return v.lang.toLowerCase().startsWith('en') && (n.includes('zira') || n.includes('jenny') || n.includes('aria') || n.includes('female') || n.includes('samantha'));
        });
        if (femaleEn) return femaleEn;
      }
    }

    return null;
  };

  const playTurn = (index: number) => {
    if (!activePodcast || !('speechSynthesis' in window) || isMuted) {
      return;
    }

    if (index >= activePodcast.dialogueTurns.length) {
      setIsPlaying(false);
      setActiveTurnIndex(0);
      return;
    }

    window.speechSynthesis.cancel();
    const turn = activePodcast.dialogueTurns[index];
    const utterance = new SpeechSynthesisUtterance(turn.text);

    const isHindiOrHinglish = activePodcast.language === 'hi-IN' || activePodcast.language === 'hinglish';
    const voice = getVoiceForSpeaker(turn.speaker, activePodcast.language);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      const podLang = activePodcast.language || 'en-US';
      utterance.lang = podLang === 'hinglish' ? 'hi-IN' : podLang;
    }

    // Human-like pitch and cadence tuning
    if (isHindiOrHinglish) {
      // Natural Indian Human pacing: slightly slower on Devanagari for maximum clarity
      utterance.rate = playbackSpeed * 0.94;
      utterance.pitch = turn.speaker === 'host1' ? 0.94 : 1.06;
    } else {
      utterance.rate = playbackSpeed;
      utterance.pitch = turn.speaker === 'host1' ? 0.92 : 1.12;
    }

    utterance.onend = () => {
      if (index + 1 < activePodcast.dialogueTurns.length) {
        setActiveTurnIndex(index + 1);
        playTurn(index + 1);
      } else {
        setIsPlaying(false);
        setActiveTurnIndex(0);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleTestVoice = (speaker: 'host1' | 'host2') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setVoiceTestPlaying(speaker);

    const isHindi = activePodcast?.language === 'hi-IN' || activePodcast?.language === 'hinglish';
    const sampleText = speaker === 'host1'
      ? (isHindi ? 'नमस्ते, मैं डॉक्टर हेमंत हूँ - आपका एआई स्टडी पॉडकास्ट होस्ट।' : 'Hello, I am Dr. Alex Vance, your analytical theory specialist.')
      : (isHindi ? 'और मैं प्रोफ़ेसर माया शर्मा, आपकी एग्ज़ाम स्ट्रेटेजिस्ट!' : 'And I am Professor Maya Sharma, your intuitive exam strategist!');

    const utterance = new SpeechSynthesisUtterance(sampleText);
    const voice = getVoiceForSpeaker(speaker, activePodcast?.language);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = isHindi ? 'hi-IN' : 'en-US';
    }

    if (isHindi) {
      utterance.rate = 0.94;
      utterance.pitch = speaker === 'host1' ? 0.94 : 1.06;
    } else {
      utterance.rate = 1.0;
      utterance.pitch = speaker === 'host1' ? 0.92 : 1.12;
    }

    utterance.onend = () => setVoiceTestPlaying(null);
    utterance.onerror = () => setVoiceTestPlaying(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playTurn(activeTurnIndex);
    }
  };

  const handleResetPlayback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setActiveTurnIndex(0);
  };

  const handleGeneratePodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSynthesizing(true);
      const dto: GeneratePodcastDto = {
        topic: topicInput,
        language: languageInput,
        sourceText: notesInput || undefined,
        style: 'DEEP_DIVE'
      };

      const res = await fetch('/api/ai-podcast/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPodcasts(prev => [data.data, ...prev]);
        setActivePodcastId(data.data.id);
        setShowCreateModal(false);
        setTopicInput('');
        setNotesInput('');
        handleResetPlayback();
      }
    } catch (err) {
      console.error('Failed to generate podcast', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <RefreshCw size={36} color="#c084fc" className="animate-spin" />
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Tuning Multi-Language 2-Host AI Podcast Studio...</p>
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
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18) 0%, rgba(236, 72, 153, 0.18) 50%, rgba(15, 23, 42, 0.95) 100%)',
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
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(168, 85, 247, 0.35)',
                flexShrink: 0
              }}
            >
              <Mic size={28} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                  AI Lecture-to-Podcast Studio
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
                  <Sparkles size={12} color="#c084fc" /> Multi-Language 2-Host Dialogue
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                Convert any lecture notes or syllabus topic into an interactive two-host audio discussion in your preferred native language.
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
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(168, 85, 247, 0.35)'
              }}
            >
              <Plus size={16} />
              Generate New Podcast
            </button>
          </div>
        </div>

        {/* Language Filter Chips Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
            <Globe size={14} color="#38bdf8" /> Filter Language:
          </span>
          {LANGUAGE_OPTIONS.slice(0, 6).map((lang) => {
            const isActive = selectedLanguageFilter === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguageFilter(lang.code)}
                className="glow-hover"
                style={{
                  padding: '5px 12px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: isActive ? 'rgba(168, 85, 247, 0.25)' : 'rgba(2, 6, 23, 0.7)',
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {lang.flag} {lang.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr minmax(280px, 320px)', gap: '20px', alignItems: 'start' }}>
        
        {/* Left Side: Podcast Library (3 cols) */}
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
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <BookOpen size={16} color="#c084fc" />
              Podcast Library ({filteredPodcasts.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredPodcasts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 12px', color: '#64748b', fontSize: '0.8rem' }}>
                No podcasts in this language. Click &ldquo;Generate New Podcast&rdquo; to create one!
              </div>
            ) : (
              filteredPodcasts.map(pod => {
                const isActive = pod.id === activePodcast?.id;
                return (
                  <button
                    key={pod.id}
                    onClick={() => {
                      setActivePodcastId(pod.id);
                      handleResetPlayback();
                    }}
                    className="glow-hover"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '14px',
                      borderRadius: '14px',
                      border: isActive ? '1px solid rgba(168, 85, 247, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                      backgroundColor: isActive ? 'rgba(168, 85, 247, 0.18)' : 'rgba(2, 6, 23, 0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 14px rgba(168, 85, 247, 0.25)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span 
                        style={{
                          backgroundColor: isActive ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                          color: isActive ? '#e9d5ff' : '#cbd5e1',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.68rem',
                          fontWeight: 800
                        }}
                      >
                        {getTagOrTopic(pod)}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700 }}>
                        {getLanguageTag(pod.language)}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isActive ? '#ffffff' : '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {pod.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {pod.dialogueTurns.length} Turns &bull; ~{Math.round(pod.totalDurationSeconds / 60)} Mins
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Center: Live Podcast Player & Interactive Dialogue Stream (6 cols) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activePodcast ? (
            <div 
              className="glass-panel"
              style={{
                padding: '28px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
              }}
            >
              
              {/* Podcast Title and Hosts Bar */}
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {activePodcast.topic}
                    </span>
                    <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
                      {getLanguageTag(activePodcast.language)}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={13} color="#38bdf8" /> ~{Math.round(activePodcast.totalDurationSeconds / 60)} Mins
                  </span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', margin: 0 }}>
                  {activePodcast.title}
                </h2>

                {/* Hosts Avatars */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(2, 6, 23, 0.8)', padding: '8px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '1.4rem' }}>{activePodcast.host1.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#c7d2fe', fontSize: '0.82rem' }}>{activePodcast.host1.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{activePodcast.host1.role}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(2, 6, 23, 0.8)', padding: '8px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '1.4rem' }}>{activePodcast.host2.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#fbcfe8', fontSize: '0.82rem' }}>{activePodcast.host2.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{activePodcast.host2.role}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master Audio Playback Controls */}
              <div 
                style={{
                  backgroundColor: 'rgba(2, 6, 23, 0.75)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '16px',
                  padding: '14px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={handleTogglePlay}
                    className="glow-hover"
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      border: 'none',
                      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)'
                    }}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
                  </button>
                  <button
                    onClick={handleResetPlayback}
                    style={{
                      padding: '8px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Restart from Beginning"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Speed:</span>
                  {[1.0, 1.25, 1.5, 2.0].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        border: playbackSpeed === speed ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
                        backgroundColor: playbackSpeed === speed ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                        color: playbackSpeed === speed ? '#ffffff' : '#94a3b8',
                        cursor: 'pointer'
                      }}
                    >
                      {speed}x
                    </button>
                  ))}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: isMuted ? '#f43f5e' : '#38bdf8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: '4px'
                    }}
                  >
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                </div>
              </div>

              {/* Natural Human Voice Engine & Audition Panel */}
              <div
                style={{
                  backgroundColor: 'rgba(2, 6, 23, 0.65)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '16px',
                  padding: '12px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Headphones size={14} color="#38bdf8" />
                      {(activePodcast.language === 'hi-IN' || activePodcast.language === 'hinglish') ? '🇮🇳 Indian Human Voice Engine (Active)' : '🎙️ Dual-Host AI Voice Engine'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Audition Host 1 */}
                    <button
                      onClick={() => handleTestVoice('host1')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(165, 180, 252, 0.3)',
                        backgroundColor: voiceTestPlaying === 'host1' ? 'rgba(165, 180, 252, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                        color: '#c7d2fe',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Volume2 size={13} color="#a5b4fc" />
                      {voiceTestPlaying === 'host1' ? 'Speaking...' : `Test ${activePodcast.host1.name.split(' ')[0]}`}
                    </button>

                    {/* Audition Host 2 */}
                    <button
                      onClick={() => handleTestVoice('host2')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(244, 114, 182, 0.3)',
                        backgroundColor: voiceTestPlaying === 'host2' ? 'rgba(244, 114, 182, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                        color: '#fbcfe8',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Volume2 size={13} color="#f472b6" />
                      {voiceTestPlaying === 'host2' ? 'Speaking...' : `Test ${activePodcast.host2.name.split(' ')[0]}`}
                    </button>

                    <button
                      onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: showVoiceSettings ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem'
                      }}
                      title="Customize TTS Voices"
                    >
                      <Settings size={13} />
                      Voice Settings
                    </button>
                  </div>
                </div>

                {/* Voice Status & Custom Voice Selectors Drawer */}
                {showVoiceSettings && (
                  <div 
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '10px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a5b4fc', display: 'block', marginBottom: '4px' }}>
                        👨‍🏫 {activePodcast.host1.name} (Male Voice):
                      </label>
                      <select
                        value={customHost1Voice || getVoiceForSpeaker('host1', activePodcast.language)?.name || ''}
                        onChange={(e) => setCustomHost1Voice(e.target.value)}
                        style={{
                          width: '100%',
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(165, 180, 252, 0.3)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          padding: '6px 10px',
                          fontSize: '0.75rem',
                          outline: 'none'
                        }}
                      >
                        <option value="">Auto Indian Human Male Voice</option>
                        {availableVoices.map(v => (
                          <option key={`h1-${v.name}`} value={v.name}>
                            {v.name} ({v.lang})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f472b6', display: 'block', marginBottom: '4px' }}>
                        👩‍🔬 {activePodcast.host2.name} (Female Voice):
                      </label>
                      <select
                        value={customHost2Voice || getVoiceForSpeaker('host2', activePodcast.language)?.name || ''}
                        onChange={(e) => setCustomHost2Voice(e.target.value)}
                        style={{
                          width: '100%',
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(244, 114, 182, 0.3)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          padding: '6px 10px',
                          fontSize: '0.75rem',
                          outline: 'none'
                        }}
                      >
                        <option value="">Auto Indian Human Female Voice</option>
                        {availableVoices.map(v => (
                          <option key={`h2-${v.name}`} value={v.name}>
                            {v.name} ({v.lang})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Dialogue Transcript Stream */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '460px', overflowY: 'auto', paddingRight: '4px' }}>
                {activePodcast.dialogueTurns.map((turn, tIdx) => {
                  const isCurrent = tIdx === activeTurnIndex && isPlaying;
                  const isHost1 = turn.speaker === 'host1';
                  const currentHost = isHost1 ? activePodcast.host1 : activePodcast.host2;

                  return (
                    <div
                      key={turn.id}
                      onClick={() => {
                        setActiveTurnIndex(tIdx);
                        if (isPlaying) playTurn(tIdx);
                      }}
                      className="glow-hover"
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        border: isCurrent ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
                        backgroundColor: isCurrent ? 'rgba(168, 85, 247, 0.18)' : 'rgba(2, 6, 23, 0.6)',
                        display: 'flex',
                        gap: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isCurrent ? '0 4px 18px rgba(168, 85, 247, 0.25)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '1.6rem', flexShrink: 0, marginTop: '2px' }}>{currentHost.avatar}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.82rem', color: isHost1 ? '#a5b4fc' : '#f472b6' }}>
                            {currentHost.name}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>Turn {tIdx + 1}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.88rem', color: '#f1f5f9', lineHeight: 1.55 }}>
                          {turn.text}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '4px' }}>
                          {turn.keyConcepts.map((k, i) => (
                            <span key={i} style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div 
              className="glass-panel"
              style={{ padding: '48px', borderRadius: '24px', textAlign: 'center', color: '#64748b' }}
            >
              No podcast loaded. Synthesize one from the top button!
            </div>
          )}
        </div>

        {/* Right Side: Key Takeaways & Exam Points (3 cols) */}
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
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
            <ListOrdered size={16} color="#ec4899" />
            Podcast Takeaways
          </h3>
          {activePodcast && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
              {activePodcast.summaryKeyTakeaways.map((point, idx) => (
                <div key={idx} style={{ padding: '12px', backgroundColor: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#c084fc', fontWeight: 800, fontFamily: 'monospace' }}>{idx + 1}.</span>
                  <span style={{ color: '#cbd5e1', lineHeight: 1.5 }}>{point}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal: Synthesize New Podcast */}
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
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '24px',
              maxWidth: '540px',
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
                <Mic size={20} color="#c084fc" />
                Synthesize Multi-Language AI Podcast
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGeneratePodcast} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                  Target Topic or Chapter
                </label>
                <input
                  type="text"
                  required
                  value={topicInput}
                  onChange={e => setTopicInput(e.target.value)}
                  placeholder="e.g. Graph Dijkstra Algorithm / Fundamental Rights"
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
                  Podcast Audio Language
                </label>
                <select
                  value={languageInput}
                  onChange={e => setLanguageInput(e.target.value)}
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
                    cursor: 'pointer'
                  }}
                >
                  <option value="hinglish">🇮🇳 Hinglish (Bilingual / हिन्दी + English)</option>
                  <option value="en-US">🇺🇸 English (US/Global)</option>
                  <option value="hi-IN">🇮🇳 शुद्ध हिन्दी (Hindi)</option>
                  <option value="es-ES">🇪🇸 Español (Spanish)</option>
                  <option value="fr-FR">🇫🇷 Français (French)</option>
                  <option value="de-DE">🇩🇪 Deutsch (German)</option>
                  <option value="ta-IN">🇮🇳 தமிழ் (Tamil)</option>
                  <option value="te-IN">🇮🇳 తెలుగు (Telugu)</option>
                  <option value="bn-IN">🇮🇳 বাংলা (Bengali)</option>
                  <option value="mr-IN">🇮🇳 मराठी (Marathi)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                  Source Notes Text (Optional)
                </label>
                <textarea
                  rows={4}
                  value={notesInput}
                  onChange={e => setNotesInput(e.target.value)}
                  placeholder="Paste class notes or key equations for host discussion in this language..."
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(2, 6, 23, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
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
                  disabled={isSynthesizing}
                  className="glow-hover"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: isSynthesizing ? 'not-allowed' : 'pointer',
                    opacity: isSynthesizing ? 0.6 : 1,
                    boxShadow: '0 4px 14px rgba(168, 85, 247, 0.35)'
                  }}
                >
                  {isSynthesizing ? 'Synthesizing Dialogue...' : 'Create & Play'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const getTagOrTopic = (pod: AiPodcast) => {
  return pod.topic.split('&')[0];
};

export default AiPodcastStudioView;
