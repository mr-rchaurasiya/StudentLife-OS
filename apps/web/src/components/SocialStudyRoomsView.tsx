import React, { useState, useEffect } from 'react';
import {
  StudyRoom,
  RoomVibeType,
  PomodoroTimerPhase
} from '@studentlife/shared';
import {
  Users2,
  Flame,
  Radio,
  Clock,
  Send,
  PlusCircle,
  Headphones,
  CheckCircle2,
  ArrowLeft,
  Volume2,
  LogOut,
  Target,
  Activity,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface SocialStudyRoomsViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

const PRESET_ROOMS: StudyRoom[] = [
  {
    id: 'room-jee-night',
    name: 'IIT JEE 2026 Night Owls 🦉',
    description: 'Late night high-intensity problem solving room for JEE Advanced aspirants. Zero distractions, shared focus.',
    subject: 'Physics & Advanced Math',
    topic: 'Rotational Motion & Definite Integrals',
    hostName: 'Rohan Verma',
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    activeStudentsCount: 8,
    maxParticipants: 15,
    isPrivate: false,
    vibe: 'Lo-Fi Chill',
    pomodoroPhase: 'WORK',
    pomodoroSecondsLeft: 1140, // 19m
    isTimerRunning: true,
    roomGoal: 'Solve 25 Multi-Correct PYQs before midnight',
    createdAt: new Date().toISOString(),
    members: [
      {
        id: 'mem-1',
        name: 'Rohan Verma (Host)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        college: 'IIT Bombay Aspirant (Kota)',
        examTarget: 'JEE Adv 2026',
        currentGoal: 'Moment of Inertia Complex Rigids (Q12-Q20)',
        status: 'FOCUSING',
        streakDays: 42,
        pomodoroMinutesToday: 210,
        joinedAt: new Date().toISOString()
      },
      {
        id: 'mem-2',
        name: 'Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        college: 'Delhi Public School, R.K. Puram',
        examTarget: 'JEE Mains 99.8%ile',
        currentGoal: 'Definite Integration Properties Proofs',
        status: 'FOCUSING',
        streakDays: 28,
        pomodoroMinutesToday: 180,
        joinedAt: new Date().toISOString()
      },
      {
        id: 'mem-3',
        name: 'Kavya Nair',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
        college: 'FIITJEE South Delhi',
        examTarget: 'JEE Adv 2026',
        currentGoal: 'Electrostatics Flux Gauss Law derivations',
        status: 'ON_BREAK',
        streakDays: 35,
        pomodoroMinutesToday: 150,
        joinedAt: new Date().toISOString()
      },
      {
        id: 'mem-4',
        name: 'Aman Chaurasiya',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
        college: 'Allen Career Institute',
        examTarget: 'JEE Adv Top 500',
        currentGoal: 'Thermodynamics Carnot Cycle & Entropy Numerical set',
        status: 'FOCUSING',
        streakDays: 19,
        pomodoroMinutesToday: 240,
        joinedAt: new Date().toISOString()
      }
    ],
    recentMessages: [
      {
        id: 'msg-1',
        roomId: 'room-jee-night',
        senderId: 'mem-1',
        senderName: 'Rohan Verma',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        text: 'Welcome everyone! 25-minute Pomodoro sprint started. Let us nail this block 🚀',
        timestamp: '10:15 PM',
        type: 'POMODORO_SYNC'
      },
      {
        id: 'msg-2',
        roomId: 'room-jee-night',
        senderId: 'mem-2',
        senderName: 'Priya Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        text: 'Cracked Q18 using King property of definite integrals! 🎯',
        timestamp: '10:22 PM',
        type: 'GOAL_ACHIEVED',
        reactionCount: 6
      },
      {
        id: 'msg-3',
        roomId: 'room-jee-night',
        senderId: 'mem-4',
        senderName: 'Aman Chaurasiya',
        senderAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
        text: 'Amazing speed Priya! Keep pushing! 🔥',
        timestamp: '10:24 PM',
        type: 'ENCOURAGE',
        reactionCount: 4
      }
    ]
  },
  {
    id: 'room-upsc-prelims',
    name: 'UPSC Prelims 2026 GS-1 Focus Hall 🏛️',
    description: 'Pin-drop silence study hall for civil services aspirants. Daily Lakshmikant & Spectrum revisions.',
    subject: 'Indian Polity & Modern History',
    topic: 'Constitutional Bodies & Non-Cooperation Movement',
    hostName: 'Ananya Deshmukh',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    activeStudentsCount: 12,
    maxParticipants: 20,
    isPrivate: false,
    vibe: 'Deep Silence',
    pomodoroPhase: 'WORK',
    pomodoroSecondsLeft: 840,
    isTimerRunning: true,
    roomGoal: 'Complete Chapter 42-45 Laxmikanth + 50 MCQs',
    createdAt: new Date().toISOString(),
    members: [
      {
        id: 'mem-10',
        name: 'Ananya Deshmukh (Host)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        college: "St. Stephen's College, DU",
        examTarget: 'UPSC CSE 2026 (IAS)',
        currentGoal: 'Election Commission of India & Model Code of Conduct',
        status: 'FOCUSING',
        streakDays: 61,
        pomodoroMinutesToday: 320,
        joinedAt: new Date().toISOString()
      },
      {
        id: 'mem-11',
        name: 'Vikramaditya Roy',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        college: 'JNU, New Delhi',
        examTarget: 'UPSC CSE 2026 (IFS)',
        currentGoal: 'Modern History: Poona Pact & 1935 Act provisions',
        status: 'FOCUSING',
        streakDays: 45,
        pomodoroMinutesToday: 260,
        joinedAt: new Date().toISOString()
      }
    ],
    recentMessages: [
      {
        id: 'msg-10',
        roomId: 'room-upsc-prelims',
        senderId: 'mem-10',
        senderName: 'Ananya Deshmukh',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        text: 'Focus session active. Let us make every minute count for Prelims! 📖',
        timestamp: '10:05 PM',
        type: 'POMODORO_SYNC'
      }
    ]
  },
  {
    id: 'room-gate-algo',
    name: 'GATE CS 2026 & DSA Arena ⚡',
    description: 'Competitive coding, algorithmic proofs, graph theory and systems architecture deep dive.',
    subject: 'Data Structures & Algorithms',
    topic: 'Dijkstra, Bellman-Ford & DP on Trees',
    hostName: 'Saurabh Kumar',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    activeStudentsCount: 6,
    maxParticipants: 12,
    isPrivate: false,
    vibe: 'Exam Rush',
    pomodoroPhase: 'SHORT_BREAK',
    pomodoroSecondsLeft: 180,
    isTimerRunning: true,
    roomGoal: 'Implement Floyd-Warshall & solve 3 LeetCode Hards',
    createdAt: new Date().toISOString(),
    members: [
      {
        id: 'mem-20',
        name: 'Saurabh Kumar (Host)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        college: 'IIT Roorkee CS',
        examTarget: 'GATE CS AIR < 50',
        currentGoal: 'Tree DP & Re-rooting technique notes',
        status: 'ON_BREAK',
        streakDays: 31,
        pomodoroMinutesToday: 195,
        joinedAt: new Date().toISOString()
      }
    ],
    recentMessages: [
      {
        id: 'msg-20',
        roomId: 'room-gate-algo',
        senderId: 'mem-20',
        senderName: 'Saurabh Kumar',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        text: '5-minute hydration break! Get water and stretch before the next 45m sprint 💧',
        timestamp: '10:28 PM',
        type: 'POMODORO_SYNC'
      }
    ]
  },
  {
    id: 'room-neet-bio',
    name: 'NEET Medical 680+ Squad 🧬',
    description: 'NCERT line-by-line active recall, genetics diagram drills and rapid flashcard reviews.',
    subject: 'Biology & Human Physiology',
    topic: 'Endocrine System & Chemical Coordination',
    hostName: 'Dr. Tanya Malik (Mentor)',
    hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    activeStudentsCount: 14,
    maxParticipants: 25,
    isPrivate: false,
    vibe: 'Library Ambience',
    pomodoroPhase: 'WORK',
    pomodoroSecondsLeft: 1320,
    isTimerRunning: true,
    roomGoal: 'Revise Pituitary & Thyroid hormones + 100 Diagram Questions',
    createdAt: new Date().toISOString(),
    members: [
      {
        id: 'mem-30',
        name: 'Dr. Tanya Malik (Mentor)',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        college: 'AIIMS New Delhi',
        examTarget: 'NEET UG Top Ranks',
        currentGoal: 'Reviewing endocrine feedback loop mechanisms',
        status: 'FOCUSING',
        streakDays: 90,
        pomodoroMinutesToday: 300,
        joinedAt: new Date().toISOString()
      }
    ],
    recentMessages: [
      {
        id: 'msg-30',
        roomId: 'room-neet-bio',
        senderId: 'mem-30',
        senderName: 'Dr. Tanya Malik',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        text: 'Remember: Hypothalamus releasing hormones vs Posterior pituitary storage! Stay sharp 🧬',
        timestamp: '10:10 PM',
        type: 'CHAT'
      }
    ]
  }
];

export const SocialStudyRoomsView: React.FC<SocialStudyRoomsViewProps> = ({
  onAddXp
}) => {
  const [rooms, setRooms] = useState<StudyRoom[]>(PRESET_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');
  const [selectedVibeFilter, setSelectedVibeFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Active room state
  const activeRoom = rooms.find((r) => r.id === activeRoomId) || null;
  const [roomSecondsLeft, setRoomSecondsLeft] = useState<number>(1500);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [currentPhase, setCurrentPhase] = useState<PomodoroTimerPhase>('WORK');
  const [myCurrentGoal, setMyCurrentGoal] = useState<string>('Complete 15 PYQs and review error log');
  const [chatInput, setChatInput] = useState<string>('');
  const [showGoalEdit, setShowGoalEdit] = useState<boolean>(false);

  // New room modal inputs
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomSubject, setNewRoomSubject] = useState('Physics & Mathematics');
  const [newRoomTopic, setNewRoomTopic] = useState('Integral Calculus');
  const [newRoomVibe, setNewRoomVibe] = useState<RoomVibeType>('Lo-Fi Chill');
  const [newRoomGoal, setNewRoomGoal] = useState('Deep focus problem solving block');

  // Fetch rooms from API on mount
  useEffect(() => {
    fetch('/api/study-rooms')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setRooms(data.data);
        }
      })
      .catch(() => {
        // Fallback to preset
      });
  }, []);

  // Synchronized timer interval when inside a room
  useEffect(() => {
    if (!activeRoom || !isTimerActive) return;

    const timer = setInterval(() => {
      setRoomSecondsLeft((prev) => {
        if (prev <= 1) {
          if (currentPhase === 'WORK') {
            setCurrentPhase('SHORT_BREAK');
            onAddXp?.(50, 'Completed 25m Social Study Block');
            return 300; // 5 min break
          } else {
            setCurrentPhase('WORK');
            return 1500; // 25 min work
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeRoom, isTimerActive, currentPhase, onAddXp]);

  const handleJoinRoom = (room: StudyRoom) => {
    setActiveRoomId(room.id);
    setRoomSecondsLeft(room.pomodoroSecondsLeft);
    setCurrentPhase(room.pomodoroPhase);
    setIsTimerActive(room.isTimerRunning);

    onAddXp?.(20, `Joined Social Room: ${room.name}`);

    // Join API
    fetch(`/api/study-rooms/${room.id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          name: 'You (Online)',
          college: 'StudentLife Scholar',
          examTarget: 'Target 2026',
          currentGoal: myCurrentGoal
        }
      })
    }).catch(() => {});
  };

  const handleLeaveRoom = () => {
    setActiveRoomId(null);
  };

  const handleSendMessage = (customText?: string, type: 'CHAT' | 'GOAL_ACHIEVED' | 'POMODORO_SYNC' | 'ENCOURAGE' = 'CHAT') => {
    const textToSend = customText || chatInput.trim();
    if (!textToSend || !activeRoom) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      roomId: activeRoom.id,
      senderId: 'mem-you',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      reactionCount: 1
    };

    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoom.id
          ? {
              ...r,
              recentMessages: [...r.recentMessages, newMsg]
            }
          : r
      )
    );

    if (type === 'ENCOURAGE') {
      onAddXp?.(10, 'Encouraged Study Peer');
    } else if (type === 'GOAL_ACHIEVED') {
      onAddXp?.(30, 'Achieved Session Milestone');
    }

    if (!customText) setChatInput('');

    // Broadcast API
    fetch(`/api/study-rooms/${activeRoom.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: textToSend,
        type,
        user: { name: 'You' }
      })
    }).catch(() => {});
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const createdRoom: StudyRoom = {
      id: `room-${Date.now()}`,
      name: newRoomName,
      description: `Live study space for ${newRoomSubject} - ${newRoomTopic}`,
      subject: newRoomSubject,
      topic: newRoomTopic,
      hostName: 'You (Host)',
      hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      activeStudentsCount: 1,
      maxParticipants: 15,
      isPrivate: false,
      vibe: newRoomVibe,
      pomodoroPhase: 'WORK',
      pomodoroSecondsLeft: 1500,
      isTimerRunning: true,
      roomGoal: newRoomGoal,
      createdAt: new Date().toISOString(),
      members: [
        {
          id: 'mem-you',
          name: 'You (Host)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          college: 'StudentLife Scholar',
          examTarget: 'Target 2026',
          currentGoal: newRoomGoal,
          status: 'FOCUSING',
          streakDays: 14,
          pomodoroMinutesToday: 60,
          joinedAt: new Date().toISOString()
        }
      ],
      recentMessages: [
        {
          id: `msg-${Date.now()}`,
          roomId: `room-${Date.now()}`,
          senderId: 'mem-you',
          senderName: 'You',
          senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          text: `Welcome to ${newRoomName}! Let us crush our study goals today 🎯`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'POMODORO_SYNC'
        }
      ]
    };

    setRooms([createdRoom, ...rooms]);
    setIsCreateModalOpen(false);
    handleJoinRoom(createdRoom);
    onAddXp?.(40, `Created Study Space: ${createdRoom.name}`);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredRooms = rooms.filter((room) => {
    const matchSubject =
      selectedSubjectFilter === 'ALL' ||
      room.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase()) ||
      room.name.toLowerCase().includes(selectedSubjectFilter.toLowerCase());
    const matchVibe =
      selectedVibeFilter === 'ALL' || room.vibe === selectedVibeFilter;
    return matchSubject && matchVibe;
  });

  const totalActiveStudents = rooms.reduce((acc, r) => acc + r.activeStudentsCount, 0);

  // ----------------------------------------------------
  // VIEW: INSIDE ACTIVE STUDY ROOM
  // ----------------------------------------------------
  if (activeRoom) {
    return (
      <div className="space-y-6 animate-fadeIn pb-12">
        {/* Top Active Room Header Bar */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLeaveRoom}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium flex items-center gap-2 border border-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Lobby
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <h1 className="text-xl font-bold text-white tracking-tight">{activeRoom.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  {activeRoom.subject}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Topic: <strong className="text-slate-200">{activeRoom.topic}</strong></span>
                <span>•</span>
                <span>Vibe: <strong className="text-cyan-400">{activeRoom.vibe}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
              <Users2 className="w-4 h-4 text-emerald-400" />
              <span><strong>{activeRoom.members.length}</strong> Studying Together</span>
            </div>
            <button
              onClick={handleLeaveRoom}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Leave Space
            </button>
          </div>
        </div>

        {/* Master Synchronized Pomodoro & Vibe Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Synchronized Master Timer */}
          <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border bg-indigo-500/10 text-indigo-300 border-indigo-500/30">
              <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              {currentPhase === 'WORK' ? 'Deep Focus Sprint' : 'Rest & Hydration'}
            </div>

            <div className="relative my-2">
              <div className="text-6xl font-black font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-cyan-300">
                {formatTimer(roomSecondsLeft)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {currentPhase === 'WORK' ? 'Next 5-min break in sync with room' : 'Next 25-min study sprint coming up'}
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => setIsTimerActive(!isTimerActive)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
              >
                {isTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isTimerActive ? 'Pause Sync' : 'Resume Sync'}
              </button>
              <button
                onClick={() => {
                  setRoomSecondsLeft(1500);
                  setCurrentPhase('WORK');
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Reset to 25m"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Ambient Sound Indicator */}
            <div className="w-full mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Ambience: <strong className="text-slate-200">{activeRoom.vibe}</strong></span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Binaural 40Hz Audio Active</span>
            </div>
          </div>

          {/* Room Goal & Interactive Target Board */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white">Current Focus Milestone</h2>
                </div>
                <button
                  onClick={() => setShowGoalEdit(!showGoalEdit)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
                >
                  {showGoalEdit ? 'Close' : 'Edit My Goal'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 mb-4">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Room Common Target</p>
                <p className="text-sm font-semibold text-slate-100">{activeRoom.roomGoal}</p>
              </div>

              {showGoalEdit ? (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
                  <label className="text-xs font-semibold text-indigo-300">Set Your Specific Goal for this Block:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={myCurrentGoal}
                      onChange={(e) => setMyCurrentGoal(e.target.value)}
                      placeholder="e.g., Solve Q15 to Q30 in Rotational Dynamics..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => {
                        setShowGoalEdit(false);
                        handleSendMessage(`Updated my focus goal: "${myCurrentGoal}" 🎯`, 'POMODORO_SYNC');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Your Personal Target:</span>
                    <p className="text-xs text-slate-200 font-medium mt-0.5">{myCurrentGoal}</p>
                  </div>
                  <button
                    onClick={() => handleSendMessage(`Crushed target: "${myCurrentGoal}" 🎉`, 'GOAL_ACHIEVED')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Crush Goal (+30 XP)
                  </button>
                </div>
              )}
            </div>

            {/* Quick Peer Encouragement Reactions Bar */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">Quick Encouragements:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSendMessage('You got this team! Keep the focus laser sharp! 👏', 'ENCOURAGE')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition"
                >
                  👏 "Keep Going!"
                </button>
                <button
                  onClick={() => handleSendMessage('Streak is on fire today! 🔥', 'ENCOURAGE')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition"
                >
                  🔥 "On Fire!"
                </button>
                <button
                  onClick={() => handleSendMessage('Take a sip of water and breathe! ☕💧', 'ENCOURAGE')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition"
                >
                  ☕ "Hydrate & Breathe"
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Peers Grid & Live Room Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Members Focus Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Live Study Desks ({activeRoom.members.length})</h3>
              </div>
              <span className="text-xs text-slate-400">All members synced in real-time</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeRoom.members.map((member) => (
                <div
                  key={member.id}
                  className="bg-slate-900/80 border border-slate-800/90 hover:border-indigo-500/40 rounded-2xl p-4 transition shadow-lg relative group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/40"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                        member.status === 'FOCUSING' ? 'bg-emerald-500' : 'bg-amber-400'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white truncate">{member.name}</h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          member.status === 'FOCUSING'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {member.status === 'FOCUSING' ? '⚡ Focusing' : '☕ Break'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 truncate">{member.college}</p>

                      <div className="mt-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300">
                        <strong className="text-slate-400">Target: </strong>
                        {member.currentGoal}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                        <span className="flex items-center gap-1 text-amber-400 font-semibold">
                          <Flame className="w-3.5 h-3.5" />
                          {member.streakDays}d Streak
                        </span>
                        <span className="flex items-center gap-1 text-indigo-300 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {member.pomodoroMinutesToday} mins today
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Live Room Chat & Activity Stream */}
          <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-[520px]">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">Live Room Activity</h3>
              </div>
              <span className="text-[11px] text-slate-400">Sync Broadcast</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
              {activeRoom.recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl border transition ${
                    msg.type === 'GOAL_ACHIEVED'
                      ? 'bg-emerald-950/30 border-emerald-500/40'
                      : msg.type === 'POMODORO_SYNC'
                      ? 'bg-indigo-950/30 border-indigo-500/40'
                      : msg.type === 'ENCOURAGE'
                      ? 'bg-amber-950/30 border-amber-500/40'
                      : 'bg-slate-800/60 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <img src={msg.senderAvatar} alt="" className="w-4 h-4 rounded-full" />
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{msg.text}</p>
                  {msg.reactionCount && msg.reactionCount > 0 && (
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-[10px] text-indigo-300 border border-slate-700">
                        👏 {msg.reactionCount}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="pt-3 border-t border-slate-800 flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Share your progress or say hi..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: ROOM LOBBY & BROWSER
  // ----------------------------------------------------
  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              Phase 26 • Social Study Rooms & Live Sync
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Study Together in Real-Time 🎧
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Never study alone again. Join virtual focus halls with synchronized Pomodoro timers,
              background Lo-Fi streams, streak tracking, and mutual student encouragement.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              Create Focus Space
            </button>
          </div>
        </div>

        {/* Live Presence Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Students</span>
            <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              {totalActiveStudents} Online
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Live Focus Rooms</span>
            <div className="text-xl font-bold text-indigo-300 mt-0.5">{rooms.length} Active</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Pomodoro Efficiency</span>
            <div className="text-xl font-bold text-cyan-300 mt-0.5">94.8% Sync</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Session Reward</span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">+50 XP / Sprint</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Subject Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Physics', 'UPSC', 'Algorithms', 'Biology'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedSubjectFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedSubjectFilter === filter
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {filter === 'ALL' ? '🌟 All Domains' : filter}
            </button>
          ))}
        </div>

        {/* Vibe Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Ambience:</span>
          <select
            value={selectedVibeFilter}
            onChange={(e) => setSelectedVibeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Vibes</option>
            <option value="Lo-Fi Chill">Lo-Fi Chill</option>
            <option value="Deep Silence">Deep Silence</option>
            <option value="Exam Rush">Exam Rush</option>
            <option value="Library Ambience">Library Ambience</option>
          </select>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between group"
          >
            <div>
              {/* Room Top Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {room.subject}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 flex items-center gap-1.5 border border-slate-700">
                  <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                  {room.vibe}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition mb-2">
                {room.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {room.description}
              </p>

              {/* Topic & Room Goal */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Current Focus:</span>
                  <strong className="text-slate-200">{room.topic}</strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Room Goal:</span>
                  <strong className="text-emerald-400">{room.roomGoal}</strong>
                </div>
              </div>

              {/* Live Status Indicators */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    {room.members.slice(0, 4).map((member) => (
                      <img
                        key={member.id}
                        src={member.avatar}
                        alt={member.name}
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {room.members.length} / {room.maxParticipants} students
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-xs font-mono font-semibold text-indigo-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  {room.pomodoroPhase === 'WORK' ? 'Sprint' : 'Break'} {formatTimer(room.pomodoroSecondsLeft)}
                </div>
              </div>
            </div>

            {/* Join Room CTA */}
            <button
              onClick={() => handleJoinRoom(room)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform active:scale-[0.98]"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              Join Study Space
            </button>
          </div>
        ))}
      </div>

      {/* CREATE ROOM MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Create Live Focus Space</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. AIIMS Top 100 Sprint Hall 🏥"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Domain / Subject</label>
                  <input
                    type="text"
                    required
                    value={newRoomSubject}
                    onChange={(e) => setNewRoomSubject(e.target.value)}
                    placeholder="e.g. Organic Chemistry"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Topic</label>
                  <input
                    type="text"
                    required
                    value={newRoomTopic}
                    onChange={(e) => setNewRoomTopic(e.target.value)}
                    placeholder="e.g. Aldehydes & Ketones"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Room Ambience / Vibe</label>
                <select
                  value={newRoomVibe}
                  onChange={(e) => setNewRoomVibe(e.target.value as RoomVibeType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Lo-Fi Chill">Lo-Fi Chill</option>
                  <option value="Deep Silence">Deep Silence</option>
                  <option value="Exam Rush">Exam Rush</option>
                  <option value="Library Ambience">Library Ambience</option>
                  <option value="Ambient Rain">Ambient Rain</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Session Goal</label>
                <input
                  type="text"
                  value={newRoomGoal}
                  onChange={(e) => setNewRoomGoal(e.target.value)}
                  placeholder="e.g. Solve 20 Mechanisms and review errors"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
                >
                  Launch Space (+40 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialStudyRoomsView;
