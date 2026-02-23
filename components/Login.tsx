
import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';

interface LoginProps {
  onLogin: (username: string, role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // التأكد من تطبيق السمة اللونية المخزنة على واجهة الدخول
  useEffect(() => {
    const savedUser = localStorage.getItem('zad_current_user');
    if (savedUser) {
      try {
        const profile = JSON.parse(savedUser);
        if (profile.themeColor) {
          document.documentElement.style.setProperty('--brand-primary', profile.themeColor);
          const shades = profile.themeColor.split(' ').map(Number);
          document.documentElement.style.setProperty('--brand-primary-light', `${Math.min(shades[0]+150, 255)} ${Math.min(shades[1]+150, 255)} ${Math.min(shades[2]+150, 255)}`);
          document.documentElement.style.setProperty('--brand-primary-dark', `${Math.max(shades[0]-30, 0)} ${Math.max(shades[1]-30, 0)} ${Math.max(shades[2]-30, 0)}`);
        }
      } catch (e) {
        console.error("Error loading theme for login screen", e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (isRegistering) {
        // For registration, we should ideally use supabase.auth.signUp
        // But for now, we'll just show an error as we prefer Google OAuth
        setError('يرجى استخدام تسجيل الدخول عبر جوجل حالياً.');
        setLoading(false);
      } else {
        // Prevent mock login as requested
        setError('عذراً، يجب تسجيل الدخول باستخدام حساب جوجل المعتمد فقط.');
        setLoading(false);
      }
    }, 800);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول عبر جوجل');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-['Cairo']">
      {/* خلفية تفاعلية تعتمد على لون السمة المختار */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[160px] -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/5 rounded-full blur-[140px] -ml-64 -mb-64"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-600/40 mb-6 border border-white/10 group transition-all duration-500 hover:rotate-6">
            <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">قسم الموارد البشرية</h1>
          <div className="inline-block px-4 py-1.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 backdrop-blur-md">
            <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[9px]">
              {isRegistering ? 'إنشاء حساب جديد في المنظومة' : 'بوابة الدخول الذكية والمشفرة'}
            </p>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] border border-white/5 relative group">
          <div className="absolute inset-0 rounded-[3rem] border border-indigo-500/0 group-focus-within:border-indigo-500/30 transition-all duration-500 pointer-events-none"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {!isRegistering ? (
              <>
                {/* حقل الرقم الوظيفي / الهاتف / الإيميل */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] block pr-1">الرقم الوظيفي / الهاتف / البريد الإلكتروني</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </span>
                    <input 
                      required
                      type="text" 
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="الرقم الوظيفي / الهاتف / البريد"
                      className="w-full h-14 bg-slate-950/40 border-2 border-white/5 rounded-2xl pr-14 pl-5 text-sm font-bold text-white placeholder:text-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all duration-300"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* حقول إنشاء حساب */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] block pr-1">الاسم الأول</label>
                    <input 
                      required
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="الأول"
                      className="w-full h-14 bg-slate-950/40 border-2 border-white/5 rounded-2xl px-5 text-sm font-bold text-white placeholder:text-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] block pr-1">الاسم الثاني</label>
                    <input 
                      required
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="الثاني"
                      className="w-full h-14 bg-slate-950/40 border-2 border-white/5 rounded-2xl px-5 text-sm font-bold text-white placeholder:text-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] block pr-1">البريد الإلكتروني</label>
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full h-14 bg-slate-950/40 border-2 border-white/5 rounded-2xl px-5 text-sm font-bold text-white placeholder:text-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all duration-300"
                  />
                </div>
              </>
            )}

            {/* حقل كلمة المرور */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] block pr-1">كلمة المرور</label>
              <div className="relative group">
                <span className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 11-8 0v4h-8z"></path></svg>
                </span>
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-slate-950/40 border-2 border-white/5 rounded-2xl pr-14 pl-14 text-sm font-bold text-white placeholder:text-slate-800 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/40 outline-none transition-all duration-300"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-600 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 animate-shake">
                <p className="text-[10px] font-bold text-rose-400 leading-snug">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl font-black text-sm shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1 transition-all active:scale-[0.97] flex items-center justify-center gap-4 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  {isRegistering ? 'إنشاء الحساب الآن' : 'تحقق من الهوية والدخول'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </>
              )}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-slate-900/0 px-4 text-slate-600 font-black">أو</span></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>

            <div className="text-center">
              <button 
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {isRegistering ? 'لديك حساب بالفعل؟ سجل دخولك' : 'ليس لديك حساب؟ أنشئ حساباً جديداً'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-10 flex items-center justify-center gap-6 opacity-20">
           <div className="h-px w-10 bg-indigo-500"></div>
           <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em]">ZAD CORE v3.2</p>
           <div className="h-px w-10 bg-indigo-500"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
