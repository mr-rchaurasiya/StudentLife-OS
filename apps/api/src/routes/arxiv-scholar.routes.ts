import { Router } from 'express';
import { ArxivScholarController } from '../controllers/arxiv-scholar.controller';

const router = Router();

router.get('/papers', ArxivScholarController.getPapers);
router.post('/search', ArxivScholarController.searchAndSummarize);

export default router;
