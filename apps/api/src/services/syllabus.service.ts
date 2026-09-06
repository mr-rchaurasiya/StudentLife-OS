import {
  SubjectWithTopics,
  TopicItem,
  CreateSubjectDto,
  CreateTopicDto,
  SyllabusOverviewStats,
} from '@studentlife/shared';
import { ProfileService } from './profile.service';

const subjectsDb = new Map<string, SubjectWithTopics[]>();

const seedDemoSyllabus = () => {
  const demoStudentId = 'demo-student-uuid-01';

  const defaultSubjects: SubjectWithTopics[] = [
    {
      id: 'sub-1',
      userId: demoStudentId,
      name: 'Data Structures & Algorithms',
      code: 'CS-201',
      colorCode: '#6366f1',
      targetExam: 'GATE & FAANG Interviews',
      totalTopics: 5,
      completedTopics: 3,
      completionPercentage: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      topics: [
        { id: 'top-1', subjectId: 'sub-1', title: 'Arrays, Two Pointers & Sliding Window', difficulty: 'EASY', weightagePercentage: 8, isCompleted: true, revisionIntervalDays: 7 },
        { id: 'top-2', subjectId: 'sub-1', title: 'Binary Trees, BST & Tree Traversals', difficulty: 'MEDIUM', weightagePercentage: 12, isCompleted: true, revisionIntervalDays: 5 },
        { id: 'top-3', subjectId: 'sub-1', title: 'Graph Theory (BFS, DFS, Dijkstra, Topo Sort)', difficulty: 'HARD', weightagePercentage: 15, isCompleted: true, revisionIntervalDays: 4 },
        { id: 'top-4', subjectId: 'sub-1', title: 'Dynamic Programming & Memoization', difficulty: 'HARD', weightagePercentage: 18, isCompleted: false, revisionIntervalDays: 3 },
        { id: 'top-5', subjectId: 'sub-1', title: 'Disjoint Set Union (DSU) & Segment Trees', difficulty: 'HARD', weightagePercentage: 10, isCompleted: false, revisionIntervalDays: 2 },
      ],
    },
    {
      id: 'sub-2',
      userId: demoStudentId,
      name: 'System Design & Distributed Systems',
      code: 'CS-305',
      colorCode: '#06b6d4',
      targetExam: 'Software Engineering Interviews',
      totalTopics: 4,
      completedTopics: 2,
      completionPercentage: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      topics: [
        { id: 'top-6', subjectId: 'sub-2', title: 'Load Balancers, Reverse Proxies & CDN', difficulty: 'MEDIUM', weightagePercentage: 10, isCompleted: true, revisionIntervalDays: 7 },
        { id: 'top-7', subjectId: 'sub-2', title: 'Database Sharding, Replication & CAP Theorem', difficulty: 'HARD', weightagePercentage: 16, isCompleted: true, revisionIntervalDays: 6 },
        { id: 'top-8', subjectId: 'sub-2', title: 'Distributed Caching (Redis/Memcached Strategies)', difficulty: 'MEDIUM', weightagePercentage: 14, isCompleted: false, revisionIntervalDays: 4 },
        { id: 'top-9', subjectId: 'sub-2', title: 'Message Queues (Kafka, RabbitMQ) & Event Driven', difficulty: 'HARD', weightagePercentage: 15, isCompleted: false, revisionIntervalDays: 3 },
      ],
    },
    {
      id: 'sub-3',
      userId: demoStudentId,
      name: 'Engineering Mathematics & Calculus',
      code: 'MATH-102',
      colorCode: '#a855f7',
      targetExam: 'GATE (CSE / ECE / ME)',
      totalTopics: 4,
      completedTopics: 2,
      completionPercentage: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      topics: [
        { id: 'top-10', subjectId: 'sub-3', title: 'Linear Algebra (Matrices, Eigenvalues & Vectors)', difficulty: 'MEDIUM', weightagePercentage: 14, isCompleted: true, revisionIntervalDays: 10 },
        { id: 'top-11', subjectId: 'sub-3', title: 'Probability & Bayes Theorem Distributions', difficulty: 'HARD', weightagePercentage: 15, isCompleted: true, revisionIntervalDays: 7 },
        { id: 'top-12', subjectId: 'sub-3', title: 'Differential Calculus & Maxima-Minima', difficulty: 'MEDIUM', weightagePercentage: 10, isCompleted: false, revisionIntervalDays: 4 },
        { id: 'top-13', subjectId: 'sub-3', title: 'Discrete Math (Combinatorics & Graph Graphing)', difficulty: 'HARD', weightagePercentage: 12, isCompleted: false, revisionIntervalDays: 3 },
      ],
    },
    {
      id: 'sub-4',
      userId: demoStudentId,
      name: 'Operating Systems & Concurrency',
      code: 'CS-204',
      colorCode: '#10b981',
      targetExam: 'Semester & GATE Exam',
      totalTopics: 3,
      completedTopics: 1,
      completionPercentage: 33,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      topics: [
        { id: 'top-14', subjectId: 'sub-4', title: 'Process Scheduling & CPU Scheduling Algorithms', difficulty: 'EASY', weightagePercentage: 8, isCompleted: true, revisionIntervalDays: 12 },
        { id: 'top-15', subjectId: 'sub-4', title: 'Synchronization, Semaphores & Deadlock Detection', difficulty: 'HARD', weightagePercentage: 16, isCompleted: false, revisionIntervalDays: 5 },
        { id: 'top-16', subjectId: 'sub-4', title: 'Virtual Memory, Paging & Page Replacement Algorithms', difficulty: 'MEDIUM', weightagePercentage: 12, isCompleted: false, revisionIntervalDays: 4 },
      ],
    },
  ];

  subjectsDb.set(demoStudentId, defaultSubjects);
};

