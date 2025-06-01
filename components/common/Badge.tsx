import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  className = '',
  dot = false,
}) => {
  const variantStyles = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-slate-600 text-white',
    success: 'bg-emerald-600 text-white',
    danger: 'bg-rose-600 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-sky-500 text-white',
  };

  const sizeStyles = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
    >
      {dot && (
        <span className={`
          inline-block w-2 h-2 rounded-full mr-1.5
          ${variant === 'primary' ? 'bg-blue-300' : ''}
          ${variant === 'secondary' ? 'bg-slate-300' : ''}
          ${variant === 'success' ? 'bg-emerald-300' : ''}
          ${variant === 'danger' ? 'bg-rose-300' : ''}
          ${variant === 'warning' ? 'bg-amber-300' : ''}
          ${variant === 'info' ? 'bg-sky-300' : ''}
        `}></span>
      )}
      {children}
    </span>
  );
};

export default Badge;