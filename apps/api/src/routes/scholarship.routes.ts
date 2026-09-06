import { Router } from 'express';
import { scholarshipController } from '../controllers/scholarship.controller';

const router = Router();

router.get('/', (req, res) => scholarshipController.getScholarships(req, res));
router.patch('/:id/bookmark', (req, res) => scholarshipController.toggleBookmark(req, res));
router.post('/check-eligibility', (req, res) => scholarshipController.checkEligibility(req, res));
router.get('/checklist', (req, res) => scholarshipController.getDocumentChecklist(req, res));
router.patch('/checklist/:id/toggle', (req, res) => scholarshipController.toggleDocumentVerification(req, res));

export default router;
