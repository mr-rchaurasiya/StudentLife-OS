import { Router } from 'express';
import { hackathonWarRoomController } from '../controllers/hackathon-war-room.controller';

const router = Router();

router.get('/state', (req, res) => hackathonWarRoomController.getWarRoomState(req, res));
router.post('/task/add', (req, res) => hackathonWarRoomController.addTask(req, res));
router.post('/task/toggle', (req, res) => hackathonWarRoomController.toggleTaskStatus(req, res));
router.post('/devpost/export', (req, res) => hackathonWarRoomController.exportDevpost(req, res));

export default router;
