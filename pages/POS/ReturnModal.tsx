
import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import KioskInput from '../../components/common/KioskInput';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { returnActionTypes } from '../../constants/menuItems';

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnSuccess: () => void;
}

const ReturnModal: React.FC<ReturnModalProps> = ({ isOpen, onClose, onReturnSuccess }) => {
  const { translate } = useLanguage();
  const { showToast } = useToast();
  const [receiptSearch, setReceiptSearch] = useState('');
  const [returnAction, setReturnAction] = useState(returnActionTypes[0].value);
  const [returnNotes, setReturnNotes] = useState('');

  const handleProcessReturn = () => {
    // Add actual return processing logic here
    showToast(translate('toast_return_processed'), 'success');
    onReturnSuccess(); // This will close modal via parent
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={translate('return_modal_title')}
        maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="original-receipt-search" className="block text-sm font-medium text-stone-300 mb-1">{translate('return_search_receipt')}</label>
          <div className="mt-1 flex">
            <KioskInput
              type="text"
              id="original-receipt-search"
              value={receiptSearch}
              onChange={(e) => setReceiptSearch(e.target.value)}
              placeholder={translate('original_receipt_search_placeholder')}
              className="flex-grow !rounded-r-none"
            />
            <KioskButton
              variant="primary"
              className="!rounded-l-none px-4"
            >
              {translate('btn_search')}
            </KioskButton>
          </div>
        </div>
        <div className="border border-slate-700 p-3 rounded-md bg-slate-700/50 min-h-[100px]">
          <p className="text-stone-400 italic">{translate('return_original_details_placeholder')}</p>
        </div>
        <div>
          <label htmlFor="return-action-type" className="block text-sm font-medium text-stone-300 mb-1">{translate('return_action_type')}</label>
          <select 
            id="return-action-type" 
            value={returnAction}
            onChange={(e) => setReturnAction(e.target.value)}
            className="w-full p-3 kiosk-input bg-slate-700 border-slate-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-stone-100"
          >
            {returnActionTypes.map(action => (
                <option key={action.value} value={action.value}>{translate(action.labelKey)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="return-notes" className="block text-sm font-medium text-stone-300 mb-1">{translate('return_notes_label')}</label>
          <textarea 
            id="return-notes" 
            rows={2} 
            value={returnNotes}
            onChange={(e) => setReturnNotes(e.target.value)}
            className="w-full p-3 kiosk-input bg-slate-700 border-slate-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-stone-100"
          ></textarea>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <KioskButton variant="secondary" onClick={onClose}>{translate('btn_cancel')}</KioskButton>
        <KioskButton variant="danger" onClick={handleProcessReturn}>{translate('btn_process_return')}</KioskButton>
      </div>
    </Modal>
  );
};

export default ReturnModal;

