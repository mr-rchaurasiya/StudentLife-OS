import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV } from './config/env';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import dashboardRoutes from './routes/dashboard.routes';
import plannerRoutes from './routes/planner.routes';
import syllabusRoutes from './routes/syllabus.routes';
import notesRoutes from './routes/notes.routes';
import aiStudyRoutes from './routes/ai-study.routes';
import revisionRoutes from './routes/revision.routes';
import examPrepRoutes from './routes/exam-prep.routes';
import questionBankRoutes from './routes/question-bank.routes';
import mockTestRoutes from './routes/mock-test.routes';
import performanceRoutes from './routes/performance.routes';
import careerRoutes from './routes/career.routes';
import resumeRoutes from './routes/resume.routes';
import internshipRoutes from './routes/internship.routes';
import scholarshipRoutes from './routes/scholarship.routes';
import deadlineRoutes from './routes/deadline.routes';
import aiMentorRoutes from './routes/ai-mentor.routes';
import communityRoutes from './routes/community.routes';
import audioRoutes from './routes/audio.routes';
import gamificationRoutes from './routes/gamification.routes';
import ocrRoutes from './routes/ocr.routes';
import { studyRoomsRouter } from './routes/study-rooms.routes';
import { notificationsPipelineRouter } from './routes/notifications-pipeline.routes';
import { voiceTutorRouter } from './routes/voice-tutor.routes';
import { conceptGraphRouter } from './routes/concept-graph.routes';
import { quizBattleRouter } from './routes/quiz-battle.routes';
import documentAnnotatorRouter from './routes/document-annotator.routes';
import customPaperRouter from './routes/custom-paper.routes';
import focusGardenRouter from './routes/focus-garden.routes';
import aiPodcastRouter from './routes/ai-podcast.routes';
import codeSandboxRouter from './routes/code-sandbox.routes';
import rankPredictorRouter from './routes/rank-predictor.routes';
import virtualCampusRouter from './routes/virtual-campus.routes';
import slideGeneratorRouter from './routes/slide-generator.routes';
import mockInterviewRouter from './routes/mock-interview.routes';
import notesMarketplaceRouter from './routes/notes-marketplace.routes';
import circadianFocusRouter from './routes/circadian-focus.routes';
import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();

// Security and Logging Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [ENV.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(ENV.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Route Registrations
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/ai-study', aiStudyRoutes);
app.use('/api/revision', revisionRoutes);
app.use('/api/exam-prep', examPrepRoutes);
app.use('/api/question-bank', questionBankRoutes);
app.use('/api/mock-tests', mockTestRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/deadlines', deadlineRoutes);
app.use('/api/ai-mentor', aiMentorRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/study-rooms', studyRoomsRouter);
app.use('/api/notifications', notificationsPipelineRouter);
app.use('/api/voice-tutor', voiceTutorRouter);
app.use('/api/concept-graph', conceptGraphRouter);
app.use('/api/quiz-battle', quizBattleRouter);
app.use('/api/document-annotator', documentAnnotatorRouter);
app.use('/api/custom-paper', customPaperRouter);
app.use('/api/focus-garden', focusGardenRouter);
app.use('/api/ai-podcast', aiPodcastRouter);
app.use('/api/code-sandbox', codeSandboxRouter);
app.use('/api/rank-predictor', rankPredictorRouter);
app.use('/api/virtual-campus', virtualCampusRouter);
app.use('/api/slide-generator', slideGeneratorRouter);
app.use('/api/mock-interview', mockInterviewRouter);
app.use('/api/notes-marketplace', notesMarketplaceRouter);
app.use('/api/circadian-focus', circadianFocusRouter);

// Global Error Handler
app.use(errorHandler);

const PORT = ENV.PORT;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 StudentLife OS API Server Started!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth Endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`👤 Profile Endpoints: http://localhost:${PORT}/api/profile`);
  console.log(`📊 Dashboard Endpoints: http://localhost:${PORT}/api/dashboard`);
  console.log(`📅 Planner Endpoints: http://localhost:${PORT}/api/planner`);
  console.log(`📚 Syllabus Endpoints: http://localhost:${PORT}/api/syllabus`);
  console.log(`📝 Notes Endpoints: http://localhost:${PORT}/api/notes`);
  console.log(`✨ AI Study Endpoints: http://localhost:${PORT}/api/ai-study`);
  console.log(`🔄 Revision Endpoints: http://localhost:${PORT}/api/revision`);
  console.log(`🎯 Exam Prep Endpoints: http://localhost:${PORT}/api/exam-prep`);
  console.log(`📖 Question Bank Endpoints: http://localhost:${PORT}/api/question-bank`);
  console.log(`⏱️ Mock Test Simulator Endpoints: http://localhost:${PORT}/api/mock-tests`);
  console.log(`📈 Performance Analytics Endpoints: http://localhost:${PORT}/api/performance`);
  console.log(`💼 Career Intelligence Endpoints: http://localhost:${PORT}/api/career`);
  console.log(`🌐 Mode: ${ENV.NODE_ENV}`);
  console.log(`=========================================`);
});

export default app;
