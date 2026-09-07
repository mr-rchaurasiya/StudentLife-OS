import { Router } from 'express';
import { HoloSimulationsController } from '../controllers/holo-simulations.controller';

const router = Router();

router.get('/models', HoloSimulationsController.getSimulations);
router.post('/run', HoloSimulationsController.runSimulation);

export default router;
