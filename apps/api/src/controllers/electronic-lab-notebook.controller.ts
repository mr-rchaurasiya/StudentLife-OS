import { Request, Response } from 'express';
import { electronicLabNotebookService } from '../services/electronic-lab-notebook.service';
import { CreateLabLogDto } from '@studentlife/shared';

export class ElectronicLabNotebookController {
  public async getLogs(_req: Request, res: Response) {
    try {
      const logs = electronicLabNotebookService.getAllLogs();
      return res.status(200).json({ success: true, data: logs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async createLog(req: Request, res: Response) {
    try {
      const dto: CreateLabLogDto = req.body;
      const log = await electronicLabNotebookService.createLog(dto);
      return res.status(201).json({ success: true, data: log });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async toggleStep(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { stepNumber } = req.body;
      const updated = electronicLabNotebookService.toggleStep(id, Number(stepNumber));
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Log not found' });
      }
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const electronicLabNotebookController = new ElectronicLabNotebookController();
