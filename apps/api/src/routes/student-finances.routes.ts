import { Router } from 'express';
import { StudentFinancesController } from '../controllers/student-finances.controller';

const router = Router();

router.get('/budget', StudentFinancesController.getBudget);
router.post('/expense', StudentFinancesController.addExpense);
router.post('/calculate-roi', StudentFinancesController.calculateRoi);

export default router;
