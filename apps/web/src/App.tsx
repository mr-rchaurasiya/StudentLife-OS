import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { DashboardCockpit } from './components/DashboardCockpit';
import { StudyPlannerView } from './components/StudyPlannerView';
import { SyllabusManagerView } from './components/SyllabusManagerView';
import { NotesHubView } from './components/NotesHubView';
import { AiStudyAssistantView } from './components/AiStudyAssistantView';
import { RevisionEngineView } from './components/RevisionEngineView';
import { ExamPrepEngineView } from './components/ExamPrepEngineView';
import { QuestionBankView } from './components/QuestionBankView';
import { MockTestSimulatorView } from './components/MockTestSimulatorView';
import { PerformanceAnalyticsView } from './components/PerformanceAnalyticsView';
import { CareerIntelligenceView } from './components/CareerIntelligenceView';
import { ResumeAtsOptimizerView } from './components/ResumeAtsOptimizerView';
import { InternshipRadarView } from './components/InternshipRadarView';
import { ScholarshipFinderView } from './components/ScholarshipFinderView';
import { DeadlineAlertsView } from './components/DeadlineAlertsView';
import { AiMentorView } from './components/AiMentorView';
import { CommunityHubView } from './components/CommunityHubView';
import { LeaderboardView } from './components/LeaderboardView';
import { OcrScannerView } from './components/OcrScannerView';
import { SocialStudyRoomsView } from './components/SocialStudyRoomsView';
import { AiVoiceTutorView } from './components/AiVoiceTutorView';
import { ConceptGraphView } from './components/ConceptGraphView';
import { QuizBattleArenaView } from './components/QuizBattleArenaView';
import { SmartDocumentAnnotatorView } from './components/SmartDocumentAnnotatorView';
import { CustomPaperGeneratorView } from './components/CustomPaperGeneratorView';
import { FocusGardenView } from './components/FocusGardenView';
import { AiPodcastStudioView } from './components/AiPodcastStudioView';
import { CodeSandboxView } from './components/CodeSandboxView';
import { RankPredictorMistakeVaultView } from './components/RankPredictorMistakeVaultView';
import { VirtualCampusView } from './components/VirtualCampusView';
import { AiSlideGeneratorView } from './components/AiSlideGeneratorView';
import { AiMockInterviewView } from './components/AiMockInterviewView';
import { NotesMarketplaceView } from './components/NotesMarketplaceView';
import { CircadianFocusHabitView } from './components/CircadianFocusHabitView';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { FocusAudioPlayerWidget } from './components/FocusAudioPlayerWidget';
import { PwaInstallPromptWidget } from './components/PwaInstallPromptWidget';
import { DailyStudyDigestModal } from './components/DailyStudyDigestModal';
import {
  StudentProfile,
  UpdateStudentProfileDto,
  DashboardSummaryData,
  StudyTask,
  CreateStudyTaskDto,
  WeeklyScheduleData,
  SubjectWithTopics,
  CreateSubjectDto,
  CreateTopicDto,
  SyllabusOverviewStats,
  SupportedLanguage,
} from '@studentlife/shared';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Clock,
  LogIn,
  LogOut,
  LayoutDashboard,
  Calendar,
  Layers,
  FileText,
  RotateCcw,
  Target,
  TrendingUp,
  Compass,
  Award,
  Bell,
  Users,
  Users2,
  Trophy,
  Scan,
  Sun,
  Mic,
  Network,
  Swords,
  Highlighter,
  Trees,
  Code2,
  Globe,
  Presentation,
  ShoppingBag,
  Activity,
  Landmark,
} from 'lucide-react';

interface PhaseItem {
  id: string;
  number: string;
  name: string;
  pillar: 'FOUNDATION' | 'STUDY' | 'EXAM' | 'CAREER' | 'OPPORTUNITIES' | 'AI_COMMUNITY';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  deliverables: string[];
}

