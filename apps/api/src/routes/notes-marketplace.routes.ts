import { Router } from 'express';
import { notesMarketplaceController } from '../controllers/notes-marketplace.controller';

const router = Router();

router.get('/resources', notesMarketplaceController.getAllResources);
router.post('/unlock', notesMarketplaceController.unlockResource);
router.post('/upload', notesMarketplaceController.uploadResource);

export default router;
