import { Router } from 'express';
import { SyllabusController } from '../controllers/syllabus.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken as any);

router.get('/subjects', SyllabusController.getSubjects as any);
router.post('/subjects', SyllabusController.createSubject as any);
router.post('/subjects/:subjectId/topics', SyllabusController.addTopic as any);
router.patch('/topics/:topicId/toggle', SyllabusController.toggleTopic as any);
router.delete('/topics/:topicId', SyllabusController.deleteTopic as any);
router.get('/overview', SyllabusController.getOverview as any);

export default router;
