import express from "express";
import prisma from "./db";
import chatRoutes from "./routes/chat";
import { generateReply } from "./services/llm";
import cors from "cors";



const app = express();
const PORT = 3000;

app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());
app.use("/chat", chatRoutes);


app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
});