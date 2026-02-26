/* eslint-disable @typescript-eslint/no-explicit-any */
import 'express';
import 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            requestId?: string;

            user?: {
                id: number;
                email: string;
                name: string;
                iat?: number;
                exp?: number;
            };

            validated?: {
                body?: any;
                query?: any;
                params?: any;
            };
        }
    }

    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: 'development' | 'test' | 'production';
            PORT?: string;

            DB_HOST: string;
            DB_PORT?: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_NAME: string;

            JWT_SECRET: string;
            JWT_EXPIRES_IN?: string;

            UPLOAD_PATH?: string;
        }
    }
}

export { };