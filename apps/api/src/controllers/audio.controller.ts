import { Request, Response } from 'express';
import { AudioService } from '../services/audio.service';
import { ApiResponse } from '@studentlife/shared';

export class AudioController {
  public static getTracks(req: Request, res: Response): void {
    const tracks = AudioService.getTracks();
    const response: ApiResponse<typeof tracks> = {
      success: true,
      data: tracks,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static getAmbientLayers(req: Request, res: Response): void {
    const layers = AudioService.getAmbientLayers();
    const response: ApiResponse<typeof layers> = {
      success: true,
      data: layers,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static getBinauralPresets(req: Request, res: Response): void {
    const presets = AudioService.getBinauralPresets();
    const response: ApiResponse<typeof presets> = {
      success: true,
      data: presets,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }
}
