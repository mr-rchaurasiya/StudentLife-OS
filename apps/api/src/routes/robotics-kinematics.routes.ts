import { Router } from 'express';
import { RoboticsKinematicsController } from '../controllers/robotics-kinematics.controller';

const router = Router();
const controller = new RoboticsKinematicsController();

router.post('/compute', (req, res) => controller.compute(req, res));

export default router;
