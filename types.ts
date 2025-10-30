import { TABS, CURRENCIES, LANGUAGES, ACCENT_COLORS } from './constants';
// FIX: Removed import for ConfigView to break circular dependency. It will be defined in this file.

export type Tab = typeof TABS[keyof typeof TABS];
export type Currency = keyof typeof CURRENCIES;
export type Language = keyof typeof LANGUAGES;
export type Theme = 'light' | 'dark';
export type AccentColorTheme = keyof typeof ACCENT_COLORS;
export type ChartColorTheme = 'accent' | 'vibrant' | 'muted' | 'sunset' | 'ocean' | 'forest' | 'pastel';
export type ProfileView = 'family' | 'accounts' | 'health_report' | 'achievements' | 'help_support' | 'personalization';

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  parent_id: string | null;
  user_id?: string;
  subCategories?: Category[];
}

// FIX: Defined ConfigView here as the single source of truth to resolve circular dependency.
export type ConfigView =
  | 'categories_accounts'
  | 'manage_categories'
  | 'income'
  | 'expense'
  | 'accounts'
  | 'tags'
  | 'regional'
  | 'language'
  | 'budgeting'
  | 'budget_cycle'
  | 'notification_settings'
  | 'default_preferences'
  | 'appearance'
  | 'security';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string; // Will now store category ID
  type: 'income' | 'expense';
  account: string;
  tags?: string[];
}

export interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  carryover?: number;
}

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  isVariable: boolean;
  category: string;
  billingCycle: 'monthly' | 'quarterly' | 'annually';
  nextDueDate: string; // ISO string
  isActive: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  emoji: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  emoji: string;
}

export interface FamilyMember {
  id:string;
  name: string;
  email: string;
  role: 'Admin' | 'Spouse' | 'Child' | 'Other';
}

export interface LinkedAccount {
  id: string;
  name: string;
  type: 'Bank' | 'Credit Card';
  last4: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'ai';
  read: boolean;
  timestamp: string;
}

export interface BudgetCycle {
  type: 'monthly' | 'custom_day';
  dayOfMonth: number;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailSummariesEnabled: boolean;
  largeTransactionAmount: number; // 0 means disabled
  budgetThresholdPercent: number; // 0 means disabled, range 0-100
}

export interface DefaultPreferences {
  transactionType: 'income' | 'expense';
  account: string;
}

export interface EndOfCycleReview {
  summary: string;
  newBudget: { name: string; allocated: number }[];
}

// Re-export to avoid circular dependencies
// FIX: Removed re-export of ConfigView.