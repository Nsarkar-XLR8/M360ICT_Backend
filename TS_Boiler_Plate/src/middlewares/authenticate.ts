import type { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError.js';
import config from '../config/index.js';

type JwtClaims = jwt.JwtPayload & {
    id?: number;
    email?: string;
    name?: string;
};

function extractToken(req: Request): string | undefined {
    const authHeader = req.headers.authorization;

    if (typeof authHeader === 'string') {
        const [scheme, token] = authHeader.split(' ');
        if (scheme?.toLowerCase() === 'bearer' && token) return token;
    }

    const { cookies } = req as unknown as { cookies?: Record<string, unknown> };
    const cookieToken = cookies?.accessToken;
    if (typeof cookieToken === 'string' && cookieToken.length > 0)
        return cookieToken;

    return undefined;
}

function verifyToken(token: string): {
    id: number;
    email: string;
    name: string;
    iat?: number;
    exp?: number;
} {
    try {
        const claims = jwt.verify(token, config.jwt.secret) as JwtClaims;
        const { id, email, name, iat, exp } = claims;

        if (!id || !email || !name) {
            throw AppError.of(StatusCodes.UNAUTHORIZED, 'Invalid token', [
                { path: 'authorization', message: 'Missing fields in token payload' },
            ]);
        }

        return {
            id,
            email,
            name,
            ...(iat !== undefined && { iat }),
            ...(exp !== undefined && { exp }),
        };
    } catch (err: unknown) {
        const anyErr = err as { name?: string };

        if (anyErr?.name === 'TokenExpiredError') {
            throw AppError.of(StatusCodes.UNAUTHORIZED, 'Token expired', [
                { path: 'authorization', message: 'Please login again' },
            ]);
        }

        throw AppError.of(StatusCodes.UNAUTHORIZED, 'Unauthorized', [
            { path: 'authorization', message: 'Invalid or missing token' },
        ]);
    }
}

export const authenticate: RequestHandler = (req, _res, next) => {
    try {
        const token = extractToken(req);

        if (!token) {
            throw AppError.of(StatusCodes.UNAUTHORIZED, 'Unauthorized', [
                { path: 'authorization', message: 'Missing Bearer token' },
            ]);
        }

        const { id, email, name, iat, exp } = verifyToken(token);

        req.user = {
            id,
            email,
            name,
            ...(iat !== undefined && { iat }),
            ...(exp !== undefined && { exp }),
        };

        next();
    } catch (err) {
        next(err);
    }
};