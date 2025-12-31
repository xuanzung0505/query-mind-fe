import amqp from "amqplib";
import { QUEUE_NAME } from "./consts";

async function consumerInit(msg: string) {
  const conn = await amqp.connect({
    protocol: "amqp",
    hostname: "localhost",
    port: 5672,
    frameMax: 8192,
  });
  const channel = await conn.createChannel();
  sendMessage(channel, msg);
}

/**
 * Message definition:
 * docId
 * docContent
 */
function sendMessage(channel: amqp.Channel, msg: string) {
  channel.sendToQueue(QUEUE_NAME, Buffer.from(msg), {
    persistent: true, // an 'acceptable' guarantee that the message can survive rabbitmq restart
  });
  console.log(" [x] Sent '%s'", msg);
}

consumerInit(
  JSON.stringify({
    mimeType: ".pdf",
    size: 17005,
    status: "Uploaded",
    createdById: "d68f",
    projectId: "pr10",
    url: "https://00rvqhkvqeiasdeh.public.blob.vercel-storage.com/d68f/mongodb.pdf",
    downloadUrl:
      "https://00rvqhkvqeiasdeh.public.blob.vercel-storage.com/d68f/mongodb.pdf?download=1",
    pathname: "d68f/mongodb.pdf",
    createdAt: new Date("2025-12-31T05:34:27.000Z"),
    updatedAt: new Date("2025-12-31T05:34:27.000Z"),
  })
);
