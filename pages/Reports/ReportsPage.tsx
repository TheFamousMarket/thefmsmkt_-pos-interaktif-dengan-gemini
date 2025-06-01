
import React, { useState, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../contexts/LanguageContext';
import { summarizeReportData } from '../../services/geminiService';
import { useToast } from '../../contexts/ToastContext';
import KioskButton from '../../components/common/KioskButton';
import { SalesDataPoint, CategorySalesDataPoint, TopSellingProductDataPoint, SalesByEmployeeDataPoint, PaymentMethodDataPoint, ReportTimeRange } from '../../types';
import SalesChart from './SalesChart';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { 
    mockDailySalesData, mockWeeklySalesData, mockMonthlySalesData,
    mockCategorySalesData, mockTopSellingProducts, mockSalesByEmployee, mockPaymentMethodData 
} from '../../constants/mockData';

type ReportType = 'overview' | 'product' | 'employee' | 'payment';

const ReportsPage: React.FC = () => {
  const { translate } = useLanguage();
  const { showToast } = useToast();
  
  const [activeReportType, setActiveReportType] = useState<ReportType>('overview');
  const [activeDateRange, setActiveDateRange] = useState<ReportTimeRange>(ReportTimeRange.DAILY);
  
  const [summaries, setSummaries] = useState<Record<ReportType, string | null>>({
    overview: null,
    product: null,
    employee: null,
    payment: null,
  });
  const [isSummarizing, setIsSummarizing] = useState<Record<ReportType, boolean>>({
    overview: false,
    product: false,
    employee: false,
    payment: false,
  });

  const handleSummarizeReport = async (reportType: ReportType) => {
    setIsSummarizing(prev => ({ ...prev, [reportType]: true }));
    setSummaries(prev => ({ ...prev, [reportType]: null }));
    showToast(translate('toast_report_summary_generating'), 'info');

    let reportDataString = "";
    let currentLang = translate('lang_toggle_button').includes('English') ? 'ms' : 'en'; // detect current language for prompt
    let promptLangInstructions = currentLang === 'ms' ? "Ringkasan dalam Bahasa Malaysia." : "Summary in English.";

    switch (reportType) {
      case 'overview':
        const dailyStr = selectedTimeBasedSalesData.map(d => `${d.name}: RM${d.sales}`).join(', ');
        const catStr = mockCategorySalesData.map(d => `${translate(d.categoryKey)}: RM${d.sales}`).join(', ');
        reportDataString = `Gambaran Jualan (${translate(`reports_filter_${activeDateRange}`)}): Jualan Harian/Berkala: ${dailyStr}. Jualan Mengikut Kategori: ${catStr}. ${promptLangInstructions}`;
        break;
      case 'product':
        const topProdStr = mockTopSellingProducts.map(p => `${p.productName} (Terjual: ${p.quantitySold}, Hasil: RM${p.totalRevenue.toFixed(2)})`).join('; ');
        reportDataString = `Prestasi Produk (${translate(`reports_filter_${activeDateRange}`)}): Produk Terlaris: ${topProdStr}. ${promptLangInstructions}`;
        break;
      case 'employee':
        const empSalesStr = mockSalesByEmployee.map(e => `${e.employeeName} (Jualan: RM${e.totalSales.toFixed(2)}, Transaksi: ${e.transactions})`).join('; ');
        reportDataString = `Prestasi Pekerja (${translate(`reports_filter_${activeDateRange}`)}): Jualan Mengikut Pekerja: ${empSalesStr}. ${promptLangInstructions}`;
        break;
      case 'payment':
        const paymentStr = mockPaymentMethodData.map(p => `${translate(p.methodKey)} (Amaun: RM${p.totalAmount.toFixed(2)}, Transaksi: ${p.transactionCount})`).join('; ');
        reportDataString = `Analisis Pembayaran (${translate(`reports_filter_${activeDateRange}`)}): Agihan Kaedah Pembayaran: ${paymentStr}. ${promptLangInstructions}`;
        break;
    }
    
    const result = await summarizeReportData(reportDataString);

    setIsSummarizing(prev => ({ ...prev, [reportType]: false }));
    if (result.error) {
      showToast(translate('toast_api_error', { message: result.error }), 'error');
    } else if (result.data) {
      setSummaries(prev => ({ ...prev, [reportType]: result.data }));
      showToast(translate('toast_report_summary_generated'), 'success');
    }
  };

  const reportTabs: { key: ReportType; labelKey: string }[] = [
    { key: 'overview', labelKey: 'reports_tab_overview' },
    { key: 'product', labelKey: 'reports_tab_product' },
    { key: 'employee', labelKey: 'reports_tab_employee' },
    { key: 'payment', labelKey: 'reports_tab_payment' },
  ];

  const dateRangeOptions: { key: ReportTimeRange; labelKey: string }[] = [
    { key: ReportTimeRange.DAILY, labelKey: 'reports_filter_daily' },
    { key: ReportTimeRange.WEEKLY, labelKey: 'reports_filter_weekly' },
    { key: ReportTimeRange.MONTHLY, labelKey: 'reports_filter_monthly' },
  ];
  
  const selectedTimeBasedSalesData = useMemo(() => {
    switch (activeDateRange) {
        case ReportTimeRange.WEEKLY: return mockWeeklySalesData;
        case ReportTimeRange.MONTHLY: return mockMonthlySalesData;
        case ReportTimeRange.DAILY:
        default: return mockDailySalesData;
    }
  }, [activeDateRange]);


  const renderOverviewReports = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-5">{translate('reports_daily_sales_title')} ({translate(`reports_filter_${activeDateRange}`)})</h3>
        <div className="chart-container h-[300px] sm:h-[350px] bg-white/5 p-2 rounded-md">
           <SalesChart data={selectedTimeBasedSalesData} type="bar" dataKey="sales" barColor="#22c55e" barLegendName={translate('reports_daily_sales_title')} />
        </div>
      </div>
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-5">{translate('reports_sales_by_category_title')}</h3>
        <div className="chart-container h-[300px] sm:h-[350px] bg-white/5 p-2 rounded-md">
           <SalesChart 
              data={mockCategorySalesData.map(item => ({ ...item, name: translate(item.categoryKey) }))} // Translate names for chart
              type="pie" 
              dataKey="sales"
          />
        </div>
      </div>
    </div>
  );

  const renderProductPerformanceReports = () => (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-5">{translate('reports_top_selling_products_title')}</h3>
      <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full text-left">
          <thead className="bg-slate-700 sticky top-0">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wide">{translate('table_product_name')}</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-right">{translate('table_quantity_sold')}</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-right">{translate('table_total_revenue')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {mockTopSellingProducts.map(p => (
              <tr key={p.productId} className="hover:bg-slate-700/50">
                <td className="p-3 text-sm text-stone-100 font-medium whitespace-nowrap">{p.productName}</td>
                <td className="p-3 text-sm text-stone-300 text-right">{p.quantitySold}</td>
                <td className="p-3 text-sm text-stone-300 text-right">RM {p.totalRevenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEmployeePerformanceReports = () => (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-5">{translate('reports_sales_by_employee_title')}</h3>
      <div className="chart-container h-[350px] bg-white/5 p-2 rounded-md">
        <SalesChart 
            data={mockSalesByEmployee.map(e => ({ name: e.employeeName, sales: e.totalSales, transactions: e.transactions }))} 
            type="bar" 
            dataKey="sales" 
            barColor="#8b5cf6"
            barLegendName={translate('table_total_sales')}
        />
        {/* Could add another chart for transactions or a table */}
      </div>
    </div>
  );

  const renderPaymentAnalysisReports = () => (
     <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-5">{translate('reports_payment_method_distribution_title')}</h3>
        <div className="chart-container h-[350px] bg-white/5 p-2 rounded-md">
           <SalesChart 
              data={mockPaymentMethodData.map(item => ({ ...item, name: translate(item.methodKey) }))}
              type="pie" 
              dataKey="totalAmount"
          />
        </div>
      </div>
  );


  return (
    <div>
      <PageHeader title={translate('reports_title')} subtitle={translate('reports_subtitle')} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Report Type Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {reportTabs.map(tab => (
            <KioskButton
              key={tab.key}
              variant={activeReportType === tab.key ? 'primary' : 'secondary'}
              onClick={() => setActiveReportType(tab.key)}
              className="text-sm whitespace-nowrap px-5 py-2.5"
            >
              {translate(tab.labelKey)}
            </KioskButton>
          ))}
        </div>
        {/* Date Range Filters */}
        <div className="flex items-center space-x-2">
            <span className="text-sm text-stone-300 mr-1">{translate('reports_filter_title')}</span>
            {dateRangeOptions.map(range => (
                 <KioskButton
                    key={range.key}
                    variant={activeDateRange === range.key ? 'primary' : 'secondary'}
                    onClick={() => setActiveDateRange(range.key)}
                    className="text-xs px-3 py-1.5"
                >
                    {translate(range.labelKey)}
                </KioskButton>
            ))}
        </div>
      </div>
      
      <div className="mb-6">
        <KioskButton 
            variant="gemini" 
            onClick={() => handleSummarizeReport(activeReportType)} 
            isLoading={isSummarizing[activeReportType]}
            className="text-sm py-2 px-4"
        >
          <SparklesIcon className="h-4 w-4 mr-1.5"/>
          {translate('reports_btn_gemini_summary')} ({translate(reportTabs.find(t => t.key === activeReportType)?.labelKey || '')})
        </KioskButton>
        {summaries[activeReportType] && (
            <div className="mt-4 text-sm text-stone-300 bg-slate-700 p-4 rounded-md shadow">
              <h4 className="font-semibold mb-2 text-purple-400">{translate(`reports_gemini_summary_${activeReportType}_title`)}</h4>
              <p className="whitespace-pre-wrap">{summaries[activeReportType]}</p>
            </div>
        )}
      </div>

      {/* Render selected report content */}
      {activeReportType === 'overview' && renderOverviewReports()}
      {activeReportType === 'product' && renderProductPerformanceReports()}
      {activeReportType === 'employee' && renderEmployeePerformanceReports()}
      {activeReportType === 'payment' && renderPaymentAnalysisReports()}

      {/* Placeholder if data for selected range isn't available (more for real data) */}
      {/* 
        (activeDateRange === ReportTimeRange.WEEKLY && activeReportType === 'overview' && selectedTimeBasedSalesData.length === 0) && 
        <p className="text-stone-400 mt-6">{translate('reports_data_not_available')}</p> 
      */}

    </div>
  );
};

export default ReportsPage;
