import { StudentProfile, UpdateStudentProfileDto } from '@studentlife/shared';

// In-memory student profiles store with pre-seeded demo student data
const profilesDb = new Map<string, StudentProfile>();

const calculateLevelInfo = (xp: number) => {
  const level = Math.floor(xp / 250) + 1;
  const currentLevelBaseXp = (level - 1) * 250;
  const nextLevelXp = level * 250;
  const xpToNextLevel = nextLevelXp - xp;
  const levelProgressPercent = Math.min(100, Math.round(((xp - currentLevelBaseXp) / 250) * 100));

  return { level, xpToNextLevel, levelProgressPercent };
};

// Seed demo student profile
const initDemoProfile = () => {
  const demoStudentId = 'demo-student-uuid-01';
  const { level, xpToNextLevel } = calculateLevelInfo(420);

  profilesDb.set(demoStudentId, {
    id: 'prof-demo-student',
    userId: demoStudentId,
    collegeOrSchool: 'Indian Institute of Technology (IIT)',
    degreeOrGrade: 'B.Tech - Computer Science & Engineering',
    fieldOfStudy: 'Computer Science',
    academicYear: 3,
    targetExams: ['GATE (CSE / ECE / ME)', 'JEE Main & Advanced'],
    primaryInterests: ['Algorithms', 'Distributed Systems', 'AI Research'],
    skillTags: ['Data Structures & Algorithms', 'System Design', 'Machine Learning & AI'],
    careerAspirations: ['Software Engineer', 'AI / Data Scientist'],
    dailyStudyGoalMinutes: 180, // 3 hours
    streakCount: 7,
    xpPoints: 420,
    level,
    xpToNextLevel,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

initDemoProfile();

export class ProfileService {
  static async getProfileByUserId(userId: string): Promise<StudentProfile> {
    let profile = profilesDb.get(userId);

    if (!profile) {
      const { level, xpToNextLevel } = calculateLevelInfo(50);
      profile = {
        id: `prof-${Date.now()}`,
        userId,
        collegeOrSchool: 'Apex University / College',
        degreeOrGrade: 'Undergraduate Program',
        fieldOfStudy: 'Science & Technology',
        academicYear: 1,
        targetExams: ['University Semester Finals'],
        primaryInterests: ['Self-Improvement', 'Exams'],
        skillTags: ['Quantitative Aptitude'],
        careerAspirations: ['Software Engineer'],
        dailyStudyGoalMinutes: 120,
        streakCount: 1,
        xpPoints: 50,
        level,
        xpToNextLevel,
        lastActiveDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      profilesDb.set(userId, profile);
    }

    const { level, xpToNextLevel } = calculateLevelInfo(profile.xpPoints);
    profile.level = level;
    profile.xpToNextLevel = xpToNextLevel;

    return profile;
  }

  static async updateProfile(userId: string, dto: UpdateStudentProfileDto): Promise<StudentProfile> {
    const existing = await this.getProfileByUserId(userId);

    const updated: StudentProfile = {
      ...existing,
      collegeOrSchool: dto.collegeOrSchool !== undefined ? dto.collegeOrSchool : existing.collegeOrSchool,
      degreeOrGrade: dto.degreeOrGrade !== undefined ? dto.degreeOrGrade : existing.degreeOrGrade,
      fieldOfStudy: dto.fieldOfStudy !== undefined ? dto.fieldOfStudy : existing.fieldOfStudy,
      academicYear: dto.academicYear !== undefined ? dto.academicYear : existing.academicYear,
      targetExams: dto.targetExams !== undefined ? dto.targetExams : existing.targetExams,
      primaryInterests: dto.primaryInterests !== undefined ? dto.primaryInterests : existing.primaryInterests,
      skillTags: dto.skillTags !== undefined ? dto.skillTags : existing.skillTags,
      careerAspirations: dto.careerAspirations !== undefined ? dto.careerAspirations : existing.careerAspirations,
      dailyStudyGoalMinutes: dto.dailyStudyGoalMinutes !== undefined ? dto.dailyStudyGoalMinutes : existing.dailyStudyGoalMinutes,
      updatedAt: new Date().toISOString(),
    };

    const { level, xpToNextLevel } = calculateLevelInfo(updated.xpPoints);
    updated.level = level;
    updated.xpToNextLevel = xpToNextLevel;

    profilesDb.set(userId, updated);
    return updated;
  }

  static async claimDailyStreak(userId: string): Promise<{ profile: StudentProfile; streakBonus: number; alreadyClaimed: boolean }> {
    const profile = await this.getProfileByUserId(userId);
    const today = new Date().toISOString().split('T')[0];

    if (profile.lastActiveDate === today) {
      return { profile, streakBonus: 0, alreadyClaimed: true };
    }

    const bonusXp = 50;
    profile.streakCount += 1;
    profile.xpPoints += bonusXp;
    profile.lastActiveDate = today;
    profile.updatedAt = new Date().toISOString();

    const { level, xpToNextLevel } = calculateLevelInfo(profile.xpPoints);
    profile.level = level;
    profile.xpToNextLevel = xpToNextLevel;

    profilesDb.set(userId, profile);
    return { profile, streakBonus: bonusXp, alreadyClaimed: false };
  }

  static async awardXp(userId: string, amount: number): Promise<StudentProfile> {
    const profile = await this.getProfileByUserId(userId);
    profile.xpPoints += amount;
    profile.updatedAt = new Date().toISOString();

    const { level, xpToNextLevel } = calculateLevelInfo(profile.xpPoints);
    profile.level = level;
    profile.xpToNextLevel = xpToNextLevel;

    profilesDb.set(userId, profile);
    return profile;
  }
}
