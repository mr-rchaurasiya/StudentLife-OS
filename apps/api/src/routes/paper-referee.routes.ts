import { Router } from 'express';
import { PaperRefereeController } from '../controllers/paper-referee.controller';

const router = Router();
const controller = new PaperRefereeController();

router.post('/review', (req, res) => controller.reviewSubmission(req, res));

export default router;
