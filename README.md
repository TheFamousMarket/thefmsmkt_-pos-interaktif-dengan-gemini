# Interactive POS System with Gemini AI

A comprehensive Point of Sale (POS) system with WhatsApp integration, Vision AI capabilities, and Gemini AI for smart suggestions and analytics.

## Features

- Interactive POS interface with product catalog
- WhatsApp Business API integration for customer notifications
- Google Vision AI for product recognition
- Gemini AI for product descriptions and recommendations
- Inventory management with visual stock-in process
- CRM functionality with customer analytics
- Multi-language support (English and Bahasa Malaysia)

## Setup Instructions

### Prerequisites
- Node.js
- npm
- WhatsApp Business API account
- Google Cloud Vision API credentials
- Gemini API key

### Installation

1. Clone the repository:
   \\\
   git clone https://github.com/TheFamousMarket/thefmsmkt_-pos-interaktif-dengan-gemini.git
   cd thefmsmkt_-pos-interaktif-dengan-gemini
   \\\

2. Install dependencies:
   \\\
   npm install
   \\\

3. Set up environment variables in \.env.local\:
   \\\
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_WHATSAPP_TOKEN=your_whatsapp_token
   VITE_META_APP_ID=your_meta_app_id
   VITE_META_APP_SECRET=your_meta_app_secret
   VITE_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
   VITE_GOOGLE_CLOUD_CREDENTIALS_PATH=path_to_credentials_json
   \\\

4. Start the development server:
   \\\
   npm run dev
   \\\

5. Start the webhook server:
   \\\
   cd server
   npm install
   npm start
   \\\

## Deployment

To deploy to thefmsmkt.com:

1. Build the application:
   \\\
   npm run build
   \\\

2. Deploy the \dist\ folder and server directory to your hosting provider

## WhatsApp Webhook Setup

1. Use ngrok to expose your webhook server:
   \\\
   ngrok http 3001
   \\\

2. Configure webhook in Meta Developer Dashboard:
   - Callback URL: https://your-domain.com/webhook
   - Verify Token: pos_whatsapp_webhook_verify_token
   - Subscribe to: messages, message_status_updates

## License

© 2025 The Famous Market. All rights reserved.

