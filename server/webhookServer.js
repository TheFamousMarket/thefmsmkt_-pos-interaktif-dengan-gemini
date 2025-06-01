import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

// Load environment variables
dotenv.config({ path: '../.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
  clients.add(ws);
  
  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Broadcast message to all connected clients
const broadcastMessage = (data) => {
  clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify(data));
    }
  });
};

// Middleware
app.use(express.json());
app.use(cors());

// Verification token from environment variables
const VERIFY_TOKEN = process.env.VITE_WEBHOOK_VERIFY_TOKEN || 'pos_whatsapp_webhook_verify_token';
console.log('Webhook verify token:', VERIFY_TOKEN);

// Webhook verification endpoint
app.get('/webhook', (req, res) => {
  // Parse parameters from the webhook verification request
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  } else {
    // Return a '404 Not Found' if mode or token are missing
    res.sendStatus(404);
  }
});

// Webhook endpoint for receiving messages
app.post('/webhook', (req, res) => {
  const body = req.body;

  console.log('Received webhook:', JSON.stringify(body, null, 2));

  // Check if this is an event from a WhatsApp Business Account
  if (body.object === 'whatsapp_business_account') {
    // Process the WhatsApp message
    if (body.entry && body.entry.length > 0) {
      const entry = body.entry[0];
      
      if (entry.changes && entry.changes.length > 0) {
        const change = entry.changes[0];
        
        // Process messages
        if (change.value && change.value.messages && change.value.messages.length > 0) {
          const message = change.value.messages[0];
          
          // Broadcast the message to all connected clients
          broadcastMessage({
            type: 'whatsapp_message',
            data: {
              from: message.from,
              timestamp: message.timestamp,
              type: message.type,
              text: message.text?.body || '',
              id: message.id
            }
          });
        }
      }
    }

    // Return a '200 OK' response to acknowledge receipt of the event
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp Business Account
    res.sendStatus(404);
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});