import { Router } from 'express';
import { astrodynamicsSimController } from '../controllers/astrodynamics-sim.controller';

const router = Router();

router.get('/orbit-state', astrodynamicsSimController.getOrbitState);
router.post('/propagate', astrodynamicsSimController.propagate);

export default router;
