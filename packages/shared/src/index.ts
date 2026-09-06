/**
 * StudentLife OS - Core Shared Domain Types & Contracts
 */

// ==========================================
// 1. Core API & Standard Response Wrapper
// ==========================================
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==========================================
// 2. Auth & User Roles (Phase 02 & 03)
// ==========================================
export type UserRole = 'STUDENT' | 'MENTOR' | 'EDUCATOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // in seconds
}

export interface AuthResponseData {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

// ==========================================
// 3. Student Profile & Gamification (Phase 03)
// ==========================================
export interface StudentProfile {
  id: string;
  userId: string;
  collegeOrSchool?: string;
  degreeOrGrade?: string;
  fieldOfStudy?: string;
  academicYear?: number;
  targetExams: string[];
  primaryInterests: string[];
  skillTags: string[];
  careerAspirations: string[];
  dailyStudyGoalMinutes: number;
  streakCount: number;
  xpPoints: number;
  level: number;
  xpToNextLevel: number;
  lastActiveDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStudentProfileDto {
  collegeOrSchool?: string;
  degreeOrGrade?: string;
  fieldOfStudy?: string;
  academicYear?: number;
  targetExams?: string[];
  primaryInterests?: string[];
  skillTags?: string[];
  careerAspirations?: string[];
  dailyStudyGoalMinutes?: number;
}

export const PREDEFINED_TARGET_EXAMS = [
  'JEE Main & Advanced',
  'NEET UG',
  'GATE (CSE / ECE / ME)',
  'UPSC Civil Services',
  'CAT / MBA Entrances',
  'GRE / GMAT / TOEFL',
  'University Semester Finals',
  'State CET / Board Exams',
];

export const PREDEFINED_SKILLS = [
  'Data Structures & Algorithms',
  'System Design',
  'Full-Stack Web Dev',
  'Machine Learning & AI',
  'Organic Chemistry',
  'Calculus & Linear Algebra',
  'Quantum Physics',
  'Quantitative Aptitude',
  'English Verbal Ability',
];

export const PREDEFINED_CAREERS = [
  'Software Engineer',
  'AI / Data Scientist',
  'Civil Servant (IAS/IPS)',
  'Medical Doctor / Surgeon',
  'Product Manager',
  'Quantitative Researcher',
  'Academician / Professor',
];

// ==========================================
// 4. Dashboard & Focus Telemetry (Phase 04)
// ==========================================
export interface ExamCountdownItem {
  id: string;
  title: string;
  examDate: string;
  daysRemaining: number;
  category: string;
  targetScoreGoal?: string;
}

export interface RevisionDueItem {
  id: string;
  subjectName: string;
  topicTitle: string;
  colorCode: string;
  intervalDays: number;
  urgency: 'OVERDUE' | 'DUE_TODAY' | 'UPCOMING';
}

export interface FocusSessionLog {
  id: string;
  durationMinutes: number;
  sessionType: 'FOCUS_25' | 'FOCUS_50' | 'CUSTOM';
  completedAt: string;
  xpEarned: number;
}

export interface DashboardSummaryData {
  todayStudiedMinutes: number;
  dailyGoalMinutes: number;
  todayGoalProgressPercent: number;
  completedPomodorosToday: number;
  countdowns: ExamCountdownItem[];
  revisionQueue: RevisionDueItem[];
  motivationalQuote: {
    quote: string;
    author: string;
  };
}

// ==========================================
// 5. Study Planner (Phase 05)
// ==========================================
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'POSTPONED';

export interface StudyTask {
  id: string;
  userId: string;
  title: string;
  description?: string;
  subjectName: string;
  subjectColor?: string;
  dueDate: string;
  dueTime?: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedMinutes: number;
  actualMinutes?: number;
  pomodoroSessionsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudyTaskDto {
  title: string;
  description?: string;
  subjectName: string;
  subjectColor?: string;
  dueDate: string;
  dueTime?: string;
  priority?: TaskPriority;
  estimatedMinutes?: number;
}

export interface UpdateStudyTaskDto {
  title?: string;
  description?: string;
  subjectName?: string;
  subjectColor?: string;
  dueDate?: string;
  dueTime?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  estimatedMinutes?: number;
  actualMinutes?: number;
}

export interface WeeklyScheduleData {
  dayName: string;
  dateStr: string;
  isToday: boolean;
  totalTasks: number;
  completedTasks: number;
  estimatedMinutes: number;
  tasks: StudyTask[];
}

// ==========================================
// 6. Syllabus Manager (Phase 06)
// ==========================================
export interface TopicItem {
  id: string;
  subjectId: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  weightagePercentage: number;
  isCompleted: boolean;
  lastRevisedAt?: string;
  nextRevisionDueAt?: string;
  revisionIntervalDays: number;
  notesCount?: number;
}

export interface SubjectWithTopics {
  id: string;
  userId: string;
  name: string;
  code?: string;
  colorCode: string;
  targetExam?: string;
  totalTopics: number;
  completedTopics: number;
  completionPercentage: number;
  topics: TopicItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectDto {
  name: string;
  code?: string;
  colorCode?: string;
  targetExam?: string;
  initialTopics?: Array<{
    title: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    weightagePercentage: number;
  }>;
}

export interface CreateTopicDto {
  subjectId: string;
  title: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  weightagePercentage?: number;
}

export interface SyllabusOverviewStats {
  totalSubjects: number;
  totalTopics: number;
  completedTopics: number;
  overallCoveragePercentage: number;
  highWeightageTopicsPending: number;
}

// ==========================================
// 7. Notes & Resources Hub (Phase 07)
// ==========================================
export type ResourceType = 'MARKDOWN_NOTE' | 'PDF_DOCUMENT' | 'CHEATSHEET' | 'FORMULA_SHEET' | 'CODE_SNIPPET';

export interface NoteItem {
  id: string;
  userId: string;
  title: string;
  content: string; // Markdown formatted
  subjectName: string;
  subjectColor?: string;
  topicId?: string;
  tags: string[];
  isBookmarked: boolean;
  isAiGenerated: boolean;
  wordCount: number;
  readTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  subjectName: string;
  subjectColor?: string;
  topicId?: string;
  tags?: string[];
  isBookmarked?: boolean;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  subjectName?: string;
  subjectColor?: string;
  topicId?: string;
  tags?: string[];
  isBookmarked?: boolean;
}

export interface ResourceDocumentItem {
  id: string;
  title: string;
  type: ResourceType;
  subjectName: string;
  fileSize: string;
  pagesOrItems: number;
  downloadUrl?: string;
  description: string;
  tags: string[];
  isPinned: boolean;
}

// ==========================================
// 8. Flashcards & Spaced Repetition (Phase 08 - 09)
// ==========================================
export interface FlashcardItem {
  id: string;
  userId?: string;
  subjectName: string;
  topicTitle: string;
  question: string;
  answer: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  masteryLevel: number; // 0 to 5
  easeFactor: number; // e.g. 2.5 default
  repetitionIntervalDays: number; // SM-2 interval
  nextReviewDate: string;
  lastReviewedAt?: string;
  tags?: string[];
  isAiGenerated: boolean;
}

export interface AiSummaryResult {
  summary: string;
  keyTakeaways: string[];
  mindMapBullets: string[];
  formulaOrSyntaxSnippet?: string;
  suggestedFlashcardCount: number;
}

export interface AiDoubtChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  level?: 'ELI5' | 'STANDARD' | 'EXAM_ADVANCED';
  suggestedFollowUps?: string[];
  codeSnippet?: string;
}

export interface ConceptExplanationResult {
  concept: string;
  subjectName: string;
  intuitionAnalogy: string;
  formalDefinition: string;
  coreMechanism: string[];
  timeAndSpaceComplexity?: string;
  commonPitfalls: string[];
  practiceQuestion: {
    question: string;
    answer: string;
  };
}

export interface SummarizeContentDto {
  title?: string;
  content: string;
  subjectName?: string;
}

export interface GenerateFlashcardsDto {
  subjectName: string;
  topicTitle: string;
  content: string;
  count?: number;
}

export interface AskAiDoubtDto {
  question: string;
  subjectName?: string;
  level?: 'ELI5' | 'STANDARD' | 'EXAM_ADVANCED';
  contextContent?: string;
}

export interface ExplainConceptDto {
  concept: string;
  subjectName?: string;
  depth?: 'INTUITION' | 'STANDARD' | 'EXAM_RIGOR';
}

export interface Flashcard {
  id: string;
  topicId?: string;
  noteId?: string;
  front: string;
  back: string;
  repetitionStep: number;
  easeFactor: number;
  nextReviewDate: string;
}

// ==========================================
// 8b. Revision Engine & SM-2 (Phase 09)
// ==========================================
export type RevisionUrgency = 'OVERDUE' | 'DUE_TODAY' | 'UPCOMING';
export type RevisionRating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

export interface RevisionItem {
  id: string;
  userId?: string;
  subjectName: string;
  subjectColor?: string;
  topicTitle: string;
  type: 'TOPIC' | 'FLASHCARD' | 'NOTE';
  currentIntervalDays: number;
  easeFactor: number;
  retentionScorePercent: number;
  dueDate: string;
  daysOverdueOrRemaining: number;
  urgency: RevisionUrgency;
  repetitionCount: number;
  lastReviewedAt?: string;
  keySummary?: string;
}

export interface RevisionOverviewStats {
  totalItemsDueToday: number;
  overdueCount: number;
  upcomingCount: number;
  averageRetentionScore: number;
  streakDays: number;
  reviewedTodayCount: number;
  memoryDecayRisk: 'LOW' | 'MODERATE' | 'CRITICAL';
}

export interface ReviewItemDto {
  itemId: string;
  rating: RevisionRating;
}

// ==========================================
// 9. Exams & Practice (Phase 10 - 13)
// ==========================================
export type ExamCategory = 'NATIONAL_COMPETITIVE' | 'UNIVERSITY' | 'CERTIFICATION' | 'RECRUITMENT';

export interface ExamStrategyMilestone {
  id: string;
  name: string;
  targetMonth: string;
  isCompleted: boolean;
  description?: string;
}

export interface ExamProfileItem {
  id: string;
  userId?: string;
  examName: string;
  examCode?: string;
  examCategory: ExamCategory;
  targetExamDate: string;
  daysRemaining: number;
  targetScore: string;
  targetPercentile: string;
  syllabusCoveragePercent: number;
  mockTestAverageScore: number;
  overallReadinessIndex: number; // 0 to 100
  strategyPhases: ExamStrategyMilestone[];
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateExamProfileDto {
  examName: string;
  examCode?: string;
  examCategory: ExamCategory;
  targetExamDate: string;
  targetScore: string;
  targetPercentile: string;
  strategyPhases?: Array<{
    name: string;
    targetMonth: string;
    description?: string;
  }>;
}

export interface UpdateExamProfileDto {
  examName?: string;
  examCode?: string;
  examCategory?: ExamCategory;
  targetExamDate?: string;
  targetScore?: string;
  targetPercentile?: string;
  status?: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
}

export type QuestionType = 'SINGLE_MCQ' | 'MULTIPLE_MCQ' | 'NUMERICAL' | 'DESCRIPTIVE';

export interface QuestionBankItem {
  id: string;
  examType: string; // 'GATE CSE' | 'JEE Advanced' | 'University Finals' | 'CAT QA'
  year?: number; // e.g. 2024, 2023
  subject: string;
  topic: string;
  type: QuestionType;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  marks: number;
  negativeMarks?: number;
  questionText: string;
  codeSnippet?: string;
  options?: Array<{
    id: string;
    text: string;
    isCorrect?: boolean;
  }>;
  correctAnswer: string | string[]; // Option ID or numerical value string
  explanation: string;
  stepByStepSolution: string[];
  keyFormula?: string;
  tags: string[];
  isBookmarked: boolean;
  userSolvedStatus?: 'UNATTEMPTED' | 'CORRECT' | 'INCORRECT';
  userSelectedAnswer?: string | string[];
  totalAttemptsCount: number;
  globalAccuracyRate: number; // percentage
}

export interface QuestionFilterDto {
  examType?: string;
  subject?: string;
  topic?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'ALL';
  year?: number;
  search?: string;
  bookmarkedOnly?: boolean;
  unsolvedOnly?: boolean;
}

export interface SubmitQuestionAnswerDto {
  questionId: string;
  selectedAnswer: string | string[];
  timeTakenSeconds?: number;
}

export interface QuestionSubmitResultDto {
  questionId: string;
  isCorrect: boolean;
  correctAnswer: string | string[];
  explanation: string;
  stepByStepSolution: string[];
  xpAwarded: number;
  marksEarned: number;
}

export interface QuestionBankStats {
  totalQuestions: number;
  totalSolved: number;
  accuracyRate: number;
  pyqsMastered: number;
  bookmarkedCount: number;
  streakDays: number;
}

export interface Question {
  id: string;
  examId?: string;
  subjectId?: string;
  topicId?: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  pyqYear?: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export type QuestionPaletteStatus = 'NOT_VISITED' | 'NOT_ANSWERED' | 'ANSWERED' | 'MARKED_FOR_REVIEW' | 'ANSWERED_AND_MARKED';

export interface MockTestQuestion {
  id: string;
  sectionId: string;
  questionNumber: number;
  type: QuestionType;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  marks: number;
  negativeMarks: number;
  questionText: string;
  codeSnippet?: string;
  options?: Array<{
    id: string;
    text: string;
  }>;
  correctAnswer: string | string[];
  explanation: string;
  stepByStepSolution: string[];
  keyFormula?: string;
  topic: string;
  subject: string;
}

export interface MockTestSection {
  id: string;
  name: string;
  description?: string;
  totalQuestions: number;
  totalMarks: number;
  questions: MockTestQuestion[];
}

export interface MockTestTemplate {
  id: string;
  title: string;
  description: string;
  examType: string;
  category: ExamCategory;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  totalQuestions: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  sections: MockTestSection[];
  totalAttemptsCount: number;
  averageScorePercent: number;
  createdAt: string;
}

export interface StartTestAttemptDto {
  mockTestId: string;
}

export interface UserQuestionResponse {
  questionId: string;
  selectedOptionId?: string | string[];
  numericalAnswer?: string;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
}

export interface SubmitTestAttemptDto {
  mockTestId: string;
  timeSpentSeconds: number;
  responses: { [questionId: string]: UserQuestionResponse };
}

export interface QuestionAttemptDetail {
  questionId: string;
  sectionId: string;
  questionNumber: number;
  questionText: string;
  subject: string;
  topic: string;
  marks: number;
  negativeMarks: number;
  userSelectedAnswer?: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  isAttempted: boolean;
  isMarkedForReview: boolean;
  marksEarned: number;
  timeSpentSeconds: number;
  explanation: string;
  stepByStepSolution: string[];
  options?: Array<{ id: string; text: string }>;
}

export interface SectionScoreDetail {
  sectionId: string;
  sectionName: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;
  marksObtained: number;
  totalSectionMarks: number;
  accuracyPercentage: number;
}

export interface MockTestScorecard {
  attemptId: string;
  mockTestId: string;
  testTitle: string;
  examType: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  accuracyPercentage: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnattempted: number;
  totalTimeSpentSeconds: number;
  estimatedPercentile: number;
  estimatedRank: string;
  xpEarned: number;
  sectionBreakdown: SectionScoreDetail[];
  questionDetails: QuestionAttemptDetail[];
  submittedAt: string;
}

export interface MockTest {
  id: string;
  title: string;
  description?: string;
  examType: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  questionsCount: number;
}

export interface TestAttempt {
  id: string;
  studentId: string;
  mockTestId: string;
  score: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
  rank?: number;
  weakTopicsDetected: string[];
  completedAt: string;
}

// ==========================================
// 9b. Performance Analytics & Diagnostics (Phase 13)
// ==========================================
export type MasteryGrade = 'NOVICE' | 'INTERMEDIATE' | 'PROFICIENT' | 'EXPERT';
export type QuadrantType = 'FAST_ACCURATE' | 'SLOW_ACCURATE' | 'FAST_INACCURATE' | 'SLOW_INACCURATE';
export type WeakAreaSeverity = 'CRITICAL' | 'MODERATE' | 'LOW';

export interface SubjectMasteryMetrics {
  subjectName: string;
  totalQuestionsAttempted: number;
  correctAnswers: number;
  accuracyRate: number;
  averageTimePerQuestionSeconds: number;
  masteryGrade: MasteryGrade;
  colorCode: string;
}

export interface SpeedAccuracyQuadrantItem {
  id: string;
  topic: string;
  subject: string;
  accuracyPercentage: number;
  avgTimeSeconds: number;
  quadrant: QuadrantType;
}

export interface WeakAreaDiagnosticItem {
  id: string;
  topic: string;
  subject: string;
  accuracyPercentage: number;
  errorCount: number;
  negativeMarksLost: number;
  severityLevel: WeakAreaSeverity;
  recommendationAction: string;
  pyqCountAvailable: number;
}

export interface PerformanceTrendData {
  testId: string;
  testTitle: string;
  dateStr: string;
  score: number;
  maxScore: number;
  percentage: number;
  percentile: number;
}

export interface StudentAnalyticsSummary {
  overallReadinessScore: number; // 0 to 100
  estimatedPercentile: number;
  totalMockTestsAttempted: number;
  totalQuestionsSolved: number;
  averageSpeedSecondsPerQuestion: number;
  strongAreasCount: number;
  weakAreasCount: number;
  accuracyRate: number;
  subjectMasteries: SubjectMasteryMetrics[];
  speedAccuracyMatrix: SpeedAccuracyQuadrantItem[];
  weakAreas: WeakAreaDiagnosticItem[];
  historicalTrends: PerformanceTrendData[];
}

// ==========================================
// 10. Career Intelligence & Opportunities (Phase 14 - 18)
// ==========================================
export type SkillImportance = 'MUST_HAVE' | 'GOOD_TO_HAVE' | 'OPTIONAL';

export interface SkillRequirementItem {
  skillName: string;
  importance: SkillImportance;
  category: 'CORE_CS' | 'FRAMEWORK' | 'INFRASTRUCTURE' | 'AI_MATH' | 'SOFT_SKILLS';
  isAcquired: boolean;
  learningCurveWeeks: number;
}

export interface CareerRecommendationResource {
  id: string;
  title: string;
  type: 'COURSE' | 'PROJECT_BLUEPRINT' | 'CERTIFICATION' | 'BOOK';
  provider: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  url?: string;
  description: string;
}

export interface CareerMarketTrend {
  avgSalaryLpa: string;
  salaryRange: {
    entry: string;
    mid: string;
    senior: string;
  };
  topHiringCompanies: string[];
  demandGrowthPercent: number;
  totalOpeningsEstimate: string;
}

export interface CareerRoleProfile {
  id: string;
  title: string;
  iconEmoji: string;
  shortDescription: string;
  fullDescription: string;
  matchScorePercent: number;
  requiredSkills: SkillRequirementItem[];
  recommendations: CareerRecommendationResource[];
  marketTrend: CareerMarketTrend;
}

export interface CareerSkillGapReport {
  roleId: string;
  roleTitle: string;
  matchScorePercent: number;
  acquiredSkills: string[];
  missingSkills: SkillRequirementItem[];
  recommendedPlanWeeks: number;
}

// ==========================================
// 10b. Resume & ATS Optimizer (Phase 15)
// ==========================================
export interface ResumeContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface ResumeEducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  cgpaOrGrade: string;
  relevantCoursework?: string[];
}

export interface ResumeExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentRole: boolean;
  bulletPoints: string[];
}

export interface ResumeProjectItem {
  id: string;
  title: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  bulletPoints: string[];
}

export interface ResumeSkillCategory {
  categoryName: string; // e.g., 'Languages', 'Frameworks & Libraries', 'Databases & Cloud', 'Core CS & Concepts'
  skills: string[];
}

export interface StudentResumeData {
  id: string;
  userId?: string;
  templateId: 'MODERN_SINGLE_COLUMN' | 'MINIMAL_LATEX' | 'TECH_CLEAN';
  contact: ResumeContactInfo;
  headline: string;
  professionalSummary: string;
  education: ResumeEducationItem[];
  experience: ResumeExperienceItem[];
  projects: ResumeProjectItem[];
  skillCategories: ResumeSkillCategory[];
  certifications: string[];
  achievements: string[];
  updatedAt: string;
}

export interface AtsSectionDiagnostic {
  sectionName: string;
  score: number; // 0 - 100
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT';
  feedback: string;
}

export interface AtsKeywordMatch {
  keyword: string;
  category: string;
  isFoundInResume: boolean;
  frequency: number;
}

export interface AtsBulletSuggestion {
  originalBullet: string;
  enhancedBullet: string;
  reasoning: string;
  quantifiedMetricAdded: boolean;
  actionVerbUsed: string;
}

export interface AtsScoreReport {
  overallAtsScore: number; // 0 to 100
  readabilityScore: number;
  keywordMatchPercentage: number;
  quantifiedImpactScore: number;
  formattingComplianceScore: number;
  targetRoleTitle?: string;
  sectionDiagnostics: AtsSectionDiagnostic[];
  detectedKeywords: AtsKeywordMatch[];
  missingKeywords: string[];
  criticalWarnings: string[];
  bulletSuggestions: AtsBulletSuggestion[];
}

export interface AiInterviewMockQuestion {
  id: string;
  questionType: 'TECHNICAL_DEEP_DIVE' | 'SYSTEM_ARCHITECTURE' | 'BEHAVIORAL_STAR' | 'TRADEOFF_ANALYSIS';
  relatedProjectOrExperience: string;
  question: string;
  contextWhyAsked: string;
  idealAnswerRubric: string[];
  keyTermsToInclude: string[];
}

export interface AnalyzeAtsDto {
  resume: StudentResumeData;
  targetRole?: string;
  jobDescriptionText?: string;
}

export interface OptimizeBulletDto {
  bulletPoint: string;
  roleOrProjectContext?: string;
  targetSkill?: string;
}

export interface GenerateInterviewQaDto {
  resume: StudentResumeData;
  focusArea?: 'PROJECTS' | 'EXPERIENCE' | 'CORE_CS' | 'BEHAVIORAL';
}

// ==========================================
// 10c. Internships & Job Radar Engine (Phase 16)
// ==========================================
export type OpportunityType = 'SUMMER_INTERNSHIP' | 'OFF_CYCLE_INTERN' | 'NEW_GRAD_FULLTIME' | 'RESEARCH_FELLOW';
export type WorkLocationType = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type ApplicationPipelineStage = 'SAVED' | 'APPLIED' | 'OA_ASSESSMENT' | 'TECHNICAL_INTERVIEW' | 'OFFER_RECEIVED' | 'REJECTED';

export interface InternshipOpportunity {
  id: string;
  companyName: string;
  companyLogoUrl?: string;
  roleTitle: string;
  opportunityType: OpportunityType;
  location: string;
  workLocationType: WorkLocationType;
  stipendOrSalary: string;
  targetGraduationBatch: string[]; // e.g. ['2025', '2026', '2027']
  applicationDeadline: string;
  daysRemaining: number;
  matchScorePercent: number;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  applyUrl: string;
  description: string;
  perks: string[];
  isBookmarked: boolean;
  postedDate: string;
}

export interface TrackedJobApplication {
  id: string;
  userId?: string;
  opportunityId?: string;
  companyName: string;
  roleTitle: string;
  stipendOrSalary?: string;
  location?: string;
  stage: ApplicationPipelineStage;
  appliedDate: string;
  nextFollowUpDate?: string;
  daysSinceLastUpdate: number;
  notes?: string;
  interviewRoundsCount: number;
  referralStatus: 'NONE' | 'REQUESTED' | 'SECURED';
  referralContactName?: string;
  portalUrl?: string;
  updatedAt: string;
}

export interface CreateJobApplicationDto {
  opportunityId?: string;
  companyName: string;
  roleTitle: string;
  stipendOrSalary?: string;
  location?: string;
  stage?: ApplicationPipelineStage;
  appliedDate?: string;
  nextFollowUpDate?: string;
  notes?: string;
  referralStatus?: 'NONE' | 'REQUESTED' | 'SECURED';
  portalUrl?: string;
}

export interface UpdateJobApplicationDto {
  stage?: ApplicationPipelineStage;
  nextFollowUpDate?: string;
  notes?: string;
  interviewRoundsCount?: number;
  referralStatus?: 'NONE' | 'REQUESTED' | 'SECURED';
  referralContactName?: string;
}

export interface ColdOutreachTemplate {
  subjectLine: string;
  body: string;
  linkedInConnectNote: string;
  tips: string[];
}

export interface GenerateColdOutreachDto {
  companyName: string;
  roleTitle: string;
  recipientName?: string;
  recipientRole?: string; // 'Technical Recruiter' | 'Engineering Manager' | 'Alumni SDE'
  studentKeyProject?: string;
}

// ==========================================
// 10d. Scholarships & Financial Aid Finder (Phase 17)
// ==========================================
export type ScholarshipCategory = 'GOVT_NATIONAL' | 'PRIVATE_MERIT' | 'WOMEN_IN_TECH' | 'MEANS_CUM_MERIT' | 'RESEARCH_GRANT';

export interface ScholarshipEligibilityCriteria {
  minCgpa: number;
  maxAnnualFamilyIncomeInLakhs?: number;
  targetDegrees: string[];
  academicYears: number[];
  genderRestriction: 'ALL' | 'FEMALE_ONLY';
}

export interface ScholarshipScheme {
  id: string;
  title: string;
  provider: string;
  category: ScholarshipCategory;
  awardAmount: string;
  awardType: 'ANNUAL_RECURRING' | 'ONE_TIME_GRANT' | 'TUITION_WAIVER';
  eligibilityCriteria: ScholarshipEligibilityCriteria;
  requiredDocuments: string[];
  applicationDeadline: string;
  daysRemaining: number;
  applyUrl: string;
  description: string;
  selectionProcess: string[];
  isEligible: boolean;
  isBookmarked: boolean;
  totalRecipientsPerYear: number;
  verifiedByGovtOrTrust: boolean;
}

export interface DocumentVerificationItem {
  id: string;
  documentName: string;
  category: 'IDENTITY' | 'ACADEMIC' | 'INCOME_FINANCIAL' | 'COLLEGE_VERIFICATION';
  isVerified: boolean;
  notes?: string;
  fileFormat: string;
}

export interface CheckScholarshipEligibilityDto {
  cgpa: number;
  familyIncomeLakhs: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  academicYear: number;
  degree: string;
}

export interface EligibilityMatchResult {
  eligibleSchemes: ScholarshipScheme[];
  totalPotentialAidEstimate: string;
  matchedCount: number;
  recommendedNextSteps: string[];
}

export interface OpportunityAlert {
  id: string;
  title: string;
  category: 'SCHOLARSHIP' | 'GOV_SCHEME' | 'INTERNSHIP' | 'JOB' | 'EXAM_DEADLINE';
  provider: string;
  deadline: string;
  eligibilityCriteria: string;
  applyUrl: string;
  remindDaysBefore: number;
}

// ==========================================
// 10e. Deadlines, Smart Reminders & Notification Engine (Phase 18)
// ==========================================
export type DeadlineCategory = 'EXAM_FORM' | 'ADMIT_CARD' | 'SCHOLARSHIP_CUTOFF' | 'INTERNSHIP_DEADLINE' | 'ASSIGNMENT' | 'FEE_PAYMENT' | 'COMPETITIVE_REGISTRATION';
export type DeadlinePriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type NotificationChannelType = 'PUSH' | 'EMAIL' | 'SMS' | 'CALENDAR_SYNC';

export interface DeadlineItem {
  id: string;
  userId?: string;
  title: string;
  category: DeadlineCategory;
  dueDate: string; // ISO string
  dueTime?: string; // e.g. "23:59 IST"
  daysRemaining: number;
  priority: DeadlinePriority;
  description: string;
  portalUrl?: string;
  organization: string;
  isCompleted: boolean;
  reminderChannels: NotificationChannelType[];
  leadTimeDays: number[]; // e.g. [14, 7, 3, 1]
  tags: string[];
  createdAt: string;
}

export interface NotificationChannelPreference {
  channel: NotificationChannelType;
  enabled: boolean;
  destination: string; // email address or phone or push token
  description: string;
}

export interface NotificationAlertLog {
  id: string;
  deadlineId: string;
  title: string;
  message: string;
  channel: NotificationChannelType;
  timestamp: string;
  isRead: boolean;
  urgency: DeadlinePriority;
}

export interface CreateDeadlineDto {
  title: string;
  category: DeadlineCategory;
  dueDate: string;
  dueTime?: string;
  priority: DeadlinePriority;
  description: string;
  portalUrl?: string;
  organization: string;
  reminderChannels?: NotificationChannelType[];
  leadTimeDays?: number[];
  tags?: string[];
}

export interface UpdateDeadlineDto {
  title?: string;
  category?: DeadlineCategory;
  dueDate?: string;
  dueTime?: string;
  priority?: DeadlinePriority;
  description?: string;
  portalUrl?: string;
  organization?: string;
  isCompleted?: boolean;
  reminderChannels?: NotificationChannelType[];
  leadTimeDays?: number[];
  tags?: string[];
}

export interface DeadlineStatsSummary {
  totalDeadlines: number;
  urgentCount: number; // < 7 days
  upcomingCount: number; // 7-30 days
  completedCount: number;
  activeNotificationChannelsCount: number;
  nextImmediateDeadline?: DeadlineItem;
}

// ==========================================
// 11. AI Personal Mentor 360° (Phase 19)
// ==========================================
export type MentorPillarFocus = 'STUDY_CONSISTENCY' | 'EXAM_READINESS' | 'CAREER_PROGRESSION' | 'WELLNESS_BURNOUT';
export type MentorPersonaType = 'STRATEGIC_COACH' | 'EMPATHETIC_SUPPORT' | 'DRILL_INSTRUCTOR';
export type BurnoutRiskLevel = 'OPTIMAL' | 'MODERATE_LOAD' | 'HIGH_BURNOUT_RISK';

export interface MentorActionItem {
  id: string;
  title: string;
  description: string;
  pillar: MentorPillarFocus;
  estimatedMinutes: number;
  xpReward: number;
  isCompleted: boolean;
  deepLinkView: 'PLANNER' | 'AI_STUDY' | 'QUESTION_BANK' | 'MOCK_TEST' | 'CAREER' | 'RESUME' | 'INTERNSHIPS' | 'DEADLINES';
  reasoning: string;
}

export interface BurnoutHealthIndex {
  score: number; // 0-100 (higher = better vitality/recovery)
  riskLevel: BurnoutRiskLevel;
  todayStudyHours: number;
  weeklyAverageStudyHours: number;
  restAndSleepHours: number;
  fatigueIndexPercent: number;
  recommendation: string;
}

export interface CrossModuleInsight {
  id: string;
  pillar: MentorPillarFocus;
  title: string;
  observation: string;
  rootCauseAnalysis: string;
  recommendedIntervention: string;
  impactPotential: 'HIGH_LEVERAGE' | 'MODERATE' | 'INCREMENTAL';
}

export interface MentorHolisticReport {
  overallStudentHealthScore: number; // 0 to 100
  momentumStatus: 'PEAK_PERFORMANCE' | 'STEADY_BUILDING' | 'FATIGUE_RECOVERY_NEEDED';
  activePersona: MentorPersonaType;
  burnoutTelemetry: BurnoutHealthIndex;
  dailyActionPlan: MentorActionItem[];
  crossModuleInsights: CrossModuleInsight[];
  weeklyStreakForecast: string;
  personalizedGreeting: string;
  generatedAt: string;
}

export interface MentorChatMessage {
  id: string;
  sender: 'STUDENT' | 'AI_MENTOR';
  message: string;
  timestamp: string;
  suggestedActions?: MentorActionItem[];
  actionLink?: {
    label: string;
    view: string;
  };
}

export interface MentorChatExchangeDto {
  message: string;
  persona?: MentorPersonaType;
  contextPillar?: MentorPillarFocus;
}

export interface MentorChatResponse {
  reply: string;
  persona: MentorPersonaType;
  suggestedActions: MentorActionItem[];
  encouragementQuote: string;
}

// ==========================================
// 12. Community Hub & Production Readiness (Phase 20)
// ==========================================
export type RoomType = 'SILENT_FOCUS' | 'GROUP_DISCUSSIONS' | 'LATE_NIGHT_GRIND' | 'MOCK_TEST_JAM';
export type AmbienceSoundType = 'LOFI_RAIN' | 'LIBRARY_CAFE' | 'WHITE_NOISE' | 'DEEP_SYNTH' | 'FOREST_BIRDS';
export type PomodoroStageType = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

export interface ParticipantPreview {
  id: string;
  name: string;
  avatarUrl: string;
  studyGoal: string;
  streakDays: number;
}

export interface VirtualStudyRoom {
  id: string;
  name: string;
  topicOrExam: string;
  roomType: RoomType;
  backgroundAmbience: AmbienceSoundType;
  activeParticipantsCount: number;
  maxCapacity: number;
  pomodoroStage: PomodoroStageType;
  secondsRemainingInInterval: number; // e.g. 1120s
  hostName: string;
  hostAvatar: string;
  participants: ParticipantPreview[];
  isLocked: boolean;
  tags: string[];
}

export interface DiscussionReplyItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge: string;
  content: string;
  codeSnippet?: string;
  upvotes: number;
  isUpvotedByMe: boolean;
  isAcceptedAnswer: boolean;
  createdAt: string;
}

export interface CommunityDoubtPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge: string;
  subjectTag: string;
  targetExam?: string;
  title: string;
  content: string;
  codeSnippet?: string;
  upvotesCount: number;
  isUpvotedByMe: boolean;
  answersCount: number;
  isSolved: boolean;
  topAnswerAuthor?: string;
  replies: DiscussionReplyItem[];
  createdAt: string;
}

export interface CreateDiscussionDto {
  title: string;
  content: string;
  subjectTag: string;
  targetExam?: string;
  codeSnippet?: string;
}

export interface PostReplyDto {
  content: string;
  codeSnippet?: string;
}

export interface CreateStudyRoomDto {
  name: string;
  topicOrExam: string;
  roomType: RoomType;
  backgroundAmbience: AmbienceSoundType;
  maxCapacity?: number;
  tags?: string[];
}

export interface CommunityStatsSummary {
  totalActiveStudentsLive: number;
  activeStudyRoomsCount: number;
  totalDoubtsSolvedToday: number;
  totalDiscussionThreads: number;
}

// ==========================================
// 13. Real-Time Audio Engine & Binaural Focus Player (Phase 23)
// ==========================================
export type LoFiStreamGenre = 'CHILL_LOFI' | 'DEEP_SYNTHWAVE' | 'PIANO_STUDY' | 'ANIME_BEATS' | 'BINAURAL_GAMMA';

export interface LoFiAudioTrack {
  id: string;
  title: string;
  artist: string;
  genre: LoFiStreamGenre;
  streamUrl: string;
  artworkUrl: string;
  durationSeconds: number;
  bpm: number;
}

export interface AmbientLayerSetting {
  id: 'rain' | 'cafe' | 'fire' | 'keyboard' | 'forest';
  name: string;
  icon: string;
  volume: number; // 0 to 100
  isMuted: boolean;
  audioUrl: string;
}

export interface BinauralPresetConfig {
  frequencyHz: number; // e.g. 40Hz (Gamma), 14Hz (Beta), 10Hz (Alpha), 6Hz (Theta)
  name: string;
  targetMentalState: 'DEEP_FOCUS' | 'MEMORY_RETENTION' | 'CREATIVE_FLOW' | 'MEDITATION_RELAX';
  description: string;
}

export interface GlobalAudioPlayerState {
  isPlaying: boolean;
  activeTrackIndex: number;
  masterVolume: number; // 0 to 100
  isBinauralActive: boolean;
  binauralFrequency: number;
  ambientLayers: AmbientLayerSetting[];
  autoSyncWithPomodoro: boolean;
}

// ==========================================
// 14. Gamification 2.0 & All-India Student Leaderboards (Phase 24)
// ==========================================
export type LeaderboardFilterScope = 'ALL_INDIA' | 'MY_COLLEGE' | 'TARGET_EXAM';
export type WeeklyLeagueTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND' | 'MASTER';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  avatarUrl: string;
  collegeOrSchool: string;
  targetExam: string;
  level: number;
  weeklyXp: number;
  totalXp: number;
  streakDays: number;
  accuracyPercentage: number;
  studyHoursThisWeek: number;
  leagueTier: WeeklyLeagueTier;
  topBadgeTitle: string;
  isCurrentUser: boolean;
}

