import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { NotesService } from '../services/notes.service';

export class NotesController {
  static async getNotes(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { tag, subject, search } = req.query;

      const notes = await NotesService.getNotes(userId, {
        tag: tag as string | undefined,
        subject: subject as string | undefined,
        search: search as string | undefined,
      });

      res.status(200).json({
        success: true,
        data: notes,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch notes',
      });
    }
  }

  static async getNoteById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { id } = req.params;

      const note = await NotesService.getNoteById(userId, id);
      if (!note) {
        res.status(404).json({
          success: false,
          message: 'Note not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: note,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch note',
      });
    }
  }

  static async createNote(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { title, content, subjectName, subjectColor, tags, isBookmarked } = req.body;

      if (!title || !content || !subjectName) {
        res.status(400).json({
          success: false,
          message: 'Title, content, and subjectName are required',
        });
        return;
      }

      const note = await NotesService.createNote(userId, {
        title,
        content,
        subjectName,
        subjectColor,
        tags,
        isBookmarked,
      });

      res.status(201).json({
        success: true,
        message: 'Note created successfully',
        data: note,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to create note',
      });
    }
  }

  static async updateNote(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { id } = req.params;

      const updated = await NotesService.updateNote(userId, id, req.body);

      res.status(200).json({
        success: true,
        message: 'Note updated successfully',
        data: updated,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update note',
      });
    }
  }

  static async toggleBookmark(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { id } = req.params;

      const updated = await NotesService.toggleBookmark(userId, id);

      res.status(200).json({
        success: true,
        message: updated.isBookmarked ? 'Note bookmarked' : 'Note unbookmarked',
        data: updated,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to toggle bookmark',
      });
    }
  }

  static async deleteNote(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { id } = req.params;

      await NotesService.deleteNote(userId, id);

      res.status(200).json({
        success: true,
        message: 'Note deleted successfully',
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to delete note',
      });
    }
  }

  static async getResources(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const resources = await NotesService.getResources();
      res.status(200).json({
        success: true,
        data: resources,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch resource documents',
      });
    }
  }
}
