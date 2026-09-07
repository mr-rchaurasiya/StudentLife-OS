import { Router } from 'express';
import { CampusPrintingController } from '../controllers/campus-printing.controller';

const router = Router();

router.get('/jobs', CampusPrintingController.getJobs);
router.post('/create', CampusPrintingController.createJob);

export default router;
