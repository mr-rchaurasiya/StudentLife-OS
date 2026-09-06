import { Router } from 'express';
import { GamificationController } from '../controllers/gamification.controller';

const router = Router();

router.get('/dashboard', GamificationController.getDashboardData);
router.post('/badges/:badgeId/claim', GamificationController.claimBadge);

export default router;
