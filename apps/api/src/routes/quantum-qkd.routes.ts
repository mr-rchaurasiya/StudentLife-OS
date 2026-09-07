import { Router } from 'express';
import { QuantumQkdController } from '../controllers/quantum-qkd.controller';

const router = Router();
const controller = new QuantumQkdController();

router.post('/simulate', (req, res) => controller.simulateProtocol(req, res));

export default router;
