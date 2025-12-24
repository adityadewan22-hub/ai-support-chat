export interface ChatChannel {
  sendMessage(input: {
    message: string;
    sessionId?: string;
  }): Promise<{
    reply: string;
    sessionId: string;
  }>;
}
