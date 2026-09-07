import { Router } from 'express';
import { ExamTrendController } from '../controllers/exam-trend.controller';

const router = Router();

router.get('/forecast', ExamTrendController.getForecast);
router.post('/predict', ExamTrendController.predictTrends);

export default router;
