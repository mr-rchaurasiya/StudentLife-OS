import { Router } from 'express';
import { ankiFsrsController } from '../controllers/anki-fsrs.controller';

const router = Router();

router.get('/deck', ankiFsrsController.getDeckState);
router.post('/review', ankiFsrsController.reviewCard);
router.post('/generate-cloze', ankiFsrsController.generateCloze);

export default router;
