import {Router} from 'express';
import { authController } from './auth.controller';

const router = Router();

router.post('/register', authController.registration);
router.post('/login', authController.login);
router.get('/users', authController.getUsers);

export { router as auth };