import React, { useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/solid';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-emerald-400" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-rose-400" />;
      case 'warning':
        return <ExclamationCircleIcon className="h-5 w-5 text-amber-400" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-600 bg-opacity-20 border-l-4 border-emerald-500';
      case 'error':
        return 'bg-rose-600 bg-opacity-20 border-l-4 border-rose-500';
      case 'warning':
        return 'bg-amber-600 bg-opacity-20 border-l-4 border-amber-500';
      case 'info':
        return 'bg-blue-600 bg-opacity-20 border-l-4 border-blue-500';
      default:
        return 'bg-slate-700';
    }
  };

  return (
    <div 
      className={`flex items-center p-4 mb-3 rounded-md shadow-lg animate-toast-slide-in ${getBgColor()}`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-grow text-sm text-white">
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 ml-3 text-stone-300 hover:text-white transition-colors"
        aria-label="Close"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;