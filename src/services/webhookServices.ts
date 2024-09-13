import logger from "../utils/logger";
import { WebhookPayload, DispatchPayload } from "../models/webhookModels";
import { EVENT_TYPE } from "../utils/constants";
import { getChannel } from "../config/rabbitmq";
import { rabbitMQConfig } from "../config/rabbitmq";

export const createWebhookService = () => {
  const publishToRabbitMQ = async (payload: DispatchPayload): Promise<void> => {
    try {
      const channel = getChannel();
      channel.publish(
        rabbitMQConfig.exchange,
        rabbitMQConfig.routingKey,
        Buffer.from(JSON.stringify(payload)),
      );
      logger.info(`Successfully published to RabbitMQ`);
    } catch (error) {
      logger.error(`Error publishing to RabbitMQ:`, error);
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
        event_type: EVENT_TYPE,
        repoUrl: repository.http_url,
        branch,
        commitSha,
      };

      // Publish to RabbitMQ
      await publishToRabbitMQ(dispatchPayload);

      logger.info("Webhook processed and published to RabbitMQ successfully");
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
