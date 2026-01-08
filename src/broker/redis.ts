import { createClient, RedisClientType } from "redis";

async function clientConnect() {
  const client = await createClient({ url: "redis://localhost:6379" })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  return client;
}

async function clientDestroy(client: RedisClientType) {
  client.destroy();
}

export { clientConnect, clientDestroy };
