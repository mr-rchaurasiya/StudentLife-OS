import { Router } from 'express';
import { SocraticDebateController } from '../controllers/socratic-debate.controller';

const router = Router();

router.post('/start', SocraticDebateController.startDebate);
router.post('/rebut', SocraticDebateController.submitArgument);
router.get('/:sessionId', SocraticDebateController.getSession);

export default router;
