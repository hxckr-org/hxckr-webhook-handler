import { Request, Response } from "express";
import logger from "../utils/logger";
import { WebhookPayload, WebhookResponse } from "../models/webhookModels";

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

    switch (payload.event) {
      case "push":
        return handlePushEvent(payload, res);
      default:
        return handleUnknownEvent(payload, res);
    }
  } catch (error) {
    logger.error("Error handling webhook:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
}

function handlePushEvent(payload: WebhookPayload, res: Response): Response {
  try {
    const { repository, sender, ref, commits } = payload;
    if (!repository || !sender || !ref || !commits) {
      throw new Error("Invalid push event payload");
    }

    const branch = ref.split("/").pop() || "unknown";

    logger.info(
      `Push event received for repository ${repository.name} on branch ${branch}`,
    );

    const response: WebhookResponse = {
      success: true,
      message: "Push event processed successfully",
      event: "push",
      repository: {
        id: repository.id,
        name: repository.name,
        owner: repository.owner.username,
      },
      sender: {
        id: sender.id,
        username: sender.username,
      },
      branch,
      commits: commits.map((commit) => ({
        id: commit.id,
        message: commit.message,
        author: commit.author.name,
        timestamp: commit.timestamp,
      })),
      timestamp: new Date().toISOString(),
    };

    console.log(response);
    return res.json(response);
  } catch (error) {
    logger.error("Error handling push event:", error);
    return res.status(400).json({
      success: false,
      message: "Error processing push event",
      error: (error as Error).message,
    });
  }
}

function handleUnknownEvent(payload: WebhookPayload, res: Response): Response {
  try {
    if (!payload.event) {
      throw new Error("Event type is missing");
    }
    logger.info(`Received unhandled event type: ${payload.event}`);

    return res.json({
      success: false,
      message: `Unhandled event type: ${payload.event}`,
      payload,
    });
  } catch (error) {
    logger.error("Error handling unknown event:", error);
    return res.status(400).json({
      success: false,
      message: "Error processing unknown event",
      error: (error as Error).message,
    });
  }
}
