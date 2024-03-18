import {Router} from 'express';
import { authController } from './auth.controller';

const router = Router();

router.post('/register', authController.registration);
router.post('/login', authController.login);

export { router as auth };