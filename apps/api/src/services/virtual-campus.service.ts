import {
  VirtualCampusState,
  CampusAvatar,
  MoveAvatarDto
} from '@studentlife/shared';

export class VirtualCampusService {
  private campusState: VirtualCampusState;

  constructor() {
    this.campusState = {
      totalStudentsOnline: 48,
      activeZones: [
        {
          type: 'SILENT_LIBRARY',
          name: 'Silent Sanctum Library 📚',
          description: 'Zero distractions. High-intensity deep study & thesis writing.',
          studentCount: 22,
          ambientSound: 'Soft Page Turning & Rain on Glass'
        },
        {
          type: 'CODE_LOUNGE',
          name: 'FAANG & Hacker Lounge 💻',
          description: 'Live pair programming, DSA sprints & system design.',
          studentCount: 14,
          ambientSound: 'Mechanical Keyboards & Lo-Fi Beats'
        },
        {
          type: 'UPSC_ROUNDTABLE',
          name: 'Civil Services Round-Table 🏛️',
          description: 'Editorial analysis, polity debates & current affairs.',
          studentCount: 8,
          ambientSound: 'Quiet Library Whispers'
        },
        {
          type: 'CAFE_TERRACE',
          name: 'Boba & Chai Terrace ☕',
          description: 'Pomodoro rest breaks, informal chats & mental recharging.',
          studentCount: 4,
          ambientSound: 'Café Jazz & Rain'
        }
      ],
      currentUser: {
        id: 'user-self',
        name: 'You (Student)',
        avatarEmoji: '🧑‍💻',
        outfitColor: '#6366f1',
        college: 'IIT Bombay',
        currentTask: 'Dynamic Programming & Graph Theory',
        zone: 'SILENT_LIBRARY',
        x: 45,
        y: 50,
        isFocusing: true,
        studyDurationMinutes: 45
      },
      peers: [
        {
          id: 'peer-1',
          name: 'Aarav Sharma',
          avatarEmoji: '🦉',
          outfitColor: '#10b981',
          college: 'IIT Delhi',
          currentTask: 'Operating Systems Virtual Memory',
          zone: 'SILENT_LIBRARY',
          x: 25,
          y: 35,
          isFocusing: true,
          studyDurationMinutes: 90
        },
        {
          id: 'peer-2',
          name: 'Priya Iyer',
          avatarEmoji: '👩‍🔬',
          outfitColor: '#ec4899',
          college: 'AIIMS New Delhi',
          currentTask: 'Neuroanatomy & Pathology MCQs',
          zone: 'SILENT_LIBRARY',
          x: 65,
          y: 30,
          isFocusing: true,
          studyDurationMinutes: 120
        },
        {
          id: 'peer-3',
          name: 'Rohan Deshmukh',
          avatarEmoji: '🥷',
          outfitColor: '#06b6d4',
          college: 'BITS Pilani',
          currentTask: 'LeetCode Hard Graph BFS/DFS',
          zone: 'CODE_LOUNGE',
          x: 75,
          y: 70,
          isFocusing: true,
          studyDurationMinutes: 60
        },
        {
          id: 'peer-4',
          name: 'Sneha Patel',
          avatarEmoji: '👑',
          outfitColor: '#f59e0b',
          college: 'St. Stephen\'s College',
          currentTask: 'The Hindu Editorial & Ethics Case Studies',
          zone: 'UPSC_ROUNDTABLE',
          x: 20,
          y: 75,
          isFocusing: true,
          studyDurationMinutes: 50
        }
      ]
    };
  }

  public getCampusState(): VirtualCampusState {
    return this.campusState;
  }

  public moveAvatar(dto: MoveAvatarDto): VirtualCampusState {
    this.campusState.currentUser.zone = dto.zone;
    this.campusState.currentUser.x = Math.max(5, Math.min(95, dto.x));
    this.campusState.currentUser.y = Math.max(5, Math.min(95, dto.y));
    if (dto.currentTask) {
      this.campusState.currentUser.currentTask = dto.currentTask;
    }
    return this.campusState;
  }
}

export const virtualCampusService = new VirtualCampusService();
