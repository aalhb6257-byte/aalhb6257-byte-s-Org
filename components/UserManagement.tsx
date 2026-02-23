
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User, UserRole, Gender } from '../types';

interface UserManagementProps {
  users: User[];
  onAdd: (u: Omit<User, 'joinDate' | 'status'>) => void;
  onUpdate: (id: string, u: Partial<User>) => void;
  onDelete: (id: string) => void;
  onDeleteMultiple?: (ids: string[]) => void;
  onToggleStatus: (id: string) => void;
  onViewProfile: (user: User) => void;
  editUserId?: string | null;
  onImportDatabase?: (data: any) => void;
  isReadOnly?: boolean;
}

const DEFAULT_ROLES = ['محاسب', 'اداري', 'مبرمج', 'حرفي', 'حرفي اول', 'كاتب', 'معاون ملاحظ', 'مدير', 'مشاهد'];

const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  onAdd, 
  onUpdate, 
  onDelete, 
  onDeleteMultiple,
  onToggleStatus, 
  onViewProfile, 
  editUserId,
  onImportDatabase,
  isReadOnly
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>({ key: 'fullNameQuad', direction: 'asc' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Custom Roles State
  const [availableRoles, setAvailableRoles] = useState<string[]>(() => {
    const saved = localStorage.getItem('zad_available_roles');
    return saved ? JSON.parse(saved) : DEFAULT_ROLES;
  });
  const [isAddingNewRole, setIsAddingNewRole] = useState(false);
  const [newRoleInput, setNewRoleInput] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    fullNameQuad: '',
    motherNameTriple: '',
    gender: 'ذكر' as Gender,
    birthDate: '',
    education: '',
    preciseSpecialization: '',
    appointmentDateContract: '',
    appointmentDatePermanent: '',
    email: '',
    role: '' as UserRole,
    phone: '',
    department: '',
    salary: '',
    address: '',
    biography: '',
    notes: '',
    avatar: null as string | null
  });

  useEffect(() => {
    localStorage.setItem('zad_available_roles', JSON.stringify(availableRoles));
  }, [availableRoles]);

  useEffect(() => {
    if (editUserId) {
      const userToEdit = users.find(u => u.id === editUserId);
      if (userToEdit) handleEditClick(userToEdit);
    }
  }, [editUserId, users]);

  const sortedAndFilteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    
    let filtered = users.filter(u => {
      if (!term) return true;
      const searchableFields = [u.fullNameQuad, u.id, u.role, u.department, u.phone, u.name, u.email];
      return searchableFields.some(field => field?.toString().toLowerCase().includes(term));
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        const aStr = (aValue ?? '').toString().toLowerCase();
        const bStr = (bValue ?? '').toString().toLowerCase();
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [users, searchTerm, sortConfig]);

  const requestSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleExportJSON = () => {
    const data = {
      users: users,
      transactions: JSON.parse(localStorage.getItem('zad_transactions') || '[]'),
      activityLogs: JSON.parse(localStorage.getItem('zad_activity_logs') || '[]'),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `نسخة_احتياطية_كاملة_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleExportCSV = () => {
    const headers = [
      'المعرف',
      'الاسم الكامل',
      'اسم الأم',
      'الجنس',
      'تاريخ الميلاد',
      'التحصيل الدراسي',
      'العنوان الوظيفي',
      'القسم',
      'الراتب',
      'رقم الهاتف',
      'الحالة'
    ];

    const rows = sortedAndFilteredUsers.map(user => [
      user.id,
      user.fullNameQuad,
      user.motherNameTriple,
      user.gender,
      user.birthDate,
      user.education,
      user.role,
      user.department,
      user.salary,
      user.phone,
      user.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Add BOM for Excel UTF-8 support
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `سجل_الموظفين_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportDatabase) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (window.confirm('سيتم استبدال البيانات الحالية بالنسخة المستوردة. هل تريد الاستمرار؟')) {
            onImportDatabase(json);
          }
        } catch (err) {
          alert('فشل في قراءة ملف النسخة الاحتياطية.');
        }
      };
      reader.readAsText(file);
    }
  };

  const resetForm = () => {
    setFormData({ 
      id: '', name: '', fullNameQuad: '', motherNameTriple: '', gender: 'ذكر',
      birthDate: '', education: '', preciseSpecialization: '',
      appointmentDateContract: '', appointmentDatePermanent: '',
      email: '', role: '', phone: '', department: '', salary: '', 
      address: '', biography: '', notes: '', avatar: null
    });
    setShowForm(false);
    setEditMode(null);
    setIsAddingNewRole(false);
  };

  const handleEditClick = (user: User) => {
    setFormData({
      id: user.id,
      name: user.name,
      fullNameQuad: user.fullNameQuad || '',
      motherNameTriple: user.motherNameTriple || '',
      gender: user.gender || 'ذكر',
      birthDate: user.birthDate || '',
      education: user.education || '',
      preciseSpecialization: user.preciseSpecialization || '',
      appointmentDateContract: user.appointmentDateContract || '',
      appointmentDatePermanent: user.appointmentDatePermanent || '',
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      department: user.department || '',
      salary: user.salary?.toString() || '',
      address: user.address || '',
      biography: user.biography || '',
      notes: user.notes || '',
      avatar: user.avatar || null
    });
    setEditMode(user.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullNameQuad || !formData.id) {
      alert('يرجى إدخال الاسم الرباعي والرقم الوظيفي');
      return;
    }
    
    // Check if ID already exists when adding new
    if (!editMode && users.some(u => u.id === formData.id)) {
      alert('الرقم الوظيفي موجود مسبقاً في النظام');
      return;
    }

    const payload = { 
      ...formData, 
      name: formData.fullNameQuad.split(' ')[0], 
      salary: parseFloat(formData.salary) || 0 
    };
    if (editMode) onUpdate(editMode, payload);
    else onAdd(payload);
    resetForm();
  };

  const renderSortIcon = (key: keyof User) => {
    if (sortConfig?.key !== key) return <svg className="w-3 h-3 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-5 5h10l-5-5zm0 16l5-5H7l5 5z"/></svg>;
    return sortConfig.direction === 'asc' ? <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-5 5h10l-5-5z"/></svg> : <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 20l5-5H7l5 5z"/></svg>;
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20 font-['Cairo']">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 no-print">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">إدارة شؤون الموظفين</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">البيانات محفوظة ومؤمنة تلقائياً</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <input 
              type="text" 
              placeholder="بحث سريع بالاسم أو المعرف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-white border border-slate-200 rounded-xl pr-10 pl-4 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
            <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span>
          </div>
          <button onClick={handleExportCSV} className="bg-emerald-600 text-white px-5 h-12 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            تصدير CSV
          </button>
          <button onClick={handleExportJSON} className="bg-slate-800 text-white px-5 h-12 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-slate-900 transition-all shadow-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>نسخة احتياطية</button>
          {!isReadOnly && (
            <>
              <button onClick={() => fileInputRef.current?.click()} className="bg-white border border-slate-200 text-slate-700 px-5 h-12 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-slate-50 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>استيراد</button>
              <input type="file" ref={fileInputRef} onChange={handleImportJSON} accept=".json" className="hidden" />
              <button 
                onClick={() => { if(showForm) resetForm(); else setShowForm(true); }} 
                className={`${showForm ? 'bg-rose-500 shadow-rose-500/20' : 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 shadow-purple-600/30'} text-white px-8 h-12 rounded-xl text-xs font-black shadow-xl flex items-center gap-2 active:scale-95 transition-all hover:scale-105 hover:shadow-2xl`}
              >
                <svg className={`w-4 h-4 transition-transform duration-500 ${showForm ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                {showForm ? 'إلغاء العملية' : 'إضافة موظف جديد'}
              </button>
            </>
          )}
        </div>
      </div>

      {showForm && (
        <div className="animate-fade-in no-print">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-2xl border border-indigo-50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-10 py-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">{editMode ? 'تعديل بيانات الموظف' : 'تسجيل موظف جديد في المنظومة'}</h3>
                <p className="text-[10px] text-purple-100 font-bold mt-1">يرجى التأكد من دقة البيانات المدخلة قبل الحفظ</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
              </div>
            </div>
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 group">
                  <label className="relative cursor-pointer flex flex-col items-center">
                    <div className="w-28 h-28 rounded-2xl bg-white shadow-md border-2 border-white overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                      {formData.avatar ? <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" /> : <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>}
                    </div>
                    <span className="mt-3 text-[9px] font-black text-indigo-600 uppercase tracking-widest">تغيير الصورة</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if(file) { const reader = new FileReader(); reader.onloadend = () => setFormData({...formData, avatar: reader.result as string}); reader.readAsDataURL(file); }}} />
                  </label>
                </div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الاسم الرباعي واللقب *</label>
                    <input required type="text" placeholder="الاسم الرباعي واللقب *" value={formData.fullNameQuad} onChange={e => setFormData({...formData, fullNameQuad: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white p-4 border text-xs font-black transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اسم الأم الثلاثي</label>
                    <input type="text" placeholder="اسم الأم الثلاثي" value={formData.motherNameTriple} onChange={e => setFormData({...formData, motherNameTriple: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white p-4 border text-xs font-black transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الجنس</label>
                    <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as Gender})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 px-4 border text-xs font-black appearance-none">
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">التولد</label>
                    <input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 p-4 border text-xs font-black" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">التحصيل الدراسي</label>
                  <input type="text" placeholder="التحصيل الدراسي" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 p-4 border text-xs font-black" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">التخصص الدقيق</label>
                  <input type="text" placeholder="التخصص الدقيق" value={formData.preciseSpecialization} onChange={e => setFormData({...formData, preciseSpecialization: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 p-4 border text-xs font-black" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">العنوان الوظيفي</label>
                  <input type="text" placeholder="العنوان الوظيفي (إدخال يدوي)" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 p-4 border text-xs font-black" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ التعيين (أجر/عقد)</label>
                  <input type="date" value={formData.appointmentDateContract} onChange={e => setFormData({...formData, appointmentDateContract: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 p-4 border text-xs font-black" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ التعيين (الملاك الدائم)</label>
                  <input type="date" value={formData.appointmentDatePermanent} onChange={e => setFormData({...formData, appointmentDatePermanent: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 p-4 border text-xs font-black" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الرقم الوظيفي *</label>
                  <input required disabled={!!editMode} type="text" placeholder="الرقم الوظيفي للموظف *" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white p-4 border text-xs font-black transition-all disabled:opacity-50" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">القسم أو الشعبة</label>
                  <input type="text" placeholder="القسم أو الشعبة" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 p-4 border text-xs font-black" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">رقم الهاتف</label>
                  <input type="text" placeholder="رقم الهاتف" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 p-4 border text-xs font-black" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">عنوان السكن</label>
                  <input type="text" placeholder="عنوان السكن" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 p-4 border text-xs font-black" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الراتب</label>
                  <input type="number" placeholder="الراتب" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 p-4 border text-xs font-black" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">البريد الإلكتروني</label>
                  <input type="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 p-4 border text-xs font-black" />
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-10 py-5 border-t border-slate-100 flex justify-between items-center">
              <button type="button" onClick={resetForm} className="text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase">مسح الحقول</button>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-black text-slate-500 hover:bg-slate-100 text-xs transition-all">إلغاء</button>
                <button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-3 rounded-xl font-black shadow-lg hover:shadow-purple-600/30 hover:-translate-y-0.5 text-xs transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                  {editMode ? 'حفظ التغييرات' : 'تثبيت الموظف في النظام'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="pro-card overflow-hidden border-none shadow-xl">
        <div className="bg-sky-400/20 backdrop-blur-xl border-b border-sky-100/30 px-10 py-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 via-transparent to-indigo-400/10 animate-pulse"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-600 shadow-inner border border-sky-200/50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h3 className="text-sm font-black text-sky-900">قاعدة بيانات القوى العاملة</h3>
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="text-center">
              <p className="text-[8px] font-bold text-sky-600 uppercase mb-0.5">العدد الإجمالي</p>
              <p className="text-sm font-black text-sky-900">{users.length}</p>
            </div>
            <div className="h-8 w-px bg-sky-200/50"></div>
            <div className="text-center">
              <p className="text-[8px] font-bold text-sky-600 uppercase mb-0.5">نشطون حالياً</p>
              <p className="text-sm font-black text-emerald-600">{users.filter(u => u.status === 'نشط').length}</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-right min-w-[1000px] border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4 text-center w-16"><input type="checkbox" checked={selectedIds.length === sortedAndFilteredUsers.length && sortedAndFilteredUsers.length > 0} onChange={() => setSelectedIds(selectedIds.length === sortedAndFilteredUsers.length ? [] : sortedAndFilteredUsers.map(u => u.id))} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /></th>
                <th className="px-4 py-4 cursor-pointer hover:bg-slate-100 group transition-colors" onClick={() => requestSort('fullNameQuad')}><div className="flex items-center gap-2"><span>الموظف</span>{renderSortIcon('fullNameQuad')}</div></th>
                <th className="px-4 py-4 text-center">الحالة</th>
                <th className="px-4 py-4 cursor-pointer hover:bg-slate-100 group transition-colors" onClick={() => requestSort('id')}><div className="flex items-center gap-2"><span>المعرف</span>{renderSortIcon('id')}</div></th>
                <th className="px-4 py-4 cursor-pointer hover:bg-slate-100 group transition-colors" onClick={() => requestSort('salary')}><div className="flex items-center gap-2"><span>الراتب</span>{renderSortIcon('salary')}</div></th>
                <th className="px-4 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedAndFilteredUsers.length > 0 ? sortedAndFilteredUsers.map(u => (
                <tr key={u.id} className={`hover:bg-indigo-50/20 transition-all ${selectedIds.includes(u.id) ? 'bg-slate-100' : ''}`}>
                  <td className="px-8 py-4 text-center"><input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => setSelectedIds(prev => prev.includes(u.id) ? prev.filter(i => i !== u.id) : [...prev, u.id])} className="w-4 h-4 rounded border-slate-300 text-indigo-600" /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 overflow-hidden">{u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : u.name.charAt(0)}</div>
                      <div><p className="text-xs font-black text-slate-800 leading-tight">{u.fullNameQuad}</p><p className="text-[9px] font-bold text-slate-400">{u.role} | {u.department}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black ${u.status === 'نشط' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'نشط' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                        {u.status}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[10px] font-black text-indigo-600 uppercase tracking-tighter">{u.id}</td>
                  <td className="px-4 py-4 text-xs font-black text-emerald-600">{(u.salary || 0).toLocaleString()} ر.س</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => onViewProfile(u)} 
                        title="عرض الملف" 
                        className="w-8 h-8 flex items-center justify-center bg-white border border-slate-100 text-purple-500 rounded-lg hover:bg-gradient-to-br hover:from-purple-500 hover:to-indigo-500 hover:text-white transition-all shadow-sm hover:shadow-purple-500/20"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </button>
                      {!isReadOnly && (
                        <>
                          <button 
                            onClick={() => handleEditClick(u)} 
                            title="تعديل البيانات" 
                            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-100 text-amber-500 rounded-lg hover:bg-gradient-to-br hover:from-amber-400 hover:to-orange-500 hover:text-white transition-all shadow-sm hover:shadow-amber-500/20"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                          </button>
                          <button 
                            onClick={() => onToggleStatus(u.id)} 
                            title={u.status === 'نشط' ? 'تعطيل الموظف' : 'تفعيل الموظف'} 
                            className={`w-8 h-8 flex items-center justify-center bg-white border border-slate-100 rounded-lg transition-all shadow-sm ${u.status === 'نشط' ? 'text-rose-400 hover:bg-gradient-to-br hover:from-rose-500 hover:to-pink-600' : 'text-emerald-400 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-600'} hover:text-white hover:shadow-lg`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                          </button>
                          <button 
                            onClick={() => onDelete(u.id)} 
                            title="نقل لسلة المهملات" 
                            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-100 text-slate-400 rounded-lg hover:bg-gradient-to-br hover:from-slate-600 hover:to-slate-800 hover:text-white transition-all shadow-sm hover:shadow-slate-500/20"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="py-20 text-center opacity-30 italic text-sm">لا توجد سجلات حالياً</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
