import { Router } from 'express';
import { QuestionBankController } from '../controllers/question-bank.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public / auth accessible routes
router.get('/stats', authenticateToken as any, QuestionBankController.getStats);
router.get('/', authenticateToken as any, QuestionBankController.getQuestions);
router.get('/:id', authenticateToken as any, QuestionBankController.getQuestionById);
router.post('/submit', authenticateToken as any, QuestionBankController.submitAnswer);
router.post('/:id/bookmark', authenticateToken as any, QuestionBankController.toggleBookmark);

export default router;
