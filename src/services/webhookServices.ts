import axios from "axios";
import logger from "../utils/logger";
import {
  WebhookPayload,
  ServiceConfig,
  DispatchPayload,
} from "../models/webhookModels";
import { EVENT_TYPE } from "../utils/constants";

export const createWebhookService = (services: ServiceConfig[]) => {
  const dispatchToService = async (
    service: ServiceConfig,
    payload: DispatchPayload,
  ): Promise<void> => {
    try {
      await axios.post(service.url, payload);
      logger.info(`Successfully dispatched to ${service.name}`);
    } catch (error) {
      logger.error(`Error dispatching to ${service.name}:`, error);
      throw error;
    }
  };

  const processWebhook = async (payload: WebhookPayload): Promise<void> => {
    try {
      const { repository, ref, after: commitSha } = payload;
      const branch = ref.split("/").pop() || "unknown";

      logger.info(
        `Processing webhook for ${repository.name}, branch: ${branch}, commit: ${commitSha}`,
      );

      const dispatchPayload: DispatchPayload = {
        type: EVENT_TYPE,
        repoUrl: repository.http_url,
        branch,
        commitSha,
      };

      // Dispatch to all configured services
      await Promise.all(
        services.map((service) => dispatchToService(service, dispatchPayload)),
      );

      logger.info(
        "Webhook processed and dispatched to all services successfully",
      );
    } catch (error) {
      logger.error("Error processing webhook:", error);
      throw error;
    }
  };

  return {
    processWebhook,
  };
};

export type WebhookService = ReturnType<typeof createWebhookService>;
