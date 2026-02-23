
import React, { useState } from 'react';
import { Transaction, FinancialSummary, User, TransactionType, GeneratedReport, CurrentUserProfile } from '../types';

interface ReportViewProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  users: User[];
  reportsHistory: GeneratedReport[];
  onSaveReport: (report: Omit<GeneratedReport, 'id'>) => void;
  currentUser: CurrentUserProfile;
  isReadOnly?: boolean;
}

const ReportView: React.FC<ReportViewProps> = ({ summary: globalSummary, transactions, users, reportsHistory, onSaveReport, currentUser, isReadOnly }) => {
  const [reportId] = useState(`EI-${Math.floor(Math.random() * 90000) + 10000}`);
  const [filterType, setFilterType] = useState<'all' | 'monthly' | 'yearly'>('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    const [year, month] = t.date.split('-');
    if (filterType === 'yearly') return year === selectedYear;
    if (filterType === 'monthly') return year === selectedYear && month === selectedMonth;
    return true;
  });

  const reportSummary = filteredTransactions.reduce((acc, t) => {
    if (t.type === TransactionType.INCOME) {
      acc.totalIncome += t.amount;
    } else {
      acc.totalExpenses += t.amount;
    }
    acc.transactionsCount += 1;
    acc.netProfit = acc.totalIncome - acc.totalExpenses;
    return acc;
  }, { totalIncome: 0, totalExpenses: 0, netProfit: 0, transactionsCount: 0 } as FinancialSummary);

  const handlePrint = () => {
    let typeLabel = 'تقرير شامل';
    if (filterType === 'monthly') typeLabel = `تقرير شهري - ${selectedMonth}/${selectedYear}`;
    if (filterType === 'yearly') typeLabel = `تقرير سنوي - ${selectedYear}`;

    // Save to "Database" first
    onSaveReport({
      timestamp: new Date().toLocaleString('ar-SA'),
      generatedBy: currentUser.name,
      summarySnapshot: { ...reportSummary },
      reportType: typeLabel
    });

    // Trigger Print
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const currentDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = [
    { val: '01', label: 'يناير' }, { val: '02', label: 'فبراير' }, { val: '03', label: 'مارس' },
    { val: '04', label: 'أبريل' }, { val: '05', label: 'مايو' }, { val: '06', label: 'يونيو' },
    { val: '07', label: 'يوليو' }, { val: '08', label: 'أغسطس' }, { val: '09', label: 'سبتمبر' },
    { val: '10', label: 'أكتوبر' }, { val: '11', label: 'نوفمبر' }, { val: '12', label: 'ديسمبر' }
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div>
          <h2 className="text-2xl font-black text-slate-800">إدارة التقارير والأرشفة</h2>
          <p className="text-slate-500 font-medium">إصدار تقارير مالية مخصصة وتتبع سجل الطباعة</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filterType === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              الكل
            </button>
            <button 
              onClick={() => setFilterType('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filterType === 'monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              شهري
            </button>
            <button 
              onClick={() => setFilterType('yearly')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filterType === 'yearly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              سنوي
            </button>
          </div>

          {filterType !== 'all' && (
            <div className="flex gap-2">
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              {filterType === 'monthly' && (
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                </select>
              )}
            </div>
          )}

          {!isReadOnly && (
            <button 
              onClick={handlePrint}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              طباعة التقرير
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Report Preview */}
        <div className="lg:col-span-3">
          <div className="bg-white p-12 md:p-16 rounded-[2.5rem] shadow-sm border border-slate-100 print-container relative overflow-hidden">
             {/* Watermark for print */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-50/50 text-7xl font-black -rotate-45 pointer-events-none select-none uppercase hidden print:block">
               FINANCIAL REPORT
             </div>

            {/* Document Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-100 pb-10 mb-10 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl">م</div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">التقرير المالي</h1>
                </div>
                <p className="text-slate-500 font-bold">
                  {filterType === 'all' ? 'تقرير مالي شامل لكافة الفترات' : 
                   filterType === 'monthly' ? `التقرير المالي لشهر ${months.find(m => m.val === selectedMonth)?.label} ${selectedYear}` : 
                   `التقرير المالي السنوي لعام ${selectedYear}`}
                </p>
                <p className="text-xs text-slate-400 mt-1">الرقم المرجعي: {reportId}</p>
              </div>
              <div className="text-left" dir="ltr">
                <p className="font-bold text-slate-800">{currentDate}</p>
                <p className="text-sm text-slate-400 mt-1">HR Information System v2.0</p>
              </div>
            </div>

            {/* Financial Summary Section */}
            <div className="mb-12 relative z-10">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                ملخص الفترة المحددة
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-2">إجمالي الدخل</p>
                  <p className="text-2xl font-black text-indigo-600">{reportSummary.totalIncome.toLocaleString()} <span className="text-xs">ر.س</span></p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-2">إجمالي المصروفات</p>
                  <p className="text-2xl font-black text-rose-500">{reportSummary.totalExpenses.toLocaleString()} <span className="text-xs">ر.س</span></p>
                </div>
                <div className={`p-6 rounded-3xl text-white shadow-lg ${reportSummary.netProfit >= 0 ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-rose-600 shadow-rose-600/20'}`}>
                  <p className="text-white/70 text-xs font-bold uppercase mb-2">{reportSummary.netProfit >= 0 ? 'صافي الربح' : 'صافي الخسارة'}</p>
                  <p className="text-2xl font-black">{Math.abs(reportSummary.netProfit).toLocaleString()} <span className="text-sm">ر.س</span></p>
                </div>
              </div>
            </div>

            {/* Statistics Table */}
            <div className="mb-12 relative z-10">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                تفاصيل العمليات في هذه الفترة
              </h3>
              {filteredTransactions.length > 0 ? (
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-sm font-black text-slate-500 uppercase">التاريخ</th>
                      <th className="px-6 py-4 text-sm font-black text-slate-500 uppercase">البيان</th>
                      <th className="px-6 py-4 text-sm font-black text-slate-500 uppercase text-center">التصنيف</th>
                      <th className="px-6 py-4 text-sm font-black text-slate-500 uppercase text-left">القيمة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTransactions.map(t => (
                      <tr key={t.id}>
                        <td className="px-6 py-4 text-sm text-slate-500">{t.date}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{t.description}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-xs font-bold text-slate-400">{t.category}</span>
                        </td>
                        <td className={`px-6 py-4 text-left font-black ${t.type === TransactionType.INCOME ? 'text-indigo-600' : 'text-rose-500'}`}>
                          {t.amount.toLocaleString()} ر.س
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">لا توجد عمليات مسجلة في هذه الفترة</p>
                </div>
              )}
            </div>

            {/* Footer / Signature */}
            <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-end relative z-10">
              <div className="text-slate-400 text-xs leading-relaxed">
                <p>تم استخراج هذا التقرير آلياً بناءً على قاعدة بيانات الموظفين.</p>
                <p>رمز التحقق الرقمي: {btoa(reportId).slice(0, 12)}</p>
              </div>
              <div className="text-center">
                <div className="w-40 h-1 bg-slate-900 mb-4 mx-auto"></div>
                <p className="font-black text-slate-900">توقيع مسؤول شؤون الموظفين</p>
                <p className="text-xs text-slate-500 mt-2 font-bold">{currentUser.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar History (Database connection) */}
        <div className="lg:col-span-1 no-print space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
            <h4 className="font-black text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
              سجل الأرشفة
            </h4>
            <div className="space-y-4">
              {reportsHistory.length > 0 ? reportsHistory.map(report => (
                <div key={report.id} className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors group cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{report.id}</span>
                    <span className="text-[10px] text-slate-500">{report.timestamp.split(' ')[0]}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-300 mb-1">{report.reportType}</p>
                  <p className="text-[10px] text-slate-500 mb-3">بواسطة: {report.generatedBy}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                    <span className="text-[10px] font-black text-emerald-400">صافي: {report.summarySnapshot.netProfit.toLocaleString()} ر.س</span>
                    <button className="text-slate-400 hover:text-white transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 opacity-30 italic text-sm">
                  لا توجد تقارير مؤرشفة بعد
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">إحصائيات الأرشفة</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-600">تقارير هذا الشهر</span>
              <span className="text-sm font-black text-indigo-600">{reportsHistory.length}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full" style={{ width: `${Math.min(reportsHistory.length * 10, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
