import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { kioskMenuItems } from '../constants/menuItems';
import PageHeader from '../components/common/PageHeader';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';

const KioskCard = ({ item, translate }) => (
  <Link
    to={item.path}
    className={`${item.color} p-6 rounded-xl shadow-lg flex flex-col items-center justify-center 
    text-center cursor-pointer min-h-[180px] text-white
    transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
  >
    {item.icon}
    <span className="text-lg font-semibold mt-2">{translate(item.translationKey)}</span>
  </Link>
);

const MetricCard = ({ title, value, icon, color, trend }) => (
  <div className="rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
    <div className="p-1">
      <div className={`${color} p-4 rounded-t-lg`}>
        <div className="flex justify-between items-center">
          <h3 className="text-white text-sm font-medium">{title}</h3>
          {icon && <div className="text-white opacity-80">{icon}</div>}
        </div>
      </div>
      <div className="bg-slate-800 p-4 rounded-b-lg">
        <div className="flex justify-between items-end">
          <div className="text-2xl font-bold text-white">{value}</div>
          {trend && (
            <div className={`flex items-center ${trend.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${trend.isPositive ? 'animate-bounce' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                {trend.isPositive ? (
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                )}
              </svg>
              <span className="ml-1 text-sm font-medium">{trend.value}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const { translate } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={translate('dashboard_title')}
        subtitle={`${translate('dashboard_welcome')} ${user?.name || 'User'}`}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
        }
      />

      {/* Dashboard metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-container">
        <MetricCard 
          title={translate('dashboard_today_sales')}
          value="RM 4,250"
          icon={<CurrencyDollarIcon className="h-5 w-5" />}
          color="bg-emerald-600"
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard 
          title={translate('dashboard_monthly_sales')}
          value="RM 42,850"
          icon={<ChartBarIcon className="h-5 w-5" />}
          color="bg-blue-600"
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard 
          title={translate('dashboard_low_stock')}
          value="12"
          icon={<ShoppingBagIcon className="h-5 w-5" />}
          color="bg-amber-600"
          trend={{ value: 3, isPositive: false }}
        />
        <MetricCard 
          title={translate('dashboard_popular_items')}
          value="5"
          icon={<UserGroupIcon className="h-5 w-5" />}
          color="bg-purple-600"
        />
      </div>

      {/* Menu cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-container">
        {kioskMenuItems
          .filter(item => item.id !== 'dashboard-content')
          .map((item) => (
            <KioskCard key={item.id} item={item} translate={translate} />
          ))}
      </div>
    </div>
  );
};

export default DashboardPage;