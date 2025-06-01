import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { sidebarMenuItems } from '../../constants/menuItems';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { translate } = useLanguage();

  return (
    <aside className="h-full bg-slate-800 text-stone-200 flex flex-col overflow-hidden">
      {/* Header with logo and close button for mobile */}
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        <div className="text-2xl font-bold text-white animate-pulse">
          {translate('app_title_short')}
        </div>
        {onCloseMobile && (
          <button 
            onClick={onCloseMobile}
            className="md:hidden text-stone-400 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>
      
      {/* Navigation menu */}
      <nav className="flex-grow overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {sidebarMenuItems.map((item, index) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-stone-300 hover:bg-slate-700 hover:text-white'
                }`
              }
              style={{ animationDelay: `${index * 0.05}s` }}
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="font-medium">{translate(item.translationKey)}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      
      {/* Footer with version info */}
      <div className="p-4 text-xs text-stone-500 border-t border-slate-700">
        <p>TheFMSMKT POS v1.0</p>
        <p>© 2024 TheFMSMKT</p>
      </div>
    </aside>
  );
};

export default Sidebar;