export interface StudentAchievementBadge {
  id: string;
  title: string;
  category: 'STREAK' | 'FOCUS' | 'EXAMS' | 'COMMUNITY' | 'MASTERY';
  description: string;
  iconEmoji: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  isUnlocked: boolean;
  unlockedAt?: string;
  progressPercent: number;
  xpBonus: number;
}

export interface GamificationDashboardData {
  currentUserRank: number;
  totalParticipants: number;
  leagueTier: WeeklyLeagueTier;
  daysRemainingInDivision: number;
  topThreePodium: LeaderboardEntry[];
  rankings: LeaderboardEntry[];
  achievements: StudentAchievementBadge[];
  weeklyXpTrajectory: number[];
}

// ==========================================
// 15. Camera OCR & Smart Document Scanner (Phase 25)
// ==========================================
export type OcrDocumentType = 'HANDWRITTEN_NOTE' | 'TEXTBOOK_PAGE' | 'DIAGRAM_CHART' | 'EXAM_PAPER';

export interface ExtractedFormulaItem {
  id: string;
  name: string;
  latex: string;
  explanation: string;
}

export interface GeneratedQuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface OcrScanResult {
  id: string;
  documentType: OcrDocumentType;
  title: string;
  subjectName: string;
  confidenceScorePercent: number;
  extractedMarkdown: string;
  keyFormulas: ExtractedFormulaItem[];
  bulletSummary: string[];
  generatedQuiz: GeneratedQuizQuestion[];
  suggestedFlashcardsCount: number;
  scannedAt: string;
}

