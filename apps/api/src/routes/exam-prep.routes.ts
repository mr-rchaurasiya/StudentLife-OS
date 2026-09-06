import { Router } from 'express';
import { ExamPrepController } from '../controllers/exam-prep.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Protect all exam prep endpoints
router.use(authenticateToken as any);

router.get('/profiles', ExamPrepController.getProfiles as any);
router.post('/profiles', ExamPrepController.createProfile as any);
router.put('/profiles/:id', ExamPrepController.updateProfile as any);
router.patch('/profiles/:id/milestones/:milestoneId', ExamPrepController.toggleMilestone as any);
router.delete('/profiles/:id', ExamPrepController.deleteProfile as any);

export default router;
