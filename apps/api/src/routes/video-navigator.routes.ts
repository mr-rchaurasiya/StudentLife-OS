import { Router } from 'express';
import { VideoNavigatorController } from '../controllers/video-navigator.controller';

const router = Router();

router.get('/lectures', VideoNavigatorController.getLectures);
router.post('/analyze', VideoNavigatorController.analyzeLecture);

export default router;
