import { useEffect, useRef, useState } from "react";
type Message = { sender: "user" | "ai"; text: string };
export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem("sessionId");
  });
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMessage = input;
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chat/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage, sessionId }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setSessionId(data.sessionId);
      localStorage.setItem("sessionId", data.sessionId);
      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            err.message ||
            "Sorry, something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        fontFamily: "sans-serif",
        background: "#0e0e0e",
        color: "#fff",
        padding: 16,
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>AI Support Chat</h2>

      <div
        style={{
          border: "1px solid #333",
          padding: 12,
          height: 320,
          overflowY: "auto",
          background: "#000",
          borderRadius: 8,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.sender === "user" ? "right" : "left",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 12,
                maxWidth: "80%",
                background: m.sender === "user" ? "#2f80ed" : "#f2c94c",
                color: "#000",
                wordWrap: "break-word",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}

        {loading && (
          <div style={{ color: "#aaa", fontStyle: "italic" }}>
            Agent is typing…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", marginTop: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message…"
          disabled={loading}
          style={{
            flex: 1,
            padding: 8,
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: 6,
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            marginLeft: 6,
            padding: "8px 14px",
            background: "#222",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
