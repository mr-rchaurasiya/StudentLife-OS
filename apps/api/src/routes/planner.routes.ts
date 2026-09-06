import { Router } from 'express';
import { PlannerController } from '../controllers/planner.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken as any);

router.get('/tasks', PlannerController.getTasks as any);
router.post('/tasks', PlannerController.createTask as any);
router.put('/tasks/:id', PlannerController.updateTask as any);
router.patch('/tasks/:id/toggle', PlannerController.toggleTask as any);
router.delete('/tasks/:id', PlannerController.deleteTask as any);
router.get('/weekly', PlannerController.getWeeklySchedule as any);

export default router;
