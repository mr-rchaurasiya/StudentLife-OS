import { Router } from 'express';
import { AiStudyController } from '../controllers/ai-study.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Protect all AI study endpoints
router.use(authenticateToken as any);

router.get('/flashcards', AiStudyController.getFlashcards as any);
router.post('/summarize', AiStudyController.summarize as any);
router.post('/flashcards/generate', AiStudyController.generateFlashcards as any);
router.post('/flashcards/:id/grade', AiStudyController.gradeFlashcard as any);
router.post('/doubt-solver', AiStudyController.askDoubt as any);
router.post('/explain-concept', AiStudyController.explainConcept as any);

export default router;
