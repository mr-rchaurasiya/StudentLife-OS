import { Router } from 'express';
import { HostelNutritionController } from '../controllers/hostel-nutrition.controller';

const router = Router();

router.get('/menu', HostelNutritionController.getMenu);
router.get('/log', HostelNutritionController.getLog);
router.post('/log-intake', HostelNutritionController.logIntake);
router.post('/rate-meal', HostelNutritionController.rateMeal);

export default router;
