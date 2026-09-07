import { Router } from 'express';
import { CarbonMarketController } from '../controllers/carbon-market.controller';

const router = Router();
const controller = new CarbonMarketController();

router.get('/report', (req, res) => controller.getReport(req, res));
router.post('/calculate', (req, res) => controller.calculate(req, res));
router.post('/trade', (req, res) => controller.trade(req, res));

export default router;
