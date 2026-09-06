import { Router } from 'express';
import { documentAnnotatorController } from '../controllers/document-annotator.controller';

const router = Router();

router.get('/documents', documentAnnotatorController.getAllDocuments);
router.get('/documents/:id', documentAnnotatorController.getDocumentById);
router.post('/documents', documentAnnotatorController.createDocument);
router.post('/documents/:documentId/annotations', documentAnnotatorController.addAnnotation);
router.delete('/documents/:documentId/annotations/:annotationId', documentAnnotatorController.deleteAnnotation);
router.post('/ai-action', documentAnnotatorController.performAiAction);
router.get('/documents/:documentId/export', documentAnnotatorController.exportMarkdown);

export default router;