export interface OcrScanRequestDto {
  imageUri?: string;
  documentType?: OcrDocumentType;
  presetKey?: 'CALCULUS_NOTE' | 'DP_BLUEPRINT' | 'UPSC_HISTORY';
  subjectName?: string;
}

// ==========================================
// 16. Social Study Rooms & Live Sync (Phase 26)
// ==========================================
export type PomodoroTimerPhase = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';
export type RoomVibeType = 'Deep Silence' | 'Lo-Fi Chill' | 'Library Ambience' | 'Exam Rush' | 'Ambient Rain';
export type StudentRoomStatus = 'FOCUSING' | 'ON_BREAK' | 'STREAK_SHARING' | 'IDLE';

export interface RoomMember {
  id: string;
  name: string;
  avatar: string;
  college: string;
  examTarget: string;
  currentGoal: string;
  status: StudentRoomStatus;
  streakDays: number;
  pomodoroMinutesToday: number;
  joinedAt: string;
}

export interface StudyRoomChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  type: 'CHAT' | 'GOAL_ACHIEVED' | 'POMODORO_SYNC' | 'ENCOURAGE';
  reactionCount?: number;
}

export interface StudyRoom {
  id: string;
  name: string;
  description: string;
  subject: string;
  topic: string;
  hostName: string;
  hostAvatar: string;
  activeStudentsCount: number;
  maxParticipants: number;
  isPrivate: boolean;
  passcode?: string;
  vibe: RoomVibeType;
  pomodoroPhase: PomodoroTimerPhase;
  pomodoroSecondsLeft: number;
  isTimerRunning: boolean;
  members: RoomMember[];
  recentMessages: StudyRoomChatMessage[];
  roomGoal: string;
  createdAt: string;
}

