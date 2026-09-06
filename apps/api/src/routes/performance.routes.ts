import { Router } from 'express';
import { PerformanceController } from '../controllers/performance.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/summary', authenticateToken as any, PerformanceController.getSummary);
router.get('/weak-areas', authenticateToken as any, PerformanceController.getWeakAreas);

export default router;
