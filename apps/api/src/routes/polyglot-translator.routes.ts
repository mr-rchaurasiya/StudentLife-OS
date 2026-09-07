import { Router } from 'express';
import { polyglotTranslatorController } from '../controllers/polyglot-translator.controller';

const router = Router();

router.post('/translate', polyglotTranslatorController.translate);
router.get('/session/:id', polyglotTranslatorController.getSession);

export default router;
