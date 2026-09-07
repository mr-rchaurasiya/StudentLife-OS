import { Router } from 'express';
import { slideGeneratorController } from '../controllers/slide-generator.controller';

const router = Router();

router.get('/decks', slideGeneratorController.getAllDecks);
router.get('/decks/:id', slideGeneratorController.getDeckById);
router.post('/generate', slideGeneratorController.generateDeck);

export default router;
