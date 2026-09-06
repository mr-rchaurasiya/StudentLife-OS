import { Router } from 'express';
import { quizBattleController } from '../controllers/quiz-battle.controller';

const router = Router();

router.post('/find-match', quizBattleController.findMatch);
router.post('/submit-answer', quizBattleController.submitAnswer);
router.post('/matches/:matchId/next-round', quizBattleController.nextRound);

export const quizBattleRouter = router;
