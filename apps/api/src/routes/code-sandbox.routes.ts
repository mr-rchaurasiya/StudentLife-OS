import { Router } from 'express';
import { codeSandboxController } from '../controllers/code-sandbox.controller';

const router = Router();

router.post('/run', codeSandboxController.executeCode);
router.post('/visualize', codeSandboxController.visualizeAlgorithm);

export default router;
