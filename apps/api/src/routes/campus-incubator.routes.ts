import { Router } from 'express';
import { campusIncubatorController } from '../controllers/campus-incubator.controller';

const router = Router();

router.get('/projects', (req, res) => campusIncubatorController.getProjects(req, res));
router.post('/generate-deck', (req, res) => campusIncubatorController.generatePitchDeck(req, res));

export default router;
