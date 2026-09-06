import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { questionBankService } from '../services/question-bank.service';

export class QuestionBankController {
  static async getQuestions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { examType, subject, topic, difficulty, year, search, bookmarkedOnly, unsolvedOnly } = req.query;

      const questions = questionBankService.getQuestions(userId, {
        examType: examType as string,
        subject: subject as string,
        topic: topic as string,
        difficulty: difficulty as any,
        year: year ? Number(year) : undefined,
        search: search as string,
        bookmarkedOnly: bookmarkedOnly === 'true',
        unsolvedOnly: unsolvedOnly === 'true',
      });

      res.status(200).json({
        success: true,
        data: questions,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch question bank items',
      });
    }
  }

  static async getQuestionById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { id } = req.params;

      const question = questionBankService.getQuestionById(id, userId);
      if (!question) {
        res.status(404).json({
          success: false,
          message: 'Question not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: question,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch question',
      });
    }
  }

  static async submitAnswer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { questionId, selectedAnswer, timeTakenSeconds } = req.body;

      if (!questionId || selectedAnswer === undefined) {
        res.status(400).json({
          success: false,
          message: 'questionId and selectedAnswer are required',
        });
        return;
      }

      const result = questionBankService.submitAnswer(userId, {
        questionId,
        selectedAnswer,
        timeTakenSeconds,
      });

      res.status(200).json({
        success: true,
        message: result.isCorrect ? `Correct! +${result.xpAwarded} XP earned 🎉` : 'Incorrect answer. Review the solution below.',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to submit answer',
      });
    }
  }

  static async toggleBookmark(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { id } = req.params;

      const isBookmarked = questionBankService.toggleBookmark(userId, id);

      res.status(200).json({
        success: true,
        message: isBookmarked ? 'Question bookmarked' : 'Question removed from bookmarks',
        data: { isBookmarked },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to toggle bookmark',
      });
    }
  }

  static async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const stats = questionBankService.getStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch question bank stats',
      });
    }
  }
}
