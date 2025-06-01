# TheFMSMKT POS - Interactive POS with Gemini

An interactive Point of Sale system enhanced with Google Gemini AI capabilities.

## Features

- Modern POS interface with product scanning and checkout
- Vision-based product recognition using Google Vision AI
- WhatsApp integration for notifications and customer interactions
- Inventory management with real-time tracking
- Employee management system
- Sales reporting and analytics
- E-Invoice generation and management

## Tech Stack

- React 19 with TypeScript
- Vite for frontend build
- Express.js for backend server
- Google Cloud services (Vision AI, Cloud Run)
- Google Gemini AI for intelligent interactions
- WhatsApp Business API integration

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Google Cloud account with Vision AI and Gemini API enabled
- WhatsApp Business API access

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/thefmsmkt-pos.git
   cd thefmsmkt-pos
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env.local` file based on `.env.example` and add your API keys

4. Start the development server
   ```
   npm run dev
   ```

### Production Deployment

The application is configured for deployment to Google Cloud Run:

1. Build the Docker image
   ```
   docker build -t gcr.io/your-project-id/thefmsmkt-pos:latest .
   ```

2. Push to Google Container Registry
   ```
   docker push gcr.io/your-project-id/thefmsmkt-pos:latest
   ```

3. Deploy to Cloud Run
   ```
   gcloud run deploy thefmsmkt-pos --image gcr.io/your-project-id/thefmsmkt-pos:latest --platform managed --allow-unauthenticated
   ```

Alternatively, use the GitHub Actions workflow by setting up the required secrets:
- `GCP_PROJECT_ID`: Your Google Cloud project ID
- `GCP_SA_KEY`: Your service account key JSON (base64 encoded)

## Development

### Server

The backend server handles:
- Serving the static frontend files
- WhatsApp webhook integration
- WebSocket connections for real-time updates

### Frontend

The React frontend provides:
- POS interface with product scanning
- Inventory management screens
- Employee management
- Sales reporting and analytics

## License

This project is licensed under the MIT License - see the LICENSE file for details.