
import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const Toast: React.FC = () => {
  const { toasts } = useToast();

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[1000] space-y-3">
      {toasts.map((toast) => {
        let bgColor = 'bg-slate-700';
        let textColor = 'text-white';
        let IconComponent = InformationCircleIcon;

        switch (toast.type) {
          case 'success':
            bgColor = 'bg-green-500';
            IconComponent = CheckCircleIcon;
            break;
          case 'error':
            bgColor = 'bg-red-500';
            IconComponent = XCircleIcon;
            break;
          case 'warning':
            bgColor = 'bg-amber-500';
            IconComponent = ExclamationTriangleIcon;
            break;
        }

        return (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg shadow-lg ${bgColor} ${textColor} min-w-[250px] max-w-md animate-fadeIn`}
            role="alert"
          >
            <IconComponent className="h-6 w-6 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        );
      })}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Toast;
