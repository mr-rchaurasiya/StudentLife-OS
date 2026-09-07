import { Router } from 'express';
import { NeuralFlowController } from '../controllers/neural-flow.controller';

const router = Router();

router.get('/telemetry', NeuralFlowController.getTelemetry);
router.post('/adjust', NeuralFlowController.adjustFrequency);

export default router;
