import amqp from "amqplib";
import handleMessage from "./handleMessage";
import {
  MAIN_EXCHANGE,
  MAIN_QUEUE,
  RETRY_EXCHANGE,
  RETRY_QUEUE,
} from "./consts";

const RETRY_INTERVAL = 2 * 60 * 1000; // 2 minutes

// currently we will work with 1 queue and 2 consumers
async function brokerInit() {
  const conn = await amqp.connect({
    protocol: "amqp",
    hostname: "localhost",
    port: 5672,
    frameMax: 8192,
  });

  console.log(" [x] Connected");

  const channel = await conn.createChannel();
  channel.prefetch(1); // This makes sure a worker only processes 1 msg at a time
  // default distribution is round-robin
  await createPublisher(channel);

  // create consumers
  await createConsumer(channel);
  await createConsumer(channel);
}

async function createPublisher(channel: amqp.Channel) {
  console.log(" [x] Init publisher");
  await channel.assertExchange(MAIN_EXCHANGE, "fanout", {
    durable: true,
  });
  await channel.assertQueue(MAIN_QUEUE, {
    durable: true, // ensure queue can survive rabbitmq node restart
    arguments: {
      "x-dead-letter-exchange": RETRY_EXCHANGE,
      "x-dead-letter-routing-key": "retry",
    },
  });
  await channel.bindQueue(MAIN_QUEUE, MAIN_EXCHANGE, "work");
  channel.assertExchange(RETRY_EXCHANGE, "direct", { durable: true });
  // 3. Setup Retry Queue (Routes back to Main Exchange after 10s TTL)
  await channel.assertQueue(RETRY_QUEUE, {
    durable: true,
    arguments: {
      "x-message-ttl": RETRY_INTERVAL,
      "x-dead-letter-exchange": MAIN_EXCHANGE,
      "x-dead-letter-routing-key": "work",
    },
  });
  await channel.bindQueue(RETRY_QUEUE, RETRY_EXCHANGE, "retry");
}

async function createConsumer(channel: amqp.Channel) {
  console.log(" [x] Init consumer");
  // This makes sure the queue is declared before attempting to consume from it
  // channel.assertQueue(MAIN_QUEUE, {
  // durable: true,
  // });

  await channel.consume(
    MAIN_QUEUE,
    async (msg) => {
      if (msg != null) {
        const result = await handleMessage(msg);
        if (result) {
          console.log(" [x] Done");
          channel.ack(msg);
        } else {
          console.log(` [x] Message failed, id='${msg.properties.messageId}'`);
          channel.nack(msg, false, false);
        }
      }
    },
    {
      // automatic acknowledgment mode,
      // see /docs/confirms for details
      noAck: false,
    }
  );
}

brokerInit();
