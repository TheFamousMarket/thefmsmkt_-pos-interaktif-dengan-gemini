import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface AmbiguousItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedProduct: Product) => void;
  detectedProduct: Product | null;
  similarProducts: Product[];
}

const AmbiguousItemModal: React.FC<AmbiguousItemModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  detectedProduct,
  similarProducts,
}) => {
  const { translate } = useLanguage();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && detectedProduct) {
      setSelectedProductId(detectedProduct.id); // Pre-select the initially detected item
    } else {
      setSelectedProductId(null);
    }
  }, [isOpen, detectedProduct]);

  const handleConfirm = () => {
    const productToConfirm = [...similarProducts, detectedProduct].find(p => p?.id === selectedProductId);
    if (productToConfirm) {
      onConfirm(productToConfirm);
    }
    onClose();
  };

  if (!isOpen || !detectedProduct) return null;

  const allOptions = [detectedProduct, ...similarProducts.filter(p => p.id !== detectedProduct.id)];


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={translate('vision_ambiguous_modal_title')} maxWidth="max-w-xl">
      <p className="text-stone-300 mb-2">{translate('vision_ambiguous_prompt')}</p>
      <p className="text-sm text-stone-400 mb-4">
        {translate('vision_ambiguous_detected')} <span className="font-semibold text-stone-200">{detectedProduct.name}</span>
      </p>
      
      <div className="space-y-3 max-h-60 overflow-y-auto mb-6 pr-2">
        {allOptions.map(product => product && (
          <div 
            key={product.id}
            onClick={() => setSelectedProductId(product.id)}
            className={`p-3 rounded-lg cursor-pointer border-2 transition-all
                        ${selectedProductId === product.id ? 'bg-green-500 border-green-400 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500 text-stone-200'}`}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-3">{product.image}</span>
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm opacity-80">RM {product.price.toFixed(2)} - {product.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <KioskButton variant="secondary" onClick={onClose}>
          {translate('btn_cancel')}
        </KioskButton>
        <KioskButton variant="primary" onClick={handleConfirm} disabled={selectedProductId === null}>
          {translate('vision_btn_confirm_selection')}
        </KioskButton>
      </div>
    </Modal>
  );
};

export default AmbiguousItemModal;