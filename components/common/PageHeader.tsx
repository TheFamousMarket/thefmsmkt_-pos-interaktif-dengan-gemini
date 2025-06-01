
import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode; // For buttons or other elements on the right
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <header className="module-header flex flex-wrap justify-between items-center gap-4 border-b-2 border-slate-700 pb-4 mb-8">
      <div>
        <h2 className="text-3xl lg:text-4xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-lg text-stone-300 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center space-x-3">{actions}</div>}
    </header>
  );
};

export default PageHeader;
