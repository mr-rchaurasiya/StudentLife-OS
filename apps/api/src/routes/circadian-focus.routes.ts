import { Router } from 'express';
import { circadianFocusController } from '../controllers/circadian-focus.controller';

const router = Router();

router.get('/profile', circadianFocusController.getProfile);
router.post('/habit', circadianFocusController.updateHabit);

export default router;
