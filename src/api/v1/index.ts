import { Router } from 'express';
import { string } from './string/string.route';
import { auth } from './auth/auth.route';
import { authMiddleware } from './auth/auth.middleware';

const router = Router();

router.use('/string', authMiddleware, string);
router.use('/auth', authMiddleware, auth);

export { router as v1 };