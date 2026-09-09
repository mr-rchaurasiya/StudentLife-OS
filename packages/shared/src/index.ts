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

// ==========================================
// 34. Smart PDF & Document Annotator (Phase 34)
// ==========================================
export type DocumentAnnotationType = 'HIGHLIGHT' | 'NOTE' | 'AI_INSIGHT' | 'FORMULA' | 'FLASHCARD';
export type DocumentAnnotationColor = 'yellow' | 'emerald' | 'cyan' | 'rose' | 'violet';

export interface DocumentAnnotation {
  id: string;
  documentId: string;
  selectedText: string;
  color: DocumentAnnotationColor;
  type: DocumentAnnotationType;
  noteContent?: string;
  aiResponse?: string;
  paragraphIndex: number;
  createdAt: string;
}

export type DocumentAiAction = 'EXPLAIN' | 'SUMMARIZE' | 'FLASHCARD' | 'QUIZ' | 'TRANSLATE_HINDI' | 'SIMPLIFY_MATH';

export interface DocumentAiActionRequestDto {
  documentId: string;
  selectedText: string;
  action: DocumentAiAction;
  contextParagraph?: string;
}

export interface SmartDocument {
  id: string;
  title: string;
  subject: string;
  category: string;
  author: string;
  readTimeMinutes: number;
  paragraphs: string[];
  annotations: DocumentAnnotation[];
}

// ==========================================
// 35. AI Custom Mock Paper & Test Series Generator (Phase 35)
// ==========================================
export type ExamDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'COMPETITIVE_OLYMPIAD';

export interface MockPaperQuestion {
  id: string;
  questionNumber: number;
  type: 'MCQ' | 'NUMERICAL' | 'DESCRIPTIVE' | 'ASSERTION_REASON';
  marks: number;
  negativeMarks: number;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  detailedSolution: string;
  difficulty: ExamDifficulty;
  topic: string;
}

export interface ExamPaperSection {
  title: string;
  weightageMarks: number;
  questions: MockPaperQuestion[];
}

export interface CustomMockPaper {
  id: string;
  title: string;
  examType: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  sections: ExamPaperSection[];
  createdAt: string;
}

export interface GenerateMockPaperDto {
  examType: string;
  subject: string;
  topics: string[];
  totalQuestions: number;
  difficultyDistribution?: {
    easyPct: number;
    mediumPct: number;
    hardPct: number;
  };
  includeSolutions?: boolean;
}

// ==========================================
// 36. Focus Garden & Virtual Study Pet (Phase 36)
// ==========================================
export type TreeSpecies = 'CHERRY_BLOSSOM' | 'GOLDEN_OAK' | 'MYSTIC_WILLOW' | 'CYBER_PINE' | 'EMERALD_BAMBOO';
export type TreeStatus = 'GROWING' | 'HARVESTED' | 'WITHERED';
export type PetType = 'WISE_OWL' | 'CHILL_CAPYBARA' | 'MYSTIC_DRAGON' | 'FOCUS_FOX';

export interface FocusTree {
  id: string;
  species: TreeSpecies;
  plantedAt: string;
  durationMinutes: number;
  status: TreeStatus;
  focusSubject?: string;
  earnedCoins: number;
  earnedXp: number;
  gridPosition: { row: number; col: number };
}

export interface StudyPet {
  id: string;
  name: string;
  type: PetType;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  happinessPercent: number;
  activeFocusBoostPercent: number; // e.g. +10% XP
  unlockedCostumes: string[];
  currentMood: 'JOYFUL' | 'FOCUSING' | 'SLEEPY' | 'HUNGRY';
}

export interface FocusGardenState {
  totalTreesPlanted: number;
  totalForestHarvested: number;
  totalFocusHours: number;
  gardenCoins: number;
  trees: FocusTree[];
  pet: StudyPet;
  currentActiveSession?: {
    treeId: string;
    species: TreeSpecies;
    durationMinutes: number;
    elapsedSeconds: number;
    subject: string;
  };
}

export interface PlantTreeDto {
  species: TreeSpecies;
  durationMinutes: number;
  subject?: string;
}

export interface CompleteTreeDto {
  treeId: string;
  wasSuccessful: boolean;
}

// ==========================================
// 37. AI Audio Podcast & Lecture Dialogue Studio (Phase 37)
// ==========================================
export type PodcastMode = 'DEEP_DIVE' | 'QA_INTERVIEW' | 'CONTINUOUS_READER' | 'RAPID_REVISION' | 'EXAM_CRACKER';

export interface PodcastHost {
  id: string;
  name: string;
  avatar: string;
  role: string;
  voiceGender: 'male' | 'female';
  personality: string;
}

export interface PodcastDialogueTurn {
  id: string;
  speaker: 'host1' | 'host2';
  text: string;
  durationEstimateSeconds: number;
  keyConcepts: string[];
}

export interface AiPodcast {
  id: string;
  title: string;
  topic: string;
  language?: string;
  mode?: PodcastMode;
  sourceType: 'NOTES' | 'SYLLABUS' | 'TEXTBOOK_CHAPTER';
  totalDurationSeconds: number;
  host1: PodcastHost;
  host2: PodcastHost;
  dialogueTurns: PodcastDialogueTurn[];
  summaryKeyTakeaways: string[];
  createdAt: string;
}

export interface GeneratePodcastDto {
  topic: string;
  language?: string;
  mode?: PodcastMode;
  sourceText?: string;
  style?: 'DEEP_DIVE' | 'RAPID_REVISION' | 'EXAM_CRACKER';
  durationPresetMinutes?: number;
}

// ==========================================
// 38. In-Browser AI Code Sandbox & DSA Visualizer (Phase 38)
// ==========================================
export type CodeLanguage = 'javascript' | 'typescript' | 'python' | 'cpp';

export interface CodeExecutionResult {
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  memoryKb: number;
  isError: boolean;
  timeComplexityEstimate?: string;
  spaceComplexityEstimate?: string;
}

export interface AlgorithmStep {
  stepNumber: number;
  description: string;
  highlightedIndices: number[];
  variablesState: Record<string, any>;
  dataStructureSnapshot: any;
}

export interface AlgorithmVisualizationData {
  algorithmName: string;
  initialData: number[] | any;
  steps: AlgorithmStep[];
  timeComplexity: string;
  spaceComplexity: string;
}

export interface ExecuteCodeDto {
  code: string;
  language: CodeLanguage;
  stdin?: string;
}

export interface VisualizeAlgorithmDto {
  algorithm: 'TWO_POINTERS' | 'BINARY_SEARCH' | 'SLIDING_WINDOW' | 'TREE_INORDER' | 'DIJKSTRA_GRAPH';
  customInput?: number[];
}

// ==========================================
// 39. All-India Rank Predictor & AI Mistake Vault (Phase 39)
// ==========================================
export interface RankPredictionResult {
  examType: string;
  predictedPercentile: number;
  predictedAIRRange: { minRank: number; maxRank: number };
  estimatedScore: number;
  totalMarks: number;
  strongAreas: string[];
  criticalWeaknesses: string[];
  eligibleInstitutions: Array<{
    college: string;
    branch: string;
    cutoffPercentile: number;
    admissionProbability: 'HIGH' | 'MODERATE' | 'AMBITIOUS';
  }>;
}

export interface PredictRankDto {
  examType: string;
  subjectScores: Array<{
    subject: string;
    accuracyPercent: number;
    avgSpeedSecondsPerQuestion: number;
    attemptCount: number;
  }>;
}

export interface MistakeEntry {
  id: string;
  questionId: string;
  examOrSubject: string;
  topic: string;
  questionText: string;
  options?: string[];
  userWrongAnswer: string;
  correctAnswer: string;
  explanation: string;
  mistakeReason?: 'CONCEPTUAL_GAP' | 'CALCULATION_ERROR' | 'TIME_PRESSURE' | 'MISREAD_QUESTION';
  failedCount: number;
  nextReviewDate: string;
  isResolved: boolean;
  createdAt: string;
}

export interface RetestMistakeDto {
  mistakeId: string;
  userAnswer: string;
}

// ==========================================
// 40. Vernacular Multi-Language Engine (Phase 40)
// ==========================================
export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'hinglish'
  | 'bn'
  | 'ta'
  | 'te'
  | 'mr'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'ur'
  | 'as'
  | 'sa'
  | 'es'
  | 'fr'
  | 'de'
  | 'ja'
  | 'ru'
  | 'zh'
  | 'ar'
  | 'pt'
  | 'it'
  | 'ko'
  | 'nl'
  | 'tr'
  | 'id'
  | 'vi';