seedDemoSyllabus();

export class SyllabusService {
  static async getSubjects(userId: string): Promise<SubjectWithTopics[]> {
    return subjectsDb.get(userId) || [];
  }

  static async createSubject(userId: string, dto: CreateSubjectDto): Promise<SubjectWithTopics> {
    const newSubjectId = `sub-${Date.now()}`;
    const initialTopics: TopicItem[] = (dto.initialTopics || []).map((t, idx) => ({
      id: `top-${Date.now()}-${idx}`,
      subjectId: newSubjectId,
      title: t.title,
      difficulty: t.difficulty,
      weightagePercentage: t.weightagePercentage,
      isCompleted: false,
      revisionIntervalDays: 1,
    }));

    const newSubject: SubjectWithTopics = {
      id: newSubjectId,
      userId,
      name: dto.name.trim(),
      code: dto.code?.trim(),
      colorCode: dto.colorCode || '#6366f1',
      targetExam: dto.targetExam || 'Core Syllabus',
      totalTopics: initialTopics.length,
      completedTopics: 0,
      completionPercentage: 0,
      topics: initialTopics,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userSubjects = subjectsDb.get(userId) || [];
    userSubjects.push(newSubject);
    subjectsDb.set(userId, userSubjects);

    return newSubject;
  }

  static async addTopic(userId: string, subjectId: string, dto: CreateTopicDto): Promise<TopicItem> {
    const userSubjects = subjectsDb.get(userId) || [];
    const subject = userSubjects.find(s => s.id === subjectId);

    if (!subject) {
      const error: any = new Error('Subject not found');
      error.statusCode = 404;
      throw error;
    }

    const newTopic: TopicItem = {
      id: `top-${Date.now()}`,
      subjectId,
      title: dto.title.trim(),
      difficulty: dto.difficulty || 'MEDIUM',
      weightagePercentage: dto.weightagePercentage || 10,
      isCompleted: false,
      revisionIntervalDays: 1,
    };

    subject.topics.push(newTopic);
    subject.totalTopics = subject.topics.length;
    subject.completionPercentage = Math.round((subject.completedTopics / subject.totalTopics) * 100);
    subject.updatedAt = new Date().toISOString();

    subjectsDb.set(userId, userSubjects);
    return newTopic;
  }

  static async toggleTopic(userId: string, topicId: string): Promise<{ topic: TopicItem; subject: SubjectWithTopics; xpEarned: number }> {
    const userSubjects = subjectsDb.get(userId) || [];
    let foundSubject: SubjectWithTopics | null = null;
    let foundTopic: TopicItem | null = null;

    for (const sub of userSubjects) {
      const top = sub.topics.find(t => t.id === topicId);
      if (top) {
        foundSubject = sub;
        foundTopic = top;
        break;
      }
    }

    if (!foundSubject || !foundTopic) {
      const error: any = new Error('Topic not found');
      error.statusCode = 404;
      throw error;
    }

    const wasCompleted = foundTopic.isCompleted;
    foundTopic.isCompleted = !wasCompleted;
    if (foundTopic.isCompleted) {
      foundTopic.lastRevisedAt = new Date().toISOString();
    }

    // Recalculate subject stats
    foundSubject.completedTopics = foundSubject.topics.filter(t => t.isCompleted).length;
    foundSubject.completionPercentage = Math.round((foundSubject.completedTopics / foundSubject.totalTopics) * 100);
    foundSubject.updatedAt = new Date().toISOString();

    let xpEarned = 0;
    if (!wasCompleted) {
      xpEarned = 20;
      await ProfileService.awardXp(userId, xpEarned);
    }

    subjectsDb.set(userId, userSubjects);
    return { topic: foundTopic, subject: foundSubject, xpEarned };
  }

  static async deleteTopic(userId: string, topicId: string): Promise<void> {
    const userSubjects = subjectsDb.get(userId) || [];
    for (const sub of userSubjects) {
      const idx = sub.topics.findIndex(t => t.id === topicId);
      if (idx !== -1) {
        sub.topics.splice(idx, 1);
        sub.totalTopics = sub.topics.length;
        sub.completedTopics = sub.topics.filter(t => t.isCompleted).length;
        sub.completionPercentage = sub.totalTopics > 0 ? Math.round((sub.completedTopics / sub.totalTopics) * 100) : 0;
        break;
      }
    }
    subjectsDb.set(userId, userSubjects);
  }

  static async getOverview(userId: string): Promise<SyllabusOverviewStats> {
    const userSubjects = subjectsDb.get(userId) || [];

    const totalSubjects = userSubjects.length;
    let totalTopics = 0;
    let completedTopics = 0;
    let highWeightagePending = 0;

    for (const sub of userSubjects) {
      totalTopics += sub.totalTopics;
      completedTopics += sub.completedTopics;
      for (const t of sub.topics) {
        if (!t.isCompleted && t.weightagePercentage >= 14) {
          highWeightagePending += 1;
        }
      }
    }

    const overallCoveragePercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return {
      totalSubjects,
      totalTopics,
      completedTopics,
      overallCoveragePercentage,
      highWeightageTopicsPending: highWeightagePending,
    };
  }
}
