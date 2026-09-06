import { Request, Response } from 'express';
import { AiMentorService } from '../services/ai-mentor.service';
import { ApiResponse, MentorPersonaType } from '@studentlife/shared';

export class AiMentorController {
  public static getHolisticReport(req: Request, res: Response): void {
    const persona = req.query.persona as MentorPersonaType | undefined;
    const report = AiMentorService.getHolisticReport(persona);

    const response: ApiResponse<typeof report> = {
      success: true,
      data: report,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static completeAction(req: Request, res: Response): void {
    const { id } = req.params;
    const completed = AiMentorService.completeAction(id);
    if (!completed) {
      res.status(404).json({
        success: false,
        error: 'Action item not found',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const response: ApiResponse<typeof completed> = {
      success: true,
      data: completed,
      message: `Action completed! +${completed.xpReward} XP awarded 🔥`,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static chatWithMentor(req: Request, res: Response): void {
    const chatResponse = AiMentorService.processMentorChat(req.body);
    const response: ApiResponse<typeof chatResponse> = {
      success: true,
      data: chatResponse,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }
}
