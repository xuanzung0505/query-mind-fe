import { createClient, RedisClientType } from "redis";

const RETRY_INTERVAL = 10 * 1000;
const RETRY_ATTEMPTS = 3;

async function clientConnect() {
  const client = await createClient({
    url: "redis://localhost:6379",
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > RETRY_ATTEMPTS) {
          console.log("Max retries reached. Stopping reconnection.");
          return false; // Stop retrying
        }
        return RETRY_INTERVAL;
      },
    },
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  return client;
}

async function clientDestroy(client: RedisClientType) {
  client.destroy();
}

export { clientConnect, clientDestroy };
