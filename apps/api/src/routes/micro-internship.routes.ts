import { Router } from 'express';
import { microInternshipController } from '../controllers/micro-internship.controller';

const router = Router();

router.get('/gigs', microInternshipController.getGigs);
router.post('/submit-proof', microInternshipController.submitProof);
router.post('/gig/:id/release-escrow', microInternshipController.releaseEscrow);

export default router;
