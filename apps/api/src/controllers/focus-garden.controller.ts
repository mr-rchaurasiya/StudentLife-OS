import { Request, Response } from 'express';
import { focusGardenService } from '../services/focus-garden.service';
import { ApiResponse, PlantTreeDto, CompleteTreeDto } from '@studentlife/shared';

export class FocusGardenController {
  public getGardenState = async (_req: Request, res: Response): Promise<void> => {
    try {
      const state = focusGardenService.getGardenState();
      const response: ApiResponse = {
        success: true,
        data: state,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'GARDEN_FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public plantTree = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: PlantTreeDto = req.body;
      const state = focusGardenService.plantTree(dto);
      res.status(201).json({
        success: true,
        data: state,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'PLANT_TREE_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public completeTree = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: CompleteTreeDto = req.body;
      const state = focusGardenService.completeTree(dto);
      res.json({
        success: true,
        data: state,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'COMPLETE_TREE_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public interactWithPet = async (_req: Request, res: Response): Promise<void> => {
    try {
      const pet = focusGardenService.feedOrPetStudyPet();
      res.json({
        success: true,
        data: pet,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'PET_INTERACTION_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };
}

export const focusGardenController = new FocusGardenController();
