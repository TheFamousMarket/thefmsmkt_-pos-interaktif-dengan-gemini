import React, { useState } from 'react';
import { sendWhatsAppMessage } from '@services/metaService';
import KioskButton from '@components/common/KioskButton';
import KioskInput from '@components/common/KioskInput';
import Toast from '@components/common/Toast';

interface WhatsAppNotificationProps {
  orderDetails?: string;
}

const WhatsAppNotification: React.FC<WhatsAppNotificationProps> = ({ orderDetails = '' }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState(orderDetails || 'Thank you for your purchase!');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const handleSendMessage = async () => {
    if (!phoneNumber) {
      setToast({
        show: true,
        message: 'Please enter a phone number',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Format phone number to ensure it has country code
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      const result = await sendWhatsAppMessage(formattedNumber, message);
      
      if (result.error) {
        setToast({
          show: true,
          message: `Error: ${result.error}`,
          type: 'error'
        });
      } else {
        setToast({
          show: true,
          message: 'Message sent successfully!',
          type: 'success'
        });
        setPhoneNumber('');
      }
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to send message',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Send WhatsApp Notification</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <KioskInput
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number with country code"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={4}
        />
      </div>
      
      <KioskButton
        onClick={handleSendMessage}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Sending...' : 'Send WhatsApp Message'}
      </KioskButton>
      
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type as 'success' | 'error' | 'info'}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default WhatsAppNotification;