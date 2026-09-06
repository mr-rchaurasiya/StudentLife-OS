import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken as any);

router.get('/', DashboardController.getSummary as any);
router.post('/focus-session', DashboardController.logFocusSession as any);

export default router;
