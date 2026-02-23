
import React, { useState } from 'react';
import { Transaction, TransactionType, User, UserRole } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  users: User[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
  onUpdateUser: (id: string, u: Partial<User>) => void;
  isReadOnly?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, users, onAdd, onDelete, onUpdateUser, isReadOnly }) => {
  const [activeSubTab, setActiveSubTab] = useState<'transactions' | 'employees'>('transactions');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'عام',
    type: TransactionType.EXPENSE,
    date: new Date().toISOString().split('T')[0]
  });

  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    department: '',
    salary: '',
    role: 'محاسب' as UserRole
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    onAdd({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date
    });
    setFormData({ ...formData, description: '', amount: '' });
    setShowForm(false);
  };

  const handleUpdateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode) {
      onUpdateUser(editMode, {
        name: employeeFormData.name,
        department: employeeFormData.department,
        salary: parseFloat(employeeFormData.salary) || 0,
        role: employeeFormData.role
      });
      setEditMode(null);
    }
  };

  const startEditEmployee = (user: User) => {
    setEmployeeFormData({
      name: user.name,
      department: user.department || '',
      salary: user.salary?.toString() || '',
      role: user.role
    });
    setEditMode(user.id);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div>
          <h2 className="text-2xl font-black text-slate-800">إدارة التدفقات المالية</h2>
          <p className="text-slate-500 font-medium">العمليات النقدية والمصاريف الوظيفية</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <button
            onClick={() => setActiveSubTab('transactions')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
              activeSubTab === 'transactions' 
                ? 'bg-slate-200 text-slate-800 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            سجل العمليات
          </button>
          <button
            onClick={() => setActiveSubTab('employees')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
              activeSubTab === 'employees' 
                ? 'bg-slate-200 text-slate-800 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            إدارة رواتب الموظفين
          </button>
        </div>
      </div>

      {activeSubTab === 'transactions' ? (
        <>
          <div className="flex justify-end gap-3 no-print">
            <button 
              onClick={handlePrintPDF}
              className="bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-95 shadow-sm"
            >
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              تصدير PDF
            </button>
            {!isReadOnly && (
              <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                إضافة عملية
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-6 items-end animate-fade-in no-print">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">وصف المعاملة</label>
                <input 
                  type="text" 
                  className="w-full rounded-2xl border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 p-4 border text-sm font-bold placeholder:text-slate-300"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="مثال: توريد بضاعة"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">القيمة (ر.س)</label>
                <input 
                  type="number" 
                  className="w-full rounded-2xl border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 p-4 border text-sm font-bold"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">النوع</label>
                <select 
                  className="w-full rounded-2xl border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 p-4 border text-sm font-bold bg-white"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as TransactionType})}
                >
                  <option value={TransactionType.INCOME}>دخل وارد (+)</option>
                  <option value={TransactionType.EXPENSE}>مصروف صادر (-)</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-indigo-600 transition-colors shadow-lg">حفظ</button>
                <button type="button" onClick={() => setShowForm(false)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </form>
          )}

          {/* Print Header */}
          <div className="hidden print:block mb-10 border-b-4 border-indigo-600 pb-6">
            <h1 className="text-3xl font-black">كشف العمليات المالية الرسمي</h1>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm font-bold text-slate-500">قسم الموارد البشرية - قسم المالية</p>
              <p className="text-sm font-bold text-slate-800" dir="ltr">{new Date().toLocaleDateString('ar-SA')}</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-100">
                <tr>
                  <th className="px-10 py-6">التاريخ والبيان</th>
                  <th className="px-6 py-6 text-center">التصنيف</th>
                  <th className="px-6 py-6 text-left">المبلغ الصافي</th>
                  <th className="px-10 py-6 text-center no-print">إدارة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.length > 0 ? (
                  transactions.map(t => (
                    <tr key={t.id} className="group hover:bg-slate-50/50 transition-all duration-200">
                      <td className="px-10 py-6">
                        <div>
                          <div className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{t.description}</div>
                          <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{t.date}</div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider print:border print:border-slate-200">{t.category}</span>
                      </td>
                      <td className={`px-6 py-6 text-left font-black text-lg ${t.type === TransactionType.INCOME ? 'text-indigo-600' : 'text-rose-500'}`}>
                        {t.type === TransactionType.INCOME ? '↑' : '↓'} {t.amount.toLocaleString()} 
                        <span className="text-[10px] mr-1 opacity-50">ر.س</span>
                      </td>
                      <td className="px-10 py-6 text-center no-print">
                        {!isReadOnly && (
                          <button 
                            onClick={() => onDelete(t.id)} 
                            className="opacity-0 group-hover:opacity-100 bg-rose-50 text-rose-500 p-2.5 rounded-xl hover:bg-rose-500 hover:text-white transition-all duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <p className="font-black text-xl">لا توجد سجلات مالية بعد</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Employee Management Section remains the same */}
          {editMode && (
            <form onSubmit={handleUpdateEmployee} className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-700 animate-fade-in mb-8 no-print">
              <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center font-bold">✎</span>
                تعديل البيانات المالية للموظف: {employeeFormData.name}
              </h3>
              {/* Form inputs... */}
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(u => (
              <div key={u.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{u.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{u.department || 'إدارة عامة'}</p>
                    </div>
                  </div>
                  {!isReadOnly && (
                    <button 
                      onClick={() => startEditEmployee(u)}
                      className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all no-print"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                  )}
                </div>
                
                <div className="py-4 border-t border-slate-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">الراتب الأساسي</span>
                    <span className="text-sm font-black text-emerald-600">{(u.salary || 0).toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">العنوان الوظيفي</span>
                    <span className="text-xs font-black text-indigo-600">{u.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
