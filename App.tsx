
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import TransactionList from './components/TransactionList';
import UserManagement from './components/UserManagement';
import EmployeeProfile from './components/EmployeeProfile';
import ReportView from './components/ReportView';
import RecordsList from './components/RecordsList';
import TrashBin from './components/TrashBin';
import UserProfileEdit from './components/UserProfileEdit';
import Login from './components/Login';
import { supabase } from './src/lib/supabase';
import { Transaction, TransactionType, FinancialSummary, User, GeneratedReport, ActivityLog, CurrentUserProfile } from './types';

const INITIAL_DATA: Transaction[] = [
  { id: '1', date: '2023-10-01', description: 'راتب شهر أكتوبر - علي خضر', category: 'رواتب', amount: 15000, type: TransactionType.EXPENSE },
  { id: '2', date: '2023-10-02', description: 'إيجار المكتب', category: 'سكن', amount: 3000, type: TransactionType.EXPENSE },
  { id: '3', date: '2023-10-05', description: 'إيداع مبيعات', category: 'دخل', amount: 25000, type: TransactionType.INCOME },
];

const DEFAULT_PROFILE: CurrentUserProfile = {
  name: 'علي خضر',
  role: 'مدير النظام',
  email: 'ali.khadr@example.com',
  avatar: null,
  phone: '+966 50 123 4567',
  bio: 'مدير مالي وإداري خبير، مسؤول عن إدارة القوى العاملة والتدفقات المالية للنظام.',
  themeColor: '79 70 229', // Indigo
  language: 'ar',
  isDarkMode: false
};

