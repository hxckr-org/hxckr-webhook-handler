import express from "express";
import { json } from "body-parser";
import config from "./config/config";
import logger from "./utils/logger";
import webhookRoutes from "./routes/webhookRoutes";
import { setupRabbitMQ } from "./config/rabbitmq";

const app = express();

app.use(json());
app.use(webhookRoutes);

async function startServer() {
  try {
    await setupRabbitMQ();
    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
