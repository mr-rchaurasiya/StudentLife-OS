import {
  StudyRoom,
  CreateSocialStudyRoomDto,
  SendRoomMessageDto,
  RoomMember,
  StudyRoomChatMessage
} from '@studentlife/shared';

class StudyRoomsService {
  private rooms: StudyRoom[] = [
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
      pomodoroSecondsLeft: 1140, // 19 mins
      isTimerRunning: true,
      roomGoal: 'Solve 25 Multi-Correct PYQs before midnight',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
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
          joinedAt: new Date(Date.now() - 7200000).toISOString()
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
          joinedAt: new Date(Date.now() - 5400000).toISOString()
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
          joinedAt: new Date(Date.now() - 3600000).toISOString()
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
          joinedAt: new Date(Date.now() - 4200000).toISOString()
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
          timestamp: new Date(Date.now() - 900000).toISOString(),
          type: 'POMODORO_SYNC'
        },
        {
          id: 'msg-2',
          roomId: 'room-jee-night',
          senderId: 'mem-2',
          senderName: 'Priya Sharma',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
          text: 'Cracked Q18 using King property of definite integrals! 🎯',
          timestamp: new Date(Date.now() - 420000).toISOString(),
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
          timestamp: new Date(Date.now() - 180000).toISOString(),
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
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      members: [
        {
          id: 'mem-10',
          name: 'Ananya Deshmukh (Host)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          college: 'St. Stephen\'s College, DU',
          examTarget: 'UPSC CSE 2026 (IAS)',
          currentGoal: 'Election Commission of India & Model Code of Conduct',
          status: 'FOCUSING',
          streakDays: 61,
          pomodoroMinutesToday: 320,
          joinedAt: new Date(Date.now() - 14400000).toISOString()
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
          joinedAt: new Date(Date.now() - 10800000).toISOString()
        }
      ],
      recentMessages: [
        {
          id: 'msg-10',
          roomId: 'room-upsc-prelims',
          senderId: 'mem-10',
          senderName: 'Ananya Deshmukh',
          senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          text: 'Focus session #4 active. Let us make every minute count for Prelims! 📖',
          timestamp: new Date(Date.now() - 600000).toISOString(),
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
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
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
          joinedAt: new Date(Date.now() - 10000000).toISOString()
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
          timestamp: new Date(Date.now() - 120000).toISOString(),
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
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
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
          joinedAt: new Date(Date.now() - 18000000).toISOString()
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
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: 'CHAT'
        }
      ]
    }
  ];

  public getAllRooms(): StudyRoom[] {
    return this.rooms;
  }

  public getRoomById(id: string): StudyRoom | undefined {
    return this.rooms.find((r) => r.id === id);
  }

  public createRoom(dto: CreateSocialStudyRoomDto, hostUser?: { name: string; avatar?: string }): StudyRoom {
    const newRoom: StudyRoom = {
      id: `room-${Date.now()}`,
      name: dto.name || 'Personal Focus Space',
      description: `Live collaborative study room focusing on ${dto.subject} - ${dto.topic}.`,
      subject: dto.subject || 'General Study',
      topic: dto.topic || 'Deep Work Session',
      hostName: hostUser?.name || 'Student Creator',
      hostAvatar: hostUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      activeStudentsCount: 1,
      maxParticipants: dto.maxParticipants || 15,
      isPrivate: false,
      vibe: dto.vibe || 'Lo-Fi Chill',
      pomodoroPhase: 'WORK',
      pomodoroSecondsLeft: 1500, // 25 mins
      isTimerRunning: true,
      roomGoal: dto.roomGoal || 'Crush key concepts and finish target exercises',
      createdAt: new Date().toISOString(),
      members: [
        {
          id: 'mem-me',
          name: `${hostUser?.name || 'You'} (Host)`,
          avatar: hostUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          college: 'StudentLife Community',
          examTarget: 'Top Percentile',
          currentGoal: dto.roomGoal || 'Deep study and revision block',
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
          senderId: 'mem-me',
          senderName: hostUser?.name || 'Host',
          senderAvatar: hostUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          text: `Welcome to ${dto.name}! Let's focus and achieve our goals today 🌟`,
          timestamp: new Date().toISOString(),
          type: 'POMODORO_SYNC'
        }
      ]
    };

    this.rooms.unshift(newRoom);
    return newRoom;
  }

  public joinRoom(roomId: string, user: { id?: string; name?: string; avatar?: string; college?: string; examTarget?: string; currentGoal?: string }): StudyRoom | undefined {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) return undefined;

    const existingMember = room.members.find((m) => m.name.toLowerCase() === (user.name || 'You').toLowerCase());
    if (!existingMember) {
      const newMember: RoomMember = {
        id: user.id || `mem-${Date.now()}`,
        name: user.name || 'You',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        college: user.college || 'StudentLife Scholar',
        examTarget: user.examTarget || 'Target Exam 2026',
        currentGoal: user.currentGoal || 'Complete daily study module & questions',
        status: 'FOCUSING',
        streakDays: 12,
        pomodoroMinutesToday: 45,
        joinedAt: new Date().toISOString()
      };
      room.members.push(newMember);
      room.activeStudentsCount = room.members.length;

      room.recentMessages.push({
        id: `msg-join-${Date.now()}`,
        roomId: room.id,
        senderId: newMember.id,
        senderName: newMember.name,
        senderAvatar: newMember.avatar,
        text: `Joined the study room! Goal: "${newMember.currentGoal}" 🚀`,
        timestamp: new Date().toISOString(),
        type: 'CHAT'
      });
    }

    return room;
  }

  public sendMessage(roomId: string, dto: SendRoomMessageDto, user?: { name?: string; avatar?: string }): StudyRoomChatMessage | undefined {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) return undefined;

    const newMsg: StudyRoomChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      roomId,
      senderId: 'mem-user',
      senderName: user?.name || 'You',
      senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      text: dto.text,
      timestamp: new Date().toISOString(),
      type: dto.type || 'CHAT',
      reactionCount: 1
    };

    room.recentMessages.push(newMsg);

    // Dynamic peer response simulation for realistic immersion
    if (dto.type === 'GOAL_ACHIEVED' || dto.text.toLowerCase().includes('done') || dto.text.toLowerCase().includes('solved')) {
      setTimeout(() => {
        const peer = room.members.find((m) => !m.name.includes('You')) || room.members[0];
        if (peer) {
          room.recentMessages.push({
            id: `msg-peer-${Date.now()}`,
            roomId: room.id,
            senderId: peer.id,
            senderName: peer.name,
            senderAvatar: peer.avatar,
            text: `Incredible work! Keep this momentum up 🔥🎯`,
            timestamp: new Date().toISOString(),
            type: 'ENCOURAGE',
            reactionCount: 3
          });
        }
      }, 800);
    }

    return newMsg;
  }

  public updateMemberGoal(roomId: string, memberName: string, newGoal: string): boolean {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) return false;

    const member = room.members.find((m) => m.name.toLowerCase().includes(memberName.toLowerCase()) || m.name.includes('You'));
    if (member) {
      member.currentGoal = newGoal;
      return true;
    }
    return false;
  }
}

export const studyRoomsService = new StudyRoomsService();
