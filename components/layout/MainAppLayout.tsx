import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { PowerIcon, LanguageIcon } from '@heroicons/react/24/outline';

const MainAppLayout: React.FC = () => {
  const { logout } = useAuth();
  const { language, setLanguage, translate } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ms' ? 'en' : 'ms');
  };

  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* New Top Bar */}
        <header className="bg-slate-900 px-6 py-3 shadow-sm flex justify-end items-center space-x-4 border-b border-slate-700">
          <button
            onClick={toggleLanguage}
            className="text-stone-300 hover:text-white p-2 rounded-md flex items-center space-x-1.5 text-sm hover:bg-slate-700 transition-colors"
            aria-label={translate('lang_toggle_button')}
          >
            <LanguageIcon className="h-5 w-5" />
            <span>{language === 'ms' ? 'EN' : 'MS'}</span>
          </button>
          <button
            onClick={logout}
            className="text-stone-300 hover:text-white p-2 rounded-md flex items-center space-x-1.5 text-sm hover:bg-slate-700 transition-colors"
            aria-label={translate('nav_logout')}
          >
            <PowerIcon className="h-5 w-5" />
            <span>{translate('nav_logout')}</span>
          </button>
        </header>
        <main id="content-area" className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto text-stone-200 bg-slate-900">
          <Outlet /> {/* This is where the routed page components will render */}
        </main>
      </div>
    </div>
  );
};

export default MainAppLayout;