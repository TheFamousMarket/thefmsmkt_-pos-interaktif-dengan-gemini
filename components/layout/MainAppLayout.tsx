import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { PowerIcon, LanguageIcon, Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';

const MainAppLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const { language, setLanguage, translate } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsCount] = useState(3); // Example notification count

  const toggleLanguage = () => {
    setLanguage(language === 'ms' ? 'en' : 'ms');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onCloseMobile={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-slate-800 border-b border-slate-700 shadow-md z-10 animate-fade-in">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="md:hidden text-stone-300 hover:text-white p-2 rounded-md"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
              <h1 className="text-xl font-bold text-white ml-2 md:hidden">
                {translate('app_title_short')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button className="text-stone-300 hover:text-white p-2 rounded-md hover:bg-slate-700 transition-colors">
                  <BellIcon className="h-5 w-5" />
                  {notificationsCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                      {notificationsCount}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Language toggle */}
              <button
                onClick={toggleLanguage}
                className="text-stone-300 hover:text-white p-2 rounded-md flex items-center space-x-1.5 text-sm hover:bg-slate-700 transition-colors"
                aria-label={translate('lang_toggle_button')}
              >
                <LanguageIcon className="h-5 w-5" />
                <span className="hidden sm:inline">{language === 'ms' ? 'EN' : 'MS'}</span>
              </button>
              
              {/* User menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-stone-300 hover:text-white p-2 rounded-md hover:bg-slate-700 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline">{user?.name || 'User'}</span>
                </button>
                
                <div className="absolute right-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 z-50 hidden group-hover:block animate-fade-in">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-stone-300 hover:bg-slate-700 hover:text-white flex items-center"
                  >
                    <PowerIcon className="h-4 w-4 mr-2" />
                    {translate('nav_logout')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main
          id="content-area"
          role="main"
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto text-stone-200"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainAppLayout;