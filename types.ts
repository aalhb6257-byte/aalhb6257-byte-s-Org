
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  deletedAt?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  transactionsCount: number;
}

export interface AIInsight {
  title: string;
  content: string;
  type: 'tip' | 'warning' | 'info';
}

export type UserRole = string;
export type Gender = 'ذكر' | 'أنثى';

export interface User {
  id: string;
  name: string; // Known as display name
  fullNameQuad: string; // الاسم الرباعي واللقب
  motherNameTriple: string; // اسم الأم الثلاثي
  gender: Gender;
  birthDate: string; // المواليد - جديد
  education: string; // التحصيل الدراسي
  preciseSpecialization: string; // التخصص الدقيق - جديد
  appointmentDateContract: string; // تاريخ التعيين (أجر/عقد)
  appointmentDatePermanent: string; // تاريخ التعيين (ملاك)
  email: string;
  role: UserRole;
  status: 'نشط' | 'معطل';
  joinDate: string; // System join date
  phone: string;
  department: string;
  salary: number;
  address: string; // السكن
  biography?: string; // السيرة المهنية - جديد
  notes?: string; // ملاحظات إدارية
  deletedAt?: string;
  avatar?: string | null; // صورة الموظف
}

export interface CurrentUserProfile {
  name: string;
  role: string;
  email: string;
  avatar: string | null;
  phone: string;
  bio: string;
  themeColor?: string; // New field for theme customization
  language?: 'ar' | 'en';
  isDarkMode?: boolean;
}

export interface GeneratedReport {
  id: string;
  timestamp: string;
  generatedBy: string;
  summarySnapshot: FinancialSummary;
  reportType: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'مالي' | 'إداري' | 'نظام' | 'سلة المهملات';
  details: string;
}
