// spawn a process then forked onto the master process
import sumOfPrimes from "./job";

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
