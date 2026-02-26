import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth.service.js';
import type { LoginInput } from './auth.validation.js';
import catchAsync from '../../utils/catchAsync.js';

const authService = new AuthService();

export class AuthController {
    login = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const { email, password } = req.validated?.body as LoginInput;

        const token = await authService.login(email, password);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Login successful',
            data: { token },
        });
    });
}