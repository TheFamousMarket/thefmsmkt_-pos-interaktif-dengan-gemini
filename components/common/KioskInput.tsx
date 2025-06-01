import React from 'react';

interface KioskInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelKey?: string;
  error?: string;
  icon?: React.ReactNode;
  helpText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  endAdornment?: React.ReactNode;
}

const KioskInput: React.FC<KioskInputProps> = ({ 
  label, 
  labelKey, 
  error, 
  icon, 
  helpText, 
  variant = 'default',
  endAdornment,
  className, 
  ...props 
}) => {
  const displayLabel = label; // In real app: labelKey ? translate(labelKey) : label
  
  const variantStyles = {
    default: 'bg-slate-700 border border-slate-600 focus:ring-blue-500 focus:border-blue-500',
    filled: 'bg-slate-800 border-0 focus:ring-blue-500 focus:bg-slate-750',
    outlined: 'bg-transparent border border-slate-500 focus:ring-blue-500 focus:border-blue-500',
  };

  return (
    <div className="w-full mb-4">
      {displayLabel && (
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-stone-200 mb-1.5">
          {displayLabel}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full p-3 rounded-lg shadow-sm text-stone-100 placeholder-stone-400 transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${endAdornment ? 'pr-10' : ''}
            ${variantStyles[variant]}
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}`}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${props.id || props.name}-error` : 
            helpText ? `${props.id || props.name}-help` : undefined
          }
          {...props}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>
      {error && (
        <p id={`${props.id || props.name}-error`} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={`${props.id || props.name}-help`} className="mt-1.5 text-xs text-stone-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default KioskInput;