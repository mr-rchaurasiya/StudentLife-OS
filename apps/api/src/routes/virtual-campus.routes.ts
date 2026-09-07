import { Router } from 'express';
import { virtualCampusController } from '../controllers/virtual-campus.controller';

const router = Router();

router.get('/status', virtualCampusController.getCampusState);
router.post('/move', virtualCampusController.moveAvatar);

export default router;
