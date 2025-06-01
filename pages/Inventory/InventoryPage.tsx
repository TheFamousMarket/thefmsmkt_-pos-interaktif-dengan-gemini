import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockProducts } from '../../constants/mockData';
import KioskInput from '../../components/common/KioskInput';
import KioskButton from '../../components/common/KioskButton';
import Modal from '../../components/common/Modal'; // Import Modal
import { generateProductDescription } from '../../services/geminiService';
import { extractProductDetailsFromImageText, ExtractedProductDetails } from '../../services/visionAIService'; // Import new service
import { useToast } from '../../contexts/ToastContext';
import { Product } from '../../types';
import { SparklesIcon, CameraIcon } from '@heroicons/react/24/solid';

const InventoryTable: React.FC<{products: Product[]}> = ({ products }) => {
    const { translate } = useLanguage();

    if (products.length === 0) {
        return <p className="text-center py-8 text-lg text-stone-400">{translate('table_no_products')}</p>;
    }

    return (
         <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-700">
                    <tr>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_sku')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_product_name')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_category')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_stock')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_sell_price')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-700/50 transition-colors">
                            <td className="p-3 text-sm text-stone-300 whitespace-nowrap">{p.sku || `P-${String(p.id).padStart(4, '0')}`}</td>
                            <td className="p-3 text-sm text-stone-100 font-medium whitespace-nowrap">{p.name}</td>
                            <td className="p-3 text-sm text-stone-300 whitespace-nowrap">{p.category}</td>
                            <td className="p-3 text-sm text-stone-300">{p.stock}</td>
                            <td className="p-3 text-sm text-stone-300">RM {p.price.toFixed(2)}</td>
                            <td className="p-3 text-sm whitespace-nowrap">
                                <KioskButton variant="secondary" className="mr-3 !p-1.5 !bg-transparent !shadow-none !border-none text-green-400 hover:text-green-300" style={{background: 'none', boxShadow: 'none'}}>
                                    {translate('btn_edit')}
                                </KioskButton>
                                <KioskButton variant="danger" className="!p-1.5 !bg-transparent !shadow-none !border-none text-red-400 hover:text-red-300" style={{background: 'none', boxShadow: 'none'}}>
                                    {translate('btn_delete')}
                                </KioskButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const InventoryPage: React.FC = () => {
  const { translate, language } = useLanguage();
  const { showToast } = useToast();

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [keywords, setKeywords] = useState(''); // Stays as string for input, converted for API
  const [description, setDescription] = useState('');
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [products, setProducts] = useState<Product[]>(mockProducts); // Local state for products

  const [isVisionAIModalOpen, setIsVisionAIModalOpen] = useState(false);
  const [visionAIInputText, setVisionAIInputText] = useState('');
  const [isProcessingVisionAI, setIsProcessingVisionAI] = useState(false);


  const handleGenerateDescription = async () => {
    if (!productName.trim() || !category.trim()) {
      showToast(translate('toast_fill_product_name_and_category'), 'warning');
      return;
    }
    setIsGeneratingDesc(true);
    // Keep existing description if user wants to regenerate for pre-filled fields
    // setDescription(''); 
    showToast(translate('toast_desc_generating'), 'info');

    // Pass current keywords string directly
    const result = await generateProductDescription(productName, category, keywords);
    
    setIsGeneratingDesc(false);
    if (result.error) {
      showToast(translate('toast_api_error', { message: result.error }), 'error');
    } else if (result.data) {
      setDescription(result.data);
      showToast(translate('toast_desc_generated'), 'success');
    }
  };

  const handleVisionAIAddProductClick = () => {
    setIsVisionAIModalOpen(true);
  };

  const handleProcessVisionAIInput = async () => {
    if (!visionAIInputText.trim()) {
        showToast(translate('toast_vision_ai_no_input'), 'warning');
        return;
    }
    setIsProcessingVisionAI(true);
    showToast(translate('toast_vision_ai_processing'), 'info');

    const result = await extractProductDetailsFromImageText(visionAIInputText, language);
    setIsProcessingVisionAI(false);

    if (result.error) {
        showToast(translate('toast_api_error', { message: result.error }), 'error');
    } else if (result.data) {
        const { name, category: cat, keywords: kw, description: desc } = result.data;
        setProductName(name || '');
        setCategory(cat || '');
        setKeywords(Array.isArray(kw) ? kw.join(', ') : (kw || ''));
        setDescription(desc || '');
        showToast(translate('toast_vision_ai_success'), 'success');
        setIsVisionAIModalOpen(false);
        setVisionAIInputText(''); // Clear modal input
    } else {
        showToast(translate('toast_api_error', { message: "No data returned from Vision AI processing." }), 'error');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
    <div>
      <PageHeader title={translate('inventory_title')} subtitle={translate('inventory_subtitle')} />
      
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">{translate('inventory_add_new_sim')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <KioskInput label={translate('inventory_product_name')} value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={translate('new_product_name_placeholder')} />
          <KioskInput label={translate('inventory_category')} value={category} onChange={(e) => setCategory(e.target.value)} placeholder={translate('new_product_category_placeholder')} />
          <div className="md:col-span-2">
            <KioskInput label={translate('inventory_keywords')} value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder={translate('new_product_keywords_placeholder')} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="new-product-description-inv" className="block text-sm font-medium text-stone-300 mb-1">{translate('inventory_description')}</label>
            <textarea 
                id="new-product-description-inv" 
                rows={4} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder={translate('new_product_desc_placeholder')}
                className="w-full p-3 kiosk-input bg-slate-700 border-slate-600 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-stone-100 placeholder-stone-400"
            />
          </div>
        </div>
        <KioskButton variant="gemini" onClick={handleGenerateDescription} isLoading={isGeneratingDesc}>
          <SparklesIcon className="h-5 w-5 mr-2"/>{translate('inventory_btn_gemini_desc')}
        </KioskButton>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <KioskInput 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={translate('inventory_search_placeholder')} 
                className="w-full sm:w-1/2 lg:w-1/3"
            />
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <KioskButton 
                    variant="gemini" 
                    onClick={handleVisionAIAddProductClick}
                    className="w-full sm:w-auto"
                >
                    <CameraIcon className="h-5 w-5 mr-2" />
                    {translate('inventory_btn_add_vision_ai')}
                </KioskButton>
                <KioskButton 
                    variant="primary" 
                    className="w-full sm:w-auto"
                >
                    {translate('inventory_btn_add_manual')}
                </KioskButton>
            </div>
        </div>
        <InventoryTable products={filteredProducts} />
      </div>

      {/* Vision AI Product Input Modal */}
      <Modal
        isOpen={isVisionAIModalOpen}
        onClose={() => setIsVisionAIModalOpen(false)}
        title={translate('inventory_vision_ai_modal_title')}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
            <p className="text-sm text-stone-400">
                {translate('inventory_vision_ai_input_placeholder')}
            </p>
            <div>
                <label htmlFor="vision-ai-input" className="block text-sm font-medium text-stone-300 mb-1">
                    {translate('inventory_vision_ai_input_label')}
                </label>
                <textarea
                    id="vision-ai-input"
                    rows={5}
                    value={visionAIInputText}
                    onChange={(e) => setVisionAIInputText(e.target.value)}
                    placeholder={translate('inventory_vision_ai_input_placeholder')}
                    className="w-full p-3 kiosk-input bg-slate-700 border-slate-600 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-stone-100 placeholder-stone-400"
                />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
                <KioskButton variant="secondary" onClick={() => setIsVisionAIModalOpen(false)}>
                    {translate('btn_cancel')}
                </KioskButton>
                <KioskButton
                    variant="gemini"
                    onClick={handleProcessVisionAIInput}
                    isLoading={isProcessingVisionAI}
                >
                    <SparklesIcon className="h-5 w-5 mr-2"/>
                    {translate('inventory_vision_ai_btn_process')}
                </KioskButton>
            </div>
        </div>
      </Modal>

    </div>
  );
};

export default InventoryPage;
