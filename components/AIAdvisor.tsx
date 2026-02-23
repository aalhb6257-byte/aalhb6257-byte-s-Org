
import React, { useState, useEffect } from 'react';
import { Transaction, AIInsight } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface AIAdvisorProps {
  transactions: Transaction[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (transactions.length === 0) return;
    setLoading(true);
    const data = await getFinancialAdvice(transactions);
    setInsights(data);
    setLoading(false);
  };

  useEffect(() => {
    if (transactions.length > 0 && insights.length === 0) {
      analyze();
    }
  }, [transactions]);

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
              محرك الذكاء الاصطناعي نشط
            </div>
            <h2 className="text-4xl font-black mb-4 leading-tight">المستشار الذكي <span className="text-indigo-400">زاد AI</span></h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              نستخدم أحدث تقنيات تعلم الآلة لتحليل بياناتك المالية وتقديم توقعات دقيقة تساعدك على اتخاذ قرارات استثمارية أفضل وتقليل الهدر المالي.
            </p>
          </div>
          <button 
            onClick={analyze}
            disabled={loading || transactions.length === 0}
            className={`bg-indigo-500 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-indigo-400 transition-all flex items-center gap-4 shadow-xl shadow-indigo-500/40 active:scale-95 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'تحديث التحليلات المتقدمة'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {insights.length > 0 ? insights.map((insight, idx) => (
          <div 
            key={idx} 
            className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${
              insight.type === 'warning' ? 'bg-rose-50 text-rose-500' : insight.type === 'tip' ? 'bg-emerald-50 text-emerald-500' : 'bg-indigo-50 text-indigo-500'
            }`}>
              {insight.type === 'warning' ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              )}
            </div>
            <h4 className="font-black text-xl text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">{insight.title}</h4>
            <p className="text-slate-500 font-medium leading-relaxed">{insight.content}</p>
          </div>
        )) : transactions.length > 0 && !loading ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 font-bold italic">اضغط على تحديث التحليلات للحصول على نصائح ذكية...</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AIAdvisor;
