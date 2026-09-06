import { Router } from 'express';
import { voiceTutorController } from '../controllers/voice-tutor.controller';

const router = Router();

router.post('/respond', voiceTutorController.respondToVoice);
router.get('/drills', voiceTutorController.getDrills);
router.post('/evaluate', voiceTutorController.evaluateOralAnswer);

export const voiceTutorRouter = router;