const INITIAL_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'علي خضر', 
    fullNameQuad: 'علي خضر بن حسن آل علي',
    motherNameTriple: 'سارة بنت محمد حسن',
    gender: 'ذكر',
    birthDate: '1985-05-15',
    education: 'ماجستير إدارة أعمال',
    preciseSpecialization: 'إدارة استراتيجية',
    appointmentDateContract: '2022-12-01',
    appointmentDatePermanent: '2023-01-01',
    email: 'ali.khadr@example.com', 
    role: 'مدير', 
    status: 'نشط', 
    joinDate: '2023-01-01',
    phone: '+966 50 123 4567',
    department: 'الإدارة العليا',
    salary: 15000,
    address: 'الرياض، حي العليا',
    biography: 'خبير مالي وإداري بخبرة تمتد لأكثر من 15 عاماً في قيادة التحول الرقمي للمؤسسات.',
    notes: 'المدير التنفيذي للنظام.'
  },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        const user = session.user;
        setCurrentUser(prev => ({
          ...prev,
          name: user.user_metadata.full_name || user.email?.split('@')[0] || 'مستخدم',
          email: user.email || '',
          avatar: user.user_metadata.avatar_url || null,
          role: user.email === 'ali.khadr@example.com' ? 'المالك' : 'موظف'
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        const user = session.user;
        setCurrentUser(prev => ({
          ...prev,
          name: user.user_metadata.full_name || user.email?.split('@')[0] || 'مستخدم',
          email: user.email || '',
          avatar: user.user_metadata.avatar_url || null,
          role: user.email === 'ali.khadr@example.com' ? 'المالك' : 'موظف'
        }));
      } else {
        setIsAuthenticated(false);
        setCurrentUser(DEFAULT_PROFILE);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<CurrentUserProfile>(() => {
    const saved = localStorage.getItem('zad_current_user');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('zad_transactions');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('zad_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [trashTransactions, setTrashTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('zad_trash_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [trashUsers, setTrashUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('zad_trash_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [reportsHistory, setReportsHistory] = useState<GeneratedReport[]>(() => {
    const saved = localStorage.getItem('zad_reports_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('zad_activity_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('zad_is_authenticated', isAuthenticated.toString());
    localStorage.setItem('zad_current_user', JSON.stringify(currentUser));
    localStorage.setItem('zad_transactions', JSON.stringify(transactions));
    localStorage.setItem('zad_users', JSON.stringify(users));
    localStorage.setItem('zad_trash_transactions', JSON.stringify(trashTransactions));
    localStorage.setItem('zad_trash_users', JSON.stringify(trashUsers));
    localStorage.setItem('zad_reports_history', JSON.stringify(reportsHistory));
    localStorage.setItem('zad_activity_logs', JSON.stringify(activityLogs));
  }, [isAuthenticated, currentUser, transactions, users, trashTransactions, trashUsers, reportsHistory, activityLogs]);

  const addLog = (action: string, category: ActivityLog['category'], details: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString('ar-SA'),
      user: currentUser.name,
      action,
      category,
      details
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleLogin = async (username: string, role: string) => {
    // This is now handled by Supabase auth listener
    // But we keep it for manual login if needed, though we prefer OAuth
    setIsAuthenticated(true);
    setCurrentUser(prev => ({ ...prev, name: username, role: role }));
    addLog('تسجيل دخول ناجح', 'نظام', `قام المستخدم ${username} بالدخول للنظام بصلاحية: ${role}.`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser(DEFAULT_PROFILE);
    addLog('تسجيل خروج', 'نظام', `تم إنهاء الجلسة الحالية يدوياً.`);
  };

  const updateTheme = (color: string) => {
    setCurrentUser(prev => ({ ...prev, themeColor: color }));
    addLog('تغيير مظهر النظام', 'نظام', `تم تغيير لون العلامة التجارية للنظام.`);
  };

  const toggleLanguage = () => {
    setCurrentUser(prev => ({ ...prev, language: prev.language === 'ar' ? 'en' : 'ar' }));
    addLog('تغيير اللغة', 'نظام', `تم تغيير لغة واجهة النظام.`);
  };

  const toggleDarkMode = () => {
    setCurrentUser(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
    addLog('تغيير وضع المظهر', 'نظام', `تم التبديل بين الوضع الليلي والنهاري.`);
  };

  useEffect(() => {
    if (currentUser.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.dir = currentUser.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentUser.language || 'ar';
  }, [currentUser.isDarkMode, currentUser.language]);

  const summary = useMemo<FinancialSummary>(() => {
    const totalIncome = transactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome, totalExpenses, netProfit: totalIncome - totalExpenses, transactionsCount: transactions.length };
  }, [transactions]);

  const isOwner = currentUser.role === 'المالك';

  const addUser = (newUser: Omit<User, 'joinDate' | 'status'>) => {
    if (!isOwner) return;
    const userWithId: User = { 
      ...newUser, 
      joinDate: new Date().toISOString().split('T')[0], 
      status: 'نشط' 
    } as User;
    setUsers(prev => [userWithId, ...prev]);
    addLog('إضافة موظف', 'إداري', `تم تسجيل الموظف: ${newUser.fullNameQuad}`);
  };

  const softDeleteUsers = (ids: string[]) => {
    if (!isOwner) return;
    const usersToDelete = users.filter(u => ids.includes(u.id));
    if (usersToDelete.length > 0) {
      setUsers(users.filter(u => !ids.includes(u.id)));
      const deletedAt = new Date().toLocaleString('ar-SA');
      const movedToTrash = usersToDelete.map(u => ({ ...u, deletedAt }));
      setTrashUsers([...movedToTrash, ...trashUsers]);
      addLog('حذف موظفين', 'سلة المهملات', `تم نقل ${ids.length} موظف إلى السلة.`);
    }
  };

  const updateUser = (id: string, updatedData: Partial<User>) => {
    if (!isOwner) return;
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedData } : u));
    addLog('تحديث بيانات موظف', 'إداري', `تم تعديل بيانات الملف الوظيفي للمعرف ${id}`);
  };

  const handleImportDatabase = (data: any) => {
    if (!isOwner) return;
    try {
      if (data.users) setUsers(data.users);
      if (data.transactions) setTransactions(data.transactions);
      if (data.activityLogs) setActivityLogs(data.activityLogs);
      addLog('استيراد بيانات', 'نظام', 'تم استيراد قاعدة البيانات بنجاح من ملف خارجي.');
      alert('تم استيراد البيانات بنجاح!');
    } catch (e) {
      alert('خطأ في تنسيق ملف البيانات المستورد.');
    }
  };

  const handleExportDatabase = () => {
    const data = {
      users: users,
      transactions: transactions,
      activityLogs: activityLogs,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `نسخة_احتياطية_كاملة_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    addLog('تصدير قاعدة البيانات', 'نظام', 'تم إنشاء نسخة احتياطية كاملة وتحميلها.');
  };

  const renderContent = () => {
    if (activeTab === 'employee-profile' && selectedUser) {
      return (
        <EmployeeProfile 
          user={selectedUser} 
          onBack={() => { setActiveTab('users'); setSelectedUser(null); }} 
          onEdit={(id) => { 
            if (isOwner) {
              setEditingUserId(id); 
              setActiveTab('users'); 
              setSelectedUser(null); 
            } else {
              alert('عذراً، لا تملك صلاحية تعديل بيانات الموظفين.');
            }
          }}
          transactions={transactions} 
          isReadOnly={!isOwner}
        />
      );
    }
    switch (activeTab) {
      case 'dashboard': 
        return isOwner ? (
          <Dashboard 
            summary={summary} 
            transactions={transactions} 
            users={users} 
            onViewUser={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} 
            onTabChange={setActiveTab} 
          />
        ) : (
          <EmployeeDashboard 
            currentUser={currentUser} 
            activityLogs={activityLogs} 
            users={users}
            onTabChange={setActiveTab}
          />
        );
      case 'transactions': return (
        <TransactionList 
          transactions={transactions} 
          users={users} 
          onAdd={(t) => isOwner && setTransactions([{...t, id: Math.random().toString(36).substr(2, 9)}, ...transactions])} 
          onDelete={(id) => isOwner && setTransactions(transactions.filter(t => t.id !== id))} 
          onUpdateUser={updateUser} 
          isReadOnly={!isOwner}
        />
      );
      case 'users': return (
        <UserManagement 
          users={users} 
          onAdd={addUser} 
          onUpdate={updateUser} 
          onDelete={(id) => softDeleteUsers([id])} 
          onDeleteMultiple={softDeleteUsers}
          onToggleStatus={id => isOwner && setUsers(users.map(u => u.id === id ? {...u, status: u.status === 'نشط' ? 'معطل' : 'نشط'} : u))} 
          onViewProfile={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} 
          editUserId={editingUserId}
          onImportDatabase={handleImportDatabase}
          isReadOnly={!isOwner}
        />
      );
      case 'reports': return <ReportView summary={summary} transactions={transactions} users={users} reportsHistory={reportsHistory} onSaveReport={r => isOwner && setReportsHistory([{...r, id: `ZD-${Date.now()}`}, ...reportsHistory])} currentUser={currentUser} isReadOnly={!isOwner} />;
      case 'archive': return (
        <div className="space-y-10 animate-fade-in pb-20">
          <div className="bg-indigo-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
             <div className="relative z-10">
                <h2 className="text-4xl font-black mb-4">أرشيف المعلومات المركزي</h2>
                <p className="text-indigo-100 text-lg leading-relaxed max-w-2xl font-medium">
                  مركز أمان البيانات المتكامل. من هنا يمكنك إدارة النسخ الاحتياطية وضمان بقاء سجلات القوى العاملة محمية ضد أي تغيير أو فقدان عرضي.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button onClick={handleExportDatabase} className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    إنشاء نسخة احتياطية (JSON)
                  </button>
                  {isOwner && (
                    <label className="bg-indigo-500 text-white border border-indigo-400 px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-400 transition-all flex items-center gap-3 cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      استيراد نسخة سابقة
                      <input type="file" className="hidden" accept=".json" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const json = JSON.parse(event.target?.result as string);
                              if (window.confirm('سيتم دمج البيانات المستوردة مع قاعدة البيانات الحالية. هل أنت متأكد؟')) {
                                handleImportDatabase(json);
                              }
                            } catch (err) { alert('خطأ في قراءة ملف الأرشيف.'); }
                          };
                          reader.readAsText(file);
                        }
                      }} />
                    </label>
                  )}
                </div>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="pro-card p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-2">سلامة المعلومات</h4>
                <p className="text-sm text-slate-500 font-bold leading-relaxed">النظام يقوم بحفظ البيانات في "المساحة المحلية الموثوقة" فورياً عند كل تعديل لضمان عدم الضياع.</p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2 text-emerald-500 font-black text-xs">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                قاعدة البيانات نشطة ومؤمنة
              </div>
            </div>

            <div className="pro-card p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-2">إحصائيات الأرشفة</h4>
                <p className="text-sm text-slate-500 font-bold leading-relaxed">إجمالي سجلات الموظفين المؤرشفة حالياً في النظام الرئيسي.</p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                 <span className="text-xs font-black text-slate-400 uppercase">إجمالي السجلات</span>
                 <span className="text-2xl font-black text-indigo-600">{users.length}</span>
              </div>
            </div>
          </div>
        </div>
      );
      case 'records': return <RecordsList logs={activityLogs} />;
      case 'trash': return <TrashBin transactions={trashTransactions} users={trashUsers} onRestoreTransaction={(id) => isOwner && {}} onPermanentDeleteTransaction={(id) => isOwner && {}} onRestoreUser={(id) => isOwner && {}} onPermanentDeleteUser={(id) => isOwner && {}} isReadOnly={!isOwner} />;
      case 'my-profile': return <UserProfileEdit profile={currentUser} onSave={u => isOwner && setCurrentUser(u)} isReadOnly={!isOwner} />;
      default: return <Dashboard summary={summary} transactions={transactions} users={users} onViewUser={user => { setSelectedUser(user); setActiveTab('employee-profile'); }} onTabChange={setActiveTab} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeTab={activeTab === 'employee-profile' ? 'users' : activeTab} 
      setActiveTab={(tab) => { setActiveTab(tab); setEditingUserId(null); }} 
      currentUser={currentUser} 
      activityLogs={activityLogs}
      onLogout={handleLogout}
      onUpdateTheme={updateTheme}
      onToggleLanguage={toggleLanguage}
      onToggleDarkMode={toggleDarkMode}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
