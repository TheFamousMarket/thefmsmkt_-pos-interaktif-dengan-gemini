import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  onChange,
  variant = 'default',
  className = '',
}) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    if (onChange) onChange(tabId);
  };

  const getTabStyles = (tab: Tab) => {
    const isActive = tab.id === activeTabId;
    const isDisabled = tab.disabled;
    
    const baseStyles = 'flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200';
    
    if (isDisabled) {
      return `${baseStyles} text-stone-500 cursor-not-allowed`;
    }
    
    switch (variant) {
      case 'pills':
        return `${baseStyles} ${
          isActive 
            ? 'bg-blue-600 text-white rounded-lg shadow-sm' 
            : 'text-stone-300 hover:text-white hover:bg-slate-700 rounded-lg'
        }`;
      
      case 'underline':
        return `${baseStyles} ${
          isActive 
            ? 'text-blue-400 border-b-2 border-blue-400' 
            : 'text-stone-300 hover:text-white border-b-2 border-transparent'
        }`;
      
      default: // 'default'
        return `${baseStyles} ${
          isActive 
            ? 'text-white bg-slate-700 rounded-t-lg border-b-2 border-blue-500' 
            : 'text-stone-300 hover:text-white hover:bg-slate-750 rounded-t-lg'
        }`;
    }
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className={className}>
      <div className={`flex ${variant === 'underline' ? 'border-b border-slate-700' : ''}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={getTabStyles(tab)}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            disabled={tab.disabled}
            aria-selected={tab.id === activeTabId}
            role="tab"
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        {activeTab?.content}
      </div>
    </div>
  );
};

export default Tabs;