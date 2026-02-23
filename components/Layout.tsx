
import React, { useState, useRef, useEffect } from 'react';
import { CurrentUserProfile, ActivityLog } from '../types';
import { translations } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: CurrentUserProfile;
  activityLogs: ActivityLog[];
  onLogout?: () => void;
  onUpdateTheme?: (color: string) => void;
  onToggleLanguage?: () => void;
  onToggleDarkMode?: () => void;
}

const COLOR_PALETTES = [
  { name: 'الافتراضي', value: '79 70 229', class: 'bg-[#4f46e5]' },
  { name: 'الأزرق', value: '37 99 235', class: 'bg-[#2563eb]' },
  { name: 'الأخضر', value: '22 163 74', class: 'bg-[#16a34a]' },
  { name: 'الأحمر', value: '220 38 38', class: 'bg-[#dc2626]' },
  { name: 'الأصفر', value: '202 138 4', class: 'bg-[#ca8a04]' },
];

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  currentUser, 
  activityLogs, 
  onLogout, 
  onUpdateTheme,
  onToggleLanguage,
  onToggleDarkMode
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const lang = currentUser.language || 'ar';
  const t = translations[lang];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setShowThemePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isOwner = currentUser.role === 'المالك';

  const navItems = [
    { id: 'dashboard', name: t.dashboard, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'transactions', name: t.financial, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', adminOnly: true },
    { id: 'users', name: t.employees, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', adminOnly: true },
    { id: 'reports', name: t.reports, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', adminOnly: true },
    { id: 'archive', name: t.archive, icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', adminOnly: true },
    { id: 'records', name: t.records, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', adminOnly: true },
    { id: 'trash', name: t.trash, icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', adminOnly: true },
  ].filter(item => !item.adminOnly || isOwner);

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">
      <header className="bg-white border-b border-slate-200 z-50 no-print">
        <div className="h-16 px-10 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">{t.appName}</h1>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t.professional}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-100 hidden md:block"></div>
            <div className="relative hidden md:block group">
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="w-64 h-9 bg-slate-50 border border-transparent rounded-xl pr-10 pl-4 text-[11px] font-bold focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-slate-200 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button 
              onClick={onToggleLanguage}
              className="w-9 h-9 rounded-xl transition-all relative flex items-center justify-center hover:bg-slate-50 text-slate-400"
              title={currentUser.language === 'ar' ? 'English' : 'العربية'}
            >
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {currentUser.language === 'ar' ? 'EN' : 'AR'}
              </span>
            </button>

            <button 
              onClick={onToggleDarkMode}
              className="w-9 h-9 rounded-xl transition-all relative flex items-center justify-center hover:bg-slate-50 text-slate-400"
              title={currentUser.isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {currentUser.isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              )}
            </button>

            <div className="relative" ref={themeRef}>
              <button 
                onClick={() => setShowThemePicker(!showThemePicker)}
                className={`w-9 h-9 rounded-xl transition-all relative flex items-center justify-center hover:bg-slate-50 ${showThemePicker ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}
                title="تغيير مظهر النظام"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
              </button>
              {showThemePicker && (
                <div className="absolute top-full left-0 mt-3 w-40 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in p-2">
                  <div className="grid grid-cols-1 gap-1">
                    {COLOR_PALETTES.map(palette => (
                      <button
                        key={palette.value}
                        onClick={() => {
                          if (onUpdateTheme) onUpdateTheme(palette.value);
                          setShowThemePicker(false);
                        }}
                        className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-xl transition-colors text-right"
                      >
                        <div className={`w-5 h-5 rounded-md ${palette.class} shadow-sm border border-black/5`}></div>
                        <span className="text-[10px] font-black text-slate-700">{palette.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-9 h-9 rounded-xl transition-all relative flex items-center justify-center hover:bg-slate-50 ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                {activityLogs.length > 0 && <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>}
              </button>
              {showNotifications && (
                <div className="absolute top-full left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-[11px] font-black uppercase text-slate-800">التنبيهات الأخيرة</h3>
                    <span className="text-[9px] font-bold text-slate-400">{activityLogs.length} عملية</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {activityLogs.slice(0, 5).map(log => (
                      <div key={log.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <p className="text-[11px] font-black text-slate-800 mb-0.5">{log.action}</p>
                        <p className="text-[10px] text-slate-500 truncate">{log.details}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[9px] font-bold text-indigo-500">{log.user}</span>
                          <span className="text-[9px] text-slate-300">{log.timestamp.split(', ')[1]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="h-6 w-px bg-slate-100"></div>
            <div className="relative" ref={userMenuRef}>
              <div 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-3 py-1 pr-1 pl-3 rounded-xl border transition-all cursor-pointer group ${activeTab === 'my-profile' || showUserMenu ? 'bg-indigo-50 border-indigo-100' : 'border-transparent hover:bg-slate-50'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md overflow-hidden transition-transform group-hover:scale-105">
                  {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
                </div>
                <div className="hidden lg:block">
                  <p className="text-[11px] font-black text-slate-800 leading-none">{currentUser.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{currentUser.role}</p>
                </div>
                <svg className={`w-3 h-3 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>

              {showUserMenu && (
                <div className="absolute top-full left-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in">
                  <button 
                    onClick={() => { setActiveTab('my-profile'); setShowUserMenu(false); }}
                    className="w-full px-5 py-4 flex items-center gap-3 text-right hover:bg-slate-50 transition-colors border-b border-slate-50"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span className="text-xs font-black text-slate-700">{t.profile}</span>
                  </button>
                  <button 
                    onClick={() => { if(onLogout) onLogout(); setShowUserMenu(false); }}
                    className="w-full px-5 py-4 flex items-center gap-3 text-right hover:bg-rose-50 transition-colors text-rose-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span className="text-xs font-black">{t.logout}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-14 px-10 flex items-center border-t border-slate-50 overflow-x-auto scrollbar-hide bg-white/60 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl transition-all duration-500 whitespace-nowrap group relative overflow-hidden border ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-purple-500/15 via-fuchsia-500/15 to-indigo-500/15 text-purple-700 border-purple-200 shadow-lg shadow-purple-500/10' 
                    : 'text-slate-500 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-indigo-50/50 border-transparent'
                }`}
              >
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-fuchsia-400/10 to-indigo-400/10 animate-pulse"></div>
                )}
                <svg className={`w-4 h-4 relative z-10 ${
                  activeTab === item.id 
                    ? 'text-purple-600' 
                    : 'text-slate-400 group-hover:text-purple-500 transition-colors'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                </svg>
                <span className={`text-xs font-bold relative z-10 ${
                  activeTab === item.id 
                    ? 'text-purple-900 font-black' 
                    : 'text-slate-600 group-hover:text-purple-900'
                }`}>{item.name}</span>
                
                {activeTab === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 via-emerald-500 via-amber-500 to-indigo-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-50/40 rounded-full blur-[120px] -mr-40 -mt-40"></div>
        </div>
        <div className="max-w-7xl mx-auto p-8 lg:p-12 animate-fade-in">
          {children}
        </div>
      </main>
      <footer className="h-8 bg-white border-t border-slate-100 px-10 flex items-center justify-between text-[10px] font-bold text-slate-400 no-print shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            {t.connected}
          </div>
        </div>
        <div className="flex items-center gap-4 uppercase tracking-[0.1em]">
          <span>HRMS PROFESSIONAL v3.1.0</span>
          <div className="h-3 w-px bg-slate-100"></div>
          <span>{currentUser.name} © 2024</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