const PHASES: PhaseItem[] = [
  { id: 'p01', number: '01', name: 'Project Architecture', pillar: 'FOUNDATION', status: 'COMPLETED', deliverables: ['Monorepo Workspace', 'Shared Domain Types', 'Prisma DB Schema', 'API Health Engine', 'Design System'] },
  { id: 'p02', number: '02', name: 'Authentication Engine', pillar: 'FOUNDATION', status: 'COMPLETED', deliverables: ['JWT + Refresh Token', 'OAuth2 Google/GitHub', 'Role-Based Access Control', 'Session Security'] },
  { id: 'p03', number: '03', name: 'Student Profile & Goals', pillar: 'FOUNDATION', status: 'COMPLETED', deliverables: ['Academic Metadata', 'Target Exams & Stream', 'Skill Tags & Badges', 'Daily Study Goals', 'XP Level & Streak 🔥'] },
  { id: 'p04', number: '04', name: 'Intelligent Dashboard', pillar: 'FOUNDATION', status: 'COMPLETED', deliverables: ['Pomodoro Focus Timer', 'Daily Study Progress Meter', 'Exam Countdown Clocks', 'Spaced Repetition Queue', 'Fast AI Shortcuts'] },
  { id: 'p05', number: '05', name: 'Study Planner & Timers', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['Daily Time-Blocking', 'Weekly Schedule Strip', 'Task Priority Matrix', 'Pomodoro Focus Linking', 'Task Completion +15 XP'] },
  { id: 'p06', number: '06', name: 'Syllabus Tracker', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['Tree Syllabus View', 'Topic Weightage Analyzer', 'Completion Milestones', 'Difficulty Ratings', 'Topic Completion +20 XP'] },
  { id: 'p07', number: '07', name: 'Notes & Resources Hub', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['Markdown Rich Notes', 'PDF Document Reader', 'Color-coded Tags', 'Smart Bookmarks', 'Word & Read Time Metrics'] },
  { id: 'p08', number: '08', name: 'AI Study Assistant', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['PDF ➔ AI Summary & Mindmap', '3D Active Recall Flashcards', '24/7 Multi-Depth Doubt Solver', 'Concept Deep-Dive Explainer'] },
  { id: 'p09', number: '09', name: 'Revision Engine (SM-2)', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['SuperMemo SM-2 Interval Engine', 'Daily Active Recall Queue', 'Memory Retention Degradation Index', 'Rapid Recall Reviewer'] },
  { id: 'p10', number: '10', name: 'Exam Prep Engine', pillar: 'EXAM', status: 'COMPLETED', deliverables: ['Exam Profile Configurator', 'High-Precision Countdown Clocks', 'Target Percentile Goals', '3-Stage Strategy Roadmap'] },
  { id: 'p11', number: '11', name: 'PYQ & Question Bank', pillar: 'EXAM', status: 'COMPLETED', deliverables: ['10,000+ Question Repository', 'Previous Year Questions (GATE/JEE/Univ)', 'Difficulty & Subject Filters', 'Step-by-Step LaTeX & XP Rewards'] },
  { id: 'p12', number: '12', name: 'Mock Test Simulator', pillar: 'EXAM', status: 'COMPLETED', deliverables: ['Full-Screen Live Simulation', 'Section Switcher & Question Palette', 'Negative Marking Rules', 'Scientific Calculator & Instant Scorecard'] },
  { id: 'p13', number: '13', name: 'Performance Analytics', pillar: 'EXAM', status: 'COMPLETED', deliverables: ['Subject Mastery Heatmap', 'Speed vs Accuracy 4-Quadrant Matrix', 'Weak Area Diagnostic Radar', 'Historical Score Trajectory Graphs'] },
  { id: 'p14', number: '14', name: 'Career Intelligence', pillar: 'CAREER', status: 'COMPLETED', deliverables: ['Career Pathway Explorer', 'Skill-Gap Heatmap', 'Required Course Recommender', 'Salary Trends & 1-Click Planner Bridge'] },
  { id: 'p15', number: '15', name: 'Resume & ATS Optimizer', pillar: 'CAREER', status: 'COMPLETED', deliverables: ['Live LaTeX/PDF Resume Builder', 'ATS Scoring Engine', 'Keyword Matcher', 'AI Interview Mock Simulator'] },
  { id: 'p16', number: '16', name: 'Internships & Job Radar', pillar: 'CAREER', status: 'COMPLETED', deliverables: ['Curated Student Internships', 'Application Tracker Kanban', 'Follow-up Reminders', 'Referral Network'] },
  { id: 'p17', number: '17', name: 'Scholarships & Schemes', pillar: 'OPPORTUNITIES', status: 'COMPLETED', deliverables: ['Govt Schemes Finder', 'Eligibility Matchmaker', 'Doc Verification Checklist', 'Financial Aid Radar'] },
  { id: 'p18', number: '18', name: 'Deadlines & Push Alerts', pillar: 'OPPORTUNITIES', status: 'COMPLETED', deliverables: ['Exam Registration Reminders', 'Admit Card Alerts', 'SMS/Push Notifications', 'Calendar iCal Sync'] },
  { id: 'p19', number: '19', name: 'AI Personal Mentor 360°', pillar: 'AI_COMMUNITY', status: 'COMPLETED', deliverables: ['Cross-Module Intelligence', 'Personalized Daily Action Plan', 'Burnout Prevention Advisor', 'Dynamic Advice Feed'] },
  { id: 'p20', number: '20', name: 'Community & Production', pillar: 'AI_COMMUNITY', status: 'COMPLETED', deliverables: ['Virtual Study Rooms', 'Peer Doubt Discussion Forums', 'Docker Deployment', 'Full CI/CD Pipeline'] },
  { id: 'p21', number: '21', name: 'Smart AI OCR Scanner', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['Handwritten Formula OCR', 'LaTeX Math Extraction', '1-Click Note Conversion', 'Diagram Vectorization'] },
  { id: 'p22', number: '22', name: 'Live Video/Audio Study Rooms', pillar: 'AI_COMMUNITY', status: 'COMPLETED', deliverables: ['WebRTC Video Mesh', 'Mute/Cam Controls', 'Live Room Chat', 'Synced Focus Timer'] },
  { id: 'p23', number: '23', name: 'Interactive AI Voice Tutor', pillar: 'AI_COMMUNITY', status: 'COMPLETED', deliverables: ['Socratic Voice Engine', 'Speech Synthesis & Recognition', 'Realtime Math/Doubt Explanations'] },
  { id: 'p24', number: '24', name: 'Knowledge Graph Visualizer', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['Interactive Force Graph', 'Syllabus Prerequisite Links', 'Topic Weightage Node Sizing'] },
  { id: 'p25', number: '25', name: 'Gamified Peer Quiz Arena', pillar: 'EXAM', status: 'COMPLETED', deliverables: ['Real-Time Multiplayer Battles', 'Live Score Board', 'Rapid Streak XP Multipliers'] },
  { id: 'p26', number: '26', name: 'Smart Document Annotator', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['Interactive PDF Highlighting', 'Inline Sticky Notes', 'Instant Flashcard Synthesizer'] },
  { id: 'p27', number: '27', name: 'AI Custom Mock Synthesizer', pillar: 'EXAM', status: 'COMPLETED', deliverables: ['Custom Difficulty Blueprint', 'Weighted Section Generator', 'LaTeX Printable PDF Export'] },
  { id: 'p28', number: '28', name: 'Focus Garden & Virtual Pet', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['Gamified Tree Growth Engine', 'Tree Death on Early Exit', 'Botanical Inventory Showcase'] },
  { id: 'p29', number: '29', name: 'AI Audio Study Studio', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['2-Speaker Socratic Dialogue', 'Script Generator', 'Synthesized Audio Playback'] },
  { id: 'p30', number: '30', name: 'In-Browser Code Sandbox', pillar: 'CAREER', status: 'COMPLETED', deliverables: ['Multi-Language Execution (JS/Py/CPP)', 'LeetCode/GATE Coding Challenges', 'Output Telemetry Console'] },
  { id: 'p31', number: '31', name: 'AIR Rank Predictor & Mistake Vault', pillar: 'EXAM', status: 'COMPLETED', deliverables: ['Monte-Carlo AIR Rank Engine', 'Categorized Mistake Log', 'Targeted Re-test Generator'] },
  { id: 'p32', number: '32', name: 'Vernacular Multi-Language Hub', pillar: 'FOUNDATION', status: 'COMPLETED', deliverables: ['10+ Regional Indian & Global Languages', 'AI Multilingual Note Translater', 'Real-time UI Localization'] },
  { id: 'p33', number: '33', name: 'Lo-Fi Ambient Focus Player', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['Synthesized Binaural & Rain Waves', 'Persistent Floating Media Bar', 'Audio Visualizer Waveform'] },
  { id: 'p34', number: '34', name: 'Progressive Web App (PWA)', pillar: 'FOUNDATION', status: 'COMPLETED', deliverables: ['Full Offline Support & Service Worker', '1-Click Install Banner', 'IndexedDB Sync Cache'] },
  { id: 'p35', number: '35', name: 'Automated Daily Study Digest', pillar: 'AI_COMMUNITY', status: 'COMPLETED', deliverables: ['Automated Morning Briefing', 'Nightly Study Report Card', 'Telegram/WhatsApp Webhook Sync'] },
  { id: 'p36', number: '36', name: 'AI Mind Map Studio', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['Canvas 2D Interactive Tree', 'Dynamic Branch Expansion', 'PNG & SVG Studio Export'] },
  { id: 'p37', number: '37', name: 'Flashcard Leitner Box', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['5-Box Leitner Memory Algorithm', 'Flip 3D Card Animation', 'Graduation Mastery Tracking'] },
  { id: 'p38', number: '38', name: 'College Exam Timetable Engine', pillar: 'EXAM', status: 'COMPLETED', deliverables: ['Clash Detection Algorithm', 'Countdown Clocks & Hall Ticket Vault', 'iCal Calendar Export'] },
  { id: 'p39', number: '39', name: 'Faculty & Peer Notes Exchange', pillar: 'AI_COMMUNITY', status: 'COMPLETED', deliverables: ['Upvoting & Verified Topper Badges', 'Department & Semester Filters', 'Direct PDF Reader'] },
  { id: 'p40', number: '40', name: 'Study Quest & Streak Engine', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['Daily Quests & Weekly Challenges', 'Tiered Achievement Badges', 'Streak Freeze Protections'] },
  { id: 'p41', number: '41', name: '2D Multiplayer Virtual Campus', pillar: 'AI_COMMUNITY', status: 'COMPLETED', deliverables: ['Interactive 2D Canvas Map', 'Avatar Navigation & Live Peer Desks', 'Library & Cafe Study Zones'] },
  { id: 'p42', number: '42', name: 'AI Animated Slide Generator', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['Auto-Deck Synthesis from Notes', 'Rich Code/Formula Callouts', 'Web Speech Audio Narration'] },
  { id: 'p43', number: '43', name: 'AI Mock Interview & Viva Coach', pillar: 'CAREER', status: 'COMPLETED', deliverables: ['Technical SDE & UPSC Viva Tracks', 'Web Speech Realtime Answer Capture', 'STAR Metric Comprehensive Scoring'] },
  { id: 'p44', number: '44', name: 'Topper Notes & Resource Bazaar', pillar: 'AI_COMMUNITY', status: 'COMPLETED', deliverables: ['P2P Handwritten Note Vault', 'Peer Rating & Unlock with Study Coins', 'Verified Topper Upload Pipeline'] },
  { id: 'p45', number: '45', name: 'Circadian Peak-Focus & Habit Engine', pillar: 'STUDY', status: 'COMPLETED', deliverables: ['Chronotype Peak-Focus Optimization', 'Hydration Tracker & Smart Hydrate Prompts', '20-20-20 Eye-Rest Interval Timer'] },
];

