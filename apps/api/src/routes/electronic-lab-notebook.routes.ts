import { Router } from 'express';
import { electronicLabNotebookController } from '../controllers/electronic-lab-notebook.controller';

const router = Router();

router.get('/logs', electronicLabNotebookController.getLogs);
router.post('/log', electronicLabNotebookController.createLog);
router.post('/log/:id/toggle-step', electronicLabNotebookController.toggleStep);

export default router;
