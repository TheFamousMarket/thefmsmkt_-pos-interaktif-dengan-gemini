import React, { ReactNode, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  titleKey?: string;
  maxWidth?: string;
  showCloseButton?: boolean;
  footer?: ReactNode;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  centered?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  titleKey, 
  maxWidth = 'max-w-lg',
  showCloseButton = true,
  footer,
  closeOnEsc = true,
  closeOnOutsideClick = true,
  centered = true
}) => {
  const displayTitle = title; // In real app: titleKey ? translate(titleKey) : title

  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEsc);
    
    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby={displayTitle ? "modal-title" : undefined}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-slate-800 rounded-xl shadow-2xl w-full ${maxWidth} transform transition-all text-stone-200 max-h-[90vh] flex flex-col ${centered ? 'animate-modal-appear' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {(displayTitle || showCloseButton) && (
          <div className="flex justify-between items-center p-6 border-b border-slate-700">
            {displayTitle && <h3 id="modal-title" className="text-xl font-bold text-white">{displayTitle}</h3>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-white transition-colors rounded-full p-1 hover:bg-slate-700"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        )}
        
        <div className="p-6 overflow-y-auto flex-grow">
          {children}
        </div>
        
        {footer && (
          <div className="p-6 border-t border-slate-700 bg-slate-750">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;