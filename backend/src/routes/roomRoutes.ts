import { Router, type Router as ExpressRouter } from 'express';
import { createRoom, joinByInvite, getRoomMembers, getPublicRooms } from '../controllers/roomController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router: ExpressRouter = Router();

router.post('/create', authenticateToken, createRoom);
router.post('/join', authenticateToken, joinByInvite);
router.get('/members/:roomId', authenticateToken, getRoomMembers);
router.get('/public', authenticateToken, getPublicRooms);

export default router;