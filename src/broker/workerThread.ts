// spawn a worker thread
import { parentPort, workerData } from "worker_threads";
import { processDoc } from "./job";

processDoc(workerData).then((result) => {
  // Send the result back to the main thread
  parentPort?.postMessage(result);
});
