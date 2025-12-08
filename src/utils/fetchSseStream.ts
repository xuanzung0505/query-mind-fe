import { Dispatch, SetStateAction } from "react";

export enum StreamStatus {
  INITIAL = "initial",
  LOADING = "loading",
  FINISHED = "finished",
}

export default async function fetchSseStream({
  url,
  postData,
  status,
  setStatus,
  handleEvent,
}: {
  url: string;
  postData: Record<string, unknown> | undefined;
  status: StreamStatus;
  setStatus?: Dispatch<SetStateAction<StreamStatus>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleEvent: (args: any) => any;
}) {
  if (status === StreamStatus.LOADING) return;
  try {
    // 1. Prepare Request Options (Allows sending POST data or custom headers)
    const options: RequestInit = {
      method: postData ? "POST" : "GET",
      headers: {
        // Essential headers if sending JSON data
        "Content-Type": "application/json",
      },
    };
    if (postData) {
      options.body = JSON.stringify(postData);
    }

    // 2. Initiate the fetch request
    if (setStatus) setStatus(StreamStatus.LOADING);
    const response = await fetch(url, options);

    // Check for 401 Unauthorized status
    if (response.status === 401) {
      console.warn("401 Unauthorized - Redirecting to sign-in...");
      if (typeof window !== "undefined") {
        // Use a client-side navigation method here since this utility runs in the browser
        window.location.assign("/sign-in");
        // Throw to stop further processing; navigation will replace the page.
        throw new Error("Redirecting to sign-in");
      }
      // If somehow executed on the server, throw a clear error
      throw new Error("Unauthorized: redirect to /sign-in required");
    }

    // Handle other HTTP errors (e.g., 500, 400, etc.)
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({})); // Handle non-JSON responses
      throw new Error(
        errorBody.error || `HTTP error! status: ${response.status}`
      );
    }

    // Crucially, check if the server responded with the correct content type
    const contentType = response.headers.get("Content-Type");
    if (contentType?.split(";")[0] !== "text/event-stream") {
      console.error(
        "Server did not return 'text/event-stream'. Found:",
        contentType
      );
      return;
    }

    // 3. Get the stream reader
    const reader = response.body?.getReader();
    if (reader === undefined) throw new Error("Reader is empty");

    const decoder = new TextDecoder();

    // Variables to accumulate data for a single SSE event
    let buffer = "";

    // 4. Start reading the stream continuously
    while (true) {
      const chunk = await reader.read();
      const { done, value } = chunk;
      if (done) {
        console.log("Stream finished.");
        if (setStatus) setStatus(StreamStatus.FINISHED);
        break;
      }
      // Decode the new chunk of data
      buffer += decoder.decode(value, { stream: true });
      // 5. Manually parse SSE messages from the buffer
      // SSE messages are separated by two newlines (\n\n)
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || ""; // Keep the last, incomplete part in the buffer
      for (const part of parts) {
        if (part.startsWith("data:")) {
          // Remove the "data: " prefix and process the message
          const message = part.substring(5).trim();
          try {
            const parsedEvent = JSON.parse(message);
            // console.log("Parsed JSON message:", parsedEvent);
            handleEvent(parsedEvent);
          } catch {
            console.log("Raw text message:", message);
          }
        }
        // NOTE: This basic example ignores 'event:' and 'id:' fields.
      }
    }
  } catch (error) {
    console.error("Network or streaming error:", error);
    if (setStatus) setStatus(StreamStatus.FINISHED);
  }
}
