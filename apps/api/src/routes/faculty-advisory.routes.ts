import { Router } from 'express';
import { FacultyAdvisoryController } from '../controllers/faculty-advisory.controller';

const router = Router();

router.get('/slots', FacultyAdvisoryController.getSlots);
router.get('/bookings', FacultyAdvisoryController.getBookings);
router.post('/book', FacultyAdvisoryController.bookSlot);

export default router;
