
import React from 'react';
import { User, Transaction, TransactionType } from '../types';

interface EmployeeProfileProps {
  user: User;
  onBack: () => void;
  onEdit?: (userId: string) => void;
  transactions: Transaction[];
  isReadOnly?: boolean;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ user, onBack, onEdit, transactions, isReadOnly }) => {
  const employeePayments = transactions.filter(t => 
    t.description.toLowerCase().includes(user.name.toLowerCase()) || 
    t.description.includes(user.fullNameQuad)
  );

  const totalPaid = employeePayments
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-indigo-600 font-black hover:bg-indigo-50 px-6 py-3 rounded-2xl transition-all w-fit"
        >
          <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          العودة لسجل الموظفين
        </button>

        {!isReadOnly && onEdit && (
          <button 
            onClick={() => onEdit(user.id)}
            className="flex items-center gap-3 bg-white border border-slate-200 text-slate-700 font-black hover:bg-slate-50 px-6 py-3 rounded-2xl transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            تعديل بيانات الملف
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="pro-card overflow-hidden">
            <div className="h-32 bg-indigo-600 relative">
               <div className="absolute -bottom-12 right-1/2 translate-x-1/2">
                 <div className="w-24 h-24 bg-white rounded-[2rem] p-1 shadow-2xl overflow-hidden">
                    <div className="w-full h-full bg-slate-100 rounded-[1.8rem] flex items-center justify-center text-3xl font-black text-indigo-600 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.fullNameQuad?.charAt(0) || user.name.charAt(0)
                      )}
                    </div>
                 </div>
               </div>
            </div>
            <div className="pt-16 pb-8 px-8 text-center">
              <h2 className="text-xl font-black text-slate-800 mb-1">{user.fullNameQuad || user.name}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.role} | {user.department}</p>
              
              <div className="mt-6 flex justify-center">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.status === 'نشط' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  الحالة: {user.status}
                </span>
              </div>
            </div>
            <div className="border-t border-slate-50 p-8 space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المواليد</span>
                <span className="text-xs font-bold text-slate-700">{user.birthDate || 'غير مسجل'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اسم الأم</span>
                <span className="text-xs font-bold text-slate-700">{user.motherNameTriple || 'غير مسجل'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الجنس</span>
                <span className="text-xs font-bold text-slate-700">{user.gender}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الهاتف</span>
                <span className="text-xs font-black text-indigo-600" dir="ltr">{user.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">البريد الإلكتروني</span>
                <span className="text-xs font-black text-indigo-600 truncate max-w-[150px] text-left" dir="ltr" title={user.email}>{user.email || '---'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">محل السكن</span>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[150px] text-left" title={user.address}>{user.address || '---'}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-50/50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الراتب الحالي</span>
                <span className="text-xs font-black text-emerald-600">{(user.salary || 0).toLocaleString()} ر.س</span>
              </div>
            </div>
          </div>

          <div className="pro-card p-8 bg-slate-900 text-white">
            <h3 className="text-lg font-black mb-6 uppercase tracking-tight">المؤشرات المالية</h3>
            <div className="space-y-4">
              <div className="bg-slate-800 p-5 rounded-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-2">الراتب الحالي</p>
                <p className="text-2xl font-black">{(user.salary || 0).toLocaleString()} <span className="text-xs text-slate-500">ر.س</span></p>
              </div>
              <div className="bg-indigo-600 p-5 rounded-2xl">
                <p className="text-[10px] font-black text-indigo-200 uppercase mb-2">إجمالي الصرف السنوي</p>
                <p className="text-2xl font-black">{totalPaid.toLocaleString()} <span className="text-xs text-indigo-200">ر.س</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {/* Professional Biography Section */}
          <div className="pro-card p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">السيرة المهنية والتحصيل</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">خلفية الموظف المهنية والخبرات السابقة</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
               <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">التحصيل الدراسي</label>
                    <p className="text-sm font-black text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">{user.education || 'لم يتم تحديد المؤهل'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">التخصص الدقيق</label>
                    <p className="text-sm font-black text-indigo-600 bg-indigo-50 p-4 rounded-xl border border-indigo-100">{user.preciseSpecialization || 'لم يتم تحديد التخصص'}</p>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">تاريخ المباشرة (عقد)</label>
                    <p className="text-sm font-black text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">{user.appointmentDateContract || 'قيد المراجعة'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">المباشرة على الملاك</label>
                    <p className="text-sm font-black text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">{user.appointmentDatePermanent || 'قيد المراجعة'}</p>
                  </div>
               </div>
            </div>

            <div className="pt-8 border-t border-slate-50">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 px-1">السيرة المهنية المفصلة</label>
              <div className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 whitespace-pre-wrap">
                {user.biography || 'لا توجد سيرة مهنية مسجلة لهذا الموظف حالياً في النظام.'}
              </div>
            </div>
          </div>

          {/* Administrative Notes Section */}
          <div className="pro-card p-10 bg-indigo-600 text-white shadow-xl shadow-indigo-600/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </div>
              <div>
                <h3 className="text-xl font-black">ملاحظات إدارية</h3>
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">سجل المتابعة والتقييم الداخلي</p>
              </div>
            </div>
            
            <div className="text-sm text-indigo-50 leading-relaxed bg-white/10 p-6 rounded-[2rem] border border-white/10 whitespace-pre-wrap backdrop-blur-sm">
              {user.notes || 'لا توجد ملاحظات إدارية أو تقييمات مسجلة لهذا الملف الموظف حالياً.'}
            </div>
            
            <div className="mt-8 flex justify-between items-center pt-8 border-t border-white/10">
               <div>
                  <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest block mb-1">تاريخ آخر تحديث للملاحظات</label>
                  <p className="text-xs font-black">{user.joinDate || '---'}</p>
               </div>
               <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-50">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>
               </div>
            </div>
          </div>

          {/* Financial Archive Table */}
          <div className="pro-card overflow-hidden">
            <div className="px-10 py-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-slate-800">الأرشيف المالي للموظف</h3>
              <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-4 py-1.5 rounded-full uppercase">آخر 5 دفعات</span>
            </div>
            <table className="w-full text-right">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-10 py-4">التاريخ</th>
                  <th className="px-6 py-4">وصف العملية</th>
                  <th className="px-10 py-4 text-left">المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {employeePayments.length > 0 ? (
                  employeePayments.slice(0, 5).map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-10 py-5 text-xs font-bold text-slate-400">{t.date}</td>
                      <td className="px-6 py-5 text-sm font-black text-slate-700">{t.description}</td>
                      <td className="px-10 py-5 text-sm font-black text-rose-500 text-left">-{t.amount.toLocaleString()} ر.س</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-10 py-12 text-center text-slate-300 italic text-sm">لا يوجد سجل مالي حالي لهذا الموظف</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
