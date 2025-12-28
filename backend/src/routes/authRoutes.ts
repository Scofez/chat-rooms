import { Router, type Router as ExpressRouter } from 'express';
import { register, login } from '../controllers/authController.js';

const router: ExpressRouter = Router();

router.post('/login', login);
router.post('/register', register);

export default router;