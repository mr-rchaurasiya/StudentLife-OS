import { Router } from 'express';
import { knowledgeOlympiadController } from '../controllers/knowledge-olympiad.controller';

const router = Router();

router.get('/match', knowledgeOlympiadController.getMatchState);
router.post('/submit-answer', knowledgeOlympiadController.submitAnswer);

export default router;
