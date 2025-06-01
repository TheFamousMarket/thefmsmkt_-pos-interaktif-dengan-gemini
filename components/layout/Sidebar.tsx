import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { sidebarMenuItems } from '../../constants/menuItems';

const Sidebar: React.FC = () => {
  const { translate } = useLanguage();

  return (
    <aside className="w-64 bg-slate-800 text-stone-200 p-5 space-y-2 flex flex-col hidden md:flex">
      <div className="text-2xl font-bold text-white mb-8 text-center">
        {translate('app_title_short')}
      </div>
      <nav className="flex-grow">
        {sidebarMenuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive text-stone-300 hover:text-white'}`
            }
          >
            {item.icon}
            <span>{translate(item.translationKey)}</span>
          </NavLink>
        ))}
      </nav>
      {/* Language toggle and logout buttons removed from here */}
    </aside>
  );
};

export default Sidebar;