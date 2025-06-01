import React from 'react';
import { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface LowStockAlertsPanelProps {
  lowStockItems: Product[];
}

const LowStockAlertsPanel: React.FC<LowStockAlertsPanelProps> = ({ lowStockItems }) => {
  const { translate } = useLanguage();

  return (
    <div className="bg-slate-700 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-amber-400 mb-2">{translate('inventory_monitoring_low_stock_title')}</h3>
      <p className="text-xs text-stone-400 mb-3">{translate('inventory_monitoring_low_stock_desc')}</p>
      {lowStockItems.length === 0 ? (
        <p className="text-stone-300 text-center py-3">{translate('inventory_monitoring_no_low_stock')}</p>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
          {lowStockItems.map(item => (
            <div key={item.id} className="bg-slate-600 p-2.5 rounded-md flex justify-between items-center text-sm">
              <div>
                <p className="font-medium text-stone-100">{item.name} <span className="text-xs text-stone-400">({item.sku || 'N/A'})</span></p>
                <p className="text-xs text-amber-300">
                  {translate('inventory_monitoring_table_current_stock')}: {item.stock} (Min: {item.reorderLevel || 'N/A'})
                </p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold text-amber-800 bg-amber-200 rounded-full">
                Amaran
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStockAlertsPanel;