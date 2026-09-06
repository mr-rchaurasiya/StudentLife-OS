import { Router } from 'express';
import { RevisionController } from '../controllers/revision.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Protect all revision endpoints with JWT auth
router.use(authenticateToken as any);

router.get('/queue', RevisionController.getQueue as any);
router.get('/stats', RevisionController.getStats as any);
router.post('/review', RevisionController.reviewItem as any);

export default router;