export interface CreateSocialStudyRoomDto {
  name: string;
  subject: string;
  topic: string;
  vibe: RoomVibeType;
  maxParticipants?: number;
  roomGoal?: string;
}

export interface SendRoomMessageDto {
  text: string;
  type?: 'CHAT' | 'GOAL_ACHIEVED' | 'POMODORO_SYNC' | 'ENCOURAGE';
}

export interface UpdateMemberGoalDto {
  goal: string;
}

// ==========================================
// 17. Push Notifications & Morning Digest (Phase 28)
// ==========================================
export interface DailyStudyDigestResult {
  date: string;
  greeting: string;
  motivationalQuote: {
    quote: string;
    author: string;
  };
  totalTasksToday: number;
  highPriorityTasks: Array<{ id: string; title: string; subjectName: string; dueTime: string }>;
  flashcardsDueCount: number;
  upcomingExamClocks: Array<{ title: string; daysRemaining: number }>;
  currentStreakDays: number;
  targetFocusMinutes: number;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: {
    url?: string;
    view?: string;
  };
}

export interface PushSubscriptionDto {
  endpoint: string;
  keys?: {
    p256dh: string;
    auth: string;
  };
  userId?: string;
}

// ==========================================
// 18. AI Voice Tutor & Oral Drills (Phase 31)
// ==========================================
export type VoicePersonaType = 'Socratic Tutor' | 'Rapid Exam Driller' | 'Calm Explainer';
export type VoiceLanguageMode = 'bilingual' | 'hi-IN' | 'en-US';

