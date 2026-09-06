import { Request, Response } from 'express';
import { notificationsPipelineService } from '../services/notifications-pipeline.service';

export class NotificationsPipelineController {
  public getDailyDigest = (req: Request, res: Response) => {
    try {
      const userName = (req.query.userName as string) || 'Student';
      const digest = notificationsPipelineService.generateDailyDigest(userName);
      return res.status(200).json({
        success: true,
        data: digest
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate daily digest',
        error: error.message
      });
    }
  };

  public subscribe = (req: Request, res: Response) => {
    try {
      const { endpoint, keys, userId } = req.body;
      const result = notificationsPipelineService.registerSubscription({ endpoint, keys, userId });
      return res.status(200).json({
        success: true,
        data: result,
        message: 'Subscribed to push notifications'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to subscribe',
        error: error.message
      });
    }
  };

  public sendTestAlert = (req: Request, res: Response) => {
    try {
      const { title, body, icon, data } = req.body;
      const result = notificationsPipelineService.sendTestAlert({
        title: title || 'StudentLife OS Alert',
        body: body || 'Time for your scheduled 25m focus sprint!',
        icon,
        data
      });
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to dispatch alert',
        error: error.message
      });
    }
  };
}

export const notificationsPipelineController = new NotificationsPipelineController();
