import prisma from "./db";

export async function createUserMessage(
  conversationId: string,
  text: string
) {
  return prisma.message.create({
    data: {
      conversationId,
      sender: "user",
      text,
    },
  });
}

export async function createAIMessage(
  conversationId: string,
  text: string
) {
  return prisma.message.create({
    data: {
      conversationId,
      sender: "ai",
      text,
    },
  });
}

export async function getConversationMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}
