import { Router } from 'express';
import { mindmapStudioController } from '../controllers/mindmap-studio.controller';

const router = Router();

router.get('/', (req, res) => mindmapStudioController.getMindmap(req, res));
router.post('/generate', (req, res) => mindmapStudioController.generateMindmap(req, res));
router.post('/reveal', (req, res) => mindmapStudioController.revealNode(req, res));

export default router;
