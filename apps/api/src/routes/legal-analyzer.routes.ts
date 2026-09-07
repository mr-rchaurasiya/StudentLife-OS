import { Router } from 'express';
import { LegalAnalyzerController } from '../controllers/legal-analyzer.controller';

const router = Router();
const controller = new LegalAnalyzerController();

router.post('/analyze', (req, res) => controller.analyze(req, res));

export default router;
