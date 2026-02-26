import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { loginSchema } from './auth.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { rateLimiter } from '@/middlewares/rateLimiter.js';

const router = Router();
const authController = new AuthController();

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: HR user login
 *     description: Authenticates an HR user with email and password. Returns a signed JWT on success.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@hr.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful – returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation error
 */
router.post('/login', 
    rateLimiter.authRateLimiter,
    validateRequest(loginSchema), 
    authController.login);

export const AuthRoutes = router;