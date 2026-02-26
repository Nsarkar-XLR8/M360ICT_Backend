import { Router } from "express";
import { isDbReady } from "../config/connectDB.js";

export const healthRouter = Router();

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     tags:
 *       - System
 *     summary: Liveness check
 *     description: Returns 200 with uptime info when the server is running.
 *     responses:
 *       200:
 *         description: Server is alive
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
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     uptime:
 *                       type: number
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 */
healthRouter.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "OK",
        data: {
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        }
    });
});

/**
 * @openapi
 * /api/v1/ready:
 *   get:
 *     tags:
 *       - System
 *     summary: Readiness check
 *     description: Returns 200 when the database connection is ready, 503 otherwise.
 *     responses:
 *       200:
 *         description: Service is ready
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
 *                   example: READY
 *                 data:
 *                   type: object
 *                   properties:
 *                     db:
 *                       type: boolean
 *       503:
 *         description: Service not ready (DB not connected)
 */
healthRouter.get("/ready", (_req, res) => {
    const ready = isDbReady();
    res.status(ready ? 200 : 503).json({
        success: ready,
        statusCode: ready ? 200 : 503,
        message: ready ? "READY" : "NOT_READY",
        data: { db: ready }
    });
});
