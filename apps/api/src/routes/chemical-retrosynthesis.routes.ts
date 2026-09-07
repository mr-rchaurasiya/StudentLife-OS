import { Router } from 'express';
import { chemicalRetrosynthesisController } from '../controllers/chemical-retrosynthesis.controller';

const router = Router();

router.get('/pathway/:id?', chemicalRetrosynthesisController.getPathway);
router.post('/plan', chemicalRetrosynthesisController.plan);

export default router;
