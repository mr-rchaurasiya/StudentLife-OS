import { Request, Response } from 'express';
import { documentAnnotatorService } from '../services/document-annotator.service';
import { ApiResponse, DocumentAiActionRequestDto } from '@studentlife/shared';

export class DocumentAnnotatorController {
  public getAllDocuments = async (_req: Request, res: Response): Promise<void> => {
    try {
      const docs = documentAnnotatorService.getAllDocuments();
      const response: ApiResponse = {
        success: true,
        data: docs,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'DOCS_FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public getDocumentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const doc = documentAnnotatorService.getDocumentById(id);
      if (!doc) {
        res.status(404).json({
          success: false,
          error: { code: 'DOC_NOT_FOUND', details: `Document ${id} not found` },
          timestamp: new Date().toISOString()
        });
        return;
      }
      res.json({
        success: true,
        data: doc,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'DOC_FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public createDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, subject, category, author, text } = req.body;
      if (!text || typeof text !== 'string') {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_TEXT', details: 'Document text content is required' },
          timestamp: new Date().toISOString()
        });
        return;
      }
      const newDoc = documentAnnotatorService.createDocument({ title, subject, category, author, text });
      res.status(201).json({
        success: true,
        message: 'Document created successfully',
        data: newDoc,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'DOC_CREATE_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public addAnnotation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { documentId } = req.params;
      const annotation = req.body;
      const created = documentAnnotatorService.addAnnotation(documentId, annotation);
      res.status(201).json({
        success: true,
        data: created,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'ANNOTATION_ADD_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public deleteAnnotation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { documentId, annotationId } = req.params;
      const success = documentAnnotatorService.deleteAnnotation(documentId, annotationId);
      res.json({
        success,
        message: success ? 'Annotation deleted' : 'Annotation not found',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'ANNOTATION_DELETE_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public performAiAction = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: DocumentAiActionRequestDto = req.body;
      if (!dto.selectedText || !dto.action) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_REQUEST', details: 'selectedText and action are required' },
          timestamp: new Date().toISOString()
        });
        return;
      }
      const result = documentAnnotatorService.performAiAction(dto);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'AI_ACTION_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public exportMarkdown = async (req: Request, res: Response): Promise<void> => {
    try {
      const { documentId } = req.params;
      const md = documentAnnotatorService.exportMarkdown(documentId);
      res.json({
        success: true,
        data: { markdown: md },
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'EXPORT_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };
}

export const documentAnnotatorController = new DocumentAnnotatorController();
