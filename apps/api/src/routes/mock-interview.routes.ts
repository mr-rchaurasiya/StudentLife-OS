import { Router } from 'express';
import { mockInterviewController } from '../controllers/mock-interview.controller';

const router = Router();

router.post('/start', mockInterviewController.startInterview);
router.post('/submit', mockInterviewController.submitResponse);
router.get('/sessions/:id', mockInterviewController.getSession);

export default router;
