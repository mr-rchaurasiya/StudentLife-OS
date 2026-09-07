import React, { useState, useEffect } from 'react';
import {
  Building2,
  Sparkles,
  Users,
  Compass,
  Coffee,
  BookOpen,
  Code,
  Landmark,
  Volume2
} from 'lucide-react';
import {
  VirtualCampusState,
  CampusZoneType,
  MoveAvatarDto
} from '@studentlife/shared';

interface VirtualCampusViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const VirtualCampusView: React.FC<VirtualCampusViewProps> = ({ onAddXp }) => {
  const [campusState, setCampusState] = useState<VirtualCampusState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedZone, setSelectedZone] = useState<CampusZoneType>('SILENT_LIBRARY');
  const [taskInput, setTaskInput] = useState<string>('Dynamic Programming & Graph Theory');
  const [cheerMessage, setCheerMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCampusState();
  }, []);

  const fetchCampusState = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/virtual-campus/status');
      const data = await res.json();
      if (data.success && data.data) {
        setCampusState(data.data);
      }
    } catch (err) {
      console.error('Failed to load virtual campus', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMove = async (zone: CampusZoneType, x: number, y: number) => {
    setSelectedZone(zone);
    try {
      const dto: MoveAvatarDto = {
        zone,
        x,
        y,
        currentTask: taskInput
      };
      const res = await fetch('/api/virtual-campus/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCampusState(data.data);
      }
    } catch (err) {
      console.error('Failed to move avatar', err);
    }
  };

  const handleSendCheer = (peerName: string) => {
    setCheerMessage(`🎉 You sent focus energy & boba tea to ${peerName}!`);
    onAddXp?.(15, `Sent peer motivation cheer to ${peerName}`);
    setTimeout(() => setCheerMessage(null), 3500);
  };

  const getZoneIcon = (type: CampusZoneType) => {
    switch (type) {
      case 'SILENT_LIBRARY': return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'CODE_LOUNGE': return <Code className="w-4 h-4 text-cyan-400" />;
      case 'UPSC_ROUNDTABLE': return <Landmark className="w-4 h-4 text-amber-400" />;
      case 'CAFE_TERRACE': return <Coffee className="w-4 h-4 text-rose-400" />;
    }
  };

  if (isLoading || !campusState) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Entering 2D Multiplayer Virtual Campus...</p>
        </div>
      </div>
    );
  }

  const { currentUser, peers, activeZones, totalStudentsOnline } = campusState;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">2D Multiplayer Virtual Campus</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Metaverse
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Walk around interactive themed study halls, sit at collaborative desks, and study alongside ambitious peers across India in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">{totalStudentsOnline} Students Live</span>
          </div>
        </div>
      </div>

      {cheerMessage && (
        <div className="bg-gradient-to-r from-indigo-950/90 to-purple-950/90 border border-indigo-400/50 p-3.5 rounded-xl text-xs text-indigo-200 font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
          <span>{cheerMessage}</span>
          <span className="text-emerald-400 font-mono">+15 XP</span>
        </div>
      )}

      {/* Main Grid: Interactive Map (8 cols) + Room Info & Peer List (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 2D Campus Interactive Map Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>Interactive Campus Map (Click any zone or desk to move your avatar)</span>
              </div>
              <span className="text-xs text-indigo-400 font-mono">Zone: {currentUser.zone}</span>
            </div>

            {/* 2D Canvas Tile Map */}
            <div className="relative w-full h-[460px] bg-slate-950 border-2 border-indigo-500/30 rounded-2xl overflow-hidden shadow-inner p-4 select-none">
              {/* 4 Quadrants Grid Layout */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-3 p-4">
                
                {/* Quadrant 1: Silent Sanctum Library */}
                <div
                  onClick={() => handleMove('SILENT_LIBRARY', 25, 30)}
                  className={`rounded-2xl border-2 transition-all p-4 cursor-pointer flex flex-col justify-between ${
                    selectedZone === 'SILENT_LIBRARY'
                      ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> Silent Library
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Quiet Study</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 opacity-50">
                    <div className="h-6 bg-slate-800 rounded border border-slate-700" />
                    <div className="h-6 bg-slate-800 rounded border border-slate-700" />
                    <div className="h-6 bg-slate-800 rounded border border-slate-700" />
                  </div>
                </div>

                {/* Quadrant 2: Code Lounge */}
                <div
                  onClick={() => handleMove('CODE_LOUNGE', 75, 30)}
                  className={`rounded-2xl border-2 transition-all p-4 cursor-pointer flex flex-col justify-between ${
                    selectedZone === 'CODE_LOUNGE'
                      ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5" /> Hacker Lounge
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">DSA & Dev</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 opacity-50">
                    <div className="h-6 bg-slate-800 rounded border border-slate-700" />
                    <div className="h-6 bg-slate-800 rounded border border-slate-700" />
                    <div className="h-6 bg-slate-800 rounded border border-slate-700" />
                  </div>
                </div>

                {/* Quadrant 3: UPSC Roundtable */}
                <div
                  onClick={() => handleMove('UPSC_ROUNDTABLE', 25, 75)}
                  className={`rounded-2xl border-2 transition-all p-4 cursor-pointer flex flex-col justify-between ${
                    selectedZone === 'UPSC_ROUNDTABLE'
                      ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-950/40'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5" /> Civil Services Round-Table
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Debates</span>
                  </div>
                  <div className="w-16 h-16 rounded-full border-2 border-slate-700 mx-auto opacity-40 flex items-center justify-center text-[10px] text-slate-500">
                    Table
                  </div>
                </div>

                {/* Quadrant 4: Boba Café Terrace */}
                <div
                  onClick={() => handleMove('CAFE_TERRACE', 75, 75)}
                  className={`rounded-2xl border-2 transition-all p-4 cursor-pointer flex flex-col justify-between ${
                    selectedZone === 'CAFE_TERRACE'
                      ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/40'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5" /> Boba & Chai Terrace
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Rest Break</span>
                  </div>
                  <div className="flex justify-around opacity-50">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700" />
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700" />
                  </div>
                </div>

              </div>

              {/* Peers Avatars */}
              {peers.map((peer) => (
                <div
                  key={peer.id}
                  style={{ top: `${peer.y}%`, left: `${peer.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer"
                  onClick={() => handleSendCheer(peer.name)}
                >
                  <div className="w-10 h-10 rounded-full border-2 border-slate-700 bg-slate-900 flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-125">
                    {peer.avatarEmoji}
                  </div>
                  <div className="bg-slate-950/90 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-bold text-slate-300 mt-1 whitespace-nowrap shadow-md">
                    {peer.name.split(' ')[0]}
                  </div>

                  {/* Peer Tooltip Card */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-[10px] text-slate-200 w-44 shadow-2xl z-30 pointer-events-none">
                    <div className="font-bold text-indigo-300">{peer.name}</div>
                    <div className="text-slate-400">{peer.college}</div>
                    <div className="text-emerald-400 font-medium mt-1">📖 {peer.currentTask}</div>
                    <div className="text-slate-500 font-mono mt-1">Focusing for {peer.studyDurationMinutes}m</div>
                  </div>
                </div>
              ))}

              {/* Current User Avatar */}
              <div
                style={{ top: `${currentUser.y}%`, left: `${currentUser.x}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
              >
                <div className="w-12 h-12 rounded-full border-2 border-indigo-400 bg-indigo-950 flex items-center justify-center text-2xl shadow-xl shadow-indigo-500/40 animate-pulse">
                  {currentUser.avatarEmoji}
                </div>
                <div className="bg-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full mt-1 shadow-md">
                  You (Focusing)
                </div>
              </div>
            </div>

            {/* Custom Task Bar */}
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 shrink-0">Your Desk Status:</span>
              <input
                type="text"
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                placeholder="What are you studying right now?"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleMove(selectedZone, currentUser.x, currentUser.y)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shrink-0"
              >
                Update Desk
              </button>
            </div>
          </div>
        </div>

        {/* Right: Active Campus Zones & Peer Hall (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Users className="w-4 h-4 text-indigo-400" />
              Campus Halls ({activeZones.length})
            </h3>

            <div className="space-y-3">
              {activeZones.map(zone => (
                <div
                  key={zone.type}
                  onClick={() => handleMove(zone.type, zone.type.includes('CODE') ? 75 : 25, zone.type.includes('UPSC') || zone.type.includes('CAFE') ? 75 : 30)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedZone === zone.type
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-200">
                      {getZoneIcon(zone.type)}
                      <span>{zone.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                      {zone.studentCount} Students
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {zone.description}
                  </p>
                  <div className="text-[10px] text-indigo-300 font-mono flex items-center gap-1 mt-2">
                    <Volume2 className="w-3 h-3" /> {zone.ambientSound}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default VirtualCampusView;
