import { Router } from 'express';
import { NotesController } from '../controllers/notes.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Protect notes endpoints with auth
router.use(authenticateToken as any);

router.get('/', NotesController.getNotes as any);
router.get('/resources', NotesController.getResources as any);
router.get('/:id', NotesController.getNoteById as any);
router.post('/', NotesController.createNote as any);
router.put('/:id', NotesController.updateNote as any);
router.patch('/:id/bookmark', NotesController.toggleBookmark as any);
router.delete('/:id', NotesController.deleteNote as any);

export default router;
