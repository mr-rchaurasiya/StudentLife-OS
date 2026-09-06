import { Request, Response } from 'express';
import { DeadlineService } from '../services/deadline.service';
import { ApiResponse, DeadlineCategory, DeadlinePriority } from '@studentlife/shared';

export class DeadlineController {
  public static getAllDeadlines(req: Request, res: Response): void {
    const category = req.query.category as DeadlineCategory | undefined;
    const priority = req.query.priority as DeadlinePriority | undefined;

    const deadlines = DeadlineService.getAllDeadlines(category, priority);
    const stats = DeadlineService.getDeadlineStats();

    const response: ApiResponse<{ deadlines: typeof deadlines; stats: typeof stats }> = {
      success: true,
      data: {
        deadlines,
        stats
      },
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static getStats(_req: Request, res: Response): void {
    const stats = DeadlineService.getDeadlineStats();
    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static createDeadline(req: Request, res: Response): void {
    const created = DeadlineService.createDeadline(req.body);
    const response: ApiResponse<typeof created> = {
      success: true,
      data: created,
      message: 'Deadline registered successfully',
      timestamp: new Date().toISOString()
    };
    res.status(201).json(response);
  }

  public static toggleCompletion(req: Request, res: Response): void {
    const { id } = req.params;
    const updated = DeadlineService.toggleDeadlineCompletion(id);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Deadline not found',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const response: ApiResponse<typeof updated> = {
      success: true,
      data: updated,
      message: updated.isCompleted ? 'Deadline marked as completed (+15 XP)' : 'Deadline re-opened',
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static updateDeadline(req: Request, res: Response): void {
    const { id } = req.params;
    const updated = DeadlineService.updateDeadline(id, req.body);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Deadline not found',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const response: ApiResponse<typeof updated> = {
      success: true,
      data: updated,
      message: 'Deadline updated successfully',
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static deleteDeadline(req: Request, res: Response): void {
    const { id } = req.params;
    const deleted = DeadlineService.deleteDeadline(id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Deadline not found',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id },
      message: 'Deadline removed',
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static exportIcsCalendar(_req: Request, res: Response): void {
    const icsContent = DeadlineService.generateIcsCalendar();
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="studentlife-deadlines.ics"');
    res.send(icsContent);
  }

  public static getPreferences(_req: Request, res: Response): void {
    const prefs = DeadlineService.getPreferences();
    const response: ApiResponse<typeof prefs> = {
      success: true,
      data: prefs,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static toggleChannel(req: Request, res: Response): void {
    const { channel } = req.body;
    const prefs = DeadlineService.toggleChannelPreference(channel);
    const response: ApiResponse<typeof prefs> = {
      success: true,
      data: prefs,
      message: `Channel ${channel} updated`,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static getAlertLogs(_req: Request, res: Response): void {
    const logs = DeadlineService.getAlertLogs();
    const response: ApiResponse<typeof logs> = {
      success: true,
      data: logs,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static markLogRead(req: Request, res: Response): void {
    const { id } = req.params;
    const logs = DeadlineService.markLogAsRead(id);
    const response: ApiResponse<typeof logs> = {
      success: true,
      data: logs,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static testTriggerAlert(req: Request, res: Response): void {
    const { channel } = req.body;
    const alert = DeadlineService.triggerTestNotification(channel || 'PUSH');
    const response: ApiResponse<typeof alert> = {
      success: true,
      data: alert,
      message: 'Test alert dispatched successfully',
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }
}
