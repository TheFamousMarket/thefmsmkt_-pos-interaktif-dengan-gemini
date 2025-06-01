import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WebhookMessage {
  type: string;
  data: {
    from: string;
    timestamp: number;
    type: string;
    text: string;
    id: string;
  };
}

interface WebhookContextType {
  messages: WebhookMessage[];
  connected: boolean;
  clearMessages: () => void;
}

const WebhookContext = createContext<WebhookContextType>({
  messages: [],
  connected: false,
  clearMessages: () => {}
});

export const useWebhook = () => useContext(WebhookContext);

interface WebhookProviderProps {
  children: ReactNode;
}

export const WebhookProvider: React.FC<WebhookProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebhookMessage[]>([]);

  useEffect(() => {
    // Connect to WebSocket server
    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
      console.log('Connected to webhook server');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, message]);
      } catch (error) {
        console.error('Error parsing webhook message:', error);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from webhook server');
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    setSocket(ws);

    // Clean up on unmount
    return () => {
      ws.close();
    };
  }, []);

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <WebhookContext.Provider value={{ messages, connected, clearMessages }}>
      {children}
    </WebhookContext.Provider>
  );
};

export default WebhookContext;