import amqp from "amqplib";

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

    console.log("RabbitMQ setup completed");
  } catch (error) {
    console.error("Error setting up RabbitMQ:", error);
    throw error;
  }
}

export function getChannel(): amqp.Channel {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  return channel;
}
