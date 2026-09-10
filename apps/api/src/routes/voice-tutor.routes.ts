import { Router } from 'express';
import { voiceTutorController } from '../controllers/voice-tutor.controller';

const router = Router();

router.get('/session', (req, res) => voiceTutorController.getSession(req, res));
router.post('/ask', (req, res) => voiceTutorController.askVoice(req, res));

export { router as voiceTutorRouter };
export default router;
