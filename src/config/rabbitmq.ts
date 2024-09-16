import amqp from "amqplib";
import logger from "../utils/logger";

export const rabbitMQConfig = {
  url: process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672",
  exchange: "webhook_exchange",
  queueBackendCore: "backend_core_queue",
  queueTestRunner: "test_runner_queue",
  routingKey: "webhook.event",
};

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

export async function setupRabbitMQ() {
  try {
    connection = await amqp.connect(rabbitMQConfig.url);
    channel = await connection.createChannel();

    await channel.assertExchange(rabbitMQConfig.exchange, "topic", {
      durable: true,
    });
    await channel.assertQueue(rabbitMQConfig.queueBackendCore, {
      durable: true,
    });
    await channel.assertQueue(rabbitMQConfig.queueTestRunner, {
      durable: true,
    });

    await channel.bindQueue(
      rabbitMQConfig.queueBackendCore,
      rabbitMQConfig.exchange,
      rabbitMQConfig.routingKey,
    );
    await channel.bindQueue(
      rabbitMQConfig.queueTestRunner,
      rabbitMQConfig.exchange,
      rabbitMQConfig.routingKey,
    );

    logger.info("RabbitMQ setup completed");
  } catch (error: unknown) {
    logger.error("Error setting up RabbitMQ:", error);
await cleanupRabbitMQ();
    throw new Error(
      `Failed to setup RabbitMQ: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function cleanupRabbitMQ() {
  if (channel) {
    try {
      await channel.close();
    } catch (closeError: unknown) {
      logger.error("Error closing RabbitMQ channel:", closeError);
    }
    channel = null;
  }
  if (connection) {
    try {
      await connection.close();
    } catch (closeError: unknown) {
      logger.error("Error closing RabbitMQ connection:", closeError);
    }
    connection = null;
  }
}

// using this to make sure rabbit is properly set up befre use in the server.
export function getChannel(): amqp.Channel {
  if (!channel) {
    logger.error("Attempting to access uninitialized RabbitMQ channel");
    throw new Error("RabbitMQ channel not initialized");
  }
  return channel;
}
