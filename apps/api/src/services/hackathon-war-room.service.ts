import {
  HackathonWarRoomState,
  PostSprintTaskDto,
  ExportDevpostDto,
  HackathonSprintTask,
  HackathonGitCommit,
} from '@studentlife/shared';

export class HackathonWarRoomService {
  private state: HackathonWarRoomState;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): HackathonWarRoomState {
    const tasks: HackathonSprintTask[] = [
      {
        id: 'task-1',
        title: 'Architect WebRTC Mesh & Canvas Vector Pipeline',
        assigneeName: 'Aman C. (FullStack)',
        role: 'BACKEND',
        status: 'DONE',
        estimatedHours: 4,
      },
      {
        id: 'task-2',
        title: 'Train DistilBERT Intent Classifier on Edge ONNX',
        assigneeName: 'Dr. Sarah (ML)',
        role: 'ML_AI',
        status: 'IN_PROGRESS',
        estimatedHours: 6,
      },
      {
        id: 'task-3',
        title: 'Craft Glassmorphism Dark UI & Mobile PWA Service Worker',
        assigneeName: 'Priya S. (Frontend)',
        role: 'FRONTEND',
        status: 'IN_PROGRESS',
        estimatedHours: 3,
      },
      {
        id: 'task-4',
        title: 'Record 2-Min Loom Demo Video & Synthesize Devpost Story',
        assigneeName: 'Devon V. (Pitch)',
        role: 'DESIGN_PITCH',
        status: 'TODO',
        estimatedHours: 2,
      },
    ];

    const commits: HackathonGitCommit[] = [
      {
        id: 'c-101',
        author: 'Aman C.',
        commitMessage: 'feat(core): implement zero-trust telemetry sync and websocket room bridge',
        branch: 'main',
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        linesAdded: 480,
      },
      {
        id: 'c-102',
        author: 'Dr. Sarah',
        commitMessage: 'feat(ml): quantize PyTorch checkpoint to int8 ONNX runtime (4x speedup)',
        branch: 'ml/onnx-quantization',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        linesAdded: 290,
      },
    ];

    return {
      hackathonName: 'ETHGlobal / Smart India Hackathon 2026 Grand Finale',
      hoursRemaining: 14.5,
      totalTeamXp: 340,
      tasks,
      commits,
      devpostDraftMarkdown: `# Project: AuraFlow AI\n\n## 💡 Inspiration\nStudents facing intense 24h hackathon sprints lack unified real-time telemetry and automated pitch synthesis.\n\n## 🛠️ How We Built It\nBuilt using React 18, Node.js TypeScript, Web Audio binaural beats, and local ONNX micro-inference.`,
    };
  }

  async getWarRoomState(): Promise<HackathonWarRoomState> {
    return this.state;
  }

  async addTask(dto: PostSprintTaskDto): Promise<HackathonWarRoomState> {
    const newTask: HackathonSprintTask = {
      id: `task-${Date.now()}`,
      title: dto.title.trim(),
      assigneeName: dto.assigneeName.trim(),
      role: dto.role,
      status: 'TODO',
      estimatedHours: 3,
    };
    this.state.tasks.unshift(newTask);
    this.state.totalTeamXp += 20;
    return this.state;
  }

  async toggleTaskStatus(taskId: string): Promise<HackathonWarRoomState> {
    const task = this.state.tasks.find((t) => t.id === taskId);
    if (task) {
      if (task.status === 'TODO') task.status = 'IN_PROGRESS';
      else if (task.status === 'IN_PROGRESS') {
        task.status = 'DONE';
        this.state.totalTeamXp += 40;
        // Simulate a new git commit
        this.state.commits.unshift({
          id: `c-${Date.now()}`,
          author: task.assigneeName,
          commitMessage: `feat(sprint): completed sprint deliverable [${task.title}]`,
          branch: 'main',
          timestamp: new Date().toISOString(),
          linesAdded: Math.floor(Math.random() * 200) + 80,
        });
      } else {
        task.status = 'TODO';
      }
    }
    return this.state;
  }

  async exportDevpost(dto: ExportDevpostDto): Promise<HackathonWarRoomState> {
    this.state.devpostDraftMarkdown = `# ${dto.projectName}\n\n## 💡 Inspiration\n${dto.inspiration}\n\n## 🚀 How We Built It\n${dto.howWeBuiltIt}\n\n## 🏆 Accomplishments that we're proud of\n- Shipped fully operational zero-latency client and backend in under 24 hours.\n- Maintained 100% strict TypeScript types and zero production crashes.`;
    return this.state;
  }
}

export const hackathonWarRoomService = new HackathonWarRoomService();
