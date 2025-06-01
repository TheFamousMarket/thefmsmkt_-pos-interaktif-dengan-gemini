import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import KioskButton from '../../components/common/KioskButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { Product, RecognizedItem } from '../../types';
import { mockProducts } from '../../constants/mockData';
import CameraFeedDisplay from './CameraFeedDisplay';
import RecognizedItemsPanel from './RecognizedItemsPanel';
import AmbiguousItemModal from './AmbiguousItemModal';
import WeightInputModal from './WeightInputModal';
import PaymentModal from '../POS/PaymentModal'; // Reuse standard payment modal
import { useNavigate } from 'react-router-dom';

const VisionCheckoutPage: React.FC = () => {
  const { translate } = useLanguage();
  const { addToCart: addToMainCart, clearCart: clearMainCart } = useCart(); // Use main cart for final payment
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isScanning, setIsScanning] = useState(false);
  const [recognizedItems, setRecognizedItems] = useState<RecognizedItem[]>([]);
  
  const [showAmbiguousModal, setShowAmbiguousModal] = useState(false);
  const [currentItemForAmbiguity, setCurrentItemForAmbiguity] = useState<Product | null>(null);
  const [similarOptionsForAmbiguity, setSimilarOptionsForAmbiguity] = useState<Product[]>([]);

  const [showWeightModal, setShowWeightModal] = useState(false);
  const [currentItemForWeight, setCurrentItemForWeight] = useState<Product | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Simulation interval
  useEffect(() => {
    let scanInterval: NodeJS.Timeout;
    if (isScanning) {
      scanInterval = setInterval(() => {
        // Simulate detecting a random product
        const randomIndex = Math.floor(Math.random() * mockProducts.length);
        const detectedProduct = mockProducts[randomIndex];
        
        // Simulate processing delay
        const delay = Math.random() * 1500 + 500; // 0.5s to 2s
        setTimeout(() => {
            if (!isScanning) return; // Check if scanning stopped during delay
            processDetectedProduct(detectedProduct);
        }, delay);

      }, 3000); // Scan every 3 seconds
    }
    return () => clearInterval(scanInterval);
  }, [isScanning, mockProducts]);

  const processDetectedProduct = (product: Product) => {
    if (product.requiresScale) {
      setCurrentItemForWeight(product);
      setShowWeightModal(true);
      showToast(translate('toast_weight_item_detected', { itemName: product.name }), 'info');
    } else if (product.isVisuallyAmbiguous && product.similarProductIds && product.similarProductIds.length > 0) {
      const similarProds = mockProducts.filter(p => product.similarProductIds?.includes(p.id));
      setCurrentItemForAmbiguity(product);
      setSimilarOptionsForAmbiguity(similarProds);
      setShowAmbiguousModal(true);
      showToast(translate('toast_ambiguous_item_detected'), 'info');
    } else {
      addOrUpdateRecognizedItem(product);
    }
  };

  const addOrUpdateRecognizedItem = (product: Product, quantity: number = 1, weight?: number) => {
    setRecognizedItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id && item.weight === weight); // consider weight for uniqueness if applicable
      
      let calculatedPrice = product.price;
      if (product.requiresScale && weight && product.pricePerUnit) {
        calculatedPrice = product.pricePerUnit * weight;
      }

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        if (product.requiresScale && weight && product.pricePerUnit) { // Update price if quantity of weighted item changes (though typically 1)
             updatedItems[existingItemIndex].calculatedPrice = (product.pricePerUnit * weight) * updatedItems[existingItemIndex].quantity;
        } else {
             updatedItems[existingItemIndex].calculatedPrice = product.price * updatedItems[existingItemIndex].quantity;
        }
        showToast(translate('toast_item_updated_vision', { itemName: product.name }), 'success');
        return updatedItems;
      } else {
        showToast(translate('toast_item_added_vision', { itemName: product.name }), 'success');
        const newItem: RecognizedItem = {
          ...product,
          quantity: quantity,
          weight: weight,
          // Price for a single unit/scan. Total is calculated in panel.
          price: product.requiresScale && weight && product.pricePerUnit ? (product.pricePerUnit * weight) : product.price,
          calculatedPrice: product.requiresScale && weight && product.pricePerUnit ? (product.pricePerUnit * weight) : product.price,
        };
        return [...prevItems, newItem];
      }
    });
  };
  
  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    setRecognizedItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, quantity: newQuantity };
          if (item.requiresScale && item.weight && item.pricePerUnit) {
            updatedItem.calculatedPrice = (item.pricePerUnit * item.weight) * newQuantity;
          } else {
            updatedItem.calculatedPrice = item.price * newQuantity;
          }
          return updatedItem;
        }
        return item;
      }).filter(item => item.quantity > 0) // Ensure items with 0 quantity are removed
    );
  };

  const handleRemoveItem = (itemId: number) => {
    setRecognizedItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleConfirmAmbiguous = (selectedProduct: Product) => {
    addOrUpdateRecognizedItem(selectedProduct);
    setShowAmbiguousModal(false);
  };

  const handleConfirmWeight = (product: Product, weight: number) => {
    addOrUpdateRecognizedItem(product, 1, weight); // Weighted items usually added one at a time
    setShowWeightModal(false);
  };

  const handleClearTray = () => {
    setRecognizedItems([]);
    showToast(translate('toast_cleared_tray'), 'info');
  };

  const handleProceedToPayment = () => {
    if (recognizedItems.length === 0) {
      showToast(translate('toast_vision_cart_empty_payment'), 'warning');
      return;
    }
    clearMainCart(); 
    
    recognizedItems.forEach(item => {
      // Construct a Product object that addToCart expects.
      // The 'price' should be the price of a single "unit" or "scan".
      const productPayload: Product = {
          id: item.id,
          name: item.name,
          price: item.price, // This is price per scan from RecognizedItem
          category: item.category,
          image: item.image,
          stock: item.stock, 
          sku: item.sku,
          isVisuallyAmbiguous: item.isVisuallyAmbiguous,
          similarProductIds: item.similarProductIds,
          requiresScale: item.requiresScale,
          pricePerUnit: item.pricePerUnit,
          unitName: item.unitName,
      };

      // If the original item had a weight, add it to the payload
      // so CartContext's spread operator can pick it up for CartItem.
      if (item.weight !== undefined && item.requiresScale) {
          (productPayload as any).weight = item.weight;
      }

      // Call addToCart for each unit of quantity
      for (let i = 0; i < item.quantity; i++) {
          addToMainCart(productPayload);
      }
    });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    setRecognizedItems([]); // Clear tray after successful payment
    navigate('/dashboard');
  };
  
  const subtotal = recognizedItems.reduce((sum, item) => {
    const price = item.calculatedPrice ?? (item.price * item.quantity);
    return sum + price;
  }, 0);
  const tax = subtotal * 0.06; // Example 6% tax
  const grandTotal = subtotal + tax;


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={translate('vision_checkout_title')}
        subtitle={translate('vision_checkout_subtitle')}
      />
      <div className="flex flex-col lg:flex-row gap-6 flex-grow min-h-0"> {/* min-h-0 for flex children to scroll */}
        {/* Left Column: Camera and Controls */}
        <div className="lg:w-2/5 flex flex-col space-y-6">
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg">
            <CameraFeedDisplay isScanning={isScanning} />
          </div>
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg space-y-3">
            <KioskButton
              variant={isScanning ? 'danger' : 'primary'}
              onClick={() => setIsScanning(!isScanning)}
              fullWidth
            >
              {isScanning ? translate('vision_btn_stop_scan') : translate('vision_btn_start_scan')}
            </KioskButton>
            <KioskButton variant="secondary" onClick={handleClearTray} fullWidth>
              {translate('vision_btn_clear_tray')}
            </KioskButton>
          </div>
        </div>

        {/* Right Column: Recognized Items and Summary */}
        <div className="lg:w-3/5 flex flex-col space-y-6 min-h-0"> {/* min-h-0 here */}
          <div className="flex-grow min-h-0"> {/* And here to make child scroll */}
             <RecognizedItemsPanel 
                items={recognizedItems} 
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
             />
          </div>
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <div className="space-y-2 mb-4 text-lg">
              <div className="flex justify-between">
                <span>{translate('pos_subtotal_label')}</span>
                <span>RM {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{translate('pos_tax_label')}</span>
                <span>RM {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-2xl text-white">
                <span>{translate('vision_total_label')}</span>
                <span>RM {grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <KioskButton variant="primary" onClick={handleProceedToPayment} fullWidth className="font-bold py-3.5 text-xl">
              {translate('vision_btn_proceed_to_payment')}
            </KioskButton>
          </div>
        </div>
      </div>

      <AmbiguousItemModal
        isOpen={showAmbiguousModal}
        onClose={() => setShowAmbiguousModal(false)}
        onConfirm={handleConfirmAmbiguous}
        detectedProduct={currentItemForAmbiguity}
        similarProducts={similarOptionsForAmbiguity}
      />
      <WeightInputModal
        isOpen={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        onConfirm={handleConfirmWeight}
        product={currentItemForWeight}
      />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default VisionCheckoutPage;