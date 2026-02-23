
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, FinancialSummary, User } from '../types';

interface DashboardProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  users: User[];
  onViewUser: (user: User) => void;
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ summary, transactions, users, onViewUser, onTabChange }) => {
  const trendData = [
    { name: 'أسبوع 1', income: 12000, expenses: 8000 },
    { name: 'أسبوع 2', income: 15000, expenses: 7000 },
    { name: 'أسبوع 3', income: 18000, expenses: 9500 },
    { name: 'أسبوع 4', income: summary.totalIncome, expenses: summary.totalExpenses },
  ];

  const mainActions = [
    { 
      id: 'users', 
      label: 'بيانات الموظفين', 
      desc: 'إدارة السجلات والملفات الوظيفية',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      color: 'indigo' 
    },
    { 
      id: 'archive', 
      label: 'أرشيف المعلومات', 
      desc: 'إدارة النسخ الاحتياطي والبيانات المؤرشفة',
      icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
      color: 'slate' 
    },
    { 
      id: 'reports', 
      label: 'تقرير الموظفين', 
      desc: 'إصدار تقارير الأداء والرواتب',
      icon: 'M9 17v-2m3 2v-4m3 2v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'amber' 
    },
    { 
      id: 'transfers', 
      label: 'النقل الداخلي والخارجي', 
      desc: 'إدارة طلبات النقل والتدوير الوظيفي',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      color: 'emerald' 
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">الرئيسية</h2>
          <p className="text-slate-500 font-medium mt-1">نظرة عامة على القوى العاملة والعمليات الإدارية.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mainActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onTabChange(action.id)}
            className="pro-card p-6 flex items-center gap-5 text-right hover:border-purple-500 group transition-all relative overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/10 via-fuchsia-500/10 to-indigo-500/10 text-purple-600 flex items-center justify-center group-hover:from-purple-600 group-hover:via-fuchsia-500 group-hover:to-indigo-600 group-hover:text-white transition-all shadow-sm border border-purple-100/50`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon}></path>
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 group-hover:text-purple-600 transition-colors">{action.label}</h4>
              <p className="text-xs text-slate-400 font-bold">{action.desc}</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 via-emerald-500 via-amber-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'السيولة الواردة', value: summary.totalIncome, trend: '+12%', color: 'indigo', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'المصاريف التشغيلية', value: summary.totalExpenses, trend: '-2.5%', color: 'rose', icon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6' },
          { label: 'الكادر الوظيفي', value: users.length, trend: 'مستقر', color: 'emerald', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
          { label: 'صافي الربح', value: summary.netProfit, trend: '+5.4%', color: 'amber', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z' }
        ].map((kpi, idx) => (
          <div key={idx} className="pro-card p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-${kpi.color}-50 text-${kpi.color}-600 flex items-center justify-center`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={kpi.icon}></path></svg>
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full ${kpi.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : kpi.trend === 'مستقر' ? 'bg-slate-50 text-slate-500' : 'bg-rose-50 text-rose-600'}`}>
                {kpi.trend}
              </span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{kpi.label}</p>
              <h3 className="text-2xl font-black text-slate-900">
                {kpi.value.toLocaleString()} 
                <span className="text-xs text-slate-400 font-bold mr-2">ر.س</span>
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 pro-card p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-black text-slate-800">تحليلات الأداء المالي</h3>
              <p className="text-xs text-slate-400 font-bold">مقارنة التدفقات النقدية والمصاريف الشهرية</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                   contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '1rem' }}
                />
                <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="pro-card p-8">
            <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">آخر الموظفين المسجلين</h3>
            <div className="space-y-6">
              {users.slice(0, 5).map(user => (
                <div 
                  key={user.id} 
                  className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-3 -mx-3 rounded-2xl transition-all" 
                  onClick={() => onViewUser(user)}
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all overflow-hidden">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800 mb-0.5 group-hover:text-indigo-600 transition-colors">{user.fullNameQuad || user.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.department}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${user.status === 'نشط' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => onTabChange('users')}
              className="w-full mt-8 py-4 text-[11px] font-black text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all"
            >
              عرض دليل الموظفين بالكامل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
