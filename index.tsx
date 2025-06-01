
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { CartProvider } from './contexts/CartContext';
import { WebhookProvider } from './contexts/WebhookContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <ToastProvider>
        <LanguageProvider>
          <AuthProvider>
            <NavigationProvider>
              <CartProvider>
                <WebhookProvider>
                  <App />
                </WebhookProvider>
              </CartProvider>
            </NavigationProvider>
          </AuthProvider>
        </LanguageProvider>
      </ToastProvider>
    </HashRouter>
  </React.StrictMode>
);
