import { Router } from 'express';
import { studyRoomsController } from '../controllers/study-rooms.controller';

const router = Router();

router.get('/', studyRoomsController.getAllRooms);
router.post('/', studyRoomsController.createRoom);
router.get('/:id', studyRoomsController.getRoomById);
router.post('/:id/join', studyRoomsController.joinRoom);
router.post('/:id/messages', studyRoomsController.sendMessage);
router.post('/:id/goal', studyRoomsController.updateGoal);

export const studyRoomsRouter = router;
