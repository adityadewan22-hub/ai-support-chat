import express from "express";
import prisma from "./db";
import chatRoutes from "./routes/chat";
import { generateReply } from "./services/llm";
import cors from "cors";



const app = express();
const PORT = 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-support-chat-gilt.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/chat", chatRoutes);


app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
});