import { Router } from 'express';
import { campusTransitController } from '../controllers/campus-transit.controller';

const router = Router();

router.get('/state', (req, res) => campusTransitController.getTransitState(req, res));
router.post('/carpool/book', (req, res) => campusTransitController.bookCarpoolRide(req, res));

export default router;
