import { Router } from 'express';
import { scholarTrackerController } from '../controllers/scholar-tracker.controller';

const router = Router();

router.get('/profile', scholarTrackerController.getProfile);
router.post('/track', scholarTrackerController.track);

export default router;
