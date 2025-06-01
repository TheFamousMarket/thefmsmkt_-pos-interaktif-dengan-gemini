import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  hoverable?: boolean;
  bordered?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  hoverable = false,
  bordered = true,
}) => {
  return (
    <div 
      className={`
        bg-slate-800 rounded-xl overflow-hidden shadow-md
        ${bordered ? 'border border-slate-700' : ''}
        ${hoverable ? 'transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]' : ''}
        ${className}
      `}
    >
      {(title || icon) && (
        <div className={`px-5 py-4 flex items-center ${subtitle ? '' : 'border-b border-slate-700'} ${headerClassName}`}>
          {icon && <div className="mr-3 text-blue-500">{icon}</div>}
          <div>
            {title && <h3 className="text-lg font-medium text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-stone-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}
      
      {subtitle && !title && !icon && (
        <div className={`px-5 py-3 ${headerClassName}`}>
          <p className="text-sm text-stone-400">{subtitle}</p>
        </div>
      )}
      
      <div className={`px-5 py-4 text-stone-200 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-5 py-3 bg-slate-750 border-t border-slate-700 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;