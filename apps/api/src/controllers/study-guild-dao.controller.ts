import { Request, Response } from 'express';
import { studyGuildDaoService } from '../services/study-guild-dao.service';
import { CastGuildVoteDto, CreateGuildProposalDto } from '@studentlife/shared';

export class StudyGuildDaoController {
  public async getProposals(_req: Request, res: Response) {
    try {
      const proposals = studyGuildDaoService.getProposals();
      return res.status(200).json({ success: true, data: proposals });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async castVote(req: Request, res: Response) {
    try {
      const dto: CastGuildVoteDto = req.body;
      const updated = studyGuildDaoService.castVote(dto);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Proposal not found' });
      }
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async createProposal(req: Request, res: Response) {
    try {
      const dto: CreateGuildProposalDto = req.body;
      const created = studyGuildDaoService.createProposal(dto);
      return res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const studyGuildDaoController = new StudyGuildDaoController();
