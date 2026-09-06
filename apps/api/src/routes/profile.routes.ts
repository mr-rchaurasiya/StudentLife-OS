import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All profile routes require authentication
router.use(authenticateToken as any);

router.get('/', ProfileController.getProfile as any);
router.put('/', ProfileController.updateProfile as any);
router.post('/streak', ProfileController.claimStreak as any);

export default router;
