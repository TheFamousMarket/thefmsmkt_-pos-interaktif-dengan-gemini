import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import KioskInput from '../../components/common/KioskInput';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { paymentMethods } from '../../constants/menuItems';
import { AnonymizedCustomerAnalytics, GeminiResponse } from '../../types'; // Added
import { getDemographicInsightSummary } from '../../services/geminiService'; // Added
import { SparklesIcon } from '@heroicons/react/24/solid';


interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
  const { translate, language } = useLanguage();
  const { getCartTotal } = useCart(); // Removed clearCart as it's handled by onPaymentSuccess
  const { showToast } = useToast();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(paymentMethods[0].key);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [emailReceipt, setEmailReceipt] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [whatsappReceipt, setWhatsappReceipt] = useState(false);
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  
  // State for Anonymized Customer Analytics
  const [customerAnalytics, setCustomerAnalytics] = useState<AnonymizedCustomerAnalytics | null>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<string | null>(null);
  const [isGeneratingAnalytics, setIsGeneratingAnalytics] = useState(false);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  const grandTotal = getCartTotal();
  const cashReceivedAmount = parseFloat(cashReceived) || 0;
  const changeAmount = cashReceivedAmount > grandTotal ? cashReceivedAmount - grandTotal : 0;

  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setSelectedPaymentMethod(paymentMethods[0].key);
      setCashReceived('');
      setEmailReceipt(false);
      setCustomerEmail('');
      setWhatsappReceipt(false);
      setCustomerWhatsapp('');
      setCustomerAnalytics(null); // Reset analytics
      setAnalyticsSummary(null);  // Reset summary
    }
  }, [isOpen]);
  
  const simulateGenerateAnalytics = () => {
    setIsGeneratingAnalytics(true);
    showToast(translate('toast_analytics_generating'), 'info', 1500);
    setTimeout(() => {
        const ageGroups: AnonymizedCustomerAnalytics['ageGroup'][] = ['Young Adult', 'Adult', 'Senior', 'Teenager'];
        const genders: AnonymizedCustomerAnalytics['gender'][] = ['Male', 'Female', 'Unknown'];
        const sentiments: AnonymizedCustomerAnalytics['sentiment'][] = ['Positive', 'Neutral', 'Negative'];
        
        setCustomerAnalytics({
            ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
            gender: genders[Math.floor(Math.random() * genders.length)],
            sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
        });
        setIsGeneratingAnalytics(false);
        showToast(translate('toast_analytics_generated'), 'success', 1500);
    }, 1000); // Simulate delay
  };


  const handleConfirmPayment = () => {
    // Basic validation for WhatsApp
    if (whatsappReceipt && !customerWhatsapp.trim()) {
      showToast(translate('toast_whatsapp_no_number'), 'warning');
      return;
    }
    if (whatsappReceipt && customerWhatsapp.trim()) {
         showToast(translate('toast_whatsapp_sim', { whatsappNumber: customerWhatsapp.trim() }), 'info', 4000);
    }
    
    // Simulate generating analytics
    simulateGenerateAnalytics();

    // Defer success toast and callback to allow analytics generation simulation
    setTimeout(() => {
        showToast(translate('toast_payment_confirmed'), 'success');
        onPaymentSuccess(); // This will clear cart and close modal via parent
    }, 1600); // Ensure this is after analytics generation toast
  };

  const handleGetInsightSummary = async () => {
    if (!customerAnalytics) return;
    setIsGeneratingInsight(true);
    setAnalyticsSummary(null);
    showToast(translate('toast_insight_summary_generating'), 'info');

    const result: GeminiResponse<string> = await getDemographicInsightSummary(customerAnalytics, language);
    
    setIsGeneratingInsight(false);
    if (result.error) {
        showToast(translate('toast_api_error', {message: result.error}), 'error');
    } else if (result.data) {
        setAnalyticsSummary(result.data);
        showToast(translate('toast_insight_summary_generated'), 'success');
    }
  };


  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={translate('payment_modal_title')}
      maxWidth="max-w-xl" // Increased width for analytics section
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Details Section */}
        <div className="space-y-4">
          <p className="text-center text-xl mb-2 md:mb-6 col-span-full md:col-span-1">
            <span className="text-stone-300">{translate('payment_modal_total_due')}: </span>
            <span className="font-bold text-green-400">RM {grandTotal.toFixed(2)}</span>
          </p>
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-1">{translate('payment_method_label')}</label>
            <div className="mt-1 grid grid-cols-2 gap-3">
              {paymentMethods.map(method => (
                <KioskButton
                  key={method.key}
                  variant={selectedPaymentMethod === method.key ? 'primary' : 'secondary'}
                  onClick={() => setSelectedPaymentMethod(method.key)}
                  className="p-3 text-sm sm:text-base" // Adjusted padding
                >
                  {translate(method.labelKey)}
                </KioskButton>
              ))}
            </div>
          </div>

          {selectedPaymentMethod === 'cash' && (
            <div className="bg-slate-700 p-3 sm:p-4 rounded-lg">
              <KioskInput
                label={translate('payment_cash_received')}
                type="number"
                id="cash-received"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder={translate('cash_received_input_placeholder')}
                className="!bg-slate-600 !border-slate-500"
              />
              <p className="mt-2 text-sm text-stone-300">
                {translate('payment_change')}: <span className="font-semibold text-green-400">RM {changeAmount.toFixed(2)}</span>
              </p>
            </div>
          )}

          <div className="space-y-2 pt-1">
              <div className="flex items-center">
                  <input type="checkbox" id="email-receipt" checked={emailReceipt} onChange={(e) => setEmailReceipt(e.target.checked)} className="h-4 w-4 text-green-500 rounded border-slate-600 bg-slate-700 focus:ring-green-500"/>
                  <label htmlFor="email-receipt" className="ml-2 text-sm text-stone-300">{translate('payment_send_email_receipt')}</label>
              </div>
              {emailReceipt && (
                   <KioskInput type="email" id="customer-email-for-receipt" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder={translate('customer_email_placeholder')} className="!p-2 !bg-slate-600 !border-slate-500"/>
              )}
          </div>
          <div className="space-y-2">
              <div className="flex items-center">
                  <input type="checkbox" id="whatsapp-receipt" checked={whatsappReceipt} onChange={(e) => setWhatsappReceipt(e.target.checked)} className="h-4 w-4 text-green-500 rounded border-slate-600 bg-slate-700 focus:ring-green-500"/>
                  <label htmlFor="whatsapp-receipt" className="ml-2 text-sm text-stone-300">{translate('payment_send_whatsapp_receipt')}</label>
              </div>
              {whatsappReceipt && (
                   <KioskInput type="tel" id="customer-whatsapp-for-receipt" value={customerWhatsapp} onChange={(e) => setCustomerWhatsapp(e.target.value)} placeholder={translate('customer_whatsapp_placeholder')} className="!p-2 !bg-slate-600 !border-slate-500"/>
              )}
          </div>
        </div>

        {/* Anonymized Customer Analytics Section */}
        <div className="bg-slate-700/70 p-3 sm:p-4 rounded-lg space-y-3 border border-slate-600">
            <h4 className="text-md font-semibold text-purple-300 mb-1">{translate('payment_anonymized_analytics_title')}</h4>
            {isGeneratingAnalytics && <p className="text-sm text-stone-400">{translate('toast_analytics_generating')}</p>}
            {customerAnalytics && !isGeneratingAnalytics && (
                <div className="text-sm space-y-1 text-stone-300">
                    <p><strong>{translate('payment_analytics_age_group')}</strong> {customerAnalytics.ageGroup || 'N/A'}</p>
                    <p><strong>{translate('payment_analytics_gender')}</strong> {customerAnalytics.gender || 'N/A'}</p>
                    <p><strong>{translate('payment_analytics_sentiment')}</strong> {customerAnalytics.sentiment || 'N/A'}</p>
                    <KioskButton 
                        variant="gemini" 
                        onClick={handleGetInsightSummary} 
                        isLoading={isGeneratingInsight}
                        disabled={!customerAnalytics || isGeneratingInsight}
                        className="w-full text-xs mt-2 !py-1.5"
                    >
                        <SparklesIcon className="h-3 w-3 mr-1"/> {translate('payment_btn_get_insight_summary')}
                    </KioskButton>
                    {analyticsSummary && (
                        <div className="mt-2 text-xs bg-slate-600 p-2 rounded">
                            <p className="font-semibold text-purple-400 mb-0.5">{translate('payment_analytics_gemini_summary_title')}</p>
                            <p>{analyticsSummary}</p>
                        </div>
                    )}
                </div>
            )}
             <p className="text-xs text-stone-500 mt-2 italic">{translate('payment_analytics_privacy_note')}</p>
        </div>
      </div>
      
      <div className="mt-6 sm:mt-8 flex justify-end space-x-3">
        <KioskButton variant="secondary" onClick={onClose}>{translate('btn_cancel')}</KioskButton>
        <KioskButton variant="primary" onClick={handleConfirmPayment} disabled={isGeneratingAnalytics}>{translate('btn_confirm_payment')}</KioskButton>
      </div>
    </Modal>
  );
};

export default PaymentModal;