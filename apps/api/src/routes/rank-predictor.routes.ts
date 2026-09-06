import { Router } from 'express';
import { rankPredictorController } from '../controllers/rank-predictor.controller';

const router = Router();

router.post('/predict', rankPredictorController.predictRank);
router.get('/mistakes', rankPredictorController.getAllMistakes);
router.post('/mistakes/retest', rankPredictorController.retestMistake);

export default router;
