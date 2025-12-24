import { ChatChannel } from "./ChatChannel";
import {
  createUserMessage,
  createAIMessage,
  getConversationMessages,
} from "../messages";
import prisma from "../db";
import { generateReply } from "../services/llm";

export class WebChatChannel implements ChatChannel {
  async sendMessage(input: {
    message: string;
    sessionId?: string;
  }): Promise<{ reply: string; sessionId: string }> {
    let conversationId = input.sessionId;

    if (!conversationId) {
      const conversation = await prisma.conversation.create({ data: {} });
      conversationId = conversation.id;
    }

    await createUserMessage(conversationId, input.message);

    const history = await getConversationMessages(conversationId);

    const reply = await generateReply(
      history.map((m) => ({ sender: m.sender, text: m.text })),
      input.message
    );

    await createAIMessage(conversationId, reply);

    return { reply, sessionId: conversationId };
  }
}
