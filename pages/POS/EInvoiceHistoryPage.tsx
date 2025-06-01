import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import KioskButton from '../../components/common/KioskButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { getEInvoiceStatus } from '../../getEInvoiceStatus';

// Dummy/mock transaction list for demo; replace with real data source
const mockTransactions = [
  { id: 'INV-20250601-0001', date: '2025-06-01', customer: 'Walk-in', total: 74.20 },
  { id: 'INV-20250601-0002', date: '2025-06-01', customer: 'XYZ Trading', total: 120.00 },
  { id: 'INV-20250601-0003', date: '2025-06-01', customer: 'ABC Sdn Bhd', total: 55.00 },
];

const statusColor = (status: string) => {
  switch (status) {
    case 'acknowledged_by_irbm': return 'bg-green-500 text-white';
    case 'submitted': return 'bg-blue-500 text-white';
    case 'generated': return 'bg-yellow-400 text-black';
    case 'failed': return 'bg-red-500 text-white';
    default: return 'bg-slate-500 text-white';
  }
};

const EInvoiceHistoryPage: React.FC = () => {
  const { translate } = useLanguage();
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchStatuses = async () => {
      const statusMap: Record<string, string> = {};
      for (const tx of mockTransactions) {
        const result = getEInvoiceStatus(tx.id);
        statusMap[tx.id] = result?.status || 'not_issued';
      }
      setStatuses(statusMap);
    };
    fetchStatuses();
  }, []);

  return (
    <div>
      <PageHeader title="E-Invoice History" subtitle="List of transactions and e-invoice status" />
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg mt-6">
        <table className="w-full text-left">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-3 text-sm font-semibold">Invoice No</th>
              <th className="p-3 text-sm font-semibold">Date</th>
              <th className="p-3 text-sm font-semibold">Customer</th>
              <th className="p-3 text-sm font-semibold text-right">Total (MYR)</th>
              <th className="p-3 text-sm font-semibold">E-Invoice Status</th>
              <th className="p-3 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {mockTransactions.map(tx => (
              <tr key={tx.id}>
                <td className="p-3 text-stone-100 font-medium">{tx.id}</td>
                <td className="p-3 text-stone-300">{tx.date}</td>
                <td className="p-3 text-stone-300">{tx.customer}</td>
                <td className="p-3 text-stone-300 text-right">{tx.total.toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded ${statusColor(statuses[tx.id])}`}>
                    {statuses[tx.id]?.replace('_', ' ') || 'Not Issued'}
                  </span>
                </td>
                <td className="p-3">
                  <KioskButton variant="secondary" className="mr-2">View</KioskButton>
                  <KioskButton variant="secondary">Print</KioskButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EInvoiceHistoryPage;
