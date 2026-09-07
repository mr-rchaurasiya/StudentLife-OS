import { Router } from 'express';
import { AlumniRadarController } from '../controllers/alumni-radar.controller';

const router = Router();

router.get('/mentors', AlumniRadarController.getMentors);
router.get('/requests', AlumniRadarController.getRequests);
router.post('/request-chat', AlumniRadarController.requestChat);

export default router;
