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
  ListOrdered
} from 'lucide-react';
import {
  AiPodcast,
  GeneratePodcastDto
} from '@studentlife/shared';

export const AiPodcastStudioView: React.FC = () => {
  const [podcasts, setPodcasts] = useState<AiPodcast[]>([]);
  const [activePodcastId, setActivePodcastId] = useState<string>('podcast-quantum-physics');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTurnIndex, setActiveTurnIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [topicInput, setTopicInput] = useState<string>('Indian Constitution & Fundamental Rights');
  const [notesInput, setNotesInput] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    fetchPodcasts();
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

  const activePodcast = podcasts.find(p => p.id === activePodcastId) || podcasts[0];

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
    utterance.rate = playbackSpeed;
    utterance.pitch = turn.speaker === 'host1' ? 0.9 : 1.15; // Host 1 lower pitch, Host 2 higher pitch

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Tuning 2-Host AI Podcast & Audio Dialogue Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Lecture-to-Podcast Studio</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> NotebookLM 2-Host Dialogue
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Convert any lecture notes or syllabus topic into an interactive two-host audio discussion you can listen to while commuting or walking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-purple-500/25"
          >
            <Plus className="w-4 h-4" />
            Generate New Podcast
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Podcast Library (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Podcast Library ({podcasts.length})
            </h3>
            <div className="space-y-2">
              {podcasts.map(pod => {
                const isActive = pod.id === activePodcast?.id;
                return (
                  <button
                    key={pod.id}
                    onClick={() => {
                      setActivePodcastId(pod.id);
                      handleResetPlayback();
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all border flex flex-col gap-1 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-950/60 to-slate-900 border-purple-500/50 shadow-md shadow-purple-950/50'
                        : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isActive ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {pod.topic.split('&')[0]}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {pod.dialogueTurns.length} Turns
                      </span>
                    </div>
                    <div className={`font-semibold text-sm line-clamp-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {pod.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Live Podcast Player & Interactive Dialogue Stream (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {activePodcast ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-200 space-y-6">
              
              {/* Podcast Title and Hosts Bar */}
              <div className="border-b border-slate-800 pb-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
                    {activePodcast.topic}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> ~{Math.round(activePodcast.totalDurationSeconds / 60)} Mins
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {activePodcast.title}
                </h2>

                {/* Hosts Avatars */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                    <span className="text-lg">{activePodcast.host1.avatar}</span>
                    <div>
                      <div className="font-bold text-slate-200">{activePodcast.host1.name}</div>
                      <div className="text-[10px] text-slate-400">{activePodcast.host1.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                    <span className="text-lg">{activePodcast.host2.avatar}</span>
                    <div>
                      <div className="font-bold text-slate-200">{activePodcast.host2.name}</div>
                      <div className="text-[10px] text-slate-400">{activePodcast.host2.role}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master Audio Playback Controls */}
              <div className="bg-slate-950/80 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTogglePlay}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <button
                    onClick={handleResetPlayback}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs transition-all"
                    title="Restart from Beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Speed:</span>
                  {[1.0, 1.25, 1.5, 2.0].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                        playbackSpeed === speed
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 ml-1"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                  </button>
                </div>
              </div>

              {/* Dialogue Transcript Stream */}
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
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
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3.5 ${
                        isCurrent
                          ? 'bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-slate-900 border-purple-400 shadow-xl shadow-purple-950/50 scale-[1.01]'
                          : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-2xl shrink-0 mt-0.5">{currentHost.avatar}</div>
                      <div className="space-y-1.5 flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${isHost1 ? 'text-indigo-300' : 'text-pink-300'}`}>
                            {currentHost.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Turn {tIdx + 1}</span>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed font-sans">
                          {turn.text}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {turn.keyConcepts.map((k, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              No podcast loaded. Synthesize one from the top button!
            </div>
          )}
        </div>

        {/* Right Side: Key Takeaways & Exam Points (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <ListOrdered className="w-4 h-4 text-pink-400" />
              Podcast Takeaways
            </h3>
            {activePodcast ? (
              <div className="space-y-2.5 text-xs text-slate-300">
                {activePodcast.summaryKeyTakeaways.map((point, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex gap-2">
                    <span className="text-purple-400 font-bold font-mono">{idx + 1}.</span>
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

      </div>

      {/* Modal: Synthesize New Podcast */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-purple-400" />
              Synthesize 2-Host AI Podcast
            </h3>
            <form onSubmit={handleGeneratePodcast} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Target Topic or Chapter</label>
                <input
                  type="text"
                  required
                  value={topicInput}
                  onChange={e => setTopicInput(e.target.value)}
                  placeholder="e.g. Graph Dijkstra Algorithm / Fundamental Rights"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Source Notes Text (Optional)</label>
                <textarea
                  rows={4}
                  value={notesInput}
                  onChange={e => setNotesInput(e.target.value)}
                  placeholder="Paste class notes or key equations for host discussion..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
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
                  disabled={isSynthesizing}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-semibold shadow-md disabled:opacity-50"
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
export default AiPodcastStudioView;
