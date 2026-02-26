import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { loginSchema } from './auth.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';

const router = Router();
const authController = new AuthController();

router.post('/login', validateRequest(loginSchema), authController.login);

export const AuthRoutes = router;