import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;
const server = createServer(app);

// Setup middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// WebSocket server
const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (message) => {
    console.log("Received message:", message);
  });
  ws.on("close", () => console.log("Client disconnected"));
});

// Broadcast to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Webhook endpoints
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  
  const VERIFY_TOKEN = process.env.VITE_WEBHOOK_VERIFY_TOKEN || "pos_whatsapp_webhook_verify_token";
  
  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(404);
  }
});

app.post("/webhook", (req, res) => {
  console.log("Received webhook:", JSON.stringify(req.body, null, 2));
  
  // Broadcast webhook data to connected clients
  try {
    broadcast({ type: 'webhook', data: req.body });
  } catch (error) {
    console.error("Error broadcasting webhook:", error);
  }
  
  res.status(200).send("EVENT_RECEIVED");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send("Internal Server Error");
});

// Serve static files
app.use(express.static(path.join(__dirname, "dist")));

// All other routes serve the index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
