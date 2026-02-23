
import React, { useState } from 'react';
import { ActivityLog } from '../types';

interface RecordsListProps {
  logs: ActivityLog[];
}

const RecordsList: React.FC<RecordsListProps> = ({ logs }) => {
  const [filter, setFilter] = useState<'الكل' | 'مالي' | 'إداري' | 'نظام'>('الكل');

  const filteredLogs = filter === 'الكل' ? logs : logs.filter(log => log.category === filter);

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'مالي': return 'bg-indigo-100 text-indigo-700';
      case 'إداري': return 'bg-purple-100 text-purple-700';
      case 'نظام': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleSaveAsPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 no-print">
        <div>
          <h2 className="text-2xl font-black text-slate-800">سجل النشاطات والنظام</h2>
          <p className="text-slate-500 font-medium">مراقبة كافة العمليات المنفذة في النظام بدقة</p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            {['الكل', 'مالي', 'إداري', 'نظام'].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item as any)}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                  filter === item 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button 
            onClick={handleSaveAsPDF}
            className="bg-rose-600 text-white px-6 h-12 rounded-2xl font-black shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all flex items-center gap-3 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            حفظ كـ PDF
          </button>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-6">
        <h1 className="text-3xl font-black mb-2">تقرير سجل النشاطات الرسمي</h1>
        <p className="text-sm font-bold text-slate-500">تصنيف التقرير: {filter} | تاريخ الاستخراج: {new Date().toLocaleString('ar-SA')}</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-100">
            <tr>
              <th className="px-10 py-6">التوقيت</th>
              <th className="px-6 py-6">المستخدم</th>
              <th className="px-6 py-6">النشاط</th>
              <th className="px-6 py-6 text-center">التصنيف</th>
              <th className="px-10 py-6">التفاصيل</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredLogs.length > 0 ? (
              filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="text-xs font-black text-slate-800">{log.timestamp.split(', ')[1]}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">{log.timestamp.split(', ')[0]}</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black print:border print:border-indigo-100">
                        {log.user.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-black text-slate-800">{log.action}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider ${getCategoryColor(log.category)} print:border print:border-slate-200`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-xs text-slate-500 font-medium max-w-xs truncate print:max-w-none print:whitespace-normal">{log.details}</p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    <p className="font-black text-lg">لا توجد سجلات حالية لهذا التصنيف</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Print Footer */}
      <div className="hidden print:flex justify-between items-center mt-12 pt-8 border-t border-slate-200 text-[10px] font-bold text-slate-400">
        <p>تم استخراج هذا التقرير آلياً من قسم الموارد البشرية</p>
        <p>الصفحة 1 من 1</p>
      </div>
    </div>
  );
};

export default RecordsList;
