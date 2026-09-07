import { Router } from 'express';
import { studyGuildDaoController } from '../controllers/study-guild-dao.controller';

const router = Router();

router.get('/proposals', studyGuildDaoController.getProposals);
router.post('/cast-vote', studyGuildDaoController.castVote);
router.post('/create-proposal', studyGuildDaoController.createProposal);

export default router;
