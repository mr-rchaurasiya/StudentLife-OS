import { Router } from 'express';
import { AiWhiteboardController } from '../controllers/ai-whiteboard.controller';

const router = Router();

router.get('/diagrams', AiWhiteboardController.getDiagrams);
router.post('/generate', AiWhiteboardController.generateAiDiagram);
router.post('/save', AiWhiteboardController.saveDiagram);

export default router;
