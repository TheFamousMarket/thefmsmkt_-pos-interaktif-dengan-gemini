
import React from 'react';

interface KioskInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelKey?: string; // For translation
  error?: string;
}

// const { translate } = useLanguage(); // Would be used in a real component

const KioskInput: React.FC<KioskInputProps> = ({ label, labelKey, error, className, ...props }) => {
  const displayLabel = label; // Simplified: labelKey ? translate(labelKey) : label;
  
  return (
    <div className="w-full">
      {displayLabel && (
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-stone-300 mb-1">
          {displayLabel}
        </label>
      )}
      <input
        className={`w-full p-3 kiosk-input bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-stone-100 placeholder-stone-400 ${className} ${error ? 'border-red-500 focus:border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default KioskInput;
