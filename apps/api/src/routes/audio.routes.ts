import { Router } from 'express';
import { AudioController } from '../controllers/audio.controller';

const router = Router();

router.get('/tracks', AudioController.getTracks);
router.get('/ambient-layers', AudioController.getAmbientLayers);
router.get('/binaural-presets', AudioController.getBinauralPresets);

export default router;
