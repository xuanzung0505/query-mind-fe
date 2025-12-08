import { StreamStatus } from "@/utils/fetchSseStream";
import { useState } from "react";

function useRetrieveAIReply() {
  const [status, setStatus] = useState<StreamStatus>(StreamStatus.INITIAL);
  const [incomingMessage, setIncomingMessage] = useState<string>("");

  return { status, setStatus, incomingMessage, setIncomingMessage };
}

export default useRetrieveAIReply;