const DEFAULT_DEMO_PROFILE: StudentProfile = {
  id: 'prof-demo',
  userId: 'demo-student-uuid-01',
  collegeOrSchool: 'Indian Institute of Technology (IIT)',
  degreeOrGrade: 'B.Tech Computer Science & Engineering',
  fieldOfStudy: 'Computer Science',
  academicYear: 3,
  targetExams: ['GATE (CSE / ECE / ME)', 'JEE Main & Advanced'],
  primaryInterests: ['Distributed Systems', 'Algorithms', 'AI'],
  skillTags: ['Data Structures & Algorithms', 'System Design', 'Full-Stack Web Dev'],
  careerAspirations: ['Software Engineer', 'AI / Data Scientist'],
  dailyStudyGoalMinutes: 180,
  streakCount: 7,
  xpPoints: 420,
  level: 2,
  xpToNextLevel: 80,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_DASHBOARD_SUMMARY: DashboardSummaryData = {
  todayStudiedMinutes: 85,
  dailyGoalMinutes: 180,
  todayGoalProgressPercent: 47,
  completedPomodorosToday: 3,
  countdowns: [
    {
      id: 'exam-1',
      title: 'GATE 2027 (CSE)',
      examDate: '2027-02-14',
      daysRemaining: 158,
      category: 'NATIONAL_COMPETITIVE',
      targetScoreGoal: 'Top 0.5% (AIR < 500)',
    },
    {
      id: 'exam-2',
      title: 'University Semester Finals',
      examDate: '2026-11-20',
      daysRemaining: 74,
      category: 'UNIVERSITY_EXAM',
      targetScoreGoal: 'CGPA >= 9.2',
    },
    {
      id: 'exam-3',
      title: 'Tech Placement Coding Assessments',
      examDate: '2026-10-15',
      daysRemaining: 39,
      category: 'CAREER_INTERVIEW',
      targetScoreGoal: 'FAANG / Tier-1 Software Engineer',
    },
  ],
  revisionQueue: [
    {
      id: 'rev-1',
      subjectName: 'Data Structures & Algorithms',
      topicTitle: 'Dynamic Programming & Memoization Patterns',
      colorCode: '#6366f1',
      intervalDays: 4,
      urgency: 'OVERDUE',
    },
    {
      id: 'rev-2',
      subjectName: 'System Design',
      topicTitle: 'Distributed Caching & Redis Eviction Policies',
      colorCode: '#06b6d4',
      intervalDays: 7,
      urgency: 'DUE_TODAY',
    },
    {
      id: 'rev-3',
      subjectName: 'Computer Networks',
      topicTitle: 'TCP Handshake & Congestion Control Algorithms',
      colorCode: '#10b981',
      intervalDays: 14,
      urgency: 'UPCOMING',
    },
  ],
  motivationalQuote: {
    quote: 'Small daily disciplines repeated with consistency lead to monumental achievements over time.',
    author: 'Robin Sharma',
  },
};

const DEFAULT_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    userId: 'demo-student-uuid-01',
    title: 'Practice 5 Hard LeetCode DP Problems',
    description: 'Focus on 0/1 Knapsack & Longest Common Subsequence patterns',
    subjectName: 'Data Structures & Algorithms',
    subjectColor: '#6366f1',
    dueDate: new Date().toISOString().split('T')[0],
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
    userId: 'demo-student-uuid-01',
    title: 'Read Chapter 4: Distributed Caching Architecture',
    description: 'Take markdown notes on Cache-Aside vs Write-Through patterns',
    subjectName: 'System Design',
    subjectColor: '#06b6d4',
    dueDate: new Date().toISOString().split('T')[0],
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
    userId: 'demo-student-uuid-01',
    title: 'Solve GATE 2024 Engineering Mathematics PYQs',
    description: 'Calculus, Eigenvalues, and Bayes Theorem numericals',
    subjectName: 'GATE Exam Prep',
    subjectColor: '#f43f5e',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '06:00 PM',
    priority: 'URGENT',
    status: 'TODO',
    estimatedMinutes: 90,
    actualMinutes: 0,
    pomodoroSessionsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_SUBJECTS: SubjectWithTopics[] = [
  {
    id: 'sub-1',
    userId: 'demo-student-uuid-01',
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
    userId: 'demo-student-uuid-01',
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
    userId: 'demo-student-uuid-01',
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
];

const DEFAULT_SYLLABUS_OVERVIEW: SyllabusOverviewStats = {
  totalSubjects: 3,
  totalTopics: 13,
  completedTopics: 7,
  overallCoveragePercentage: 54,
  highWeightageTopicsPending: 3,
};

function DashboardContent() {
  const { user, tokens, isAuthenticated, logout } = useAuth();
  const [activeView, setActiveView] = useState<'DASHBOARD' | 'PLANNER' | 'SYLLABUS' | 'NOTES' | 'AI_STUDY' | 'REVISION' | 'EXAM_PREP' | 'QUESTION_BANK' | 'MOCK_TEST' | 'ANALYTICS' | 'CAREER' | 'RESUME' | 'INTERNSHIPS' | 'SCHOLARSHIPS' | 'DEADLINES' | 'AI_MENTOR' | 'COMMUNITY' | 'LEADERBOARD' | 'OCR_SCANNER' | 'STUDY_ROOMS' | 'VOICE_TUTOR' | 'CONCEPT_GRAPH' | 'QUIZ_BATTLE' | 'DOCUMENT_ANNOTATOR' | 'CUSTOM_PAPER' | 'FOCUS_GARDEN' | 'AI_PODCAST' | 'CODE_SANDBOX' | 'RANK_PREDICTOR' | 'VIRTUAL_CAMPUS' | 'SLIDE_GENERATOR' | 'MOCK_INTERVIEW' | 'NOTES_MARKETPLACE' | 'CIRCADIAN_FOCUS' | 'ROADMAP'>('DASHBOARD');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [initialAiStudyContent, setInitialAiStudyContent] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDigestModalOpen, setIsDigestModalOpen] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_DEMO_PROFILE);
  const [summary, setSummary] = useState<DashboardSummaryData>(DEFAULT_DASHBOARD_SUMMARY);
  const [tasks, setTasks] = useState<StudyTask[]>(DEFAULT_TASKS);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleData[]>([]);
  const [subjects, setSubjects] = useState<SubjectWithTopics[]>(DEFAULT_SUBJECTS);
  const [syllabusOverview, setSyllabusOverview] = useState<SyllabusOverviewStats>(DEFAULT_SYLLABUS_OVERVIEW);
  const [isClaimingStreak, setIsClaimingStreak] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'FOUNDATION' | 'STUDY' | 'EXAM' | 'CAREER' | 'AI_COMMUNITY'>('ALL');
  const [apiHealth, setApiHealth] = useState<{ status: string; uptime?: number; latency?: number } | null>(null);

  useEffect(() => {
    checkHealth();
    buildFallbackWeekly(DEFAULT_TASKS);
  }, []);

  useEffect(() => {
    if (isAuthenticated && tokens?.accessToken) {
      fetchProfile();
      fetchDashboardSummary();
      fetchTasks();
      fetchWeekly();
      fetchSyllabus();
    }
  }, [isAuthenticated, tokens]);

  const checkHealth = async () => {
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      const end = performance.now();
      if (data && data.success) {
        setApiHealth({
          status: 'ONLINE',
          uptime: data.data?.uptime || 1,
          latency: Math.round(end - start),
        });
      } else {
        setApiHealth({ status: 'STANDBY', latency: Math.round(end - start) });
      }
    } catch {
      setApiHealth({ status: 'STANDBY', latency: 0 });
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${tokens?.accessToken}` },
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setProfile(data.data);
      }
    } catch {
      // Keep state
    }
  };

  const fetchDashboardSummary = async () => {
    try {
      const res = await fetch('/api/dashboard', {
        headers: { Authorization: `Bearer ${tokens?.accessToken}` },
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setSummary(data.data);
      }
    } catch {
      // Keep state
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/planner/tasks', {
        headers: { Authorization: `Bearer ${tokens?.accessToken}` },
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setTasks(data.data);
        buildFallbackWeekly(data.data);
      }
    } catch {
      // Keep state
    }
  };

  const fetchWeekly = async () => {
    try {
      const res = await fetch('/api/planner/weekly', {
        headers: { Authorization: `Bearer ${tokens?.accessToken}` },
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setWeeklySchedule(data.data);
      }
    } catch {
      // Keep state
    }
  };

  const fetchSyllabus = async () => {
    try {
      const [subRes, overRes] = await Promise.all([
        fetch('/api/syllabus/subjects', { headers: { Authorization: `Bearer ${tokens?.accessToken}` } }),
        fetch('/api/syllabus/overview', { headers: { Authorization: `Bearer ${tokens?.accessToken}` } }),
      ]);
      const subData = await subRes.json();
      const overData = await overRes.json();

      if (subData && subData.success && subData.data) {
        setSubjects(subData.data);
      }
      if (overData && overData.success && overData.data) {
        setSyllabusOverview(overData.data);
      }
    } catch {
      // Keep state
    }
  };

  const buildFallbackWeekly = (taskList: StudyTask[]) => {
    const days: WeeklyScheduleData[] = [];
    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = -1; i < 6; i++) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + i);
      const dateStr = targetDate.toISOString().split('T')[0];
      const isToday = i === 0;

      const dayTasks = taskList.filter((t) => t.dueDate === dateStr);
      const completedTasks = dayTasks.filter((t) => t.status === 'COMPLETED').length;
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
    setWeeklySchedule(days);
  };

  const handleSaveProfile = async (dto: UpdateStudentProfileDto) => {
    if (isAuthenticated && tokens?.accessToken) {
      try {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.accessToken}`,
          },
          body: JSON.stringify(dto),
        });
        const data = await res.json();
        if (data && data.success && data.data) {
          setProfile(data.data);
          return;
        }
      } catch (err) {
        console.error('Profile update error', err);
      }
    }

    setProfile((prev) => ({
      ...prev,
      ...dto,
      collegeOrSchool: dto.collegeOrSchool ?? prev.collegeOrSchool,
      degreeOrGrade: dto.degreeOrGrade ?? prev.degreeOrGrade,
      academicYear: dto.academicYear ?? prev.academicYear,
      targetExams: dto.targetExams ?? prev.targetExams,
      skillTags: dto.skillTags ?? prev.skillTags,
      careerAspirations: dto.careerAspirations ?? prev.careerAspirations,
      dailyStudyGoalMinutes: dto.dailyStudyGoalMinutes ?? prev.dailyStudyGoalMinutes,
    }));
  };

  const handleClaimStreak = async () => {
    setIsClaimingStreak(true);
    try {
      if (isAuthenticated && tokens?.accessToken) {
        const res = await fetch('/api/profile/streak', {
          method: 'POST',
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        const data = await res.json();
        if (data && data.success && data.data?.profile) {
          setProfile(data.data.profile);
          return;
        }
      }

      setProfile((prev) => ({
        ...prev,
        streakCount: prev.streakCount + 1,
        xpPoints: prev.xpPoints + 50,
        xpToNextLevel: Math.max(0, prev.xpToNextLevel - 50),
      }));
    } finally {
      setIsClaimingStreak(false);
    }
  };

  const handleFocusSessionComplete = async (durationMinutes: number, sessionType: 'FOCUS_25' | 'FOCUS_50') => {
    if (isAuthenticated && tokens?.accessToken) {
      try {
        await fetch('/api/dashboard/focus-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.accessToken}`,
          },
          body: JSON.stringify({ durationMinutes, sessionType }),
        });
        await fetchProfile();
        await fetchDashboardSummary();
        return;
      } catch {
        // Fallback
      }
    }

    const xpBonus = sessionType === 'FOCUS_50' ? 50 : 25;
    setProfile((p) => ({
      ...p,
      xpPoints: p.xpPoints + xpBonus,
      xpToNextLevel: Math.max(0, p.xpToNextLevel - xpBonus),
    }));
    setSummary((s) => ({
      ...s,
      todayStudiedMinutes: s.todayStudiedMinutes + durationMinutes,
      completedPomodorosToday: s.completedPomodorosToday + 1,
      todayGoalProgressPercent: Math.min(100, Math.round(((s.todayStudiedMinutes + durationMinutes) / s.dailyGoalMinutes) * 100)),
    }));
  };

  const handleCreateTask = async (dto: CreateStudyTaskDto) => {
    if (isAuthenticated && tokens?.accessToken) {
      try {
        const res = await fetch('/api/planner/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.accessToken}`,
          },
          body: JSON.stringify(dto),
        });
        const data = await res.json();
        if (data && data.success && data.data) {
          const updatedList = [data.data, ...tasks];
          setTasks(updatedList);
          buildFallbackWeekly(updatedList);
          return;
        }
      } catch {
        // Fallback
      }
    }

    const newTask: StudyTask = {
      id: `task-${Date.now()}`,
      userId: 'demo-student-uuid-01',
      title: dto.title,
      description: dto.description,
      subjectName: dto.subjectName,
      subjectColor: dto.subjectColor || '#6366f1',
      dueDate: dto.dueDate,
      dueTime: dto.dueTime || '12:00 PM',
      priority: dto.priority || 'MEDIUM',
      status: 'TODO',
      estimatedMinutes: dto.estimatedMinutes || 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    buildFallbackWeekly(updated);
  };

  const handleToggleTask = async (taskId: string) => {
    if (isAuthenticated && tokens?.accessToken) {
      try {
        const res = await fetch(`/api/planner/tasks/${taskId}/toggle`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        const data = await res.json();
        if (data && data.success && data.data?.task) {
          const updated = tasks.map((t) => (t.id === taskId ? data.data.task : t));
          setTasks(updated);
          buildFallbackWeekly(updated);
          await fetchProfile();
          return;
        }
      } catch {
        // Fallback
      }
    }

    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const isCompleted = t.status === 'COMPLETED';
        return {
          ...t,
          status: isCompleted ? 'TODO' : 'COMPLETED',
        } as StudyTask;
      }
      return t;
    });

    setTasks(updated);
    buildFallbackWeekly(updated);
    setProfile((p) => ({
      ...p,
      xpPoints: p.xpPoints + 15,
      xpToNextLevel: Math.max(0, p.xpToNextLevel - 15),
    }));
  };

  const handleDeleteTask = async (taskId: string) => {
    if (isAuthenticated && tokens?.accessToken) {
      try {
        await fetch(`/api/planner/tasks/${taskId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
      } catch {
        // Continue
      }
    }

    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    buildFallbackWeekly(updated);
  };

  const handleToggleTopic = async (topicId: string) => {
    if (isAuthenticated && tokens?.accessToken) {
      try {
        const res = await fetch(`/api/syllabus/topics/${topicId}/toggle`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        const data = await res.json();
        if (data && data.success && data.data?.subject) {
          const updatedSubs = subjects.map((s) => (s.id === data.data.subject.id ? data.data.subject : s));
          setSubjects(updatedSubs);
          await fetchProfile();
          await fetchSyllabus();
          return;
        }
      } catch {
        // Fallback
      }
    }

    // Local state fallback
    const updatedSubs = subjects.map((s) => {
      const topicIndex = s.topics.findIndex((t) => t.id === topicId);
      if (topicIndex !== -1) {
        const updatedTopics = [...s.topics];
        const current = updatedTopics[topicIndex];
        updatedTopics[topicIndex] = { ...current, isCompleted: !current.isCompleted };
        const completedCount = updatedTopics.filter((t) => t.isCompleted).length;
        return {
          ...s,
          completedTopics: completedCount,
          completionPercentage: Math.round((completedCount / updatedTopics.length) * 100),
          topics: updatedTopics,
        };
      }
      return s;
    });

    setSubjects(updatedSubs);
    setProfile((p) => ({
      ...p,
      xpPoints: p.xpPoints + 20,
      xpToNextLevel: Math.max(0, p.xpToNextLevel - 20),
    }));
  };

  const handleCreateSubject = async (dto: CreateSubjectDto) => {
    if (isAuthenticated && tokens?.accessToken) {
      try {
        const res = await fetch('/api/syllabus/subjects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.accessToken}`,
          },
          body: JSON.stringify(dto),
        });
        const data = await res.json();
        if (data && data.success && data.data) {
          setSubjects([...subjects, data.data]);
          await fetchSyllabus();
          return;
        }
      } catch {
        // Fallback
      }
    }

    const newSubId = `sub-${Date.now()}`;
    const initialTopics = (dto.initialTopics || []).map((t, idx) => ({
      id: `top-${Date.now()}-${idx}`,
      subjectId: newSubId,
      title: t.title,
      difficulty: t.difficulty,
      weightagePercentage: t.weightagePercentage,
      isCompleted: false,
      revisionIntervalDays: 1,
    }));

    const newSub: SubjectWithTopics = {
      id: newSubId,
      userId: 'demo-student-uuid-01',
      name: dto.name,
      code: dto.code,
      colorCode: dto.colorCode || '#6366f1',
      targetExam: dto.targetExam || 'Core Syllabus',
      totalTopics: initialTopics.length,
      completedTopics: 0,
      completionPercentage: 0,
      topics: initialTopics,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSubjects([...subjects, newSub]);
  };

  const handleAddTopic = async (subjectId: string, dto: CreateTopicDto) => {
    if (isAuthenticated && tokens?.accessToken) {
      try {
        const res = await fetch(`/api/syllabus/subjects/${subjectId}/topics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.accessToken}`,
          },
          body: JSON.stringify(dto),
        });
        const data = await res.json();
        if (data && data.success && data.data) {
          await fetchSyllabus();
          return;
        }
      } catch {
        // Fallback
      }
    }

    const updatedSubs = subjects.map((s) => {
      if (s.id === subjectId) {
        const newTop = {
          id: `top-${Date.now()}`,
          subjectId,
          title: dto.title,
          difficulty: dto.difficulty || 'MEDIUM',
          weightagePercentage: dto.weightagePercentage || 10,
          isCompleted: false,
          revisionIntervalDays: 1,
        };
        const allTops = [...s.topics, newTop];
        return {
          ...s,
          totalTopics: allTops.length,
          completionPercentage: Math.round((s.completedTopics / allTops.length) * 100),
          topics: allTops,
        };
      }
      return s;
    });

    setSubjects(updatedSubs);
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (isAuthenticated && tokens?.accessToken) {
      try {
        await fetch(`/api/syllabus/topics/${topicId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        await fetchSyllabus();
        return;
      } catch {
        // Fallback
      }
    }

    const updatedSubs = subjects.map((s) => {
      const filtered = s.topics.filter((t) => t.id !== topicId);
      const completedCount = filtered.filter((t) => t.isCompleted).length;
      return {
        ...s,
        totalTopics: filtered.length,
        completedTopics: completedCount,
        completionPercentage: filtered.length > 0 ? Math.round((completedCount / filtered.length) * 100) : 0,
        topics: filtered,
      };
    });

    setSubjects(updatedSubs);
  };

  const filteredPhases = activeTab === 'ALL' 
    ? PHASES 
    : PHASES.filter(p => p.pillar === activeTab || (activeTab === 'CAREER' && p.pillar === 'OPPORTUNITIES'));

  const completedCount = PHASES.filter(p => p.status === 'COMPLETED').length;
  const progressPercent = Math.round((completedCount / PHASES.length) * 100);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header style={{
        borderBottom: '1px solid var(--border-glass)',
        backgroundColor: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '14px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)'
              }}>
                <GraduationCap size={22} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                    STUDENT<span className="gradient-text">LIFE OS</span>
                  </h1>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Operating System for Study, Exams & Career</p>
              </div>
            </div>

            {/* Primary View Switcher */}
            <div className="glass-pill" style={{ padding: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveView('DASHBOARD')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'DASHBOARD' ? 'var(--accent-primary)' : 'transparent',
                  color: activeView === 'DASHBOARD' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <LayoutDashboard size={13} /> Cockpit
              </button>
              <button
                onClick={() => setActiveView('PLANNER')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'PLANNER' ? 'var(--accent-primary)' : 'transparent',
                  color: activeView === 'PLANNER' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Calendar size={13} /> Planner
              </button>
              <button
                onClick={() => setActiveView('SYLLABUS')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'SYLLABUS' ? 'var(--accent-primary)' : 'transparent',
                  color: activeView === 'SYLLABUS' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <BookOpen size={13} /> Syllabus
              </button>
              <button
                onClick={() => setActiveView('NOTES')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'NOTES' ? 'var(--accent-primary)' : 'transparent',
                  color: activeView === 'NOTES' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <FileText size={13} /> Notes
              </button>
              <button
                onClick={() => setActiveView('AI_STUDY')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'AI_STUDY' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                  color: activeView === 'AI_STUDY' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Sparkles size={13} color={activeView === 'AI_STUDY' ? '#fff' : '#f472b6'} /> AI Study
              </button>
              <button
                onClick={() => setActiveView('REVISION')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'REVISION' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                  color: activeView === 'REVISION' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <RotateCcw size={13} color={activeView === 'REVISION' ? '#fff' : '#34d399'} /> SM-2 Revision
              </button>
              <button
                onClick={() => setActiveView('EXAM_PREP')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'EXAM_PREP' ? 'linear-gradient(135deg, #06b6d4, #0284c7)' : 'transparent',
                  color: activeView === 'EXAM_PREP' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Target size={13} color={activeView === 'EXAM_PREP' ? '#fff' : '#22d3ee'} /> Exam Prep
              </button>
              <button
                onClick={() => setActiveView('QUESTION_BANK')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'QUESTION_BANK' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                  color: activeView === 'QUESTION_BANK' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <BookOpen size={13} color={activeView === 'QUESTION_BANK' ? '#fff' : '#818cf8'} /> PYQ Bank
              </button>
              <button
                onClick={() => setActiveView('MOCK_TEST')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'MOCK_TEST' ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'transparent',
                  color: activeView === 'MOCK_TEST' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Clock size={13} color={activeView === 'MOCK_TEST' ? '#fff' : '#fbbf24'} /> Mock Tests
              </button>
              <button
                onClick={() => setActiveView('ANALYTICS')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'ANALYTICS' ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'transparent',
                  color: activeView === 'ANALYTICS' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <TrendingUp size={13} color={activeView === 'ANALYTICS' ? '#fff' : '#34d399'} /> Analytics
              </button>
              <button
                onClick={() => setActiveView('CAREER')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'CAREER' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                  color: activeView === 'CAREER' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Briefcase size={13} color={activeView === 'CAREER' ? '#fff' : '#fbbf24'} /> Career Intel
              </button>
              <button
                onClick={() => setActiveView('RESUME')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'RESUME' ? 'linear-gradient(135deg, #10b981, #6366f1)' : 'transparent',
                  color: activeView === 'RESUME' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <FileCheck2 size={13} color={activeView === 'RESUME' ? '#fff' : '#34d399'} /> Resume & ATS
              </button>
              <button
                onClick={() => setActiveView('INTERNSHIPS')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'INTERNSHIPS' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
                  color: activeView === 'INTERNSHIPS' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Compass size={13} color={activeView === 'INTERNSHIPS' ? '#fff' : '#22d3ee'} /> Internships
              </button>
              <button
                onClick={() => setActiveView('SCHOLARSHIPS')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'SCHOLARSHIPS' ? 'linear-gradient(135deg, #10b981, #f59e0b)' : 'transparent',
                  color: activeView === 'SCHOLARSHIPS' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Award size={13} color={activeView === 'SCHOLARSHIPS' ? '#fff' : '#34d399'} /> Scholarships
              </button>
              <button
                onClick={() => setActiveView('DEADLINES')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'DEADLINES' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'transparent',
                  color: activeView === 'DEADLINES' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Bell size={13} color={activeView === 'DEADLINES' ? '#fff' : '#f87171'} /> Deadlines & Alerts
              </button>
              <button
                onClick={() => setActiveView('AI_MENTOR')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'AI_MENTOR' ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : 'transparent',
                  color: activeView === 'AI_MENTOR' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Sparkles size={13} color={activeView === 'AI_MENTOR' ? '#fff' : '#c084fc'} /> AI Mentor 360°
              </button>
              <button
                onClick={() => setActiveView('COMMUNITY')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'COMMUNITY' ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'transparent',
                  color: activeView === 'COMMUNITY' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Users size={13} color={activeView === 'COMMUNITY' ? '#fff' : '#818cf8'} /> Community Hub
              </button>
              <button
                onClick={() => setActiveView('LEADERBOARD')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'LEADERBOARD' ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'transparent',
                  color: activeView === 'LEADERBOARD' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Trophy size={13} color={activeView === 'LEADERBOARD' ? '#fff' : '#fbbf24'} /> Leaderboards
              </button>
              <button
                onClick={() => setActiveView('OCR_SCANNER')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'OCR_SCANNER' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
                  color: activeView === 'OCR_SCANNER' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Scan size={13} color={activeView === 'OCR_SCANNER' ? '#fff' : '#22d3ee'} /> OCR Scanner
              </button>
              <button
                onClick={() => setActiveView('STUDY_ROOMS')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'STUDY_ROOMS' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                  color: activeView === 'STUDY_ROOMS' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Users2 size={13} color={activeView === 'STUDY_ROOMS' ? '#fff' : '#a78bfa'} /> Study Rooms 🎧
              </button>
              <button
                onClick={() => setActiveView('VOICE_TUTOR')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'VOICE_TUTOR' ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'transparent',
                  color: activeView === 'VOICE_TUTOR' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Mic size={13} color={activeView === 'VOICE_TUTOR' ? '#fff' : '#e879f9'} /> Voice Tutor 🎙️
              </button>
              <button
                onClick={() => setActiveView('CONCEPT_GRAPH')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'CONCEPT_GRAPH' ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'transparent',
                  color: activeView === 'CONCEPT_GRAPH' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Network size={13} color={activeView === 'CONCEPT_GRAPH' ? '#fff' : '#38bdf8'} /> Mind Map Graph 🕸️
              </button>
              <button
                onClick={() => setActiveView('QUIZ_BATTLE')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'QUIZ_BATTLE' ? 'linear-gradient(135deg, #f43f5e, #e11d48)' : 'transparent',
                  color: activeView === 'QUIZ_BATTLE' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Swords size={13} color={activeView === 'QUIZ_BATTLE' ? '#fff' : '#fda4af'} /> 1v1 Arena ⚔️
              </button>
              <button
                onClick={() => setActiveView('DOCUMENT_ANNOTATOR')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'DOCUMENT_ANNOTATOR' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
                  color: activeView === 'DOCUMENT_ANNOTATOR' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Highlighter size={13} color={activeView === 'DOCUMENT_ANNOTATOR' ? '#fff' : '#67e8f9'} /> PDF Annotator 📑
              </button>
              <button
                onClick={() => setActiveView('CUSTOM_PAPER')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'CUSTOM_PAPER' ? 'linear-gradient(135deg, #f59e0b, #e11d48)' : 'transparent',
                  color: activeView === 'CUSTOM_PAPER' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <FileCheck2 size={13} color={activeView === 'CUSTOM_PAPER' ? '#fff' : '#fcd34d'} /> Mock Paper Synthesizer 📜
              </button>
              <button
                onClick={() => setActiveView('FOCUS_GARDEN')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'FOCUS_GARDEN' ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'transparent',
                  color: activeView === 'FOCUS_GARDEN' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Trees size={13} color={activeView === 'FOCUS_GARDEN' ? '#fff' : '#34d399'} /> Focus Garden 🌲
              </button>
              <button
                onClick={() => setActiveView('AI_PODCAST')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'AI_PODCAST' ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'transparent',
                  color: activeView === 'AI_PODCAST' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Mic size={13} color={activeView === 'AI_PODCAST' ? '#fff' : '#f472b6'} /> AI Podcast 🎙️
              </button>
              <button
                onClick={() => setActiveView('CODE_SANDBOX')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'CODE_SANDBOX' ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'transparent',
                  color: activeView === 'CODE_SANDBOX' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Code2 size={13} color={activeView === 'CODE_SANDBOX' ? '#fff' : '#38bdf8'} /> Code Sandbox 💻
              </button>
              <button
                onClick={() => setActiveView('RANK_PREDICTOR')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'RANK_PREDICTOR' ? 'linear-gradient(135deg, #f59e0b, #e11d48)' : 'transparent',
                  color: activeView === 'RANK_PREDICTOR' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <TrendingUp size={13} color={activeView === 'RANK_PREDICTOR' ? '#fff' : '#fbbf24'} /> AIR Predictor 🎯
              </button>
              <button
                onClick={() => setActiveView('VIRTUAL_CAMPUS')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'VIRTUAL_CAMPUS' ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'transparent',
                  color: activeView === 'VIRTUAL_CAMPUS' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Landmark size={13} color={activeView === 'VIRTUAL_CAMPUS' ? '#fff' : '#818cf8'} /> 2D Campus 🏰
              </button>
              <button
                onClick={() => setActiveView('SLIDE_GENERATOR')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'SLIDE_GENERATOR' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'transparent',
                  color: activeView === 'SLIDE_GENERATOR' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Presentation size={13} color={activeView === 'SLIDE_GENERATOR' ? '#fff' : '#c084fc'} /> Slide Studio 📊
              </button>
              <button
                onClick={() => setActiveView('MOCK_INTERVIEW')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'MOCK_INTERVIEW' ? 'linear-gradient(135deg, #06b6d4, #10b981)' : 'transparent',
                  color: activeView === 'MOCK_INTERVIEW' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Mic size={13} color={activeView === 'MOCK_INTERVIEW' ? '#fff' : '#22d3ee'} /> Viva & Interview 🎙️
              </button>
              <button
                onClick={() => setActiveView('NOTES_MARKETPLACE')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'NOTES_MARKETPLACE' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                  color: activeView === 'NOTES_MARKETPLACE' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <ShoppingBag size={13} color={activeView === 'NOTES_MARKETPLACE' ? '#fff' : '#fbbf24'} /> Notes Bazaar 📚
              </button>
              <button
                onClick={() => setActiveView('CIRCADIAN_FOCUS')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'CIRCADIAN_FOCUS' ? 'linear-gradient(135deg, #10b981, #f59e0b)' : 'transparent',
                  color: activeView === 'CIRCADIAN_FOCUS' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Activity size={13} color={activeView === 'CIRCADIAN_FOCUS' ? '#fff' : '#34d399'} /> Circadian Focus ⚡
              </button>
              <button
                onClick={() => setActiveView('ROADMAP')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: activeView === 'ROADMAP' ? 'var(--accent-primary)' : 'transparent',
                  color: activeView === 'ROADMAP' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Layers size={13} /> 45-Phase Matrix 🗺️
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Telemetry */}
            <div className="glass-pill" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: apiHealth?.status === 'ONLINE' ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                boxShadow: apiHealth?.status === 'ONLINE' ? '0 0 8px #10b981' : '0 0 8px #f59e0b'
              }} className="pulse-circle" />
              <span style={{ color: 'var(--text-secondary)' }}>API:</span>
              <strong style={{ color: apiHealth?.status === 'ONLINE' ? '#34d399' : '#fbbf24' }}>
                {apiHealth?.status || 'STANDBY'}
              </strong>
            </div>

            {/* Vernacular Language Switcher */}
            <button
              onClick={() => setIsLanguageModalOpen(true)}
              className="glass-pill glow-hover"
              style={{
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#67e8f9',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                background: 'rgba(6, 182, 212, 0.1)',
                cursor: 'pointer'
              }}
              title="Change Regional Language"
            >
              <Globe size={13} color="#22d3ee" /> {currentLanguage.toUpperCase()} 🌐
            </button>

            {/* Daily Digest Trigger */}
            <button
              onClick={() => setIsDigestModalOpen(true)}
              className="glass-pill glow-hover"
              style={{
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#fef08a',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                background: 'rgba(234, 179, 8, 0.1)',
                cursor: 'pointer'
              }}
              title="View Today's Morning Study Digest"
            >
              <Sun size={14} color="#facc15" /> Daily Digest ☀️
            </button>

            {/* User Account / Sign In */}
            {isAuthenticated && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="glass-pill"
                  style={{
                    padding: '4px 12px 4px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  <img
                    src={user.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                    alt={user.fullName}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{user.fullName}</div>
                    <div style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 600 }}>{user.role}</div>
                  </div>
                </button>
                <button
                  onClick={logout}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.75rem' }}
                  title="Logout"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <LogIn size={15} />
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px', flex: 1, width: '100%' }}>
        
        {activeView === 'DASHBOARD' && (
          <DashboardCockpit
            profile={profile}
            summary={summary}
            onEditProfile={() => setIsProfileModalOpen(true)}
            onClaimStreak={handleClaimStreak}
            isClaimingStreak={isClaimingStreak}
            onFocusSessionComplete={handleFocusSessionComplete}
            onOpenRoadmap={() => setActiveView('ROADMAP')}
          />
        )}

        {activeView === 'PLANNER' && (
          <StudyPlannerView
            tasks={tasks}
            weeklySchedule={weeklySchedule}
            onToggleTask={handleToggleTask}
            onCreateTask={handleCreateTask}
            onDeleteTask={handleDeleteTask}
            onStartFocusForTask={(_title, _mins) => setActiveView('DASHBOARD')}
          />
        )}

        {activeView === 'SYLLABUS' && (
          <SyllabusManagerView
            subjects={subjects}
            overview={syllabusOverview}
            onToggleTopic={handleToggleTopic}
            onCreateSubject={handleCreateSubject}
            onAddTopic={handleAddTopic}
            onDeleteTopic={handleDeleteTopic}
          />
        )}

        {activeView === 'NOTES' && (
          <NotesHubView
            onTriggerAiStudy={(content) => {
              setInitialAiStudyContent(content);
              setActiveView('AI_STUDY');
            }}
          />
        )}

        {activeView === 'AI_STUDY' && (
          <AiStudyAssistantView initialContent={initialAiStudyContent} />
        )}

        {activeView === 'REVISION' && (
          <RevisionEngineView
            onReviewCompleted={(earnedXp) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + earnedXp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - earnedXp),
              }));
            }}
          />
        )}

        {activeView === 'EXAM_PREP' && (
          <ExamPrepEngineView
            onMilestoneToggled={(earnedXp) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + earnedXp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - earnedXp),
              }));
            }}
          />
        )}

        {activeView === 'QUESTION_BANK' && (
          <QuestionBankView />
        )}

        {activeView === 'MOCK_TEST' && (
          <MockTestSimulatorView
            onTestSubmitted={(earnedXp) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + earnedXp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - earnedXp),
              }));
            }}
          />
        )}

        {activeView === 'ANALYTICS' && (
          <PerformanceAnalyticsView
            onTriggerPractice={() => setActiveView('QUESTION_BANK')}
            onTriggerAiStudy={() => setActiveView('AI_STUDY')}
          />
        )}

        {activeView === 'CAREER' && (
          <CareerIntelligenceView
            onAddSkillToPlanner={(skillTitle) => {
              handleCreateTask({
                title: `Master skill: ${skillTitle}`,
                description: `Acquire proficiency in ${skillTitle} to bridge career gap.`,
                subjectName: 'Career & Skills',
                subjectColor: '#f59e0b',
                dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
                dueTime: '05:00 PM',
                priority: 'HIGH',
                estimatedMinutes: 60,
              });
              setActiveView('PLANNER');
            }}
          />
        )}

        {activeView === 'RESUME' && (
          <ResumeAtsOptimizerView />
        )}

        {activeView === 'INTERNSHIPS' && (
          <InternshipRadarView />
        )}

        {activeView === 'SCHOLARSHIPS' && (
          <ScholarshipFinderView />
        )}

        {activeView === 'DEADLINES' && (
          <DeadlineAlertsView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
          />
        )}

        {activeView === 'AI_MENTOR' && (
          <AiMentorView
            onNavigateView={(view) => setActiveView(view as any)}
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
          />
        )}

        {activeView === 'COMMUNITY' && (
          <CommunityHubView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
          />
        )}

        {activeView === 'LEADERBOARD' && (
          <LeaderboardView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
          />
        )}

        {activeView === 'OCR_SCANNER' && (
          <OcrScannerView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
            onNavigateView={(v) => setActiveView(v as any)}
          />
        )}

        {activeView === 'STUDY_ROOMS' && (
          <SocialStudyRoomsView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
          />
        )}

        {activeView === 'VOICE_TUTOR' && (
          <AiVoiceTutorView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
            onNavigateView={(v) => setActiveView(v as any)}
          />
        )}

        {activeView === 'CONCEPT_GRAPH' && (
          <ConceptGraphView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
            onNavigateView={(v) => setActiveView(v as any)}
          />
        )}

        {activeView === 'QUIZ_BATTLE' && (
          <QuizBattleArenaView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
            onNavigateView={(v) => setActiveView(v as any)}
          />
        )}

        {activeView === 'DOCUMENT_ANNOTATOR' && (
          <SmartDocumentAnnotatorView />
        )}

        {activeView === 'CUSTOM_PAPER' && (
          <CustomPaperGeneratorView />
        )}

        {activeView === 'FOCUS_GARDEN' && (
          <FocusGardenView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
          />
        )}

        {activeView === 'AI_PODCAST' && (
          <AiPodcastStudioView />
        )}

        {activeView === 'CODE_SANDBOX' && (
          <CodeSandboxView />
        )}

        {activeView === 'RANK_PREDICTOR' && (
          <RankPredictorMistakeVaultView />
        )}

        {activeView === 'VIRTUAL_CAMPUS' && (
          <VirtualCampusView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
          />
        )}

        {activeView === 'SLIDE_GENERATOR' && (
          <AiSlideGeneratorView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
          />
        )}

        {activeView === 'MOCK_INTERVIEW' && (
          <AiMockInterviewView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
          />
        )}

        {activeView === 'NOTES_MARKETPLACE' && (
          <NotesMarketplaceView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
          />
        )}

        {activeView === 'CIRCADIAN_FOCUS' && (
          <CircadianFocusHabitView
            onAddXp={(xp, reason) => {
              setProfile((p) => ({
                ...p,
                xpPoints: p.xpPoints + xp,
                xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
              }));
              console.log(`XP Earned: +${xp} (${reason})`);
            }}
          />
        )}

        {activeView === 'ROADMAP' && (
          <div>
            {/* Top Progress & Banner */}
            <section style={{ marginBottom: '24px' }}>
              <div className="glass-panel glow-hover" style={{
                padding: '24px 32px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)'
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span className="badge badge-completed">
                        <CheckCircle2 size={12} /> ALL 45 PHASES FULLY OPERATIONAL (100% DONE!) 🏆
                      </span>
                      <span className="badge badge-active">APEX EDITION v5.0</span>
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                      Master Execution Matrix <span className="gradient-text">(45 Phases)</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                      Complete roadmap tracking and architecture deliverables across Study, Exams, Career & Mentor layers.
                    </p>
                  </div>

                  {/* Progress Box */}
                  <div className="glass-panel" style={{ padding: '16px 20px', minWidth: '240px', backgroundColor: 'rgba(9, 13, 22, 0.6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Roadmap</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{progressPercent}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        background: 'var(--gradient-primary)',
                        borderRadius: '4px',
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span style={{ color: '#34d399', fontWeight: 600 }}>{completedCount} Completed</span>
                      <span>{PHASES.length - completedCount} Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Pillar Overview Cards */}
            <section style={{ marginBottom: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div className="glass-panel glow-hover" style={{ padding: '20px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: '#818cf8' }}>
                    <BookOpen size={20} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Study System</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Notes, Syllabus, Time-blocking Planner, and Spaced-Repetition Revision.
                  </p>
                  <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Phases 05 – 09 (In Progress)</div>
                </div>

                <div className="glass-panel glow-hover" style={{ padding: '20px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: '#22d3ee' }}>
                    <FileCheck2 size={20} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Exam & Practice</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    PYQ Repositories, Live Timed Mocks, Sectional Analytics & Weak-area radar.
                  </p>
                  <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>Phases 10 – 13</div>
                </div>

                <div className="glass-panel glow-hover" style={{ padding: '20px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: '#fbbf24' }}>
                    <Briefcase size={20} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Career & Alerts</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    ATS Resume Builder, Skill Gap Analyzer, Scholarships & Deadline Push Alerts.
                  </p>
                  <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 600 }}>Phases 14 – 18</div>
                </div>

                <div className="glass-panel glow-hover" style={{ padding: '20px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: '#c084fc' }}>
                    <Sparkles size={20} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>AI Personal Mentor</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Central guidance engine correlating notes, test scores & career milestones.
                  </p>
                  <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 600 }}>Phases 19 – 20</div>
                </div>
              </div>
            </section>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px' }}>
              <div className="glass-pill" style={{ padding: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {(['ALL', 'FOUNDATION', 'STUDY', 'EXAM', 'CAREER', 'AI_COMMUNITY'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                      backgroundColor: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
                      color: activeTab === tab ? '#ffffff' : 'var(--text-secondary)'
                    }}
                  >
                    {tab.replace('_', ' & ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Phase Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {filteredPhases.map((phase) => (
                <div
                  key={phase.id}
                  className="glass-panel glow-hover"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: phase.status === 'COMPLETED' ? '3px solid var(--accent-emerald)' : '1px solid var(--border-glass)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)'
                      }}>
                        PHASE {phase.number}
                      </span>
                      {phase.status === 'COMPLETED' ? (
                        <span className="badge badge-completed">
                          <CheckCircle2 size={12} /> COMPLETED
                        </span>
                      ) : (
                        <span className="badge badge-pending">
                          <Clock size={12} /> QUEUED
                        </span>
                      )}
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>{phase.name}</h4>

                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {phase.deliverables.map((item, idx) => (
                        <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: phase.status === 'COMPLETED' ? 'var(--accent-emerald)' : 'var(--text-muted)'
                          }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                      {phase.pillar}
                    </span>
                    {phase.status === 'COMPLETED' ? (
                      <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Active in System</span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Next in queue</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
      <DailyStudyDigestModal
        isOpen={isDigestModalOpen}
        onClose={() => setIsDigestModalOpen(false)}
        onAddXp={(xp, reason) => {
          setProfile((p) => ({
            ...p,
            xpPoints: p.xpPoints + xp,
            xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
          }));
          console.log(`XP Earned: +${xp} (${reason})`);
        }}
        onNavigateView={(v) => setActiveView(v as any)}
      />

      {/* Floating Persistent Real-Time Focus Audio Player Widget */}
      <FocusAudioPlayerWidget />

      {/* Progressive Web App Install & Offline Indicator */}
      <PwaInstallPromptWidget
        onAddXp={(xp, reason) => {
          setProfile((p) => ({
            ...p,
            xpPoints: p.xpPoints + xp,
            xpToNextLevel: Math.max(0, p.xpToNextLevel - xp),
          }));
          console.log(`XP Earned: +${xp} (${reason})`);
        }}
      />

      {/* Vernacular Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={(lang) => setCurrentLanguage(lang)}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-glass)',
        padding: '20px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        marginTop: 'auto',
        backgroundColor: 'rgba(9, 13, 22, 0.95)'
      }}>
        StudentLife OS 5.0 (Apex Edition) &bull; 45 Phases Fully Operational &bull; 100% Production Ready 🏆
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
