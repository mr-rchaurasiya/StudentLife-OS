import { Router } from 'express';
import { DeadlineController } from '../controllers/deadline.controller';

const router = Router();

router.get('/', DeadlineController.getAllDeadlines);
router.get('/stats', DeadlineController.getStats);
router.post('/', DeadlineController.createDeadline);
router.patch('/:id/toggle', DeadlineController.toggleCompletion);
router.put('/:id', DeadlineController.updateDeadline);
router.delete('/:id', DeadlineController.deleteDeadline);

router.get('/export/ics', DeadlineController.exportIcsCalendar);

router.get('/preferences', DeadlineController.getPreferences);
router.post('/preferences/toggle', DeadlineController.toggleChannel);

router.get('/notifications', DeadlineController.getAlertLogs);
router.patch('/notifications/:id/read', DeadlineController.markLogRead);
router.post('/notifications/test-trigger', DeadlineController.testTriggerAlert);

export default router;
