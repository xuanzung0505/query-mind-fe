import cluster from "cluster";
import os from "os";
import sumOfPrimes from "./job";
const cpuCount = os.cpus().length; //returns no of cores our cpu have

if (cluster.isPrimary) {
  masterProcess();
} else {
  childProcess();
}

function masterProcess() {
  console.log(`Master process ${process.pid} is running`);

  //fork workers.
  for (let i = 0; i < cpuCount; i++) {
    console.log(`Forking process number ${i}...`);
    cluster.fork(); //creates new node js processes
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died, ${code}, ${signal}`);
    cluster.fork(); //forks a new process if any process dies
  });
}

function childProcess() {
  process.on("message", (message) => {
    //child process is listening for messages by the parent process
    console.log("Hello from process: " + process.pid);
    console.log("Message:", JSON.stringify(message));
    const result = sumOfPrimes(600000);
    if (process.send) {
      process.send(result);
    }
    process.exit(); // make sure to use exit() to prevent orphaned processes
  });
}
