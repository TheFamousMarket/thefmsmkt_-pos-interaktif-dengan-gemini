
import React from 'react';
import { Product } from '../../types';
import { mockProducts } from '../../constants/mockData';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import KioskButton from '../../components/common/KioskButton';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { translate } = useLanguage();
  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center text-center kiosk-card text-slate-800">
      <div aria-hidden="true" className="text-4xl sm:text-5xl mb-2 sm:mb-3 h-12 sm:h-14 flex items-center justify-center">{product.image}</div>
      <h4 className="text-sm sm:text-md font-semibold mb-1 h-10 overflow-hidden text-ellipsis leading-tight">{product.name}</h4>
      <p className="text-xs sm:text-sm text-stone-500 mb-1 sm:mb-2">{product.category}</p>
      <p className="text-sm sm:text-md font-bold text-sky-600">RM {product.price.toFixed(2)}</p>
      <KioskButton 
        onClick={() => onAddToCart(product)} 
        className="mt-2 sm:mt-3 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 w-full"
        variant="primary" 
      >
        {translate('btn_add_to_cart')}
      </KioskButton>
    </div>
  );
};

interface ProductGridProps {
  selectedCategory: string;
  searchTerm: string;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ selectedCategory, searchTerm, className }) => {
  const { addToCart } = useCart();

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 overflow-y-auto ${className}`}>
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
      ))}
      {filteredProducts.length === 0 && (
        <p className="col-span-full text-center text-stone-400 py-10">No products found.</p>
      )}
    </div>
  );
};

export default ProductGrid;
