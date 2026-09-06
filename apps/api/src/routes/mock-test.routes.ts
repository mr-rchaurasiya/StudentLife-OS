import { Router } from 'express';
import { MockTestController } from '../controllers/mock-test.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken as any, MockTestController.getTemplates);
router.get('/history', authenticateToken as any, MockTestController.getHistory);
router.get('/:id', authenticateToken as any, MockTestController.getTemplateById);
router.post('/submit', authenticateToken as any, MockTestController.submitTest);

export default router;
