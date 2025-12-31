import amqp from "amqplib";
import { EXCHANGE_NAME, QUEUE_NAME } from "./consts";
import handleMessage from "./handleMessage";

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
  createPublisher(channel);

  // create consumers
  createConsumer(channel);
  createConsumer(channel);
}

function createPublisher(channel: amqp.Channel) {
  console.log(" [x] Init publisher");
  channel.assertExchange(EXCHANGE_NAME, "fanout", {
    durable: true,
  });
  channel.assertQueue(QUEUE_NAME, {
    durable: true, // ensure queue can survive rabbitmq node restart
  });
}

function createConsumer(channel: amqp.Channel) {
  console.log(" [x] Init consumer");
  // This makes sure the queue is declared before attempting to consume from it
  // channel.assertQueue(QUEUE_NAME, {
  // durable: true,
  // });

  channel.consume(
    QUEUE_NAME,
    async (msg) => {
      if (msg != null) {
        const result = await handleMessage(msg);
        if (result) {
          console.log(" [x] Done");
          channel.ack(msg);
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
