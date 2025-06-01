
import React, { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  titleKey?: string; // For translation
  maxWidth?: string; // e.g., 'max-w-lg', 'max-w-2xl'
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, titleKey, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  // In a real app, useLanguage would be used here for the title
  // const { translate } = useLanguage();
  // const displayTitle = titleKey ? translate(titleKey) : title;

  const displayTitle = title; // Simplified for now

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className={`bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full ${maxWidth} transform transition-all text-stone-200 max-h-[90vh] flex flex-col`}>
        <div className="flex justify-between items-center mb-6">
          {displayTitle && <h3 className="text-2xl font-bold text-white">{displayTitle}</h3>}
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
        <div className="overflow-y-auto flex-grow">
         {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
