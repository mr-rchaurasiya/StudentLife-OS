import {
  StudyTask,
  CreateStudyTaskDto,
  UpdateStudyTaskDto,
  WeeklyScheduleData,
  TaskPriority,
  TaskStatus,
} from '@studentlife/shared';
import { ProfileService } from './profile.service';

const tasksDb = new Map<string, StudyTask[]>();

// Seed default study tasks for the demo student
const seedDemoTasks = () => {
  const demoStudentId = 'demo-student-uuid-01';
  const today = new Date().toISOString().split('T')[0];

  const defaultTasks: StudyTask[] = [
    {
      id: 'task-1',
      userId: demoStudentId,
      title: 'Practice 5 Hard LeetCode DP Problems',
      description: 'Focus on 0/1 Knapsack & Longest Common Subsequence patterns',
      subjectName: 'Data Structures & Algorithms',
      subjectColor: '#6366f1',
      dueDate: today,
      dueTime: '10:00 AM',
      priority: 'HIGH',
      status: 'TODO',
      estimatedMinutes: 60,
      actualMinutes: 0,
      pomodoroSessionsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      userId: demoStudentId,
      title: 'Read Chapter 4: Distributed Caching Architecture',
      description: 'Take markdown notes on Cache-Aside vs Write-Through patterns',
      subjectName: 'System Design',
      subjectColor: '#06b6d4',
      dueDate: today,
      dueTime: '02:30 PM',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      estimatedMinutes: 45,
      actualMinutes: 45,
      pomodoroSessionsCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-3',
      userId: demoStudentId,
      title: 'Solve GATE 2024 Engineering Mathematics PYQs',
      description: 'Calculus, Eigenvalues, and Bayes Theorem numericals',
      subjectName: 'GATE Exam Prep',
      subjectColor: '#f43f5e',
      dueDate: today,
      dueTime: '06:00 PM',
      priority: 'URGENT',
      status: 'TODO',
      estimatedMinutes: 90,
      actualMinutes: 0,
      pomodoroSessionsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-4',
      userId: demoStudentId,
      title: 'Revise Computer Networks Socket Programming',
      description: 'TCP 3-way handshake states and sliding window protocol',
      subjectName: 'Computer Networks',
      subjectColor: '#10b981',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      dueTime: '11:00 AM',
      priority: 'LOW',
      status: 'TODO',
      estimatedMinutes: 30,
      actualMinutes: 0,
      pomodoroSessionsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  tasksDb.set(demoStudentId, defaultTasks);
};

seedDemoTasks();

export class PlannerService {
  static async getTasks(userId: string, filter?: { status?: TaskStatus; priority?: TaskPriority; date?: string }): Promise<StudyTask[]> {
    let userTasks = tasksDb.get(userId) || [];

    if (filter?.status) {
      userTasks = userTasks.filter(t => t.status === filter.status);
    }
    if (filter?.priority) {
      userTasks = userTasks.filter(t => t.priority === filter.priority);
    }
    if (filter?.date) {
      userTasks = userTasks.filter(t => t.dueDate === filter.date);
    }

    return userTasks;
  }

  static async createTask(userId: string, dto: CreateStudyTaskDto): Promise<StudyTask> {
    const newTask: StudyTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title: dto.title.trim(),
      description: dto.description?.trim(),
      subjectName: dto.subjectName.trim() || 'General Study',
      subjectColor: dto.subjectColor || '#6366f1',
      dueDate: dto.dueDate || new Date().toISOString().split('T')[0],
      dueTime: dto.dueTime || '12:00 PM',
      priority: dto.priority || 'MEDIUM',
      status: 'TODO',
      estimatedMinutes: dto.estimatedMinutes || 30,
      actualMinutes: 0,
      pomodoroSessionsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userTasks = tasksDb.get(userId) || [];
    userTasks.unshift(newTask);
    tasksDb.set(userId, userTasks);

    return newTask;
  }

  static async updateTask(userId: string, taskId: string, dto: UpdateStudyTaskDto): Promise<StudyTask> {
    const userTasks = tasksDb.get(userId) || [];
    const index = userTasks.findIndex(t => t.id === taskId);

    if (index === -1) {
      const error: any = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    const current = userTasks[index];
    const updated: StudyTask = {
      ...current,
      ...dto,
      title: dto.title !== undefined ? dto.title.trim() : current.title,
      description: dto.description !== undefined ? dto.description.trim() : current.description,
      subjectName: dto.subjectName !== undefined ? dto.subjectName.trim() : current.subjectName,
      subjectColor: dto.subjectColor !== undefined ? dto.subjectColor : current.subjectColor,
      dueDate: dto.dueDate !== undefined ? dto.dueDate : current.dueDate,
      dueTime: dto.dueTime !== undefined ? dto.dueTime : current.dueTime,
      priority: dto.priority !== undefined ? dto.priority : current.priority,
      status: dto.status !== undefined ? dto.status : current.status,
      estimatedMinutes: dto.estimatedMinutes !== undefined ? dto.estimatedMinutes : current.estimatedMinutes,
      actualMinutes: dto.actualMinutes !== undefined ? dto.actualMinutes : current.actualMinutes,
      updatedAt: new Date().toISOString(),
    };

    userTasks[index] = updated;
    tasksDb.set(userId, userTasks);
    return updated;
  }

  static async toggleTask(userId: string, taskId: string): Promise<{ task: StudyTask; xpEarned: number }> {
    const userTasks = tasksDb.get(userId) || [];
    const task = userTasks.find(t => t.id === taskId);

    if (!task) {
      const error: any = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    const wasCompleted = task.status === 'COMPLETED';
    task.status = wasCompleted ? 'TODO' : 'COMPLETED';
    task.updatedAt = new Date().toISOString();

    let xpEarned = 0;
    if (!wasCompleted) {
      xpEarned = 15;
      await ProfileService.awardXp(userId, xpEarned);
    }

    tasksDb.set(userId, userTasks);
    return { task, xpEarned };
  }

  static async deleteTask(userId: string, taskId: string): Promise<void> {
    let userTasks = tasksDb.get(userId) || [];
    userTasks = userTasks.filter(t => t.id !== taskId);
    tasksDb.set(userId, userTasks);
  }

  static async getWeeklySchedule(userId: string): Promise<WeeklyScheduleData[]> {
    const userTasks = tasksDb.get(userId) || [];
    const days: WeeklyScheduleData[] = [];
    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = -1; i < 6; i++) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + i);
      const dateStr = targetDate.toISOString().split('T')[0];
      const isToday = i === 0;

      const dayTasks = userTasks.filter(t => t.dueDate === dateStr);
      const completedTasks = dayTasks.filter(t => t.status === 'COMPLETED').length;
      const estimatedMinutes = dayTasks.reduce((acc, curr) => acc + curr.estimatedMinutes, 0);

      days.push({
        dayName: dayNames[targetDate.getDay()],
        dateStr,
        isToday,
        totalTasks: dayTasks.length,
        completedTasks,
        estimatedMinutes,
        tasks: dayTasks,
      });
    }

    return days;
  }
}
