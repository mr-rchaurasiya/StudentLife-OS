import { Router } from 'express';
import { kernelProfilerController } from '../controllers/kernel-profiler.controller';

const router = Router();

router.post('/analyze', kernelProfilerController.analyze);
router.get('/profile/:id', kernelProfilerController.getProfile);

export default router;