// ==========================================
// 41. 2D Multiplayer Virtual Campus (Phase 41)
// ==========================================
export type CampusZoneType = 'SILENT_LIBRARY' | 'CODE_LOUNGE' | 'UPSC_ROUNDTABLE' | 'CAFE_TERRACE';

export interface CampusAvatar {
  id: string;
  name: string;
  avatarEmoji: string;
  outfitColor: string;
  college: string;
  currentTask: string;
  zone: CampusZoneType;
  x: number; // 0 to 100 percentage coordinates on 2D map
  y: number;
  isFocusing: boolean;
  studyDurationMinutes: number;
}

export interface VirtualCampusState {
  totalStudentsOnline: number;
  activeZones: Array<{
    type: CampusZoneType;
    name: string;
    description: string;
    studentCount: number;
    ambientSound: string;
  }>;
  peers: CampusAvatar[];
  currentUser: CampusAvatar;
}

export interface MoveAvatarDto {
  zone: CampusZoneType;
  x: number;
  y: number;
  currentTask?: string;
}

// ==========================================
// 42. AI Animated Slide & Visual Presentation (Phase 42)
// ==========================================
export interface SlideElement {
  type: 'HEADING' | 'BULLET' | 'CODE_BLOCK' | 'FORMULA' | 'CALLOUT';
  content: string;
  highlightWords?: string[];
}

export interface SlideData {
  slideNumber: number;
  title: string;
  subtitle?: string;
  elements: SlideElement[];
  voiceoverNarration: string;
  diagramSvg?: string;
}

export interface SlideDeck {
  id: string;
  topic: string;
  subject: string;
  totalSlides: number;
  slides: SlideData[];
  createdAt: string;
}

export interface GenerateSlidesDto {
  topic: string;
  subject?: string;
  sourceNotes?: string;
  slideCount?: number;
}

// ==========================================
// 43. AI Voice Mock Interview & Viva Coach (Phase 43)
// ==========================================
export type InterviewTrack = 'SDE_TECH' | 'UPSC_PERSONALITY' | 'DATA_SCIENCE_AI' | 'COLLEGE_VIVA';

export interface InterviewQuestion {
  id: string;
  questionNumber: number;
  category: string;
  questionText: string;
  hintKeywords: string[];
  expectedPoints: string[];
}

export interface InterviewAnswerEvaluation {
  questionId: string;
  userSpeechAnswer: string;
  overallScore: number; // 0 to 100
  clarityScore: number;
  starMethodScore: {
    situation: number;
    task: number;
    action: number;
    result: number;
  };
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
}

export interface MockInterviewSession {
  id: string;
  track: InterviewTrack;
  candidateName: string;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  evaluations: InterviewAnswerEvaluation[];
  isCompleted: boolean;
  totalScore: number;
  createdAt: string;
}

export interface StartInterviewDto {
  track: InterviewTrack;
  candidateName?: string;
  targetRoleOrExam?: string;
}

export interface SubmitInterviewResponseDto {
  sessionId: string;
  questionId: string;
  spokenAnswer: string;
}

// ==========================================
// 44. Topper Notes & Resource Marketplace (Phase 44)
// ==========================================
export interface TopperNoteResource {
  id: string;
  title: string;
  author: string;
  topperRankBadge: string;
  exam: string;
  subject: string;
  pageCount: number;
  rating: number;
  downloadCount: number;
  unlockCostCoins: number;
  previewParagraphs: string[];
  tags: string[];
  isUnlocked: boolean;
  createdAt: string;
}

export interface UploadResourceDto {
  title: string;
  exam: string;
  subject: string;
  topperRankBadge?: string;
  content: string;
  unlockCostCoins?: number;
}

export interface UnlockResourceDto {
  resourceId: string;
}

// ==========================================
// 45. Circadian Peak-Focus & Habit Engine (Phase 45)
// ==========================================
export interface CircadianSlot {
  timeWindow: string; // e.g. "06:00 AM - 09:00 AM"
  energyLevel: 'PEAK_COGNITIVE' | 'MODERATE_FOCUS' | 'LOW_ENERGY' | 'RECOVERY';
  recommendedActivities: string[];
  recommendedSubjectTypes: string[];
}

export interface CircadianProfile {
  chronotype: 'EARLY_BIRD' | 'NIGHT_OWL' | 'BALANCED';
  bestHoursForMathAndCoding: string;
  bestHoursForRevision: string;
  recommendedSleepWindow: string;
  dailySlots: CircadianSlot[];
  waterIntakeGlassesToday: number;
  waterGoalGlasses: number;
  screenBreaksTaken: number;
  focusConsistencyScore: number;
}

export interface UpdateHabitDto {
  action: 'DRINK_WATER' | 'TAKE_SCREEN_BREAK' | 'SET_CHRONOTYPE';
  value?: string | number;
}

// ==========================================
// 46. AI Exam Paper Trend Forecaster (Phase 46)
// ==========================================
export interface TopicProbabilityData {
  topicName: string;
  historicalFrequencyCount: number;
  probabilityPercent: number;
  expectedMarksWeightage: number;
  riskLevel: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
}

export interface ExamTrendForecast {
  examName: string;
  analyzedYearSpan: string;
  totalPYQQuestionsIndexed: number;
  forecastAccuracyScore: number;
  topPredictedTopics: TopicProbabilityData[];
  predictedPaperDifficulty: 'EASY' | 'MODERATE' | 'CHALLENGING' | 'EXTREME';
  highProbabilityQuestionPatterns: string[];
}

export interface PredictExamTrendsDto {
  examName: string;
  targetSubject?: string;
}

// ==========================================
// 47. AI Collaborative Whiteboard Studio (Phase 47)
// ==========================================
export interface WhiteboardElement {
  id: string;
  type: 'RECTANGLE' | 'CIRCLE' | 'ARROW' | 'TEXT' | 'DIAMOND';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  fill?: string;
}

export interface WhiteboardDiagram {
  id: string;
  title: string;
  topic: string;
  elements: WhiteboardElement[];
  generatedByAi: boolean;
  notesSummary: string;
  createdAt: string;
}

export interface AiDiagramRequestDto {
  topic: string;
  diagramType: 'FLOWCHART' | 'ARCHITECTURE' | 'ALGORITHM_TREE' | 'CONCEPT_MAP';
}

// ==========================================
// 48. Student Financial & Expense Tracker (Phase 48)
// ==========================================
export type ExpenseCategory = 'MESS_FOOD' | 'BOOKS_STATIONERY' | 'HOSTEL_RENT' | 'COURSES_TESTS' | 'TRANSPORT' | 'LEISURE';

export interface StudentExpenseItem {
  id: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  date: string;
}

export interface StudentGigOpportunity {
  id: string;
  title: string;
  payoutAmount: number;
  requiredSkills: string[];
  estimatedHours: string;
  platform: string;
}

export interface StudentFinancialBudget {
  monthlyBudget: number;
  totalSpentThisMonth: number;
  remainingAllowance: number;
  savingsRatePercent: number;
  expenses: StudentExpenseItem[];
  suggestedGigs: StudentGigOpportunity[];
}

export interface AddExpenseDto {
  category: ExpenseCategory;
  title: string;
  amount: number;
}

export interface CourseRoiCalcDto {
  totalCourseCost: number;
  durationMonths: number;
  expectedStartingSalaryAnnual: number;
}

export interface CourseRoiResult {
  paybackPeriodMonths: number;
  threeYearRoiPercentage: number;
  verdict: 'HIGH_ROI' | 'MODERATE_ROI' | 'LOW_ROI';
  recommendations: string[];
}

// ==========================================
// 49. 3D Interactive Science & CS Holo-Lab (Phase 49)
// ==========================================
export type SimulationCategory = 'COMPUTER_SCIENCE' | 'PHYSICS' | 'CHEMISTRY' | 'MATHEMATICS';

export interface SimulationParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface Simulation3DModel {
  id: string;
  title: string;
  category: SimulationCategory;
  description: string;
  keyFormulas: string[];
  parameters: SimulationParameter[];
  activeStageLabel?: string;
  throughputRate?: number;
}

export interface RunSimulationDto {
  simulationId: string;
  parameters: Record<string, number>;
}

// ==========================================
// 50. Verifiable Academic Skill Passport (Phase 50)
// ==========================================
export interface AcademicCredential {
  id: string;
  studentName: string;
  credentialTitle: string;
  issuer: string;
  sha256VerificationHash: string;
  issuedDate: string;
  level: string;
  verifiedSkills: string[];
  xpMilestoneReached: number;
  publicVerificationUrl: string;
  status: 'VERIFIED' | 'REVOKED';
}

export interface VerifiedPassportSummary {
  totalCredentialsIssued: number;
  topRankPercentile: number;
  totalVerifiedBadges: number;
  grandmasterStatus: boolean;
  credentials: AcademicCredential[];
}

