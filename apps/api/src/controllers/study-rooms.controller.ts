import { Request, Response } from 'express';
import { studyRoomsService } from '../services/study-rooms.service';

export class StudyRoomsController {
  public getAllRooms = (req: Request, res: Response) => {
    try {
      const rooms = studyRoomsService.getAllRooms();
      return res.status(200).json({
        success: true,
        data: rooms,
        total: rooms.length
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch study rooms',
        error: error.message
      });
    }
  };

  public getRoomById = (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const room = studyRoomsService.getRoomById(id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Study room not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: room
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch study room',
        error: error.message
      });
    }
  };

  public createRoom = (req: Request, res: Response) => {
    try {
      const { name, subject, topic, vibe, maxParticipants, roomGoal } = req.body;
      const hostUser = req.body.hostUser || { name: 'Aman Chaurasiya' };
      const newRoom = studyRoomsService.createRoom(
        { name, subject, topic, vibe, maxParticipants, roomGoal },
        hostUser
      );
      return res.status(201).json({
        success: true,
        data: newRoom,
        message: 'Study room created successfully'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create study room',
        error: error.message
      });
    }
  };

  public joinRoom = (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.body.user || { name: 'You' };
      const room = studyRoomsService.joinRoom(id, user);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Study room not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: room,
        message: 'Joined study room successfully'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to join study room',
        error: error.message
      });
    }
  };

  public sendMessage = (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { text, type, user } = req.body;
      const msg = studyRoomsService.sendMessage(id, { text, type }, user);
      if (!msg) {
        return res.status(404).json({
          success: false,
          message: 'Study room not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: msg,
        message: 'Message broadcasted'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to broadcast message',
        error: error.message
      });
    }
  };

  public updateGoal = (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { memberName, newGoal } = req.body;
      const ok = studyRoomsService.updateMemberGoal(id, memberName || 'You', newGoal);
      return res.status(200).json({
        success: ok,
        message: ok ? 'Goal updated' : 'Room or member not found'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update goal',
        error: error.message
      });
    }
  };
}

export const studyRoomsController = new StudyRoomsController();
