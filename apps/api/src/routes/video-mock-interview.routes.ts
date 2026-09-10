import { Router } from 'express';
import { videoMockInterviewController } from '../controllers/video-mock-interview.controller';

const router = Router();

router.post('/start', (req, res) => videoMockInterviewController.startSession(req, res));
router.post('/evaluate', (req, res) => videoMockInterviewController.evaluateAnswer(req, res));
router.get('/:sessionId', (req, res) => videoMockInterviewController.getSession(req, res));

export default router;
