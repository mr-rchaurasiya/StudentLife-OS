import { Router } from 'express';
import { CommunityController } from '../controllers/community.controller';

const router = Router();

router.get('/stats', CommunityController.getStats);
router.get('/rooms', CommunityController.getRooms);
router.post('/rooms', CommunityController.createRoom);
router.post('/rooms/:id/join', CommunityController.joinRoom);

router.get('/discussions', CommunityController.getDiscussions);
router.post('/discussions', CommunityController.createDiscussion);
router.post('/discussions/:id/upvote', CommunityController.toggleUpvote);
router.post('/discussions/:id/replies', CommunityController.addReply);

export default router;
