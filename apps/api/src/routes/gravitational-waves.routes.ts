import { Router } from 'express';
import { GravitationalWavesController } from '../controllers/gravitational-waves.controller';

const router = Router();
const controller = new GravitationalWavesController();

router.post('/simulate', (req, res) => controller.simulate(req, res));

export default router;
