import { Router } from 'express';
import { ErgonomicWellnessController } from '../controllers/ergonomic-wellness.controller';

const router = Router();

router.get('/profile', ErgonomicWellnessController.getProfile);
router.post('/log', ErgonomicWellnessController.logSession);
router.post('/action', ErgonomicWellnessController.recordAction);

export default router;
