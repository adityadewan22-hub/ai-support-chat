import { Router } from "express";
import { WebChatChannel } from "../channels/WebChatChannel";

const router = Router();
const channel = new WebChatChannel();

router.post("/message", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    // Input validation stays at the HTTP boundary
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        error: "Message too long. Please keep it under 1000 characters.",
      });
    }

    // Delegate business logic to channel
    const result = await channel.sendMessage({
      message,
      sessionId,
    });

    res.json(result);
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
