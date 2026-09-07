import { Request, Response } from 'express';
import { RoboticsKinematicsService } from '../services/robotics-kinematics.service';

export class RoboticsKinematicsController {
  private service: RoboticsKinematicsService;

  constructor() {
    this.service = new RoboticsKinematicsService();
  }

  async compute(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.computeKinematics(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to compute inverse kinematics' });
    }
  }
}
