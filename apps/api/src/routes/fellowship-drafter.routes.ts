import { Router } from 'express';
import { fellowshipDrafterController } from '../controllers/fellowship-drafter.controller';

const router = Router();

router.get('/proposals', (req, res) => fellowshipDrafterController.getProposals(req, res));
router.post('/draft', (req, res) => fellowshipDrafterController.draftProposal(req, res));

export default router;
