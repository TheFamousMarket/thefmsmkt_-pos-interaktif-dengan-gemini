import React from 'react';

interface KioskButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gemini' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const KioskButton: React.FC<KioskButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false, 
  isLoading = false,
  icon,
  className = '', 
  ...props 
}) => {
  // Base styles applied to all buttons
  const baseStyle = "font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md";
  
  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  };
  
  // Variant styles with improved color scheme
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-400',
    gemini: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-400',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-400',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400',
    info: 'bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={isLoading || props.disabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]" role="status"></span>
      ) : icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </button>
  );
};

export default KioskButton;