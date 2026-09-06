import { Router } from 'express';
import { customPaperController } from '../controllers/custom-paper.controller';

const router = Router();

router.get('/papers', customPaperController.getAllPapers);
router.get('/papers/:id', customPaperController.getPaperById);
router.post('/generate', customPaperController.generateMockPaper);

export default router;
