import { Router } from 'express';
import { AiMentorController } from '../controllers/ai-mentor.controller';

const router = Router();

router.get('/holistic-report', AiMentorController.getHolisticReport);
router.post('/actions/:id/complete', AiMentorController.completeAction);
router.post('/chat', AiMentorController.chatWithMentor);

export default router;
