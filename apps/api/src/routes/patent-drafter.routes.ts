import { Router } from 'express';
import { PatentDrafterController } from '../controllers/patent-drafter.controller';

const router = Router();

router.get('/drafts', PatentDrafterController.getDrafts);
router.post('/draft', PatentDrafterController.draftPatent);

export default router;
