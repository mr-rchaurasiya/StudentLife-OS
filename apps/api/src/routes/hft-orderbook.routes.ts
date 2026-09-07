import { Router } from 'express';
import { HftOrderBookController } from '../controllers/hft-orderbook.controller';

const router = Router();
const controller = new HftOrderBookController();

router.get('/snapshot', (req, res) => controller.getSnapshot(req, res));
router.post('/trade', (req, res) => controller.executeTrade(req, res));

export default router;
