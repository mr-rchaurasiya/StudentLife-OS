import React, { useState, useEffect, useRef } from 'react';
import {
  LoFiAudioTrack,
  AmbientLayerSetting,
  BinauralPresetConfig
} from '@studentlife/shared';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Radio,
  X
} from 'lucide-react';

const FALLBACK_TRACKS: LoFiAudioTrack[] = [
  {
    id: 'track-1',
    title: 'Midnight Tokyo Study Session',
    artist: 'Lofi Records & Chillhop Academy',
    genre: 'CHILL_LOFI',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    artworkUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    durationSeconds: 165,
    bpm: 78
  },
  {
    id: 'track-2',
    title: 'Late Night Coffee & Algorithms',
    artist: 'Komorebi Soundscapes',
    genre: 'PIANO_STUDY',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-chill-medium-version-159456.mp3',
    artworkUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80',
    durationSeconds: 142,
    bpm: 72
  },
  {
    id: 'track-3',
    title: 'Cyberpunk Cyber-Focus 2077',
    artist: 'Neon Horizon',
    genre: 'DEEP_SYNTHWAVE',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2023/04/10/audio_517904b779.mp3?filename=synthwave-80s-110045.mp3',
    artworkUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&auto=format&fit=crop&q=80',
    durationSeconds: 198,
    bpm: 90
  }
];

const FALLBACK_AMBIENT: AmbientLayerSetting[] = [
  {
    id: 'rain',
    name: 'Monsoon Rain',
    icon: '🌧️',
    volume: 50,
    isMuted: false,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=rain-and-thunder-16705.mp3'
  },
  {
    id: 'cafe',
    name: 'Library Cafe',
    icon: '☕',
    volume: 35,
    isMuted: false,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_7314541bf5.mp3?filename=coffee-shop-ambience-9441.mp3'
  },
  {
    id: 'fire',
    name: 'Fireplace',
    icon: '🪵',
    volume: 30,
    isMuted: true,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c3be402511.mp3?filename=crackling-fireplace-nature-sounds-7813.mp3'
  },
  {
    id: 'keyboard',
    name: 'Typing',
    icon: '⌨️',
    volume: 40,
    isMuted: true,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=typing-on-a-keyboard-104990.mp3'
  }
];

const BINAURAL_PRESETS: BinauralPresetConfig[] = [
  { frequencyHz: 40, name: '40Hz Gamma', targetMentalState: 'DEEP_FOCUS', description: 'Peak problem solving & deep coding' },
  { frequencyHz: 14, name: '14Hz Beta', targetMentalState: 'MEMORY_RETENTION', description: 'Active recall & flashcard review' },
  { frequencyHz: 10, name: '10Hz Alpha', targetMentalState: 'CREATIVE_FLOW', description: 'Calm alertness & math derivations' },
  { frequencyHz: 6, name: '6Hz Theta', targetMentalState: 'MEDITATION_RELAX', description: 'Stress relief & post-exam calm' }
];

