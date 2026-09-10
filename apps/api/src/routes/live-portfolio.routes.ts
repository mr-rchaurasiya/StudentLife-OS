import { Router } from 'express';
import { livePortfolioController } from '../controllers/live-portfolio.controller';

const router = Router();

router.get('/profile', (req, res) => livePortfolioController.getPortfolio(req, res));
router.get('/profile/:username', (req, res) => livePortfolioController.getPortfolio(req, res));
router.post('/draft-outreach', (req, res) => livePortfolioController.draftOutreach(req, res));

export default router;
