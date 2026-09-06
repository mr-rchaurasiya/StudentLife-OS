import { Router } from 'express';
import { focusGardenController } from '../controllers/focus-garden.controller';

const router = Router();

router.get('/status', focusGardenController.getGardenState);
router.post('/plant', focusGardenController.plantTree);
router.post('/complete', focusGardenController.completeTree);
router.post('/pet/interact', focusGardenController.interactWithPet);

export default router;
