import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_SECRET });

// The AI response is sent in a single HTTP response
const queryAIReply = async () => {
  try {
    const stream = await client.responses.create({
      model: "gpt-5-nano",
      input: [
        {
          role: "developer",
          content: "answer with less than 30 words",
        },
        {
          role: "user",
          content: "Write a one-sentence bedtime story about a unicorn.",
        },
      ],
      reasoning: {
        effort: "minimal",
      },
      stream: true,
    });
    for await (const event of stream) {
      if (
        [
          "response.created",
          "response.output_text.delta",
          "response.output_text.done",
          "response.completed",
        ].includes(event.type)
      )
        console.log(event);
    }
    return {};
  } catch (error) {
    console.log(error);
  }
};

export { queryAIReply };
