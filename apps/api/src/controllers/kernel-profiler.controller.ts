import { Request, Response } from 'express';
import { kernelProfilerService } from '../services/kernel-profiler.service';
import { AnalyzeKernelCodeDto } from '@studentlife/shared';

export class KernelProfilerController {
  public async analyze(req: Request, res: Response) {
    try {
      const dto: AnalyzeKernelCodeDto = req.body;
      const result = await kernelProfilerService.analyzeKernel(dto);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getProfile(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = kernelProfilerService.getProfile(id);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const kernelProfilerController = new KernelProfilerController();
