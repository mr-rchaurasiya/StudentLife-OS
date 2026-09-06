import { Request, Response } from 'express';
import { conceptGraphService } from '../services/concept-graph.service';

export class ConceptGraphController {
  public getSubjectGraph = (req: Request, res: Response) => {
    try {
      const subjectId = (req.params.subjectId as string) || 'dsa';
      const graph = conceptGraphService.getGraphBySubject(subjectId);
      return res.status(200).json({
        success: true,
        data: graph
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch concept graph',
        error: error.message
      });
    }
  };

  public getSubjectList = (req: Request, res: Response) => {
    try {
      const list = conceptGraphService.getAllSubjectGraphsSummary();
      return res.status(200).json({
        success: true,
        data: list
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch graphs list',
        error: error.message
      });
    }
  };

  public updateMastery = (req: Request, res: Response) => {
    try {
      const { subjectId, nodeId } = req.params;
      const { mastery } = req.body;
      const ok = conceptGraphService.updateNodeMastery(subjectId, nodeId, mastery);
      return res.status(200).json({
        success: ok,
        message: ok ? 'Mastery updated' : 'Node not found'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update mastery',
        error: error.message
      });
    }
  };
}

export const conceptGraphController = new ConceptGraphController();