export interface GenerateCredentialDto {
  credentialTitle: string;
  skills: string[];
}

// ==========================================
// 51. AI arXiv Scholar & Research Paper Synthesizer (Phase 51)
// ==========================================
export interface BibtexCitation {
  rawBibtex: string;
  apaFormatted: string;
  ieeeFormatted: string;
}

export interface ResearchPaperSummary {
  id: string;
  title: string;
  authors: string[];
  publishedYear: number;
  conferenceOrJournal: string;
  arxivId: string;
  abstractSummary: string;
  coreMethodology: string;
  keyBenchmarks: Array<{ metric: string; score: string; baselineScore: string }>;
  keyTakeaways: string[];
  bibtex: BibtexCitation;
  pdfUrl: string;
}

export interface SearchPapersDto {
  query: string;
  domain?: 'AI_ML' | 'DISTRIBUTED_SYSTEMS' | 'QUANTUM_COMPUTING' | 'CYBERSECURITY';
}

// ==========================================
// 52. AI Socratic Debate Arena & Thesis Defender (Phase 52)
// ==========================================
export type DebatePersona = 'STRICT_EXAMINER' | 'SKEPTICAL_PEER' | 'DIALECTICAL_PHILOSOPHER';

export interface DebateTurn {
  speaker: 'USER' | 'AI';
  content: string;
  timestamp: string;
  fallacyDetected?: string;
  strengthScore?: number; // 0 to 100
}

export interface DebateScorecard {
  logicalCoherence: number;
  evidenceWeight: number;
  fallacyResistance: number;
  persuasiveness: number;
  overallScore: number;
  summaryFeedback: string;
}

export interface DebateSession {
  id: string;
  topicMotion: string;
  persona: DebatePersona;
  turns: DebateTurn[];
  isCompleted: boolean;
  scorecard?: DebateScorecard;
  createdAt: string;
}

export interface StartDebateDto {
  topicMotion: string;
  persona: DebatePersona;
}

export interface SubmitArgumentDto {
  sessionId: string;
  userArgument: string;
}

// ==========================================
// 53. Smart Campus Lost & Found + Equipment Exchange (Phase 53)
// ==========================================
export type CampusItemCategory = 'CALCULATOR' | 'LAB_EQUIPMENT' | 'ID_DOCUMENT' | 'BOOK_STATIONERY' | 'ELECTRONICS';
export type CampusItemType = 'LOST' | 'FOUND' | 'FOR_BORROW_RENT';

export interface CampusItem {
  id: string;
  type: CampusItemType;
  category: CampusItemCategory;
  title: string;
  locationDetails: string;
  description: string;
  reportedBy: string;
  contactHandle: string;
  status: 'OPEN' | 'RESOLVED' | 'CLAIMED';
  dateReported: string;
  imageUrl?: string;
}

export interface CreateCampusItemDto {
  type: CampusItemType;
  category: CampusItemCategory;
  title: string;
  locationDetails: string;
  description: string;
  contactHandle: string;
}

// ==========================================
// 54. Multimodal Video Lecture Navigator (Phase 54)
// ==========================================
export interface LectureChapterMarker {
  timestampSeconds: number;
  timestampFormatted: string; // e.g. "14:32"
  title: string;
  keyConcepts: string[];
  extractedWhiteboardMathProof?: string;
}

export interface VideoLectureAnalysis {
  id: string;
  videoTitle: string;
  sourceUrl: string;
  durationMinutes: number;
  instructorName: string;
  subject: string;
  chapters: LectureChapterMarker[];
  printableCheatsheetMarkdown: string;
  createdAt: string;
}

export interface AnalyzeLectureDto {
  videoUrl: string;
  targetSubject?: string;
}

// ==========================================
// 55. Ergonomic Posture & Eye-Blink Bio-Feedback (Phase 55)
// ==========================================
export interface ErgonomicWellnessProfile {
  digitalEyeStrainScore: number; // 0 (healthy) to 100 (critical fatigue)
  blinkRatePerMinute: number; // normal: 15-20, low: <10
  currentPostureStatus: 'GOOD_UPRIGHT' | 'FORWARD_HEAD_SLOUCH' | 'TOO_CLOSE_TO_SCREEN';
  screenDistanceCm: number;
  screenTimeMinutesToday: number;
  eyeBreaksCompleted: number;
  stretchesCompleted: number;
  activeAlerts: string[];
}

export interface LogErgonomicSessionDto {
  blinkRatePerMinute?: number;
  postureStatus?: 'GOOD_UPRIGHT' | 'FORWARD_HEAD_SLOUCH' | 'TOO_CLOSE_TO_SCREEN';
  distanceCm?: number;
}

// ==========================================
// 56. Multi-Agent AI Research Lab & Thesis Proposal Generator (Phase 56)
// ==========================================
export type ResearchAgentRole = 'LITERATURE_SCOUT' | 'METHODOLOGY_CRITIC' | 'PROPOSAL_SYNTHESIZER';

export interface ResearchAgentMessage {
  agentRole: ResearchAgentRole;
  agentName: string;
  avatarColor: string;
  timestamp: string;
  content: string;
  citationsReferenced: string[];
}

export interface ResearchHypothesisProposal {
  id: string;
  topicTitle: string;
  domain: string;
  hypothesisStatement: string;
  literatureGapsIdentified: string[];
  proposedMethodology: string;
  expectedDeliverables: string[];
  suggestedExperimentSteps: string[];
  targetConferencesOrJournals: string[];
  agentDialogues: ResearchAgentMessage[];
  createdAt: string;
}

export interface RunResearchAgentsDto {
  researchTopic: string;
  domain?: string;
  additionalConstraints?: string;
}

// ==========================================
// 57. Neural Biometric Flow & Attention Telemetry (Phase 57)
// ==========================================
export interface BrainWaveBands {
  alphaBandHz: number; // 8 - 12 Hz (Relaxed Alertness & Memory)
  betaBandHz: number;  // 13 - 30 Hz (Active Problem Solving)
  thetaBandHz: number; // 4 - 8 Hz (Deep Creativity & Intuition)
  gammaBandHz: number; // 30 - 50 Hz (Hyper-Focus & Cross-Modal Processing)
}

export interface NeuralFlowTelemetry {
  flowStateScore: number; // 0 - 100
  dominantWaveBand: 'ALPHA' | 'BETA' | 'THETA' | 'GAMMA';
  waves: BrainWaveBands;
  binauralTuningFrequencyHz: number;
  focusImmersionMinutes: number;
  cognitiveFatiguePercent: number;
  recommendedModulation: string;
  timestamp: string;
}

export interface AdjustBinauralFrequencyDto {
  targetWaveBand: 'ALPHA' | 'BETA' | 'THETA' | 'GAMMA';
  customHz?: number;
}

// ==========================================
// 58. Smart Hostel Mess & Student Nutrition Brain-Fuel Tracker (Phase 58)
// ==========================================
export type MessMealSlot = 'BREAKFAST' | 'LUNCH' | 'EVENING_SNACKS' | 'DINNER';

export interface MessMenuItem {
  id: string;
  slot: MessMealSlot;
  dishName: string;
  isVegetarian: boolean;
  caloriesKcal: number;
  proteinGrams: number;
  brainFuelTag?: string; // e.g., "High Choline", "Omega-3 Rich", "Slow GI Carbs"
  avgStudentRating: number; // 1.0 - 5.0
}

export interface HostelDailyMenu {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  messHallName: string;
  meals: MessMenuItem[];
}

export interface NutrientIntakeLog {
  totalCalories: number;
  proteinGramsToday: number;
  targetProteinGrams: number;
  caffeineMgToday: number;
  hydrationLitersToday: number;
  brainNutrientStatus: {
    omega3Status: 'OPTIMAL' | 'MODERATE' | 'LOW';
    vitaminB12Status: 'OPTIMAL' | 'MODERATE' | 'LOW';
    ironStatus: 'OPTIMAL' | 'MODERATE' | 'LOW';
  };
  sleepLatencyImpactWarning?: string;
}

export interface LogNutrientIntakeDto {
  dishName: string;
  caloriesKcal: number;
  proteinGrams: number;
  caffeineMg?: number;
  waterMl?: number;
}

export interface RateMealDto {
  dishId: string;
  rating: number; // 1 to 5
  feedbackComment?: string;
}

// ==========================================
// 59. Interactive LaTeX Academic Paper & Thesis Studio (Phase 59)
// ==========================================
export type LatexDocumentTemplate = 'IEEE_TRANSACTIONS' | 'ACM_SIGCONF' | 'SPRINGER_LNCS' | 'NEURIPS_PAPER';

