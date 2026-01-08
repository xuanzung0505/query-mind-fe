import { FileType } from "@/types/FileType";
import amqp from "amqplib";
import crypto from "crypto";
import stringify from "json-stable-stringify";

const MAIN_QUEUE = "querymind_docs_main_queue";

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

async function publishToQueue(file: FileType) {
  try {
    const conn = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: 5672,
      frameMax: 8192,
    });
    const channel = await conn.createConfirmChannel();
    sendMessage(channel, stringify(file) as string);
    await channel.waitForConfirms();
    await conn.close();
  } catch (error) {
    console.log(error);
  }
}

export { publishToQueue };
