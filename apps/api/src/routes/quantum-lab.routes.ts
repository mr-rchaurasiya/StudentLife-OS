import { Router } from 'express';
import { quantumLabController } from '../controllers/quantum-lab.controller';

const router = Router();

router.post('/simulate', (req, res) => quantumLabController.simulateCircuit(req, res));

export default router;
