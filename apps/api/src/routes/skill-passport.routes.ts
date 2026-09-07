import { Router } from 'express';
import { SkillPassportController } from '../controllers/skill-passport.controller';

const router = Router();

router.get('/summary', SkillPassportController.getPassportSummary);
router.post('/generate', SkillPassportController.generateCredential);

export default router;
