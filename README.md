# AI Support Chat – Take-Home Assignment

This project is a minimal AI-powered customer support chat application built as part of a founding full-stack engineer take-home assignment.

The goal was to simulate a real live-chat support widget while prioritizing correctness, robustness, and clean architecture over feature complexity.

---

## Features

- Live chat UI with user and AI messages
- Session-based conversations
- Persistent message storage
- Real LLM integration
- Graceful handling of API failures and invalid input
- Simple, predictable UX

---

## Tech Stack

**Frontend**

- React + TypeScript
- Vite

**Backend**

- Node.js
- Express
- TypeScript

**Database**

- SQLite
- Prisma ORM

**AI**

- OpenAI API (`gpt-4o-mini`)

---

## Running Locally

### Backend

-```bash
-cd server
npm install
npm run dev

The backend runs at:
-http://localhost:3000

### Frontend

- client
  -npm install
  -npm run dev

The frontend runs at:
http://localhost:5173

---

### End-to-End Flow

Open the frontend at http://localhost:5173
Type a message in the chat UI
The frontend sends requests to the backend at http://localhost:3000
The backend persists messages, invokes the LLM, and returns a reply

---

### Architecture Notes

HTTP routes are kept thin and handle only request validation and response formatting.

Core chat logic is routed through a ChatChannel abstraction, making it easy to add additional channels (e.g. WhatsApp, Instagram) without changing the API layer.

LLM calls are isolated to allow future async processing, retries, or background job execution.

Failure Handling & Robustness
The system is intentionally defensive and designed to degrade gracefully.

---

### Handled cases include:

Empty messages
Excessively long messages
Invalid or missing session IDs
Network failures
LLM/API errors (timeouts, rate limits, insufficient quota)
If the LLM API is unavailable, the chat continues to function and surfaces a clear, friendly error message in the UI instead of failing silently or crashing.

---

### Possible Improvements

Streaming AI responses
Message history hydration on reload
Rate limiting and abuse prevention
Authentication & multi-tenant support
Tool / function calling for structured actions

---

### Summary

This project focuses on clarity, correctness, and resilience rather than feature breadth.
The goal was to build a small but realistic piece of a production system that behaves predictably even when dependencies fail.
