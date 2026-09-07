import { Router } from 'express';
import { mentalResilienceController } from '../controllers/mental-resilience.controller';

const router = Router();

router.get('/state', (req, res) => mentalResilienceController.getSanctumState(req, res));
router.post('/checkin', (req, res) => mentalResilienceController.checkInResilience(req, res));
router.post('/breathing/mode', (req, res) => mentalResilienceController.setBreathingMode(req, res));

export default router;
