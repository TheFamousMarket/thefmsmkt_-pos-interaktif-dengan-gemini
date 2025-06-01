import { MetaResponse } from '../types';

// Use environment variables for credentials
const APP_ID = process.env.VITE_META_APP_ID || '';
const APP_SECRET = process.env.VITE_META_APP_SECRET || '';
const WHATSAPP_TOKEN = process.env.VITE_WHATSAPP_TOKEN || '';

if (!APP_ID || !APP_SECRET || !WHATSAPP_TOKEN) {
  console.warn('Meta credentials not set. WhatsApp Business features will not work.');
}

/**
 * Sends a WhatsApp message using the Meta Business API
 */
export const sendWhatsAppMessage = async (
  phoneNumber: string, 
  message: string
): Promise<MetaResponse<any>> => {
  if (!WHATSAPP_TOKEN) {
    return { 
      data: null, 
      error: 'WhatsApp token not configured. Please set the VITE_WHATSAPP_TOKEN environment variable.' 
    };
  }

  try {
    const response = await fetch('https://graph.facebook.com/v18.0/me/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'text',
        text: { body: message }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { data: null, error: data.error?.message || 'Failed to send WhatsApp message' };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
    return { data: null, error: errorMessage };
  }
};