export interface LatexPaperProject {
  id: string;
  title: string;
  authorNames: string[];
  template: LatexDocumentTemplate;
  abstractText: string;
  latexSourceCode: string;
  compiledHtmlPreview: string;
  wordCount: number;
  lastCompiledAt: string;
}

export interface CompileLatexDto {
  latexSourceCode: string;
  template?: LatexDocumentTemplate;
}

export interface FormatMathEquationDto {
  naturalLanguageMathDescription: string;
}

// ==========================================
// 60. Global Hackathon Radar & AI Team Formation Matchmaker (Phase 60)
// ==========================================
export type HackathonFormat = 'ONLINE_GLOBAL' | 'IN_PERSON_CAMPUS' | 'HYBRID';

export interface HackathonTeamNeed {
  roleTitle: string; // e.g. "Full-Stack React Engineer", "Computer Vision ML Specialist"
  skillsRequired: string[];
  isFilled: boolean;
}

export interface HackathonEvent {
  id: string;
  title: string;
  organizer: string;
  format: HackathonFormat;
  prizePool: string;
  daysRemaining: number;
  registrationDeadline: string;
  bannerGradient: string;
  themes: string[];
  portalUrl: string;
  openTeamSpotsCount: number;
  featuredChallenge: string;
}

export interface HackathonTeamMatchResult {
  matchScorePercent: number;
  teamName: string;
  hackathonId: string;
  hackathonTitle: string;
  members: Array<{ name: string; role: string; avatarUrl: string }>;
  openRolesNeeded: string[];
  contactHandle: string;
}

export interface FindTeammatesDto {
  mySkills: string[];
  preferredTheme?: string;
  preferredFormat?: HackathonFormat;
}

// ==========================================
// 61. Autonomous AI Patent & IP Drafter (Phase 61)
// ==========================================
export type PatentJurisdiction = 'USPTO_USA' | 'IPO_INDIA' | 'EPO_EUROPE' | 'WIPO_PCT';

export interface ProvisionalPatentDraft {
  id: string;
  inventionTitle: string;
  inventorNames: string[];
  jurisdiction: PatentJurisdiction;
  technicalField: string;
  backgroundPriorArtGaps: string[];
  summaryOfInvention: string;
  independentClaims: string[];
  patentabilityScore: number; // 0 - 100
  noveltySearchKeywords: string[];
  createdAt: string;
}

export interface DraftPatentDto {
  projectTitle: string;
  projectDescription: string;
  technicalField?: string;
  jurisdiction?: PatentJurisdiction;
}

export interface PatentSearchQueryDto {
  queryKeywords: string;
}

// ==========================================
// 62. Faculty Office Hours & 1-on-1 Advisory Scheduler (Phase 62)
// ==========================================
export type AdvisoryPurpose = 'THESIS_GUIDANCE' | 'LOR_REQUEST' | 'EXAM_GRADE_REVIEW' | 'RESEARCH_FELLOWSHIP';

export interface FacultyOfficeSlot {
  id: string;
  professorName: string;
  department: string;
  officeRoom: string;
  avatarUrl: string;
  availableDays: string[];
  timeSlotFormatted: string; // e.g., "14:00 - 16:00 IST"
  maxStudentsPerSlot: number;
  currentBookingsCount: number;
}

export interface AdvisoryBooking {
  id: string;
  facultyId: string;
  professorName: string;
  studentName: string;
  scheduledDate: string;
  scheduledTime: string;
  purpose: AdvisoryPurpose;
  agendaDescription: string;
  briefingPacketSummary: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface BookAdvisorySlotDto {
  facultyId: string;
  scheduledDate: string;
  purpose: AdvisoryPurpose;
  agendaDescription: string;
}

// ==========================================
// 63. AI Micro-Tutoring & Peer Doubt Bounty Marketplace (Phase 63)
// ==========================================
export type TutorBountyStatus = 'OPEN' | 'IN_SESSION' | 'SOLVED' | 'EXPIRED';

export interface PeerTutorBounty {
  id: string;
  studentName: string;
  studentAvatar: string;
  subjectTag: string;
  topicTitle: string;
  doubtDescription: string;
  coinBountyReward: number;
  xpReward: number;
  urgencyMinutes: number; // e.g. 15 mins
  status: TutorBountyStatus;
  assignedTutorName?: string;
  createdAt: string;
}

export interface CreateTutorBountyDto {
  subjectTag: string;
  topicTitle: string;
  doubtDescription: string;
  coinBountyReward?: number;
  urgencyMinutes?: number;
}

export interface AcceptTutorBountyDto {
  bountyId: string;
}

// ==========================================
// 64. Smart Campus Printing & Laser Plotter Queue Hub (Phase 64)
// ==========================================
export type PrintLocation = 'CENTRAL_LIBRARY' | 'CS_DEPT_LAB' | 'HOSTEL_XEROX_HUB';
export type PrintJobStatus = 'QUEUED' | 'READY_FOR_PICKUP' | 'PRINTING' | 'COMPLETED';

export interface CampusPrintJob {
  id: string;
  documentTitle: string;
  pageCount: number;
  isDoubleSided: boolean;
  isColor: boolean;
  estimatedCostINR: number;
  location: PrintLocation;
  qrReleaseCode: string;
  status: PrintJobStatus;
  createdAt: string;
}

export interface CreatePrintJobDto {
  documentTitle: string;
  pageCount: number;
  isDoubleSided?: boolean;
  isColor?: boolean;
  location?: PrintLocation;
}

// ==========================================
// 65. AI Alumni Mentorship & Senior Career Guidance Radar (Phase 65)
// ==========================================
export type AlumniIndustry = 'BIG_TECH' | 'QUANT_FINANCE' | 'DEEP_TECH_AI' | 'SPACE_ROBOTICS' | 'MANAGEMENT_CONSULTING';

export interface AlumnusMentor {
  id: string;
  fullName: string;
  graduationYear: number;
  degree: string;
  companyName: string;
  currentDesignation: string;
  industry: AlumniIndustry;
  avatarUrl: string;
  linkedinHandle: string;
  bioSnippet: string;
  availableCoffeeSlotsCount: number;
  topAdviceTag: string;
}

export interface AlumniMentorshipRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  studentName: string;
  requestedDate: string;
  topicDiscussion: string;
  aiSuggestedIcebreaker: string;
  status: 'PENDING_APPROVAL' | 'ACCEPTED' | 'COMPLETED';
  meetingRoomUrl?: string;
  createdAt: string;
}

export interface RequestAlumniChatDto {
  mentorId: string;
  topicDiscussion: string;
  preferredDate?: string;
}

// ==========================================
// 66. Autonomous AI Study Buddy Swarm & Group Viva Simulator (Phase 66)
// ==========================================
export type StudyBuddyPersona = 'THEORY_ARCHITECT' | 'NUMERICAL_WIZARD' | 'SOCRATIC_SCEPTIC' | 'PROFESSOR_EXAMINER';

export interface StudyBuddyPeer {
  id: string;
  name: string;
  avatarEmoji: string;
  persona: StudyBuddyPersona;
  specialty: string;
  confidenceLevel: number;
}

export interface SwarmMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'STUDENT' | 'PEER' | 'PROFESSOR';
  content: string;
  timestamp: string;
  mathSnippet?: string;
  citation?: string;
}

export interface GroupVivaSession {
  id: string;
  subjectTopic: string;
  peers: StudyBuddyPeer[];
  messages: SwarmMessage[];
  currentQuestion?: string;
  studentAnswerGrade?: {
    scorePercent: number;
    critique: string;
    missedPoints: string[];
    awardedXp: number;
  };
  isActive: boolean;
}

export interface StartSwarmSessionDto {
  subjectTopic: string;
  activePersonaIds?: string[];
}

export interface PostSwarmQueryDto {
  sessionId: string;
  questionOrDoubt: string;
}

export interface SubmitVivaAnswerDto {
  sessionId: string;
  studentAnswer: string;
}

// ==========================================
// 67. Campus Startup Incubator & AI Pitch Deck Synthesizer (Phase 67)
// ==========================================
export type StartupStage = 'IDEA_VALIDATION' | 'PROTOTYPE_MVP' | 'EARLY_TRACTION' | 'SEED_FUNDRAISE';

export interface PitchDeckSlide {
  slideNumber: number;
  title: string;
  headline: string;
  bulletPoints: string[];
  visualCallout: string;
  metricHighlight?: string;
}

export interface GrantOpportunity {
  id: string;
  grantName: string;
  agency: string;
  maxFundingINR: number;
  applicationDeadline: string;
  eligibilityScore: number;
  applicationUrl: string;
}

