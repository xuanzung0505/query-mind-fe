import amqp from "amqplib";
import { MAIN_QUEUE } from "./consts";
import crypto from "crypto";
import stringify from "json-stable-stringify";
import { ObjectId } from "mongodb";

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
 * Hash the message under SHA256 then apply the hash as the message Id
 */
function sendMessage(channel: amqp.Channel, msg: string) {
  const contentHash = crypto.createHash("sha256").update(msg).digest("hex"); // Resulting ID looks like "5e8862..."
  channel.sendToQueue(MAIN_QUEUE, Buffer.from(msg), {
    messageId: contentHash,
    persistent: true, // an 'acceptable' guarantee that the message can survive RabbitMQ restart
  });
  console.log(" [x] Sent message, id='%s'", contentHash);
}

consumerInit(
  stringify({
    _id: new ObjectId("69550310e4c8eb1dabf63780"),
    contentType: "application/pdf",
    size: 170005,
    status: "Uploaded",
    createdById: "d68f",
    projectId: "pr10",
    url: "https://00rvqhkvqeiasdeh.public.blob.vercel-storage.com/d68f/mongodb.pdf",
    downloadUrl:
      "https://00rvqhkvqeiasdeh.public.blob.vercel-storage.com/d68f/mongodb.pdf?download=1",
    pathname: "d68f/mongodb.pdf",
    createdAt: new Date("2025-12-31T05:34:27.000Z"),
    updatedAt: new Date("2025-12-31T05:34:27.000Z"),
  }) as string
);
