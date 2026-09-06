import { Router } from 'express';
import { internshipController } from '../controllers/internship.controller';

const router = Router();

router.get('/', (req, res) => internshipController.getOpportunities(req, res));
router.patch('/:id/bookmark', (req, res) => internshipController.toggleBookmark(req, res));
router.get('/tracked', (req, res) => internshipController.getTrackedApplications(req, res));
router.post('/tracked', (req, res) => internshipController.createTrackedApplication(req, res));
router.patch('/tracked/:id', (req, res) => internshipController.updateApplication(req, res));
router.delete('/tracked/:id', (req, res) => internshipController.deleteApplication(req, res));
router.post('/outreach-template', (req, res) => internshipController.generateColdOutreach(req, res));

export default router;
