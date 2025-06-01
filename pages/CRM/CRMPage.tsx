
import React, {useState} from 'react';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockCustomers } from '../../constants/mockData';
import KioskInput from '../../components/common/KioskInput';
import KioskButton from '../../components/common/KioskButton';
import { Customer } from '../../types';

const CustomerTable: React.FC<{customers: Customer[]}> = ({customers}) => {
    const { translate } = useLanguage();

    if (customers.length === 0) {
        return <p className="text-center py-8 text-lg text-stone-400">{translate('table_no_customers')}</p>;
    }
    
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-700">
                    <tr>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_id')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_customer_name')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_email')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_phone')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_total_purchase')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {customers.map(c => (
                        <tr key={c.id} className="hover:bg-slate-700/50 transition-colors">
                            <td className="p-3 text-sm text-stone-300 whitespace-nowrap">{c.id}</td>
                            <td className="p-3 text-sm text-stone-100 font-medium whitespace-nowrap">{c.name}</td>
                            <td className="p-3 text-sm text-stone-300 whitespace-nowrap">{c.email}</td>
                            <td className="p-3 text-sm text-stone-300 whitespace-nowrap">{c.phone}</td>
                            <td className="p-3 text-sm text-stone-300">RM {c.totalSpent.toFixed(2)}</td>
                            <td className="p-3 text-sm whitespace-nowrap">
                                <button className="text-sky-400 hover:text-sky-300 mr-3 font-medium">{translate('btn_view')}</button>
                                <button className="text-green-400 hover:text-green-300 font-medium">{translate('btn_edit')}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


const CRMPage: React.FC = () => {
  const { translate } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers); // Local state for customers

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div>
      <PageHeader title={translate('crm_title')} subtitle={translate('crm_subtitle')} />
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <KioskInput 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={translate('crm_search_placeholder')} 
                className="w-full sm:w-2/3 lg:w-1/2"
            />
            <KioskButton variant="primary" className="w-full sm:w-auto">
                {translate('crm_btn_add_customer')}
            </KioskButton>
        </div>
        <CustomerTable customers={filteredCustomers} />
      </div>
    </div>
  );
};

export default CRMPage;
