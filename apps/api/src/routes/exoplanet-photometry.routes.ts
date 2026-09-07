import { Router } from 'express';
import { ExoplanetPhotometryController } from '../controllers/exoplanet-photometry.controller';

const router = Router();
const controller = new ExoplanetPhotometryController();

router.post('/analyze', (req, res) => controller.analyze(req, res));

export default router;
