import { Router } from 'express';
import { CrisprEditorController } from '../controllers/crispr-editor.controller';

const router = Router();
const controller = new CrisprEditorController();

router.post('/design', (req, res) => controller.designGuide(req, res));

export default router;
