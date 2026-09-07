import { Router } from 'express';
import { speedReaderController } from '../controllers/speed-reader.controller';

const router = Router();

router.get('/session', (req, res) => speedReaderController.getSession(req, res));
router.post('/start', (req, res) => speedReaderController.startSession(req, res));

export default router;
