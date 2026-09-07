import { Router } from 'express';
import { CenturyGrandmasterController } from '../controllers/century-grandmaster.controller';

const router = Router();
const controller = new CenturyGrandmasterController();

router.get('/profile', (req, res) => controller.getProfile(req, res));
router.post('/claim', (req, res) => controller.claimMedallion(req, res));

export default router;
