import { Router } from 'express';
import { BciSpellerController } from '../controllers/bci-speller.controller';

const router = Router();
const controller = new BciSpellerController();

router.post('/process-epoch', (req, res) => controller.processEpoch(req, res));

export default router;
