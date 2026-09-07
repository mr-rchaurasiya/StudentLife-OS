import { Router } from 'express';
import { FusionTokamakController } from '../controllers/fusion-tokamak.controller';

const router = Router();
const controller = new FusionTokamakController();

router.post('/simulate', (req, res) => controller.simulate(req, res));

export default router;
