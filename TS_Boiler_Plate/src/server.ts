import { Server } from "node:http";
import { createApp } from "./app.js";
import { logger } from "./config/logger.js";
import config from "./config/index.js";
import db from "./config/database.js";

const app = createApp();

const handleFatalError = (err: unknown, type: string) => {
    logger.fatal({ err }, `FATAL ${type} DETECTED`);
    setTimeout(() => process.exit(1), 1000);
};

process.on("uncaughtException", (err) => handleFatalError(err, "EXCEPTION"));
process.on("unhandledRejection", (reason) => handleFatalError(reason, "REJECTION"));

let server: Server;

const shutdown = (signal: string) => {
    logger.info(`[${signal}] - Initiating clean exit.`);

    if (server) {
        if (server.closeAllConnections) server.closeAllConnections();

        server.close(async (err) => {
            if (err) {
                logger.error({ err }, "Server close error");
                process.exit(1);
            }

            try {
                await db.destroy(); // close Knex connection pool
                logger.info("Graceful shutdown successful.");
                process.exit(0);
            } catch (error_) {
                logger.error({ error_ }, "Shutdown sequence error");
                process.exit(1);
            }
        });
    } else {
        process.exit(0);
    }

    setTimeout(() => {
        logger.error("Shutdown timed out. Forcing exit.");
        process.exit(1);
    }, 2000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

try {
    await db.raw("SELECT 1"); // test DB connection
    logger.info("✅ Database connected successfully");

    server = app.listen(config.port, () => {
        logger.info({ port: config.port, env: config.nodeEnv }, "🚀 Server Synchronized");
    });
} catch (err) {
    logger.error({ err }, "Bootstrap sequence failed");
    process.exit(1);
}