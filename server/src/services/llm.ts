import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FAQ_CONTEXT = `
Store Policies:
- Shipping: We ship worldwide. Orders are delivered within 5–7 business days.
- Returns: Returns are accepted within 30 days of delivery.
- Refunds: Refunds are processed within 5 business days after approval.
- Support hours: Monday to Friday, 9am–6pm IST.
`;

export async function generateReply(
  history: { sender: string; text: string }[],
  userMessage: string
): Promise<string> {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are a helpful customer support agent for a small e-commerce store.Use the store policies below to answer customer questions accurately.If the question is unrelated, respond politely.\n" +
          FAQ_CONTEXT,

      },
      ...history.map(
        (m): ChatCompletionMessageParam => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        })
      ),
      {
        role: "user",
        content: userMessage,
      },
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 200,
    });

    return (
      response.choices[0]?.message?.content ??
      "Sorry, I couldn't generate a response."
    );
  } catch (error) {
    console.error("LLM error:", error);
    return "Sorry, our support agent is temporarily unavailable. Please try again later.";
  }
}