export interface CampusStartupProject {
  id: string;
  startupName: string;
  tagLine: string;
  industryVertical: string;
  stage: StartupStage;
  problemStatement: string;
  solutionStatement: string;
  tamSamSom: {
    tam: string;
    sam: string;
    som: string;
  };
  unitEconomics: {
    cac: string;
    ltv: string;
    paybackMonths: number;
  };
  slides: PitchDeckSlide[];
  matchedGrants: GrantOpportunity[];
  createdAt: string;
}

export interface GeneratePitchDeckDto {
  startupName: string;
  industryVertical: string;
  rawProjectIdea: string;
  targetMarket?: string;
}

// ==========================================
// 68. Campus Smart Transit & Shuttle Radar (Phase 68)
// ==========================================
export type TransitVehicleType = 'ELECTRIC_SHUTTLE' | 'E_RICKSHAW_EXPRESS' | 'BIKE_POOL';

export interface ShuttleRouteNode {
  id: string;
  stopName: string;
  stopLocationTag: string;
  nextArrivalMinutes: number;
  occupancyStatus: 'SEATS_AVAILABLE' | 'STANDING_ONLY' | 'FULL';
}

export interface ShuttleVehicle {
  id: string;
  vehicleNumber: string;
  routeName: string;
  vehicleType: TransitVehicleType;
  currentStop: string;
  nextStop: string;
  etaMinutes: number;
  speedKmph: number;
  isLiveTracking: boolean;
}

export interface CarpoolRidePost {
  id: string;
  riderName: string;
  fromLocation: string;
  toLocation: string;
  departureTime: string;
  availableSeats: number;
  coinRewardContribution: number;
  status: 'OPEN' | 'FILLED' | 'COMPLETED';
}

export interface CampusTransitState {
  activeShuttles: ShuttleVehicle[];
  routeStops: ShuttleRouteNode[];
  activeCarpoolPosts: CarpoolRidePost[];
  userEcoCarbonSavedKg: number;
}

export interface BookCarpoolRideDto {
  carpoolPostId: string;
}

// ==========================================
// 69. AI Mental Resilience & Exam Anxiety Bio-Coaching Sanctum (Phase 69)
// ==========================================
export type BreathingPaceMode = 'BOX_BREATHING_4_4_4_4' | 'CALMING_4_7_8' | 'RAPID_GROUNDING_3_3_3';

export interface AnxietyReframingRecord {
  id: string;
  catastrophizingThought: string;
  cognitiveDistortionTag: string;
  socraticReframe: string;
  empowermentAction: string;
  createdAt: string;
}

export interface ResilienceCheckinDto {
  currentStressScore: number;
  triggerSource: string;
  rawWorryText: string;
}

export interface MentalSanctumState {
  currentReadinessIndex: number;
  dailyCheckinsCompleted: number;
  reframedThoughts: AnxietyReframingRecord[];
  activeBreathingMode: BreathingPaceMode;
}

// ==========================================
// 70. Quantum Circuit & Bloch Sphere Simulator (Phase 70)
// ==========================================
export type QuantumGateType = 'H' | 'X' | 'Y' | 'Z' | 'CNOT' | 'T' | 'S';

export interface BlochVector {
  thetaDegrees: number;
  phiDegrees: number;
  x: number;
  y: number;
  z: number;
  stateFormula: string;
}

export interface QuantumCircuitState {
  qubitCount: number;
  gatesApplied: {
    qubitIndex: number;
    gate: QuantumGateType;
    stepIndex: number;
  }[];
  stateVectorProbabilities: {
    stateBinary: string;
    probability: number;
    phaseDegrees: number;
  }[];
  blochVectors: BlochVector[];
  entanglementMetric: number;
  presetAlgorithmName?: string;
}

export interface SimulateCircuitDto {
  qubitCount: number;
  gates: {
    qubitIndex: number;
    gate: QuantumGateType;
    stepIndex: number;
  }[];
  preset?: 'BELL_STATE' | 'SUPERPOSITION' | 'GHZ_STATE';
}

// ==========================================
// 71. Autonomous Global Fellowship & PMRF Proposal Drafter (Phase 71)
// ==========================================
export type FellowshipType = 'PMRF_INDIA' | 'FULBRIGHT_NEHRU' | 'DAAD_GERMANY' | 'RHODES_OXFORD' | 'ERASMUS_MUNDUS';

export interface FellowshipProposal {
  id: string;
  fellowshipType: FellowshipType;
  applicantField: string;
  statementOfPurpose: string;
  researchMethodology: string;
  broaderImpactStatements: string[];
  refereeBulletPoints: string[];
  competitiveIndexScore: number;
  createdAt: string;
}

export interface DraftFellowshipDto {
  fellowshipType: FellowshipType;
  applicantField: string;
  primaryResearchTopic: string;
  pastAchievementsSummary?: string;
}

// ==========================================
// 72. Live Hackathon War-Room & 24-Hour Sprint Command Hub (Phase 72)
// ==========================================
export interface HackathonSprintTask {
  id: string;
  title: string;
  assigneeName: string;
  role: 'FRONTEND' | 'BACKEND' | 'ML_AI' | 'DESIGN_PITCH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  estimatedHours: number;
}

export interface HackathonGitCommit {
  id: string;
  author: string;
  commitMessage: string;
  branch: string;
  timestamp: string;
  linesAdded: number;
}

export interface HackathonWarRoomState {
  hackathonName: string;
  hoursRemaining: number;
  totalTeamXp: number;
  tasks: HackathonSprintTask[];
  commits: HackathonGitCommit[];
  devpostDraftMarkdown: string;
}

export interface PostSprintTaskDto {
  title: string;
  assigneeName: string;
  role: 'FRONTEND' | 'BACKEND' | 'ML_AI' | 'DESIGN_PITCH';
}

export interface ExportDevpostDto {
  projectName: string;
  inspiration: string;
  howWeBuiltIt: string;
}

// ==========================================
// 73. AI RSVP Speed-Reading & Subvocalization Eliminator (Phase 73)
// ==========================================
export interface RsvpWordToken {
  word: string;
  orpIndex: number; // Optimal Recognition Point index
  prefix: string;
  pivotChar: string;
  suffix: string;
}

export interface SpeedReaderSession {
  id: string;
  documentTitle: string;
  targetWpm: number;
  tokens: RsvpWordToken[];
  totalWords: number;
  comprehensionQuiz: {
    question: string;
    options: string[];
    correctOptionIndex: number;
  }[];
}

export interface StartSpeedReaderDto {
  documentTitle: string;
  rawArticleText: string;
  targetWpm?: number;
}

export interface SubmitRecallQuizDto {
  sessionId: string;
  selectedAnswers: number[];
}

