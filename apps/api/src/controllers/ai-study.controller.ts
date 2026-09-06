import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { AiStudyService } from '../services/ai-study.service';

export class AiStudyController {
  static async getFlashcards(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const cards = await AiStudyService.getFlashcards(userId);
      res.status(200).json({
        success: true,
        data: cards,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch flashcards',
      });
    }
  }

  static async summarize(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { content, subjectName, title } = req.body;
      if (!content) {
        res.status(400).json({
          success: false,
          message: 'Content is required for AI summarization',
        });
        return;
      }

      const summary = await AiStudyService.summarizeContent({
        content,
        subjectName,
        title,
      });

      res.status(200).json({
        success: true,
        message: 'Content summarized successfully',
        data: summary,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to summarize content',
      });
    }
  }

  static async generateFlashcards(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { content, subjectName, topicTitle, count } = req.body;

      if (!content || !subjectName || !topicTitle) {
        res.status(400).json({
          success: false,
          message: 'Content, subjectName, and topicTitle are required',
        });
        return;
      }

      const cards = await AiStudyService.generateFlashcards(userId, {
        content,
        subjectName,
        topicTitle,
        count: count || 3,
      });

      res.status(201).json({
        success: true,
        message: 'AI flashcards generated successfully',
        data: cards,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to generate flashcards',
      });
    }
  }

  static async askDoubt(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { question, subjectName, level, contextContent } = req.body;
      if (!question) {
        res.status(400).json({
          success: false,
          message: 'Question is required',
        });
        return;
      }

      const reply = await AiStudyService.askAiDoubt({
        question,
        subjectName,
        level,
        contextContent,
      });

      res.status(200).json({
        success: true,
        data: reply,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to resolve AI doubt',
      });
    }
  }

  static async explainConcept(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { concept, subjectName, depth } = req.body;
      if (!concept) {
        res.status(400).json({
          success: false,
          message: 'Concept is required',
        });
        return;
      }

      const explanation = await AiStudyService.explainConcept({
        concept,
        subjectName,
        depth,
      });

      res.status(200).json({
        success: true,
        data: explanation,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to explain concept',
      });
    }
  }

  static async gradeFlashcard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { id } = req.params;
      const { grade } = req.body;

      if (!['AGAIN', 'HARD', 'GOOD', 'EASY'].includes(grade)) {
        res.status(400).json({
          success: false,
          message: 'Grade must be AGAIN, HARD, GOOD, or EASY',
        });
        return;
      }

      const updated = await AiStudyService.gradeFlashcard(userId, id, grade);

      res.status(200).json({
        success: true,
        message: 'Flashcard graded successfully',
        data: updated,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to grade flashcard',
      });
    }
  }
}
