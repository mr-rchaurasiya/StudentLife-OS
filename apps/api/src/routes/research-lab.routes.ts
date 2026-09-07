import { Router } from 'express';
import { ResearchLabController } from '../controllers/research-lab.controller';

const router = Router();

router.get('/proposals', ResearchLabController.getProposals);
router.post('/run-agents', ResearchLabController.runAgents);

export default router;
