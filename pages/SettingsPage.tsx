
import React from 'react';
import PageHeader from '../components/common/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';

const SettingsPage: React.FC = () => {
  const { translate } = useLanguage();

  return (
    <div>
      <PageHeader title={translate('settings_title')} subtitle={translate('settings_subtitle')} />
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <p className="text-center text-stone-400 py-10 text-lg">
          {translate('settings_content_placeholder')}
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
