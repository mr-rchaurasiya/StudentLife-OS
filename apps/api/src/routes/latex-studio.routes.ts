import { Router } from 'express';
import { LatexStudioController } from '../controllers/latex-studio.controller';

const router = Router();

router.get('/project', LatexStudioController.getProject);
router.post('/compile', LatexStudioController.compileLatex);
router.post('/format-equation', LatexStudioController.formatEquation);

export default router;
