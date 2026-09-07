import { Router } from 'express';
import { VentureSyndicateController } from '../controllers/venture-syndicate.controller';

const router = Router();
const controller = new VentureSyndicateController();

router.post('/generate-safe', (req, res) => controller.generateSafe(req, res));

export default router;