// ==========================================
// 74. Academic Plagiarism & AI-Hallucination Integrity Inspector (Phase 74)
// ==========================================
export interface PlagiarismAuditSection {
  sectionTitle: string;
  similarityPercentage: number;
  matchedSourceExcerpt?: string;
  paraphraseRisk: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface HallucinatedCitationReport {
  citationText: string;
  doiFound: boolean;
  validationStatus: 'VERIFIED_CORRECT' | 'HALLUCINATED_OR_UNINDEXED';
  recommendation: string;
}

export interface AcademicIntegrityReport {
  id: string;
  documentTitle: string;
  overallOriginalityScore: number; // 0 to 100
  plagiarismIndex: number; // 0 to 100
  aiGeneratedLikelihoodPercent: number;
  sections: PlagiarismAuditSection[];
  citationsAudited: HallucinatedCitationReport[];
  createdAt: string;
}

export interface AuditIntegrityDto {
  documentTitle: string;
  manuscriptText: string;
}

// ==========================================
// 75. 3D Campus Digital Twin & Indoor Navigation Navigator (Phase 75)
// ==========================================
export interface CampusBuildingNode {
  id: string;
  buildingName: string;
  code: string;
  category: 'ACADEMIC' | 'LAB' | 'LIBRARY' | 'HOSTEL' | 'SPORTS';
  coordinates: { x: number; y: number; z: number };
  currentOccupancyPercent: number;
  noiseLevelDb: number;
  activeEventsCount: number;
}

export interface CampusDigitalTwinState {
  buildings: CampusBuildingNode[];
  recommendedQuietZones: string[];
  activeNavigationRoute?: {
    fromBuilding: string;
    toBuilding: string;
    walkingDistanceMeters: number;
    estimatedMinutes: number;
    waypointPath: string[];
  };
}

export interface FindCampusRouteDto {
  fromBuildingId: string;
  toBuildingId: string;
}

// ==========================================
// 76. AI Polyglot Scientific Literature Translator (Phase 76)
// ==========================================
export type ScientificSourceLang = 'DE' | 'ZH' | 'JA' | 'FR' | 'RU';
export type ScientificTargetLang = 'EN' | 'HI';

export interface TranslatedParagraphUnit {
  paragraphIndex: number;
  sourceText: string;
  translatedText: string;
  extractedFormulas: string[];
  scientificGlossaryTerms: { term: string; definition: string }[];
}

export interface PolyglotTranslationSession {
  id: string;
  documentTitle: string;
  sourceLanguage: ScientificSourceLang;
  targetLanguage: ScientificTargetLang;
  preservedFormulaCount: number;
  confidenceScore: number;
  paragraphs: TranslatedParagraphUnit[];
  createdAt: string;
}

export interface TranslatePaperDto {
  documentTitle: string;
  sourceLanguage: ScientificSourceLang;
  targetLanguage: ScientificTargetLang;
  rawManuscriptText: string;
}

// ==========================================
// 77. Autonomous Electronic Lab Notebook & Hazard Logger (Phase 77)
// ==========================================
export interface ReagentSafetyData {
  reagentName: string;
  casNumber: string;
  quantityMols: number;
  ghsPictograms: string[];
  hazardSummary: string;
  ppeRecommendations: string[];
}

export interface LabExperimentLog {
  id: string;
  experimentTitle: string;
  experimentType: 'WET_LAB_SYNTHESIS' | 'DRY_LAB_SIMULATION' | 'BIO_ASSAY';
  hypothesis: string;
  protocolSteps: { stepNumber: number; instruction: string; completed: boolean }[];
  reagents: ReagentSafetyData[];
  tamperProofSha256Hash: string;
  timestamp: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
}

export interface CreateLabLogDto {
  experimentTitle: string;
  experimentType: 'WET_LAB_SYNTHESIS' | 'DRY_LAB_SIMULATION' | 'BIO_ASSAY';
  hypothesis: string;
  protocolSteps: string[];
  reagents: Array<{
    reagentName: string;
    casNumber: string;
    quantityMols: number;
  }>;
}

// ==========================================
// 78. AI Adaptive Anki & FSRS-v4 Memory Deck Synchronizer (Phase 78)
// ==========================================
export type FsrsGrade = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

export interface FsrsMemoryCard {
  id: string;
  clozeText: string; // e.g. "The {{c1::Hamiltonian}} represents total energy"
  plainPrompt: string;
  plainAnswer: string;
  stability: number; // S (days)
  difficulty: number; // D (1 to 10)
  retrievabilityPercent: number; // R
  repetitions: number;
  dueTimestamp: string;
  state: 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING';
}

export interface FsrsDeckState {
  deckName: string;
  totalCards: number;
  dueTodayCount: number;
  averageRetentionRate: number;
  cards: FsrsMemoryCard[];
}

export interface ReviewFsrsCardDto {
  cardId: string;
  grade: FsrsGrade;
}

export interface GenerateClozeCardsDto {
  deckName: string;
  rawTextNotes: string;
}

// ==========================================
// 79. Micro-Internship & 48h Sprint Escrow Hub (Phase 79)
// ==========================================
export type MicroGigCategory = 'AI_BENCHMARK' | 'FULLSTACK_FEATURE' | 'DATASET_CURATION' | 'SECURITY_AUDIT';

export interface MicroInternshipGig {
  id: string;
  title: string;
  sponsorOrganization: string;
  category: MicroGigCategory;
  bountyStudyCoins: number;
  deadlineHours: number;
  requirements: string[];
  status: 'OPEN' | 'IN_SPRINT' | 'SUBMITTED' | 'APPROVED';
  pullRequestUrl?: string;
  escrowStatus: 'FUNDED_IN_ESCROW' | 'RELEASED_TO_STUDENT';
}

export interface SubmitProofOfWorkDto {
  gigId: string;
  pullRequestUrl: string;
  submissionNotes: string;
}

// ==========================================
// 80. Inter-Collegiate Knowledge Olympiad Arena (Phase 80)
// ==========================================
export type OlympiadLeague = 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND' | 'GRANDMASTER';

export interface OlympiadMatchQuestion {
  id: string;
  category: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  points: number;
}

export interface OlympiadMatchState {
  matchId: string;
  league: OlympiadLeague;
  playerCollege: string;
  opponentCollege: string;
  playerScore: number;
  opponentScore: number;
  playerElo: number;
  opponentElo: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  questions: OlympiadMatchQuestion[];
  matchStatus: 'LIVE_BUZZER_ACTIVE' | 'ROUND_RESOLVED' | 'MATCH_CONCLUDED';
}

export interface SubmitOlympiadAnswerDto {
  matchId: string;
  questionId: string;
  selectedOptionIndex: number;
  buzzerTimeMs: number;
}

// ==========================================
// 81. AI Autonomous Code Profiler & Kernel Optimizer (Phase 81)
// ==========================================
export interface SimdVectorizationReport {
  loopVectorized: boolean;
  instructionSet: 'AVX-512' | 'AVX2' | 'ARM_NEON' | 'SCALAR_FALLBACK';
  speedupMultiplier: number;
  assemblySnippet: string;
}

export interface CodeProfileAnalysis {
  id: string;
  functionName: string;
  sourceLanguage: 'CPP' | 'RUST' | 'PYTHON';
  timeComplexityBound: string;
  spaceComplexityBound: string;
  l1CacheMissRatePercent: number;
  branchMispredictionPercent: number;
  estimatedExecutionCycles: number;
  simdOptimization: SimdVectorizationReport;
  profilingRecommendations: string[];
}

export interface AnalyzeKernelCodeDto {
  functionName: string;
  sourceLanguage: 'CPP' | 'RUST' | 'PYTHON';
  sourceCode: string;
  targetArchitecture?: 'X86_64_AVX512' | 'ARM64_NEON';
}

// ==========================================
// 82. 3D Celestial Astrodynamics & Satellite Orbit Propagator (Phase 82)
// ==========================================
export interface KeplerianOrbitParameters {
  semiMajorAxisKm: number; // a
  eccentricity: number; // e (0 = circular, 0 < e < 1 = elliptical)
  inclinationDeg: number; // i
  longitudeOfAscendingNodeDeg: number; // Ω
  argumentOfPeriapsisDeg: number; // ω
  trueAnomalyDeg: number; // ν
  orbitalPeriodMinutes: number;
  periapsisAltitudeKm: number;
  apoapsisAltitudeKm: number;
}

export interface OrbitalTransferManeuver {
  maneuverName: string;
  deltaV1KmSec: number;
  deltaV2KmSec: number;
  totalDeltaVKmSec: number;
  transferTimeHours: number;
  trajectoryDescription: string;
}

export interface PropagateOrbitDto {
  targetOrbitName: string;
  primaryBody: 'EARTH' | 'MOON' | 'MARS' | 'SUN';
  semiMajorAxisKm: number;
  eccentricity: number;
  inclinationDeg: number;
}

// ==========================================
// 83. AI Chemical Retrosynthesis & Molecule Designer (Phase 83)
// ==========================================
export interface DisconnectionStep {
  stepNumber: number;
  targetFragment: string;
  synthons: string[];
  reagentsRequired: string[];
  reactionName: string;
  predictedYieldPercent: number;
  conditions: string;
}

export interface RetrosyntheticPathway {
  id: string;
  moleculeName: string;
  smilesFormula: string;
  molecularWeight: number;
  therapeuticCategory: string;
  totalSynthesisSteps: number;
  overallYieldEstimatePercent: number;
  steps: DisconnectionStep[];
}

export interface PlanRetrosynthesisDto {
  moleculeName: string;
  smilesFormula: string;
  maxDisconnectionDepth?: number;
}

// ==========================================
// 84. Autonomous Google Scholar Citation & h-Index Tracker (Phase 84)
// ==========================================
export interface AcademicPublicationItem {
  id: string;
  title: string;
  venue: string;
  year: number;
  citationsCount: number;
  doi: string;
  isHighlyCited: boolean;
}

export interface ScholarCitationProfile {
  scholarName: string;
  affiliation: string;
  hIndex: number;
  i10Index: number;
  totalCitations: number;
  citationsVelocityPerYear: { year: number; citations: number }[];
  coAuthorNetwork: { name: string; institution: string; sharedPapers: number }[];
  topPublications: AcademicPublicationItem[];
}

export interface TrackScholarDto {
  scholarName: string;
  institutionDomain?: string;
}

// ==========================================
// 85. Decentralized Collegiate Study Guild & Quadratic DAO Forum (Phase 85)
// ==========================================
export type GuildProposalCategory = 'HARDWARE_ACQUISITION' | 'COURSE_LICENSE' | 'HACKATHON_SPONSORSHIP' | 'CAMPUS_EVENT';

export interface GuildProposal {
  id: string;
  title: string;
  proposerName: string;
  category: GuildProposalCategory;
  requestedTreasuryCoins: number;
  quadraticVotesAccumulated: number;
  totalVotersCount: number;
  quorumReached: boolean;
  status: 'VOTING_ACTIVE' | 'PASSED_FUNDED' | 'REJECTED';
  onChainProposalHash: string;
}

export interface CastGuildVoteDto {
  proposalId: string;
  creditsToSpend: number; // In Quadratic voting, votes = sqrt(credits)
}

export interface CreateGuildProposalDto {
  title: string;
  category: GuildProposalCategory;
  requestedTreasuryCoins: number;
  justification: string;
}

// ==========================================
// 86. Neuromorphic Spiking Neural Network (SNN) & Memristor Lab (Phase 86)
// ==========================================
export interface SpikingNeuronConfig {
  neuronType: 'LIF' | 'IZHIKEVICH' | 'ADAPTIVE_EXPONENTIAL';
  restingPotentialMv: number;
  thresholdPotentialMv: number;
  decayConstantTauMs: number;
  refractoryPeriodMs: number;
}

export interface SynapticWeightUpdate {
  synapseId: string;
  preSpikeTimeMs: number;
  postSpikeTimeMs: number;
  deltaWeight: number;
  currentWeight: number;
}

export interface NeuromorphicSimulationResult {
  id: string;
  architectureName: string;
  totalSpikesFired: number;
  energyConsumptionJoules: number;
  sparsityPercent: number;
  voltageTraceMv: { timeMs: number; voltageMv: number; spiked: boolean }[];
  synapticUpdates: SynapticWeightUpdate[];
  neuromorphicHardwareChip: 'INTEL_LOIHI_2' | 'SPINNAKER_2' | 'BRAINDROP';
}

export interface RunSnnSimulationDto {
  architectureName: string;
  neuronConfig: SpikingNeuronConfig;
  inputCurrentNanoAmps: number;
  simulationDurationMs: number;
}

// ==========================================
// 87. Quantum Key Distribution (BB84 / E91 QKD) & Cryptography Simulator (Phase 87)
// ==========================================
export interface QkdPhotonState {
  index: number;
  aliceBit: 0 | 1;
  aliceBasis: 'RECTILINEAR' | 'DIAGONAL';
  eveIntercepted: boolean;
  eveBasis?: 'RECTILINEAR' | 'DIAGONAL';
  bobBasis: 'RECTILINEAR' | 'DIAGONAL';
  bobMeasuredBit: 0 | 1;
  basisMatched: boolean;
  isSiftedKeyBit: boolean;
}

export interface QkdTransmissionReport {
  id: string;
  protocol: 'BB84' | 'E91_ENTANGLEMENT';
  totalPhotonsSent: number;
  siftedKeyLength: number;
  qberPercent: number; // Quantum Bit Error Rate
  eavesdropperDetected: boolean;
  securityVerdict: 'SECURE_CHANNEL' | 'COMPROMISED_EAVESDROPPER_DETECTED';
  samplePhotons: QkdPhotonState[];
  finalSecretKeyHex: string;
  encryptedSampleCipherHex?: string;
}

export interface SimulateQkdProtocolDto {
  photonsCount: number;
  enableEveEavesdropping: boolean;
  channelNoisePercent?: number;
}

// ==========================================
// 88. Autonomous Academic LaTeX Paper Referee & Reviewer 2 Scorer (Phase 88)
// ==========================================
export interface PeerReviewCriteriaScore {
  criterion: 'TECHNICAL_NOVELTY' | 'METHODOLOGICAL_RIGOR' | 'STATISTICAL_VALIDITY' | 'CLARITY_STRUCTURE' | 'REPRODUCIBILITY';
  scoreOutOf10: number;
  comments: string;
}

export interface PaperRefereeReport {
  id: string;
  paperTitle: string;
  overallScore: number; // 1 to 10
  decisionRecommendation: 'STRONG_ACCEPT' | 'WEAK_ACCEPT' | 'BORDERLINE' | 'MAJOR_REVISION' | 'REJECT';
  acceptanceProbabilityPercent: number;
  criteriaScores: PeerReviewCriteriaScore[];
  reviewer2Critique: string;
  suggestedRebuttalStrategy: string[];
  noveltyHighlights: string[];
  methodologyGaps: string[];
}

export interface ReviewPaperSubmissionDto {
  paperTitle: string;
  targetVenue: string;
  abstractText: string;
  latexMethodologySnippet?: string;
}

// ==========================================
// 89. 3D CRISPR-Cas9 Guide-RNA (gRNA) & Off-Target Cleavage Predictor (Phase 89)
// ==========================================
export interface OffTargetLocusPrediction {
  locusId: string;
  chromosomeLocation: string;
  sequenceMismatchCount: number;
  mismatchedBases: string;
  cleavageProbabilityScore: number; // 0.0 to 1.0 (CFD Score)
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface CrisprTargetAnalysis {
  id: string;
  targetGene: string;
  pamMotif: string; // e.g. "NGG"
  gRnaSequence20nt: string;
  gcContentPercent: number;
  onTargetDoenchScore: number; // 0 to 100
  offTargetCount: number;
  predictedCuts: OffTargetLocusPrediction[];
  safetyCertification: 'APPROVED_FOR_SYNTHESIS' | 'WARNING_HIGH_OFF_TARGET_RISK';
}

export interface DesignGuideRnaDto {
  targetGene: string;
  genomicDnaSequence: string;
  casProteinType?: 'SPCAS9' | 'CAS12A' | 'CAS13';
}

// ==========================================
// 90. Student Venture Syndicate & YC Post-Money SAFE Note Builder (Phase 90)
// ==========================================
export interface CapTableShareholder {
  holderName: string;
  stakeType: 'FOUNDERS' | 'EMPLOYEE_POOL' | 'ANGEL_SYNDICATE' | 'OPTION_POOL';
  sharesCount: number;
  ownershipPercentPre: number;
  ownershipPercentPost: number;
}

export interface VentureSafeAgreement {
  id: string;
  startupName: string;
  founderName: string;
  investorName: string;
  investmentAmountUsd: number;
  postMoneyValuationCapUsd: number;
  discountRatePercent: number;
  impliedEquityPercent: number;
  governingLawState: string;
  safeAgreementMarkdown: string;
  capTableSimulation: CapTableShareholder[];
  sha256ContractHash: string;
}

export interface GenerateSafeNoteDto {
  startupName: string;
  founderName: string;
  investorName: string;
  investmentAmountUsd: number;
  postMoneyValuationCapUsd: number;
  discountRatePercent?: number;
}

// ==========================================
// 91. 3D Computational Fusion Plasma & Tokamak Magnetic Trap Simulator (Phase 91)
// ==========================================
export interface TokamakPlasmaParameters {
  coreIonTemperatureKeV: number; // e.g. 15 keV (~150M Kelvin)
  electronDensityM3: number; // e.g. 1.2e20 m^-3
  energyConfinementTimeSeconds: number; // e.g. 3.8s
  toroidalMagneticFieldTesla: number; // e.g. 5.3 Tesla
  plasmaCurrentMegaAmps: number; // e.g. 15 MA
  qFactorSafetySafety: number; // q_95 safety factor
}

export interface FusionReactionOutput {
  id: string;
  tokamakReactorName: string;
  fusionGainQFactor: number; // Q = P_fusion / P_input
  tripleProductKeVSM3: number; // n * T * tau_E
  lawsonCriterionAchieved: boolean;
  totalThermalPowerMegawatts: number;
  alphaParticleHeatingMw: number;
  plasmaStabilityStatus: 'STABLE_H_MODE' | 'EDGE_LOCALIZED_MODE' | 'DISRUPTION_RISK';
}

export interface SimulateTokamakPlasmaDto {
  tokamakReactorName: string;
  parameters: TokamakPlasmaParameters;
  auxiliaryHeatingPowerMw: number;
}

// ==========================================
// 92. BCI Brain-Computer Interface P300 Neuro-Speller Matrix (Phase 92)
// ==========================================
export interface BciMatrixTile {
  char: string;
  row: number;
  col: number;
  isFlashing: boolean;
}

export interface P300SpellerSession {
  id: string;
  targetWord: string;
  spelledWord: string;
  wordsPerMinute: number;
  p300AmplitudeMicroVolts: number;
  classificationConfidencePercent: number;
  erpWaveform: { timeMs: number; czMv: number; pzMv: number; ozMv: number }[];
  activeElectrodeMontage: string[];
}

export interface ProcessBciEpochDto {
  targetWord: string;
  currentSpelledText: string;
  samplingRateHz: number;
}

// ==========================================
// 93. Autonomous Legal Contract Analyzer & Patent Infringement Risk Radar (Phase 93)
// ==========================================
export interface ContractClauseRisk {
  clauseTitle: string;
  originalText: string;
  riskCategory: 'UNFAIR_IP_ASSIGNMENT' | 'OVERREACHING_NON_COMPETE' | 'UNLIMITED_INDEMNITY' | 'HIDDEN_PENALTY';
  severityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suggestedRedlineText: string;
  legalJustification: string;
}

export interface LegalRiskAssessmentReport {
  id: string;
  contractTitle: string;
  overallRiskScore: number; // 0 (Safe) to 100 (Hazardous)
  contractSafetyTier: 'LOW_RISK_STUDENT_FRIENDLY' | 'MODERATE_REVIEW_ADVISED' | 'HIGH_RISK_DO_NOT_SIGN';
  flaggedClauses: ContractClauseRisk[];
  ipRetainedPercent: number;
  patentInfringementRiskPercent: number;
}

export interface AnalyzeLegalContractDto {
  contractTitle: string;
  contractFullText: string;
  studentRole: 'FREELANCER' | 'STUDENT_FOUNDER' | 'RESEARCH_ASSISTANT';
}

// ==========================================
// 94. Exoplanet Transit Photometry & Kepler Light-Curve Extractor (Phase 94)
// ==========================================
export interface PhotometryDataPoint {
  timeHours: number;
  normalizedFlux: number;
  fluxError: number;
}

export interface ExoplanetTransitAnalysis {
  id: string;
  starName: string;
  planetName: string;
  transitDepthPpm: number; // Parts per million
  planetRadiusEarthRadii: number;
  orbitalPeriodDays: number;
  semiMajorAxisAu: number;
  equilibriumTempKelvin: number;
  isInHabitableZone: boolean;
  transitLightCurve: PhotometryDataPoint[];
}

export interface AnalyzeTransitLightCurveDto {
  starName: string;
  stellarRadiusSolar: number;
  stellarEffectiveTempK: number;
  lightCurvePoints?: PhotometryDataPoint[];
}

// ==========================================
// 95. Collegiate Carbon Credit Smart Market & ESG Offset Ledger (Phase 95)
// ==========================================
export interface CarbonCreditListing {
  id: string;
  campusProjectName: string;
  creditType: 'SOLAR_ROOFTOP' | 'EV_SHUTTLE_OFFSET' | 'TREE_PLANTATION' | 'FOOD_WASTE_BIOGAS';
  tonnesCo2Offset: number;
  pricePerTonneCredits: number;
  verifierOrganization: string;
  sellerStudentOrg: string;
  sha256CertificateHash: string;
}

export interface EsgFootprintReport {
  id: string;
  scope1EmissionsTonnes: number;
  scope2EmissionsTonnes: number;
  scope3EmissionsTonnes: number;
  netCarbonBalanceTonnes: number;
  greenCampusRating: 'PLATINUM' | 'GOLD' | 'SILVER';
  activeListings: CarbonCreditListing[];
}

export interface TradeCarbonCreditDto {
  listingId: string;
  tonnesToBuy: number;
  buyerAddress: string;
}

export interface CalculateEsgFootprintDto {
  campusBuildingId: string;
  electricityKwh: number;
  transportKm: number;
}

// ==========================================
// 96. Gravitational Wave Interferometry & Black Hole Merger Ringdown Simulator (Phase 96)
// ==========================================
export interface WaveformStrainDataPoint {
  timeMs: number; // Time relative to merger
  strainH10Minus21: number; // Strain h(t) * 10^-21
  frequencyHz: number;
}

export interface GravitationalWaveEvent {
  id: string;
  eventName: string;
  primaryMassSolar: number;
  secondaryMassSolar: number;
  chirpMassSolar: number; // M = (m1*m2)^(3/5) / (m1+m2)^(1/5)
  luminosityDistanceMpc: number;
  peakGravitationalPowerWatts: number;
  remnantBlackHoleMassSolar: number;
  energyRadiatedSolarMasses: number;
  detectorNetwork: string[];
  strainWaveform: WaveformStrainDataPoint[];
}

export interface SimulateGwMergerDto {
  primaryMassSolar: number;
  secondaryMassSolar: number;
  luminosityDistanceMpc?: number;
  targetObservatory?: 'LIGO_HANFORD' | 'LIGO_LIVINGSTON' | 'VIRGO' | 'KAGRA';
}

// ==========================================
// 97. Autonomous Robotic Arm Inverse Kinematics & 6-DOF ROS Trajectory Planner (Phase 97)
// ==========================================
export interface Joint6DofState {
  jointNumber: number;
  jointName: string;
  currentAngleDeg: number;
  minLimitDeg: number;
  maxLimitDeg: number;
  torqueNm: number;
}

export interface RoboticTrajectoryPlan {
  id: string;
  targetCoordinates: { x: number; y: number; z: number; rollDeg: number; pitchDeg: number; yawDeg: number };
  joints: Joint6DofState[];
  isReachabilityFeasible: boolean;
  singularityDistanceMetric: number; // Condition number
  executionTimeSec: number;
  trajectoryWaypoints: Array<{ timeStepSec: number; jointAngles: number[] }>;
}

export interface ComputeInverseKinematicsDto {
  targetX: number;
  targetY: number;
  targetZ: number;
  targetRollDeg?: number;
  targetPitchDeg?: number;
  targetYawDeg?: number;
}

// ==========================================
// 98. Epigenetic DNA Methylation & Biological Longevity Clock (Phase 98)
// ==========================================
export interface CpgSiteMethylation {
  cpgId: string;
  geneSymbol: string;
  betaValuePercentage: number; // 0 to 100% methylation
  biologicalImpact: 'CELLULAR_SENESCENCE' | 'DNA_REPAIR' | 'METABOLIC_EFFICIENCY' | 'INFLAMMATION_REGULATION';
}

export interface EpigeneticClockReport {
  id: string;
  chronologicalAgeYears: number;
  epigeneticAgeHorvathYears: number;
  epigeneticAgeHannumYears: number;
  biologicalAgeAccelerationYears: number; // Negative is youthful, positive is accelerated aging
  vitalityScorePercent: number;
  analyzedCpgSites: CpgSiteMethylation[];
  recommendedLifestyleInterventions: string[];
}

export interface AnalyzeEpigeneticClockDto {
  chronologicalAgeYears: number;
  dailySleepHours: number;
  weeklyCardioMinutes: number;
  mediterraneanDietAdherenceScore: number; // 1 to 10
  stressIndex: number; // 1 to 10
}

// ==========================================
// 99. High-Frequency Algorithmic Order Book (L2/L3) & Limit Order Matching Engine (Phase 99)
// ==========================================
export interface LimitOrder {
  id: string;
  side: 'BUY' | 'SELL';
  priceUsd: number;
  quantityLots: number;
  timestampNano: number;
  traderId: string;
}

export interface OrderBookLevel {
  priceUsd: number;
  aggregateQuantity: number;
  orderCount: number;
}

export interface OrderBookSnapshot {
  id: string;
  symbol: string;
  lastTradePriceUsd: number;
  spreadBps: number;
  bidLadder: OrderBookLevel[];
  askLadder: OrderBookLevel[];
  recentFills: Array<{ price: number; quantity: number; side: 'BUY' | 'SELL'; timestamp: string }>;
  matchingEngineLatencyMicros: number;
}

export interface ExecuteHftTradeDto {
  side: 'BUY' | 'SELL';
  priceUsd: number;
  quantityLots: number;
  orderType: 'LIMIT' | 'MARKET';
}

// ==========================================
// 100. Century Grandmaster Singularity Medallion & Sovereign Digital Campus Avatar (Phase 100)
// ==========================================
export interface CenturySoulboundCertificate {
  id: string;
  studentName: string;
  college: string;
  completionDate: string;
  totalPhasesCompleted: 100;
  totalXpAccumulated: number;
  grandmasterTier: 'MYTHIC_CENTURION_SINGULARITY';
  sha256SoulboundHash: string;
  signatureRsa2048: string;
  unlockedMasterAbilities: string[];
}

export interface MasterCurriculumTranscript {
  totalModules: 100;
  passedCount: 100;
  masteryGpaEquivalent: 4.0;
  pillarBreakdown: {
    foundation: number;
    studyAndResearch: number;
    examsAndPractice: number;
    careerAndFintech: number;
    aiAndCommunity: number;
    quantumAndAdvancedTech: number;
  };
}

export interface CenturyGrandmasterProfile {
  studentProfile: StudentProfile;
  certificate: CenturySoulboundCertificate;
  transcript: MasterCurriculumTranscript;
}

export interface ClaimCenturyMedallionDto {
  studentName: string;
  college?: string;
  signaturePhrase?: string;
}



