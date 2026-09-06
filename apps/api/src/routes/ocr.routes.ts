import { Router } from 'express';
import { OcrController } from '../controllers/ocr.controller';

const router = Router();

router.post('/scan', OcrController.scanDocument);

export default router;
