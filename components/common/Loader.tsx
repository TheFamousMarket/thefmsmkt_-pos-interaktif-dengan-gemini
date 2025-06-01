
import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'button'; // 'button' for inline with text
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', text, variant = 'default' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  if (variant === 'button') {
    return <span className="gemini-btn-loader"></span>; // Uses global style from index.html
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-slate-600 border-t-purple-500 ${sizeClasses[size]}`}
      ></div>
      {text && <p className="mt-2 text-sm text-stone-400">{text}</p>}
    </div>
  );
};

export default Loader;
