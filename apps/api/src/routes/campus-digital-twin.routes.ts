import { Router } from 'express';
import { campusDigitalTwinController } from '../controllers/campus-digital-twin.controller';

const router = Router();

router.get('/state', (req, res) => campusDigitalTwinController.getDigitalTwinState(req, res));
router.post('/route', (req, res) => campusDigitalTwinController.findCampusRoute(req, res));

export default router;
