import { Router } from 'express';
import { CareerController } from '../controllers/career.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/roles', authenticateToken as any, CareerController.getRoles);
router.get('/roles/:id', authenticateToken as any, CareerController.getRoleById);
router.get('/roles/:id/skill-gap', authenticateToken as any, CareerController.analyzeSkillGap);

export default router;