export interface VoiceTutorMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category: 'QUESTION' | 'EXPLANATION' | 'ORAL_QUIZ_PROMPT' | 'FEEDBACK';
  audioDurationSeconds?: number;
  latexSnippet?: string;
  followUpSuggestion?: string;
}

export interface OralQuizDrill {
  id: string;
  subject: string;
  topic: string;
  question: string;
  expectedKeyPoints: string[];
  hint: string;
  fullExplanation: string;
}

export interface VoiceTutorQueryDto {
  transcript: string;
  persona?: VoicePersonaType;
  languageMode?: VoiceLanguageMode;
  currentSubject?: string;
}

export interface EvaluateOralAnswerDto {
  drillId: string;
  spokenAnswer: string;
}

// ==========================================
// 19. Concept Knowledge Graph & Mind Maps (Phase 32)
// ==========================================
export type MasteryLevel = 'MASTERED' | 'REVISING' | 'UNEXPLORED';
export type GraphEdgeType = 'PREREQUISITE' | 'CORRELATED' | 'APPLICATION';

export interface ConceptNode {
  id: string;
  label: string;
  subject: string;
  category: string;
  mastery: MasteryLevel;
  weightagePercent: number;
  x: number;
  y: number;
  formulaSummary?: string;
  pyqCount: number;
  keyTakeaways: string[];
}