export const FocusAudioPlayerWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'LOFI' | 'AMBIENT' | 'BINAURAL'>('LOFI');
  const [tracks, setTracks] = useState<LoFiAudioTrack[]>(FALLBACK_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(70);
  const [ambientLayers, setAmbientLayers] = useState<AmbientLayerSetting[]>(FALLBACK_AMBIENT);
  const [isBinauralActive, setIsBinauralActive] = useState(false);
  const [selectedBinauralHz, setSelectedBinauralHz] = useState(40);

  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    fetchAudioData();
  }, []);

  const fetchAudioData = async () => {
    try {
      const [trackRes, ambRes] = await Promise.all([
        fetch('/api/audio/tracks'),
        fetch('/api/audio/ambient-layers')
      ]);
      if (trackRes.ok) {
        const tJson = await trackRes.json();
        if (tJson.data && tJson.data.length > 0) setTracks(tJson.data);
      }
      if (ambRes.ok) {
        const aJson = await ambRes.json();
        if (aJson.data && aJson.data.length > 0) setAmbientLayers(aJson.data);
      }
    } catch {
      // Use fallback
    }
  };

  // Main track audio controller
  useEffect(() => {
    if (!mainAudioRef.current) {
      mainAudioRef.current = new Audio(tracks[currentTrackIndex]?.streamUrl);
      mainAudioRef.current.loop = true;
    } else {
      mainAudioRef.current.src = tracks[currentTrackIndex]?.streamUrl;
      if (isPlaying) {
        mainAudioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrackIndex, tracks]);

  useEffect(() => {
    if (mainAudioRef.current) {
      mainAudioRef.current.volume = masterVolume / 100;
      if (isPlaying) {
        mainAudioRef.current.play().catch(() => {});
      } else {
        mainAudioRef.current.pause();
      }
    }
  }, [isPlaying, masterVolume]);

  // Binaural Oscillator Web Audio Controller
  useEffect(() => {
    if (isBinauralActive) {
      startBinauralBeats(selectedBinauralHz);
    } else {
      stopBinauralBeats();
    }
    return () => stopBinauralBeats();
  }, [isBinauralActive, selectedBinauralHz]);

  const startBinauralBeats = (freq: number) => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }

      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 5, ctx.currentTime); // Carrier scaled for audible soothing hum
      gain.gain.setValueAtTime(0.08, ctx.currentTime); // Gentle soothing volume

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (err) {
      console.warn('Web Audio Binaural engine initialization:', err);
    }
  };

  const stopBinauralBeats = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
    } catch {
      // Handled
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const currentTrack = tracks[currentTrackIndex] || FALLBACK_TRACKS[0];

  return (
    <>
      {/* 1. Collapsed Floating Dock Pill (Bottom Right) */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '50px',
          padding: '8px 16px 8px 10px',
          boxShadow: isPlaying
            ? '0 10px 30px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            : '0 8px 24px rgba(0, 0, 0, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          userSelect: 'none'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Animated Waveform Icon / Disc */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: isPlaying ? 'linear-gradient(135deg, #6366f1, #ec4899)' : 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            animation: isPlaying ? 'spin 8s linear infinite' : 'none'
          }}
        >
          <Music size={18} />
        </div>

        {/* Track Title & Equalizer Bars */}
        <div style={{ textAlign: 'left', maxWidth: '160px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentTrack.title}
          </div>
          <div style={{ fontSize: '0.65rem', color: isPlaying ? '#a5b4fc' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isPlaying ? (
              <>
                <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'flex-end', height: '10px' }}>
                  <span style={{ width: '2px', height: '8px', background: '#34d399', animation: 'bounce 0.8s infinite alternate' }} />
                  <span style={{ width: '2px', height: '10px', background: '#38bdf8', animation: 'bounce 0.6s infinite 0.2s alternate' }} />
                  <span style={{ width: '2px', height: '6px', background: '#ec4899', animation: 'bounce 0.7s infinite 0.4s alternate' }} />
                </span>
                <span>Playing Lo-Fi</span>
              </>
            ) : (
              'Focus Audio Paused'
            )}
          </div>
        </div>

        {/* Quick Play/Pause Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            background: isPlaying ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.15)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginLeft: '4px'
          }}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
        </button>
      </div>

      {/* 2. Expanded Glassmorphic Studio Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '84px',
            right: '24px',
            width: '420px',
            maxWidth: '92vw',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 15, 35, 0.98) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(24px)',
            zIndex: 950,
            animation: 'fadeIn 0.25s ease'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={18} color="#c084fc" />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Real-Time Focus Audio Studio
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '12px', padding: '4px', marginBottom: '18px' }}>
            <button
              onClick={() => setActiveTab('LOFI')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                background: activeTab === 'LOFI' ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === 'LOFI' ? '#fff' : '#94a3b8'
              }}
            >
              📻 24/7 Lo-Fi Beats
            </button>
            <button
              onClick={() => setActiveTab('AMBIENT')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                background: activeTab === 'AMBIENT' ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === 'AMBIENT' ? '#fff' : '#94a3b8'
              }}
            >
              🎚️ Ambient Mixer
            </button>
            <button
              onClick={() => setActiveTab('BINAURAL')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                background: activeTab === 'BINAURAL' ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === 'BINAURAL' ? '#fff' : '#94a3b8'
              }}
            >
              🧠 40Hz Brainwave
            </button>
          </div>

          {/* TAB 1: Lo-Fi Radio */}
          {activeTab === 'LOFI' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <img
                  src={currentTrack.artworkUrl}
                  alt={currentTrack.title}
                  style={{ width: '70px', height: '70px', borderRadius: '14px', objectFit: 'cover', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                    {currentTrack.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
                    {currentTrack.artist}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: '700' }}>
                      {currentTrack.genre.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '20px', background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6', fontWeight: '700' }}>
                      {currentTrack.bpm} BPM
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <button
                  onClick={handlePrevTrack}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '8px' }}
                >
                  <SkipBack size={18} />
                </button>
                <button
                  onClick={togglePlay}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'var(--gradient-primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)'
                  }}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
                </button>
                <button
                  onClick={handleNextTrack}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '8px' }}
                >
                  <SkipForward size={18} />
                </button>
              </div>

              {/* Volume Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Volume2 size={14} color="#94a3b8" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#818cf8', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', width: '30px', textAlign: 'right' }}>
                  {masterVolume}%
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: Ambient Mixer */}
          {activeTab === 'AMBIENT' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ambientLayers.map((layer) => (
                <div
                  key={layer.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{layer.icon}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fff' }}>{layer.name}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={layer.isMuted ? 0 : layer.volume}
                    onChange={(e) => {
                      const vol = Number(e.target.value);
                      setAmbientLayers((prev) =>
                        prev.map((l) => (l.id === layer.id ? { ...l, volume: vol, isMuted: vol === 0 } : l))
                      );
                    }}
                    style={{ flex: 1, accentColor: '#38bdf8', cursor: 'pointer' }}
                  />
                  <button
                    onClick={() => {
                      setAmbientLayers((prev) =>
                        prev.map((l) => (l.id === layer.id ? { ...l, isMuted: !l.isMuted } : l))
                      );
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: layer.isMuted ? '#f87171' : '#34d399',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      fontWeight: '700'
                    }}
                  >
                    {layer.isMuted ? 'Muted' : `${layer.volume}%`}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Binaural Beats */}
          {activeTab === 'BINAURAL' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600' }}>
                  Scientific Wave Generator
                </span>
                <button
                  onClick={() => setIsBinauralActive(!isBinauralActive)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    background: isBinauralActive ? '#34d399' : 'rgba(255, 255, 255, 0.15)',
                    color: isBinauralActive ? '#000' : '#fff'
                  }}
                >
                  {isBinauralActive ? '⚡ Active (Generating)' : 'Activate Tone'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {BINAURAL_PRESETS.map((preset) => (
                  <div
                    key={preset.frequencyHz}
                    onClick={() => setSelectedBinauralHz(preset.frequencyHz)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: selectedBinauralHz === preset.frequencyHz ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: selectedBinauralHz === preset.frequencyHz ? 'rgba(168, 85, 247, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: selectedBinauralHz === preset.frequencyHz ? '#c084fc' : '#fff' }}>
                      {preset.name}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
                      {preset.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
