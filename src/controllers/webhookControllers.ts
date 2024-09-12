import { Request, Response } from "express";
import { createWebhookService } from "../services/webhookServices";
import logger from "../utils/logger";
import { WebhookPayload } from "../models/webhookModels";

const webhookService = createWebhookService([
  {
    name: "Test Runners",
    url: process.env.TEST_RUNNER_URL || "http://localhost:3001/run-tests",
  },
  // {
  //   name: "Backend Core",
  //   url: process.env.BACKEND_SERVER_URL || "http://localhost:4000/webhook",
  // },
]);

export async function handleWebhook(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const payload: WebhookPayload = req.body;
    if (!payload) {
      throw new Error("Empty payload received");
    }
    logger.info("Received webhook payload:", JSON.stringify(payload));

    await webhookService.processWebhook(payload);

    return res.status(200).json({
      success: true,
      message: "Webhook processed and dispatched successfully",
    });
  } catch (error) {
    logger.error("Error handling webhook:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
}
