import React from 'react';
import { useWebhook } from '@contexts/WebhookContext';
import PageHeader from '@components/common/PageHeader';

const WebhookMonitor: React.FC = () => {
  const { messages, connected, clearMessages } = useWebhook();

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="p-4">
      <PageHeader title="WhatsApp Webhook Monitor" />
      
      <div className="mb-4 flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span>{connected ? 'Connected to webhook server' : 'Disconnected from webhook server'}</span>
        
        <button 
          onClick={clearMessages}
          className="ml-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Clear Messages
        </button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-3 border-b font-medium">
          Incoming WhatsApp Messages
        </div>
        
        <div className="divide-y">
          {messages.length === 0 ? (
            <div className="p-4 text-gray-500 italic">
              No messages received yet. Messages will appear here when customers send WhatsApp messages.
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">From: {msg.data.from}</span>
                  <span className="text-sm text-gray-500">{formatTimestamp(msg.data.timestamp)}</span>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  {msg.data.text}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Message ID: {msg.data.id} • Type: {msg.data.type}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Webhook Setup Information</h3>
        <p className="mb-2">To receive WhatsApp messages, configure your Meta App with these webhook details:</p>
        <ul className="list-disc pl-5 mb-4">
          <li><strong>Callback URL:</strong> https://your-domain.com/webhook</li>
          <li><strong>Verify Token:</strong> pos_whatsapp_webhook_verify_token</li>
        </ul>
        <p className="text-sm text-gray-600">
          Note: Your server needs to be accessible from the internet. Consider using a service like ngrok for local development.
        </p>
      </div>
    </div>
  );
};

export default WebhookMonitor;