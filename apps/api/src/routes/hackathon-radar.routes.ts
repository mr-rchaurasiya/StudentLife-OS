import { Router } from 'express';
import { HackathonRadarController } from '../controllers/hackathon-radar.controller';

const router = Router();

router.get('/events', HackathonRadarController.getEvents);
router.post('/match-teammates', HackathonRadarController.findTeammates);

export default router;
