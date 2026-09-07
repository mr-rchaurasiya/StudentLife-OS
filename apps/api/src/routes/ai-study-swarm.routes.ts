import { Router } from 'express';
import { aiStudySwarmController } from '../controllers/ai-study-swarm.controller';

const router = Router();

router.get('/session', (req, res) => aiStudySwarmController.getSession(req, res));
router.post('/start', (req, res) => aiStudySwarmController.startSession(req, res));
router.post('/query', (req, res) => aiStudySwarmController.postQuery(req, res));
router.post('/viva/submit', (req, res) => aiStudySwarmController.submitVivaAnswer(req, res));

export default router;
