import { Router } from 'express';
import { notificationsPipelineController } from '../controllers/notifications-pipeline.controller';

const router = Router();

router.get('/digest', notificationsPipelineController.getDailyDigest);
router.post('/subscribe', notificationsPipelineController.subscribe);
router.post('/test-alert', notificationsPipelineController.sendTestAlert);

export const notificationsPipelineRouter = router;
