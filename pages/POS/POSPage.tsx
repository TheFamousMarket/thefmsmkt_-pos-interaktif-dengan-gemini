
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import PageHeader from '../../components/common/PageHeader';
import ProductGrid from './ProductGrid';
import CartDisplay from './CartDisplay';
import PaymentModal from './PaymentModal';
import ReturnModal from './ReturnModal';
import KioskButton from '../../components/common/KioskButton';
import { posCategoryTranslationKeys } from '../../constants/menuItems';
import { mockProductCategories } from '../../constants/mockData'; // For actual category values

const POSPage: React.FC = () => {
  const { translate } = useLanguage();
  const { clearCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>(mockProductCategories[0]); // Default to "Semua"
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Reset cart on component mount/unmount if needed, or handle persistence
   useEffect(() => {
    // Optional: Clear cart when navigating away or implement cart persistence
    // return () => clearCart(); 
  }, [clearCart]);

  const handlePaymentSuccess = () => {
    clearCart();
    setIsPaymentModalOpen(false);
    // Any other post-payment logic
  };
  
  const handleReturnSuccess = () => {
    setIsReturnModalOpen(false);
    // Any other post-return logic
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={translate('pos_title')}
        subtitle={translate('pos_subtitle')}
        actions={
          <div className="text-sm text-stone-300">
            <span>{translate('pos_cashier')}</span>: <span className="font-semibold text-white">Siti</span> | <span>{translate('pos_current_shift')}</span>: <span className="font-semibold text-green-400">RM 0.00</span>
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6 flex-grow">
        {/* Left Side: Product Selection */}
        <div className="lg:w-3/5 space-y-6 flex flex-col">
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={translate('pos_product_search_placeholder')}
              className="w-full p-3 kiosk-input bg-slate-700 border-slate-600"
            />
            <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
              {mockProductCategories.map((category, index) => (
                <KioskButton
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'secondary'}
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm whitespace-nowrap px-5 py-2.5" // Keep specific padding for these buttons
                >
                  {translate(posCategoryTranslationKeys[index])}
                </KioskButton>
              ))}
            </div>
          </div>
          
          <ProductGrid selectedCategory={selectedCategory} searchTerm={searchTerm} className="flex-grow"/>

          <div className="bg-slate-800 p-4 rounded-xl shadow-lg flex flex-wrap gap-3">
             <KioskButton variant="secondary" className="flex-1 min-w-[120px] !bg-amber-500 hover:!bg-amber-600 text-white focus:!ring-amber-400">{translate('pos_btn_discount_items')}</KioskButton>
             <KioskButton variant="secondary" className="flex-1 min-w-[120px] !bg-teal-500 hover:!bg-teal-600 text-white focus:!ring-teal-400">{translate('pos_btn_new_product')}</KioskButton>
             <KioskButton variant="secondary" onClick={() => setIsReturnModalOpen(true)} className="flex-1 min-w-[120px] !bg-rose-500 hover:!bg-rose-600 text-white focus:!ring-rose-400">{translate('pos_btn_return_exchange')}</KioskButton>
             <KioskButton variant="secondary" className="flex-1 min-w-[120px] !bg-indigo-500 hover:!bg-indigo-600 text-white focus:!ring-indigo-400">{translate('pos_btn_check_price')}</KioskButton>
          </div>
        </div>

        {/* Right Side: Cart and Checkout */}
        <div className="lg:w-2/5 bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col text-stone-200">
          <CartDisplay onPayNow={() => setIsPaymentModalOpen(true)} />
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <ReturnModal 
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        onReturnSuccess={handleReturnSuccess}
      />

    </div>
  );
};

export default POSPage;
