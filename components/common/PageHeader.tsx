import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  backButton?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  backButton,
  icon,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          {backButton && (
            <button
              onClick={backButton.onClick}
              className="mr-4 text-stone-300 hover:text-white flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {backButton.label}
            </button>
          )}
          
          <div className="flex items-center">
            {icon && <div className="mr-3 text-blue-500">{icon}</div>}
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {subtitle && <p className="text-stone-400 mt-1">{subtitle}</p>}
            </div>
          </div>
        </div>
        
        {actions && (
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
            {actions}
          </div>
        )}
      </div>
      
      <div className="h-1 w-full bg-slate-800 mt-6">
        <div className="h-1 w-24 bg-blue-600 rounded-r"></div>
      </div>
    </div>
  );
};

export default PageHeader;