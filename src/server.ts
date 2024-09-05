import express from "express";
import { json } from "body-parser";
import config from "./config/config";
import logger from "./utils/logger";
import webhookRoutes from "./routes/webhookRoutes";

const app = express();

app.use(json());
app.use(webhookRoutes);

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
