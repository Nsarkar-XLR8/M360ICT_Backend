import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import db from '../../config/database.js';
import config from '../../config/index.js';
import AppError from '../../errors/AppError.js';

export interface JwtPayload {
    id: number;
    email: string;
    name: string;
}

interface HrUser {
    id: number;
    email: string;
    password_hash: string;
    name: string;
}

export class AuthService {
    async login(email: string, password: string): Promise<string> {
        const user = await db<HrUser>('hr_users').where({ email }).first();

        if (!user) {
            throw AppError.of(StatusCodes.UNAUTHORIZED, 'Invalid email or password', [
                { path: 'email', message: 'Invalid email or password' },
            ]);
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw AppError.of(StatusCodes.UNAUTHORIZED, 'Invalid email or password', [
                { path: 'password', message: 'Invalid email or password' },
            ]);
        }

        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        const token = jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        } as jwt.SignOptions);

        return token;
    }
}