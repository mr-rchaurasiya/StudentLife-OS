import { Router } from 'express';
import { academicIntegrityController } from '../controllers/academic-integrity.controller';

const router = Router();

router.get('/reports', (req, res) => academicIntegrityController.getReports(req, res));
router.post('/audit', (req, res) => academicIntegrityController.auditManuscript(req, res));

export default router;
