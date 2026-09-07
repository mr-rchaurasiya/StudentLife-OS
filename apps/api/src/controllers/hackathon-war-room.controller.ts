import { Request, Response } from 'express';
import { hackathonWarRoomService } from '../services/hackathon-war-room.service';

export class HackathonWarRoomController {
  async getWarRoomState(_req: Request, res: Response): Promise<void> {
    try {
      const state = await hackathonWarRoomService.getWarRoomState();
      res.json({ success: true, data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async addTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, assigneeName, role } = req.body;
      if (!title || !assigneeName) {
        res.status(400).json({ success: false, message: 'title and assigneeName are required' });
        return;
      }
      const state = await hackathonWarRoomService.addTask({
        title,
        assigneeName,
        role: role || 'FULLSTACK',
      });
      res.json({ success: true, data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async toggleTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.body;
      if (!taskId) {
        res.status(400).json({ success: false, message: 'taskId is required' });
        return;
      }
      const state = await hackathonWarRoomService.toggleTaskStatus(taskId);
      res.json({ success: true, data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async exportDevpost(req: Request, res: Response): Promise<void> {
    try {
      const { projectName, inspiration, howWeBuiltIt } = req.body;
      if (!projectName) {
        res.status(400).json({ success: false, message: 'projectName is required' });
        return;
      }
      const state = await hackathonWarRoomService.exportDevpost({
        projectName,
        inspiration: inspiration || 'Solved a critical campus bottleneck.',
        howWeBuiltIt: howWeBuiltIt || 'React 18 + Node.js + TypeScript.',
      });
      res.json({ success: true, data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const hackathonWarRoomController = new HackathonWarRoomController();
