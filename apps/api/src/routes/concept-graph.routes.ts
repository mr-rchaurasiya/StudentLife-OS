import { Router } from 'express';
import { conceptGraphController } from '../controllers/concept-graph.controller';

const router = Router();

router.get('/subjects', conceptGraphController.getSubjectList);
router.get('/:subjectId', conceptGraphController.getSubjectGraph);
router.patch('/:subjectId/nodes/:nodeId/mastery', conceptGraphController.updateMastery);

export const conceptGraphRouter = router;
