import {
  ExamProfileItem,
  CreateExamProfileDto,
  UpdateExamProfileDto,
} from '@studentlife/shared';

const examProfilesDb = new Map<string, ExamProfileItem[]>();

const calculateDaysRemaining = (targetDate: string): number => {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const DEFAULT_DEMO_EXAMS: ExamProfileItem[] = [
  {
    id: 'exam-1',
    userId: 'demo-student-uuid-01',
    examName: 'GATE 2027 (Computer Science & Engineering)',
    examCode: 'GATE-CS',
    examCategory: 'NATIONAL_COMPETITIVE',
    targetExamDate: '2027-02-14',
    daysRemaining: calculateDaysRemaining('2027-02-14'),
    targetScore: '75 / 100 Marks',
    targetPercentile: 'AIR < 500 (Top 0.5%)',
    syllabusCoveragePercent: 54,
    mockTestAverageScore: 68,
    overallReadinessIndex: 61,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    strategyPhases: [
      {
        id: 'ms-1',
        name: 'Phase 1: Core Syllabus & Theory Coverage',
        targetMonth: 'Sept – Nov 2026',
        isCompleted: true,
        description: 'Complete discrete math, algorithms, COA, DBMS, and OS core topics.',
      },
      {
        id: 'ms-2',
        name: 'Phase 2: 15-Year PYQ Solving & Topic Tests',
        targetMonth: 'Dec 2026 – Jan 2027',
        isCompleted: false,
        description: 'Solve all past 15 years question papers with error-log tracking.',
      },
      {
        id: 'ms-3',
        name: 'Phase 3: Full-Length Mocks & Speed Calibration',
        targetMonth: 'Jan – Feb 2027',
        isCompleted: false,
        description: 'Simulate 10 national-level 3-hour tests with negative marking.',
      },
    ],
  },
  {
    id: 'exam-2',
    userId: 'demo-student-uuid-01',
    examName: 'University B.Tech 6th Semester Finals',
    examCode: 'UNIV-SEM6',
    examCategory: 'UNIVERSITY',
    targetExamDate: '2026-11-20',
    daysRemaining: calculateDaysRemaining('2026-11-20'),
    targetScore: 'CGPA >= 9.2',
    targetPercentile: 'Top 5% in Department',
    syllabusCoveragePercent: 72,
    mockTestAverageScore: 82,
    overallReadinessIndex: 77,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    strategyPhases: [
      {
        id: 'ms-4',
        name: 'Mid-term Lab Assessments & Viva Prep',
        targetMonth: 'October 2026',
        isCompleted: true,
        description: 'Complete internal projects and system design viva checklists.',
      },
      {
        id: 'ms-5',
        name: 'Past 5-Year University Papers & Derivations',
        targetMonth: 'November 2026',
        isCompleted: false,
        description: 'Practice 10-mark long-answer questions and theory proofs.',
      },
    ],
  },
  {
    id: 'exam-3',
    userId: 'demo-student-uuid-01',
    examName: 'Tech Tier-1 Software Engineer Online Assessment',
    examCode: 'OA-SWE',
    examCategory: 'RECRUITMENT',
    targetExamDate: '2026-10-15',
    daysRemaining: calculateDaysRemaining('2026-10-15'),
    targetScore: '100% Test Case Pass',
    targetPercentile: 'Top 2% of applicants',
    syllabusCoveragePercent: 65,
    mockTestAverageScore: 78,
    overallReadinessIndex: 71,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    strategyPhases: [
      {
        id: 'ms-6',
        name: 'Blind 75 & LeetCode Top Patterns',
        targetMonth: 'Sept 2026',
        isCompleted: true,
        description: 'Trees, Graphs, DP state compression, and Trie implementations.',
      },
      {
        id: 'ms-7',
        name: 'Timed 90-Min Coding Assessment Mock Run',
        targetMonth: 'Early Oct 2026',
        isCompleted: false,
        description: 'Simulate HackerRank / CodeSignal 4-problem test constraints.',
      },
    ],
  },
];

examProfilesDb.set('demo-student-uuid-01', DEFAULT_DEMO_EXAMS);

export class ExamPrepService {
  static async getProfiles(userId: string): Promise<ExamProfileItem[]> {
    const list = examProfilesDb.get(userId) || DEFAULT_DEMO_EXAMS;
    return list.map((item) => ({
      ...item,
      daysRemaining: calculateDaysRemaining(item.targetExamDate),
    }));
  }

  static async createProfile(userId: string, dto: CreateExamProfileDto): Promise<ExamProfileItem> {
    const days = calculateDaysRemaining(dto.targetExamDate);

    const defaultMilestones = dto.strategyPhases
      ? dto.strategyPhases.map((p, idx) => ({
          id: `ms-${Date.now()}-${idx}`,
          name: p.name,
          targetMonth: p.targetMonth,
          description: p.description,
          isCompleted: false,
        }))
      : [
          {
            id: `ms-${Date.now()}-1`,
            name: 'Phase 1: Conceptual Foundation & Notes',
            targetMonth: 'Month 1',
            isCompleted: false,
            description: 'Cover all fundamental topics from syllabus.',
          },
          {
            id: `ms-${Date.now()}-2`,
            name: 'Phase 2: Question Bank & PYQ Drills',
            targetMonth: 'Month 2',
            isCompleted: false,
            description: 'Topic-wise practice and high-frequency patterns.',
          },
          {
            id: `ms-${Date.now()}-3`,
            name: 'Phase 3: Timed Mocks & Strategy Optimization',
            targetMonth: 'Final Month',
            isCompleted: false,
            description: 'Simulated exam environments with negative marking.',
          },
        ];

    const newProfile: ExamProfileItem = {
      id: `exam-${Date.now()}`,
      userId,
      examName: dto.examName.trim(),
      examCode: dto.examCode?.trim().toUpperCase() || 'EXAM-TARGET',
      examCategory: dto.examCategory,
      targetExamDate: dto.targetExamDate,
      daysRemaining: days,
      targetScore: dto.targetScore,
      targetPercentile: dto.targetPercentile,
      syllabusCoveragePercent: 25,
      mockTestAverageScore: 0,
      overallReadinessIndex: 25,
      strategyPhases: defaultMilestones,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const current = examProfilesDb.get(userId) || DEFAULT_DEMO_EXAMS;
    const updated = [newProfile, ...current];
    examProfilesDb.set(userId, updated);

    return newProfile;
  }

  static async updateProfile(
    userId: string,
    id: string,
    dto: UpdateExamProfileDto
  ): Promise<ExamProfileItem> {
    const list = examProfilesDb.get(userId) || DEFAULT_DEMO_EXAMS;
    const index = list.findIndex((e) => e.id === id);

    if (index === -1) {
      const error: any = new Error('Exam profile not found');
      error.statusCode = 404;
      throw error;
    }

    const current = list[index];
    const targetDate = dto.targetExamDate || current.targetExamDate;
    const days = calculateDaysRemaining(targetDate);

    const updated: ExamProfileItem = {
      ...current,
      examName: dto.examName !== undefined ? dto.examName.trim() : current.examName,
      examCode: dto.examCode !== undefined ? dto.examCode.trim().toUpperCase() : current.examCode,
      examCategory: dto.examCategory !== undefined ? dto.examCategory : current.examCategory,
      targetExamDate: targetDate,
      daysRemaining: days,
      targetScore: dto.targetScore !== undefined ? dto.targetScore : current.targetScore,
      targetPercentile: dto.targetPercentile !== undefined ? dto.targetPercentile : current.targetPercentile,
      status: dto.status !== undefined ? dto.status : current.status,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    examProfilesDb.set(userId, list);

    return updated;
  }

  static async toggleMilestone(
    userId: string,
    examId: string,
    milestoneId: string
  ): Promise<ExamProfileItem> {
    const list = examProfilesDb.get(userId) || DEFAULT_DEMO_EXAMS;
    const exam = list.find((e) => e.id === examId);

    if (!exam) {
      const error: any = new Error('Exam profile not found');
      error.statusCode = 404;
      throw error;
    }

    const milestone = exam.strategyPhases.find((m) => m.id === milestoneId);
    if (!milestone) {
      const error: any = new Error('Milestone not found');
      error.statusCode = 404;
      throw error;
    }

    milestone.isCompleted = !milestone.isCompleted;

    const completedCount = exam.strategyPhases.filter((m) => m.isCompleted).length;
    const milestoneBonus = Math.round((completedCount / exam.strategyPhases.length) * 20);
    exam.overallReadinessIndex = Math.min(100, exam.syllabusCoveragePercent + milestoneBonus);
    exam.updatedAt = new Date().toISOString();

    examProfilesDb.set(userId, list);
    return exam;
  }

  static async deleteProfile(userId: string, id: string): Promise<void> {
    let list = examProfilesDb.get(userId) || DEFAULT_DEMO_EXAMS;
    list = list.filter((e) => e.id !== id);
    examProfilesDb.set(userId, list);
  }
}
