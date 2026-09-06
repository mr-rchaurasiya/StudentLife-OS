import { Request, Response } from 'express';
import { CommunityService } from '../services/community.service';
import { ApiResponse } from '@studentlife/shared';

export class CommunityController {
  public static getStats(_req: Request, res: Response): void {
    const stats = CommunityService.getStats();
    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static getRooms(_req: Request, res: Response): void {
    const rooms = CommunityService.getRooms();
    const stats = CommunityService.getStats();
    const response: ApiResponse<{ rooms: typeof rooms; stats: typeof stats }> = {
      success: true,
      data: { rooms, stats },
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static createRoom(req: Request, res: Response): void {
    const created = CommunityService.createRoom(req.body);
    const response: ApiResponse<typeof created> = {
      success: true,
      data: created,
      message: 'Study room created successfully! (+25 XP)',
      timestamp: new Date().toISOString()
    };
    res.status(201).json(response);
  }

  public static joinRoom(req: Request, res: Response): void {
    const { id } = req.params;
    const room = CommunityService.joinRoom(id);
    if (!room) {
      res.status(404).json({
        success: false,
        error: 'Study room not found',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const response: ApiResponse<typeof room> = {
      success: true,
      data: room,
      message: `Joined study room: ${room.name}`,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static getDiscussions(req: Request, res: Response): void {
    const subject = req.query.subject as string | undefined;
    const exam = req.query.exam as string | undefined;

    const discussions = CommunityService.getDiscussions(subject, exam);
    const response: ApiResponse<typeof discussions> = {
      success: true,
      data: discussions,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static createDiscussion(req: Request, res: Response): void {
    const created = CommunityService.createDiscussion(req.body);
    const response: ApiResponse<typeof created> = {
      success: true,
      data: created,
      message: 'Discussion doubt posted to community (+20 XP)',
      timestamp: new Date().toISOString()
    };
    res.status(201).json(response);
  }

  public static toggleUpvote(req: Request, res: Response): void {
    const { id } = req.params;
    const updated = CommunityService.toggleUpvote(id);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Post not found',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const response: ApiResponse<typeof updated> = {
      success: true,
      data: updated,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static addReply(req: Request, res: Response): void {
    const { id } = req.params;
    const updated = CommunityService.addReply(id, req.body);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Post not found',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const response: ApiResponse<typeof updated> = {
      success: true,
      data: updated,
      message: 'Reply posted to peer (+20 XP)',
      timestamp: new Date().toISOString()
    };
    res.status(201).json(response);
  }
}
