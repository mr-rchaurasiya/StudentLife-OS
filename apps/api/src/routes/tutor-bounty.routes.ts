import { Router } from 'express';
import { TutorBountyController } from '../controllers/tutor-bounty.controller';

const router = Router();

router.get('/bounties', TutorBountyController.getBounties);
router.post('/create', TutorBountyController.createBounty);
router.post('/accept', TutorBountyController.acceptBounty);

export default router;
