
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { kioskMenuItems } from '../constants/menuItems';
import PageHeader from '../components/common/PageHeader';

const KioskCard: React.FC<{ item: import('../types').KioskMenuItem }> = ({ item }) => {
  const { translate } = useLanguage();
  return (
    <Link
      to={item.path}
      className={`kiosk-card ${item.color} p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center cursor-pointer min-h-[180px] text-white`}
    >
      {item.icon}
      <span className="text-lg font-semibold">{translate(item.translationKey)}</span>
    </Link>
  );
};

const DashboardPage: React.FC = () => {
  const { translate } = useLanguage();
  const { username } = useAuth();

  return (
    <div>
      <PageHeader
        title={translate('dashboard_title')}
        subtitle={translate('dashboard_welcome_user', { user: username || 'Pengguna' })}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {kioskMenuItems.filter(item => item.id !== 'dashboard-content').map((item) => ( // Exclude dashboard link from dashboard
          <KioskCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
