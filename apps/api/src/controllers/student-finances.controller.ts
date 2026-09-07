import { Request, Response } from 'express';
import { StudentFinancesService } from '../services/student-finances.service';

export class StudentFinancesController {
  public static async getBudget(_req: Request, res: Response): Promise<void> {
    try {
      const budget = StudentFinancesService.getBudget();
      res.json({ success: true, data: budget });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async addExpense(req: Request, res: Response): Promise<void> {
    try {
      const { category, title, amount } = req.body;
      if (!category || !title || !amount) {
        res.status(400).json({ success: false, message: 'Category, title and amount are required' });
        return;
      }
      const updatedBudget = StudentFinancesService.addExpense({ category, title, amount: Number(amount) });
      res.json({ success: true, data: updatedBudget });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async calculateRoi(req: Request, res: Response): Promise<void> {
    try {
      const { totalCourseCost, durationMonths, expectedStartingSalaryAnnual } = req.body;
      const result = StudentFinancesService.calculateCourseRoi({
        totalCourseCost: Number(totalCourseCost) || 50000,
        durationMonths: Number(durationMonths) || 6,
        expectedStartingSalaryAnnual: Number(expectedStartingSalaryAnnual) || 1200000
      });
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
