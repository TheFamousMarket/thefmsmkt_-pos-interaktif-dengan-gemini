# WhatsApp Webhook Server

This server handles webhooks from the WhatsApp Business API and forwards messages to the POS application via WebSockets.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. For development with auto-restart:
   ```
   npm run dev
   ```

## Making the Server Publicly Accessible

For WhatsApp to send webhooks to your server, it needs to be accessible from the internet. For development, you can use ngrok:

1. Install ngrok: https://ngrok.com/download

2. Start ngrok to expose your local server:
   ```
   ngrok http 3001
   ```

3. Use the HTTPS URL provided by ngrok as your Callback URL in the WhatsApp Business Platform settings.

## Webhook Configuration

In your Meta App dashboard:

1. Go to WhatsApp > Configuration > Webhooks
2. Click "Edit"
3. Enter your Callback URL (e.g., https://your-ngrok-url.ngrok.io/webhook)
4. Enter your Verify Token: `pos_whatsapp_webhook_verify_token`
5. Subscribe to the following fields:
   - messages
   - message_status_updates

## Environment Variables

The server uses the following environment variables:

- `PORT`: The port to run the server on (default: 3001)
- `VITE_WEBHOOK_VERIFY_TOKEN`: The token used to verify webhook requests

These are loaded from the `.env.local` file in the parent directory.