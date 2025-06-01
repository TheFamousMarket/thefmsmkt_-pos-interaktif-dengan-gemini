
import React from 'react';

interface KioskButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gemini';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const KioskButton: React.FC<KioskButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false, 
  className = '', 
  ...props 
}) => {
  // Base styles applied to all buttons. Specific padding/text size can be overridden by `className` prop.
  const baseStyle = "text-md font-medium rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75 flex items-center justify-center px-4 py-2.5 disabled:opacity-70 disabled:cursor-not-allowed";
  
  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400';
      break;
    case 'secondary':
      variantStyle = 'bg-slate-600 hover:bg-slate-500 text-stone-200 focus:ring-slate-400';
      break;
    case 'danger':
      variantStyle = 'bg-rose-500 hover:bg-rose-600 text-white focus:ring-rose-400';
      break;
    case 'gemini':
      variantStyle = 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-400';
      break;
    default: // Fallback to primary style if variant is unknown
      variantStyle = 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400';
  }

  const widthStyle = fullWidth ? 'w-full' : '';
  // Add loadingStyle to visually indicate loading and prevent multiple clicks if desired
  // The spinner itself is handled by the gemini-btn-loader class
  const loadingStateStyle = isLoading ? 'opacity-80' : '';


  return (
    <button 
      className={`${baseStyle} ${variantStyle} ${widthStyle} ${loadingStateStyle} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <span className="gemini-btn-loader"></span>}
      {children}
    </button>
  );
};

export default KioskButton;
