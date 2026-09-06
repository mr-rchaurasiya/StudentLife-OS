import { Router } from 'express';
import { resumeController } from '../controllers/resume.controller';

const router = Router();

router.get('/', (req, res) => resumeController.getResume(req, res));
router.put('/', (req, res) => resumeController.updateResume(req, res));
router.post('/analyze-ats', (req, res) => resumeController.analyzeAts(req, res));
router.post('/optimize-bullet', (req, res) => resumeController.optimizeBullet(req, res));
router.post('/interview-qa', (req, res) => resumeController.generateInterviewQa(req, res));

export default router;
