import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainAppLayout from './components/layout/MainAppLayout';
import LoginScreen from './pages/LoginScreen';
import DashboardPage from './pages/DashboardPage';
import POSPage from './pages/POS/POSPage';
import VisionCheckoutPage from './pages/VisionCheckout/VisionCheckoutPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import VisionStockInPage from './pages/Inventory/VisionStockInPage';
import InventoryMonitoringPage from './pages/Inventory/InventoryMonitoringPage';
import CRMPage from './pages/CRM/CRMPage';
import EmployeePage from './pages/Employee/EmployeePage';
import ReportsPage from './pages/Reports/ReportsPage';
import WebhookMonitor from './pages/WhatsAppWebhook/WebhookMonitor';
import SettingsPage from './pages/SettingsPage';
import EInvoiceHistoryPage from './pages/POS/EInvoiceHistoryPage';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<MainAppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="pos" element={<POSPage />} />
        <Route path="pos/einvoice-history" element={<EInvoiceHistoryPage />} />
        <Route path="vision-checkout" element={<VisionCheckoutPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="inventory/vision-stock-in" element={<VisionStockInPage />} />
        <Route path="inventory/monitoring" element={<InventoryMonitoringPage />} />
        <Route path="crm" element={<CRMPage />} />
        <Route path="employees" element={<EmployeePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="whatsapp-webhook" element={<WebhookMonitor />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default App;