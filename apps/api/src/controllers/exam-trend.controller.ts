import { Request, Response } from 'express';
import { ExamTrendService } from '../services/exam-trend.service';

export class ExamTrendController {
  public static async getForecast(req: Request, res: Response): Promise<void> {
    try {
      const examName = req.query.examName as string || 'GATE (CSE)';
      const forecast = ExamTrendService.getForecast(examName);
      res.json({
        success: true,
        data: forecast
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async predictTrends(req: Request, res: Response): Promise<void> {
    try {
      const result = ExamTrendService.predictCustom(req.body);
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