export interface ConceptGraphEdge {
  id: string;
  from: string;
  to: string;
  type: GraphEdgeType;
  label?: string;
}

export interface SubjectKnowledgeGraph {
  subjectId: string;
  subjectName: string;
  nodes: ConceptNode[];
  edges: ConceptGraphEdge[];
  overallMasteryPercent: number;
}

// ==========================================
// 20. 1v1 Peer Quiz Arena & Battles (Phase 33)
// ==========================================
export type BattleMatchStatus = 'WAITING_FOR_MATCH' | 'IN_BATTLE' | 'ROUND_SUMMARY' | 'MATCH_FINISHED';

export interface BattleQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  timeLimitSeconds: number;
  points: number;
  latexSnippet?: string;
  explanation: string;
}

export interface BattlePlayer {
  id: string;
  name: string;
  avatar: string;
  college: string;
  score: number;
  streakCombo: number;
  currentAnswerIndex?: number;
  isAnswered: boolean;
  timeTakenSeconds?: number;
}

export interface QuizBattleMatch {
  id: string;
  subject: string;
  topic: string;
  roundNumber: number;
  totalRounds: number;
  status: BattleMatchStatus;
  currentQuestionIndex: number;
  questions: BattleQuestion[];
  player1: BattlePlayer;
  player2: BattlePlayer;
  winnerId?: string;
  xpWager: number;
  xpReward: number;
}

export interface SubmitBattleAnswerDto {
  matchId: string;
  playerId: string;
  questionIndex: number;
  answerIndex: number;
  timeTakenSeconds: number;
}

export interface FindBattleMatchDto {
  subject: string;
  user?: {
    id?: string;
    name?: string;
    avatar?: string;
    college?: string;
  };
  xpWager?: number;
}
