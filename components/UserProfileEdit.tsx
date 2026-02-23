
import React, { useState } from 'react';
import { CurrentUserProfile } from '../types';

interface UserProfileEditProps {
  profile: CurrentUserProfile;
  onSave: (updated: CurrentUserProfile) => void;
  isReadOnly?: boolean;
}

const COLOR_PRESETS = [
  { name: 'افتراضي (Indigo)', value: '79 70 229', class: 'bg-[#4f46e5]' },
  { name: 'أزرق (Blue)', value: '37 99 235', class: 'bg-[#2563eb]' },
  { name: 'زمردي (Emerald)', value: '5 150 105', class: 'bg-[#059669]' },
  { name: 'ياقوتي (Rose)', value: '225 29 72', class: 'bg-[#e11d48]' },
  { name: 'كهرماني (Amber)', value: '217 119 6', class: 'bg-[#d97706]' },
  { name: 'بنفسجي (Violet)', value: '124 58 237', class: 'bg-[#7c3aed]' },
  { name: 'فحمي (Slate)', value: '71 85 105', class: 'bg-[#475569]' },
];

const UserProfileEdit: React.FC<UserProfileEditProps> = ({ profile, onSave, isReadOnly }) => {
  const [formData, setFormData] = useState<CurrentUserProfile>(profile);
  const [preview, setPreview] = useState<string | null>(profile.avatar);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setFormData({ ...formData, avatar: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Modified rounded-xl to rounded-lg for "slightly rounded" look
  const inputClasses = "w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none";

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800">إعدادات ملفي الشخصي</h2>
        <p className="text-slate-500 font-medium mt-1">تحديث هويتك الرقمية ومعلوماتك الشخصية في النظام</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-40 bg-indigo-600 relative">
            <div className="absolute -bottom-16 right-12 flex items-end gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2rem] bg-white p-1.5 shadow-2xl overflow-hidden border border-slate-100">
                  <div className="w-full h-full rounded-[1.7rem] bg-slate-100 flex items-center justify-center text-slate-300 font-black text-4xl overflow-hidden">
                    {preview ? (
                      <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                      formData.name.charAt(0)
                    )}
                  </div>
                </div>
                {!isReadOnly && (
                  <label className="absolute bottom-2 right-2 w-10 h-10 bg-indigo-600 text-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-all border-4 border-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
              <div className="mb-4">
                <h3 className="text-2xl font-black text-slate-800">{formData.name}</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{formData.role}</p>
              </div>
            </div>
          </div>

          <div className="px-12 pt-24 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">الاسم المعروض</label>
                <input 
                  type="text" 
                  className={inputClasses}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  className={inputClasses}
                  dir="ltr"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="space-y-2 mb-10">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">نبذة عنك (Bio)</label>
              <textarea 
                rows={4}
                className={`${inputClasses} resize-none`}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="اكتب نبذة مختصرة عن مسؤولياتك وخبراتك..."
                disabled={isReadOnly}
              />
            </div>

            {/* Brand Color Customization Section */}
            <div className="pt-10 border-t border-slate-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">تخصيص هوية النظام</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">اختر لون العلامة التجارية المفضل لديك</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => !isReadOnly && setFormData({ ...formData, themeColor: color.value })}
                    disabled={isReadOnly}
                    className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all border-2 ${
                      formData.themeColor === color.value 
                        ? 'border-indigo-600 bg-indigo-50/30' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    } ${isReadOnly ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl shadow-inner ${color.class} flex items-center justify-center`}>
                       {formData.themeColor === color.value && (
                         <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                       )}
                    </div>
                    <span className="text-[9px] font-black text-slate-600 truncate w-full text-center">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {!isReadOnly && (
              <div className="flex justify-end gap-4 mt-12 pt-10 border-t border-slate-50">
                <button 
                  type="submit" 
                  className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                >
                  تحديث ملفي الشخصي
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfileEdit;
