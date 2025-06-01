
import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import KioskButton from '../../components/common/KioskButton';
import KioskInput from '../../components/common/KioskInput';
import { XCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { getRelatedProductSuggestions } from '../../services/geminiService';
import { mockProducts } from '../../constants/mockData';


interface CartDisplayProps {
  onPayNow: () => void;
}

const CartDisplay: React.FC<CartDisplayProps> = ({ onPayNow }) => {
  const { cartItems, removeFromCart, getCartSubtotal, getCartTax, getItemCount, updateQuantity } = useCart();
  const { translate } = useLanguage();
  const { showToast } = useToast();
  
  const [orderDiscountInput, setOrderDiscountInput] = useState('');
  const [appliedDiscountValue, setAppliedDiscountValue] = useState(0);
  const [appliedDiscountTypeString, setAppliedDiscountTypeString] = useState('');
  
  const [geminiSuggestions, setGeminiSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const subtotal = getCartSubtotal();

  useEffect(() => {
    let newDiscountAmount = 0;
    let newDiscountTypeString = '';

    if (orderDiscountInput) {
        const trimmedInput = orderDiscountInput.trim();
        if (trimmedInput.endsWith('%')) {
            const percentage = parseFloat(trimmedInput.slice(0, -1));
            if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
                newDiscountAmount = subtotal * (percentage / 100);
                newDiscountTypeString = `${percentage.toFixed(2)}%`;
            } else {
                 newDiscountTypeString = `(Invalid %)`; // Indicates error to user
                 newDiscountAmount = 0; // Set to 0 if invalid
            }
        } else {
            const amount = parseFloat(trimmedInput);
            if (!isNaN(amount) && amount >= 0) {
                newDiscountAmount = Math.min(amount, subtotal); // Discount cannot exceed subtotal
                newDiscountTypeString = `RM ${amount.toFixed(2)}`;
            } else {
                newDiscountTypeString = `(Invalid RM)`; // Indicates error to user
                newDiscountAmount = 0; // Set to 0 if invalid
            }
        }
    }
    
    setAppliedDiscountValue(newDiscountAmount);
    setAppliedDiscountTypeString(newDiscountTypeString);

}, [orderDiscountInput, subtotal]);

  const discountedSubtotal = Math.max(0, subtotal - appliedDiscountValue);
  const tax = getCartTax(discountedSubtotal);
  const grandTotal = discountedSubtotal + tax;
  
  const handlePayNowClick = () => {
    if (getItemCount() === 0) {
      showToast(translate('toast_cart_empty'), 'warning');
      return;
    }
    onPayNow();
  };

  const handleGeminiSuggest = async () => {
    if (cartItems.length === 0) {
      showToast(translate('toast_product_suggestion_cart_empty'), 'warning');
      return;
    }
    setIsSuggesting(true);
    setGeminiSuggestions([]);
    showToast(translate('toast_product_suggestion_generating'), 'info');

    const cartItemNames = cartItems.map(item => item.name).join(', ');
    const productCatalogNames = mockProducts.map(p => p.name).join(', ');
    
    const result = await getRelatedProductSuggestions(cartItemNames, productCatalogNames);
    
    setIsSuggesting(false);
    if (result.error) {
      showToast(translate('toast_api_error', { message: result.error }), 'error');
    } else if (result.data && result.data.length > 0) {
      setGeminiSuggestions(result.data);
      showToast(translate('toast_product_suggestion_received'), 'success');
    } else {
      showToast(translate('toast_product_suggestion_failed'), 'info');
    }
  };


  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-white">{translate('pos_order_details')}</h3>
        <span className="text-md text-stone-300">{translate('pos_order_no')}: <span className="font-semibold">#1057</span></span>
      </div>
      <div className="mb-4">
        <button className="text-md text-green-400 hover:underline">{translate('pos_customer_walk_in')}</button>
      </div>

      <div className="flex-grow space-y-2 overflow-y-auto max-h-60 sm:max-h-72 pr-2 mb-4">
        {cartItems.length === 0 ? (
          <p className="text-stone-400 text-center py-6 text-lg">{translate('pos_cart_empty')}</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center p-2.5 border-b border-slate-700">
              <div>
                <p className="font-semibold text-md text-stone-100">{item.name}</p>
                <div className="flex items-center text-sm text-stone-400">
                    RM {item.price.toFixed(2)} x 
                    <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            if (!isNaN(newQuantity)) {
                                updateQuantity(item.id, newQuantity);
                            }
                        }}
                        onBlur={(e) => { 
                            const newQuantity = parseInt(e.target.value);
                            if (isNaN(newQuantity) || newQuantity < 1) {
                                updateQuantity(item.id, 1);
                            }
                        }}
                        className="w-12 text-center bg-slate-600 text-stone-200 rounded mx-1 py-0.5 border border-slate-500 focus:ring-green-500 focus:border-green-500"
                        min="1"
                        aria-label={`Quantity for ${item.name}`}
                    />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-md text-stone-100">RM {(item.price * item.quantity).toFixed(2)}</span>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="text-red-400 hover:text-red-300"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-auto"> {/* Pushes content below to the bottom */}
        <div className="mb-4">
          <KioskButton 
            variant="gemini" 
            fullWidth 
            onClick={handleGeminiSuggest} 
            isLoading={isSuggesting}
            className="text-sm py-2.5"
          >
             <SparklesIcon className="h-4 w-4 mr-1.5"/> {translate('pos_btn_gemini_suggest')}
          </KioskButton>
          {geminiSuggestions.length > 0 && (
            <div className="mt-3 text-sm text-stone-300 bg-slate-700 p-3 rounded-md">
              <h4 className="font-semibold mb-1 text-purple-400">{translate('pos_gemini_suggestions_title')}</h4>
              <ul className="list-disc list-inside ml-2">
                {geminiSuggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-slate-700 pt-4 mt-4 space-y-2.5 text-md">
          <div className="flex justify-between">
            <span>{translate('pos_subtotal_label')}</span>
            <span>RM {subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              {translate('pos_discount_label')}
              {appliedDiscountTypeString && !appliedDiscountTypeString.includes("Invalid") && (
                <span className="text-xs text-purple-300 ml-1.5 px-1.5 py-0.5 bg-slate-700 rounded-md">
                  {appliedDiscountTypeString}
                </span>
              )}
              {appliedDiscountTypeString && appliedDiscountTypeString.includes("Invalid") && (
                 <span className="text-xs text-red-400 ml-1.5 px-1.5 py-0.5 bg-slate-700 rounded-md">
                  {appliedDiscountTypeString}
                </span>
              )}
            </span>
            <KioskInput
                type="text"
                id="pos-order-discount"
                value={orderDiscountInput}
                onChange={(e) => setOrderDiscountInput(e.target.value)}
                placeholder={translate('discount_input_placeholder_detailed')}
                className="w-36 p-1.5 text-right !bg-slate-600 !border-slate-500"
                aria-label={translate('pos_discount_label')}
            />
          </div>

          {appliedDiscountValue > 0 && (
            <div className="flex justify-between text-sm text-stone-300">
                <span>{translate('pos_applied_discount_value_label')}</span>
                <span className="text-red-400 font-medium">- RM {appliedDiscountValue.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>{translate('pos_tax_label')}</span>
            <span>RM {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-xl text-white">
            <span>{translate('pos_grand_total_label')}</span>
            <span>RM {grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <KioskButton variant="secondary">{translate('pos_btn_hold')}</KioskButton>
          <KioskButton variant="secondary">{translate('pos_btn_recall')}</KioskButton>
        </div>
        <KioskButton onClick={handlePayNowClick} fullWidth className="font-bold py-3.5 mt-3 text-xl">
          {translate('pos_btn_pay_now')}
        </KioskButton>
      </div>
    </>
  );
};

export default CartDisplay;
