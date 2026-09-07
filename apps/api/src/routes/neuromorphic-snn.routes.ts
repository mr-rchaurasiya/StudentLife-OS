import { Router } from 'express';
import { NeuromorphicSnnController } from '../controllers/neuromorphic-snn.controller';

const router = Router();
const controller = new NeuromorphicSnnController();

router.get('/simulation', (req, res) => controller.getSimulation(req, res));
router.post('/simulate', (req, res) => controller.runSimulation(req, res));

export default router;
