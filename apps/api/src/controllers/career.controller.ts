import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { careerService } from '../services/career.service';

export class CareerController {
  static async getRoles(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const roles = careerService.getRoles(userId);

      res.status(200).json({
        success: true,
        data: roles,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch career roles',
      });
    }
  }

  static async getRoleById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const role = careerService.getRoleById(id);

      if (!role) {
        res.status(404).json({
          success: false,
          message: 'Career role not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: role,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch career role',
      });
    }
  }

  static async analyzeSkillGap(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const report = careerService.analyzeSkillGap(id);

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to analyze skill gap',
      });
    }
  }
}
