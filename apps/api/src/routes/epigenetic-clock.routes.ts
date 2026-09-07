import { Router } from 'express';
import { EpigeneticClockController } from '../controllers/epigenetic-clock.controller';

const router = Router();
const controller = new EpigeneticClockController();

router.post('/analyze', (req, res) => controller.analyze(req, res));

export default router;
