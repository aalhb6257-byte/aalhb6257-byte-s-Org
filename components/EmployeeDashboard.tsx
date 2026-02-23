
import React from 'react';
import { CurrentUserProfile, ActivityLog, User } from '../types';
import { translations } from '../translations';

interface EmployeeDashboardProps {
  currentUser: CurrentUserProfile;
  activityLogs: ActivityLog[];
  users: User[];
  onTabChange: (tab: string) => void;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ currentUser, activityLogs, users, onTabChange }) => {
  const lang = currentUser.language || 'ar';
  const t = translations[lang];

  // Find the user object for the current logged in user to get more details
  const userDetails = users.find(u => u.email === currentUser.email || u.name === currentUser.name);

  const personalLogs = activityLogs.filter(log => log.details.includes(currentUser.name)).slice(0, 5);

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight dark:text-white">
            {t.welcome}, {currentUser.name}
          </h2>
          <p className="text-slate-500 font-medium mt-1 dark:text-slate-400">
            {lang === 'ar' ? 'هذه هي لوحة التحكم الخاصة بك كموظف.' : 'This is your employee dashboard.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="pro-card p-8 lg:col-span-2 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-32 h-32 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-600/30 overflow-hidden shrink-0">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.name.charAt(0)
            )}
          </div>
          <div className="flex-1 text-center md:text-right">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">{currentUser.name}</h3>
                <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mt-1">{currentUser.role}</p>
              </div>
              <button 
                onClick={() => onTabChange('my-profile')}
                className="px-6 py-2.5 bg-slate-100 text-slate-800 rounded-xl font-black text-xs hover:bg-indigo-600 hover:text-white transition-all dark:bg-slate-800 dark:text-slate-200"
              >
                {t.edit} {t.profile}
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-right">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t.department}</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{userDetails?.department || '---'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t.phone}</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300" dir="ltr">{currentUser.phone}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t.email}</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{currentUser.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t.salary}</p>
                <p className="text-sm font-bold text-emerald-600">{userDetails?.salary?.toLocaleString() || '---'} <span className="text-[10px]">ر.س</span></p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t.joinDate}</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{userDetails?.appointmentDatePermanent || '---'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t.status}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {t.active}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats/Info */}
        <div className="space-y-6">
          <div className="pro-card p-8 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-none shadow-xl shadow-indigo-600/20">
            <h4 className="text-lg font-black mb-2">{lang === 'ar' ? 'رصيد الإجازات' : 'Leave Balance'}</h4>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black">24</span>
              <span className="text-indigo-200 font-bold mb-1">{lang === 'ar' ? 'يوم متبقي' : 'days left'}</span>
            </div>
            <div className="mt-6 w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full w-[70%]"></div>
            </div>
            <p className="mt-4 text-xs text-indigo-100 font-medium">
              {lang === 'ar' ? 'لقد استهلكت 6 أيام من أصل 30 يوم.' : 'You have used 6 out of 30 days.'}
            </p>
          </div>

          <div className="pro-card p-6">
            <h4 className="text-sm font-black text-slate-800 dark:text-white mb-4 uppercase tracking-widest">
              {t.recentActivity}
            </h4>
            <div className="space-y-4">
              {personalLogs.length > 0 ? personalLogs.map(log => (
                <div key={log.id} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{log.action}</p>
                    <p className="text-[9px] text-slate-400">{log.timestamp}</p>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-slate-400 font-medium italic">
                  {lang === 'ar' ? 'لا توجد أنشطة حديثة مسجلة.' : 'No recent activities recorded.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="pro-card p-8">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4">{t.biography}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          {currentUser.bio || (lang === 'ar' ? 'لا توجد سيرة مهنية مضافة حالياً.' : 'No biography added yet.')}
        </p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
