import { Router } from 'express';
import { aiPodcastController } from '../controllers/ai-podcast.controller';

const router = Router();

router.get('/podcasts', aiPodcastController.getAllPodcasts);
router.get('/podcasts/:id', aiPodcastController.getPodcastById);
router.post('/generate', aiPodcastController.generatePodcast);

export default router;
