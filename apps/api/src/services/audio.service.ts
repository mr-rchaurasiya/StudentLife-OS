import {
  LoFiAudioTrack,
  AmbientLayerSetting,
  BinauralPresetConfig
} from '@studentlife/shared';

export class AudioService {
  private static tracks: LoFiAudioTrack[] = [
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
    },
    {
      id: 'track-4',
      title: 'Anime Rainy Window Memories',
      artist: 'Sakura Beats Lab',
      genre: 'ANIME_BEATS',
      streamUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=chill-lofi-song-8444.mp3',
      artworkUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=300&auto=format&fit=crop&q=80',
      durationSeconds: 154,
      bpm: 75
    }
  ];

  private static ambientLayers: AmbientLayerSetting[] = [
    {
      id: 'rain',
      name: 'Heavy Monsoon Rain',
      icon: '🌧️',
      volume: 60,
      isMuted: false,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=rain-and-thunder-16705.mp3'
    },
    {
      id: 'cafe',
      name: 'Oxford Library Cafe',
      icon: '☕',
      volume: 40,
      isMuted: false,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_7314541bf5.mp3?filename=coffee-shop-ambience-9441.mp3'
    },
    {
      id: 'fire',
      name: 'Cozy Fireplace Crackle',
      icon: '🪵',
      volume: 35,
      isMuted: true,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c3be402511.mp3?filename=crackling-fireplace-nature-sounds-7813.mp3'
    },
    {
      id: 'keyboard',
      name: 'Mechanical Keyboard Typing',
      icon: '⌨️',
      volume: 45,
      isMuted: true,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=typing-on-a-keyboard-104990.mp3'
    },
    {
      id: 'forest',
      name: 'Himalayan Morning Birds',
      icon: '🌲',
      volume: 30,
      isMuted: true,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_82c3c6f849.mp3?filename=forest-birds-chirping-nature-sounds-7712.mp3'
    }
  ];

  private static binauralPresets: BinauralPresetConfig[] = [
    {
      frequencyHz: 40,
      name: '40Hz Gamma Focus Booster',
      targetMentalState: 'DEEP_FOCUS',
      description: 'Clinically studied 40Hz frequency for peak working memory, rapid problem solving, and deep coding flow.'
    },
    {
      frequencyHz: 14,
      name: '14Hz SMR Sensorimotor Rhythm',
      targetMentalState: 'MEMORY_RETENTION',
      description: 'Stabilizes cognitive attention for long-duration reading and spaced repetition flashcard review.'
    },
    {
      frequencyHz: 10,
      name: '10Hz Alpha State Bridge',
      targetMentalState: 'CREATIVE_FLOW',
      description: 'Promotes calm alertness, ideal for math derivations, system architecture, and essay planning.'
    },
    {
      frequencyHz: 6,
      name: '6Hz Theta Relaxation',
      targetMentalState: 'MEDITATION_RELAX',
      description: 'Soothes exam anxiety and lowers cognitive cortisol after high-intensity study blocks.'
    }
  ];

  public static getTracks(): LoFiAudioTrack[] {
    return this.tracks;
  }

  public static getAmbientLayers(): AmbientLayerSetting[] {
    return this.ambientLayers;
  }

  public static getBinauralPresets(): BinauralPresetConfig[] {
    return this.binauralPresets;
  }
}
