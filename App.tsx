
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient, Session } from '@supabase/supabase-js';
import type {
  Tab,
  Theme,
  Transaction,
  BudgetCategory,
  RecurringPayment,
  ChatMessage,
  Goal,
  Achievement,
  FamilyMember,
  LinkedAccount,
  Notification,
  Currency,
  Language,
  BudgetCycle,
  NotificationSettings,
  DefaultPreferences,
  AccentColorTheme,
  ConfigView,
  ProfileView,
  Category,
  ChartColorTheme,
} from './types';
import { TABS, CURRENCIES, ACCENT_COLORS, GoogleIcon, DEFAULT_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, generateContrastingColor, CHART_COLOR_THEMES, generateMonochromaticPalette, hexToRgba } from './constants';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeDashboard from './components/HomeDashboard';
import Planner from './components/Planner';
import Profile from './components/Profile';
import AddTransactionView from './components/AddTransactionModal';
import AllTransactions from './components/AllTransactions';
import Notifications from './components/Notifications';
import ScanReceipt from './components/ScanReceipt';
import Configuration from './components/Configuration';
import FamilyMembersManager from './components/FamilyMembersManager';
import LinkedAccountsManager from './components/LinkedAccountsManager';
import AchievementsComponent from './components/Achievements';
import FinancialHealthReport from './components/FinancialHealthReport';
import HelpAndSupport from './components/HelpAndSupport';
import Personalization from './components/Personalization';
import { useToast } from './contexts/ToastContext';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import AICoachModal from './components/Insights';
import FinancialHealthDetailsModal from './components/FinancialHealthDetailsModal';
import Analysis from './components/Analysis';

// --- SUPABASE CLIENT SETUP ---
const supabaseUrl = 'https://lwjsfstwmphgocxhhgha.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3anNmc3R3bXBoZ29jeGhoZ2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNDI5NzEsImV4cCI6MjA3NDYxODk3MX0.9MnI-vr8KdsU8ILF9FpcbByNteOUajQV3916TpXtlPY';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// --- AUTHENTICATION COMPONENT ---
const Auth: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState('');
    const [signupPendingConfirmation, setSignupPendingConfirmation] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleAuth = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage('');

        if (!isLogin) {
            if (password.length < 6) {
                setMessage('Password must be at least 6 characters long.');
                return;
            }
            if (password !== confirmPassword) {
                setMessage('Passwords do not match.');
                return;
            }
        }
        
        setLoading(true);

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setMessage(error.message);
            } else {
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
            }
        } else {
            const { error } = await supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                    }
                }
            });
            if (error) {
                setMessage(error.message);
            } else {
                setSignupPendingConfirmation(true);
            }
        }
        setLoading(false);
    };
    
    const handleOAuthSignIn = async (provider: 'google') => {
        setLoading(true);
        setMessage('');
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
        });
        if (error) {
            console.error('OAuth Error:', error);
            setMessage(error.message);
            setLoading(false);
        }
    };
    
    const resetForms = () => {
        setMessage('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center text-accent-primary mb-2">Budgetly AI</h1>
                <p className="text-center text-text-secondary mb-6">
                    {signupPendingConfirmation ? 'Check your email' : (isLogin ? 'Sign in to your account' : 'Create a new account')}
                </p>

                {signupPendingConfirmation ? (
                    <div className="text-center space-y-4">
                        <p className="text-text-primary">
                            We've sent a confirmation link to <span className="font-bold">{email}</span>.
                        </p>
                        <p className="text-sm text-text-secondary">
                            Please click the link in the email to activate your account.
                        </p>
                        <Button onClick={() => {
                            setSignupPendingConfirmation(false);
                            setIsLogin(true);
                            resetForms();
                        }} variant="secondary" className="w-full">
                            Back to Sign In
                        </Button>
                    </div>
                ) : (
                    <>
                        <form onSubmit={handleAuth} className="space-y-4">
                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-text-secondary">First Name</label>
                                        <input
                                            type="text"
                                            placeholder="John"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-text-secondary">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Doe"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="text-sm text-text-secondary">Email</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm text-text-secondary">Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"
                                    required
                                    minLength={6}
                                />
                            </div>
                            {isLogin && (
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 rounded border-border text-accent-primary focus:ring-accent-primary cursor-pointer"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary cursor-pointer">
                                        Remember me
                                    </label>
                                </div>
                            )}
                            {!isLogin && (
                                <div>
                                    <label className="text-sm text-text-secondary">Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            )}
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                            </Button>
                        </form>
                        
                        {message && (
                            <div className="text-center mt-4 text-sm p-3 rounded-md bg-accent-secondary/20 text-accent-secondary">
                                {message}
                            </div>
                        )}
                        
                        <div className="relative flex py-5 items-center">
                            <div className="flex-grow border-t border-border"></div>
                            <span className="flex-shrink mx-4 text-text-secondary text-sm">OR</span>
                            <div className="flex-grow border-t border-border"></div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => handleOAuthSignIn('google')}
                                variant="secondary"
                                className="w-full bg-white text-gray-800 hover:bg-gray-100 border border-border shadow-sm"
                                disabled={loading}
                            >
                                <GoogleIcon className="w-5 h-5" />
                                <span>{isLogin ? 'Sign In' : 'Sign Up'} with Google</span>
                            </Button>
                        </div>
                        <div className="mt-6 text-center">
                            <button onClick={() => {
                                setIsLogin(!isLogin);
                                resetForms();
                            }} className="text-sm text-accent-primary hover:underline">
                                {isLogin ? 'Need an account? Sign Up' : 'Have an account? Sign In'}
                            </button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};


// --- MAIN APP COMPONENT (replaces old App) ---
const MainApp: React.FC<{ session: Session }> = ({ session }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  // Data State
  const [theme, setTheme] = useState<Theme>('dark');
  const [accentColor, setAccentColor] = useState<AccentColorTheme>('teal');
  const [chartColorTheme, setChartColorTheme] = useState<ChartColorTheme>(() => {
      return (localStorage.getItem('chartColorTheme') as ChartColorTheme) || 'accent';
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<BudgetCategory[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>('Raghu S');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [language, setLanguage] = useState<Language>('EN');
  const [isPinSet, setIsPinSet] = useState<boolean>(false);
  const [isBudgetCarryoverEnabled, setIsBudgetCarryoverEnabled] = useState(true);
  const [financialYearStartMonth, setFinancialYearStartMonth] = useState(4);
  const [budgetCycle, setBudgetCycle] = useState<BudgetCycle>({ type: 'monthly', dayOfMonth: 1 });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({ pushEnabled: true, emailSummariesEnabled: false, largeTransactionAmount: 1000, budgetThresholdPercent: 80 });
  const [defaultPreferences, setDefaultPreferences] = useState<DefaultPreferences>({ transactionType: 'expense', account: 'Main Bank Account' });
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<Tab>(TABS.HOME);
  const [currentView, setCurrentView] = useState<string>('main');
  const [addTransactionType, setAddTransactionType] = useState<'income' | 'expense'>('expense');
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  const userId = session.user.id;
  
  const updateProfile = async (updates: Record<string, any>) => {
      const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
      if (error) {
          console.error("Supabase profile update error:", error.message, error.details);
          addToast(`Failed to save settings: ${error.message}`, 'error');
      }
      return !error;
  };

    // Fetch all data on load
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);

            let { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (profileError) {
                console.error('Error fetching profile:', profileError);
                addToast(`Could not load your profile: ${profileError.message}`, 'error');
            }
            
            // Smart-seed categories for new users
            const { data: existingCategories, error: catError } = await supabase.from('categories').select('id, type');
            if (!catError && existingCategories.length === 0) {
                 // Seed income
                const incomeParentsToInsert = DEFAULT_CATEGORIES.map(p => ({ user_id: userId, name: p.name, type: p.type }));
                const { data: insertedIncomeParents, error: incomeParentError } = await supabase.from('categories').insert(incomeParentsToInsert).select();
                
                if (!incomeParentError && insertedIncomeParents) {
                    const incomeChildrenToInsert = insertedIncomeParents.flatMap(parent => {
                        const parentDef = DEFAULT_CATEGORIES.find(p => p.name === parent.name);
                        return parentDef?.subCategories.map(child => ({ user_id: userId, name: child.name, type: child.type, parent_id: parent.id })) || [];
                    });
                    await supabase.from('categories').insert(incomeChildrenToInsert);
                }
                
                // Seed expenses
                const expenseParentsToInsert = DEFAULT_EXPENSE_CATEGORIES.map(p => ({ user_id: userId, name: p.name, type: p.type }));
                const { data: insertedExpenseParents, error: expenseParentError } = await supabase.from('categories').insert(expenseParentsToInsert).select();
                
                if (!expenseParentError && insertedExpenseParents) {
                    const expenseChildrenToInsert = insertedExpenseParents.flatMap(parent => {
                        const parentDef = DEFAULT_EXPENSE_CATEGORIES.find(p => p.name === parent.name);
                        return parentDef?.subCategories.map(child => ({ user_id: userId, name: child.name, type: child.type, parent_id: parent.id })) || [];
                    });
                    await supabase.from('categories').insert(expenseChildrenToInsert);
                }

                addToast('Welcome! We have set up some default categories for you.', 'info');
            }


            const [
                transactionsRes, budgetRes, recurringRes, achievementsRes, familyRes, linkedRes, notificationsRes, allCategoriesRes, accountsRes, tagsRes
            ] = await Promise.all([
                supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
                supabase.from('budget_categories').select('*').eq('user_id', userId),
                supabase.from('recurring_payments').select('*').eq('user_id', userId).order('nextDueDate', { ascending: true }),
                supabase.from('achievements').select('*').eq('user_id', userId),
                supabase.from('family_members').select('*').eq('user_id', userId),
                supabase.from('linked_accounts').select('*').eq('user_id', userId),
                supabase.from('notifications').select('*').eq('user_id', userId).order('timestamp', { ascending: false }),
                supabase.from('categories').select('*').eq('user_id', userId),
                supabase.from('accounts').select('name').eq('user_id', userId),
                supabase.from('tags').select('name').eq('user_id', userId),
            ]);
            
            // FIX: Proactively repair user profile if any settings are missing to prevent update errors.
            if (profile) {
                const updates: Record<string, any> = {};
                if (!profile.user_name) updates.user_name = 'New User';
                if (!profile.theme) updates.theme = 'dark';
                if (!profile.accent_color) updates.accent_color = 'teal';
                // NOTE: chart_color_theme is now handled by local storage, removed from profile repair
                if (!profile.currency) updates.currency = 'INR';
                if (!profile.language) updates.language = 'EN';
                if (profile.is_pin_set === null || profile.is_pin_set === undefined) updates.is_pin_set = false;
                if (profile.is_budget_carryover_enabled === null || profile.is_budget_carryover_enabled === undefined) updates.is_budget_carryover_enabled = true;
                if (!profile.financial_year_start_month) updates.financial_year_start_month = 4;
                if (!profile.budget_cycle) updates.budget_cycle = { type: 'monthly', dayOfMonth: 1 };
                if (!profile.notification_settings) updates.notification_settings = { pushEnabled: true, emailSummariesEnabled: false, largeTransactionAmount: 1000, budgetThresholdPercent: 80 };
                if (!profile.default_preferences) updates.default_preferences = { transactionType: 'expense', account: accountsRes.data?.[0]?.name || '' };
            
                if (Object.keys(updates).length > 0) {
                    addToast('Initializing your profile with default settings...', 'info');
                    const success = await updateProfile(updates);
                    if (success) {
                        // Merge updates into local profile object to avoid re-fetching
                        profile = { ...profile, ...updates };
                    }
                }
            }


            if (allCategoriesRes.data) setCategories(allCategoriesRes.data as Category[]);

            if (transactionsRes.data) setTransactions(transactionsRes.data as Transaction[]);
            if (budgetRes.data) setBudget(budgetRes.data as BudgetCategory[]);
            if (recurringRes.data) setRecurringPayments(recurringRes.data as RecurringPayment[]);
            if (achievementsRes.data) setAchievements(achievementsRes.data as Achievement[]);
            
            if (familyRes.data && familyRes.data.length === 0 && profile) {
                const newAdminMember: Omit<FamilyMember, 'id'> = { name: profile.user_name || 'Admin User', email: session.user.email || '', role: 'Admin' };
                const { data: insertedMember, error: insertError } = await supabase.from('family_members').insert({ id: crypto.randomUUID(), ...newAdminMember }).select().single();
                if (insertError) {
                    console.error('Failed to create initial admin family member:', insertError);
                    addToast('Could not initialize your family profile.', 'error');
                } else if (insertedMember) {
                    setFamilyMembers([insertedMember as FamilyMember]);
                }
            } else if (familyRes.data) {
                setFamilyMembers(familyRes.data as FamilyMember[]);
            }

            if (linkedRes.data) setLinkedAccounts(linkedRes.data as LinkedAccount[]);
            
            if (notificationsRes.data && notificationsRes.data.length > 0) {
                setNotifications(notificationsRes.data as Notification[]);
            } else {
                // Add mock notifications if none are fetched to demonstrate the feature
                const now = new Date();
                const mockNotifications: Notification[] = [
                    { id: '1', title: 'Bill Due Soon', message: 'Your Netflix subscription payment is due in 3 days.', type: 'alert', read: false, timestamp: new Date(now.getTime() - 86400000).toISOString() }, // 1 day ago
                    { id: '2', title: 'AI Insight', message: 'We noticed a new recurring charge from Spotify. Would you like to add it to your bills?', type: 'ai', read: false, timestamp: new Date(now.getTime() - 172800000).toISOString() }, // 2 days ago
                    { id: '3', title: 'Budget Update', message: 'You have reached 90% of your "Dining Out" budget for the month.', type: 'info', read: true, timestamp: new Date(now.getTime() - 259200000).toISOString() }, // 3 days ago
                ];
                setNotifications(mockNotifications);
            }

            if (accountsRes.data) setAccounts(accountsRes.data.map(a => a.name));
            if (tagsRes.data) setTags(tagsRes.data.map(t => t.name));
            
            if (profile) {
                const p = profile;
                const userTheme = p.theme || 'dark';
                setTheme(userTheme);
                
                // Load theme-specific accent color or set default
                const savedThemeAccent = localStorage.getItem(userTheme === 'light' ? 'lightAccentColor' : 'darkAccentColor') as AccentColorTheme | null;
                const defaultAccent = userTheme === 'light' ? 'sapphire' : 'teal';
                setAccentColor(savedThemeAccent || defaultAccent);

                setUserName(p.user_name || 'User');
                setProfilePicture(p.profile_picture_url || null);
                setCurrency(p.currency || 'INR');
                setLanguage(p.language || 'EN');
                setIsPinSet(p.is_pin_set || false);
                setIsBudgetCarryoverEnabled(p.is_budget_carryover_enabled !== false);
                setFinancialYearStartMonth(p.financial_year_start_month || 4);
                setBudgetCycle(p.budget_cycle || { type: 'monthly', dayOfMonth: 1 });
                setNotificationSettings(p.notification_settings || { pushEnabled: true, emailSummariesEnabled: false, largeTransactionAmount: 1000, budgetThresholdPercent: 80 });
                setDefaultPreferences(p.default_preferences || { transactionType: 'expense', account: accountsRes.data?.[0]?.name || '' });
            }
            setIsLoading(false);
        };
        fetchAllData();
    }, [userId, addToast, session.user.email]);

    const financialSummary = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return { income, expenses, savings: income - expenses };
    }, [transactions]);
    
    const healthScoreDetails = useMemo(() => {
        const isWelcomeState = transactions.length < 3;
        if (isWelcomeState) {
            return {
                healthScore: null,
                savingsScore: 0,
                budgetingScore: 0,
                budgetWithSpending: [],
                isWelcomeState: true,
            };
        }

        const { income, expenses } = financialSummary;

        // 1. Calculate Savings Score (50% weight)
        const savingsRate = income > 0 ? (income - expenses) / income : 0;
        const targetSavingsRate = 0.20; // 20% savings is the target for a score of 100
        const savingsScore = Math.min(Math.max(Math.round((savingsRate / targetSavingsRate) * 100), 0), 100);

        // 2. Calculate Budgeting Score (50% weight)
        if (!budget || budget.length === 0 || !categories || categories.length === 0) {
            const healthScore = savingsScore;
            return { healthScore, savingsScore, budgetingScore: 100, budgetWithSpending: [], isWelcomeState: false };
        }

        const categoryIdToParentNameMap = new Map<string, string>();
        const parentCategories = new Map<string, Category>(categories.filter(c => !c.parent_id).map(c => [c.id, c]));
        for (const category of categories) {
            if (category.parent_id) {
                const parent = parentCategories.get(category.parent_id);
                if (parent) {
                    categoryIdToParentNameMap.set(category.id, parent.name);
                }
            } else {
                // It's a parent category itself
                categoryIdToParentNameMap.set(category.id, category.name);
            }
        }
        
        const spendingByCategory = transactions.reduce((acc: Record<string, number>, tx) => {
            if (tx.type === 'expense') {
                const budgetCategoryName = categoryIdToParentNameMap.get(tx.category);
                if (budgetCategoryName) {
                    acc[budgetCategoryName] = (acc[budgetCategoryName] || 0) + tx.amount;
                }
            }
            return acc;
        }, {} as Record<string, number>);

        const budgetWithSpending = budget.map(b => ({
            ...b,
            spent: spendingByCategory[b.name] || 0
        }));

        const totalAllocated = budgetWithSpending.reduce((sum, b) => sum + b.allocated, 0);
        if (totalAllocated === 0) {
            return { healthScore: savingsScore, savingsScore, budgetingScore: 100, budgetWithSpending, isWelcomeState: false };
        }
        
        const categoryScores = budgetWithSpending.map(b => {
            const categoryScore = b.allocated >= b.spent ? 100 : Math.max(0, (b.allocated / b.spent) * 100);
            const weight = b.allocated / totalAllocated;
            return categoryScore * weight;
        });
        
        const budgetingScore = Math.round(categoryScores.reduce((sum, s) => sum + s, 0));

        // 3. Combine scores
        const healthScore = Math.round(savingsScore * 0.5 + budgetingScore * 0.5);

        return { healthScore, savingsScore, budgetingScore, budgetWithSpending, isWelcomeState: false };

    }, [financialSummary, budget, transactions, categories]);

    const accentColorHex = useMemo(() => ACCENT_COLORS[accentColor], [accentColor]);
    
    const { barColor1, barColor2, piePalette } = useMemo(() => {
        const budgetSize = budget.length > 0 ? budget.length : 1;
        switch (chartColorTheme) {
            case 'vibrant':
                return {
                    barColor1: CHART_COLOR_THEMES.vibrant[0],
                    barColor2: CHART_COLOR_THEMES.vibrant[1],
                    piePalette: CHART_COLOR_THEMES.vibrant,
                };
            case 'muted':
                return {
                    barColor1: CHART_COLOR_THEMES.muted[0],
                    barColor2: CHART_COLOR_THEMES.muted[1],
                    piePalette: CHART_COLOR_THEMES.muted,
                };
            case 'sunset':
                return {
                    barColor1: CHART_COLOR_THEMES.sunset[0],
                    barColor2: CHART_COLOR_THEMES.sunset[1],
                    piePalette: CHART_COLOR_THEMES.sunset,
                };
            case 'ocean':
                return {
                    barColor1: CHART_COLOR_THEMES.ocean[0],
                    barColor2: CHART_COLOR_THEMES.ocean[1],
                    piePalette: CHART_COLOR_THEMES.ocean,
                };
            case 'forest':
                return {
                    barColor1: CHART_COLOR_THEMES.forest[0],
                    barColor2: CHART_COLOR_THEMES.forest[1],
                    piePalette: CHART_COLOR_THEMES.forest,
                };
            case 'pastel':
                return {
                    barColor1: CHART_COLOR_THEMES.pastel[0],
                    barColor2: CHART_COLOR_THEMES.pastel[1],
                    piePalette: CHART_COLOR_THEMES.pastel,
                };
            case 'accent':
            default: {
                if (accentColor === 'sapphire') {
                    return {
                        barColor1: CHART_COLOR_THEMES.sapphire[0], // Sapphire Blue
                        barColor2: CHART_COLOR_THEMES.sapphire[1], // Warm Orange
                        piePalette: CHART_COLOR_THEMES.sapphire,
                    };
                }

                let contrastingColor;
                // Special case for Teal to provide a more harmonious color pairing.
                if (accentColor === 'teal') {
                    contrastingColor = ACCENT_COLORS.sapphire;
                } else {
                    contrastingColor = generateContrastingColor(accentColorHex);
                }
                return {
                    barColor1: accentColorHex,
                    barColor2: contrastingColor,
                    piePalette: generateMonochromaticPalette(accentColorHex, budgetSize),
                };
            }
        }
    }, [chartColorTheme, accentColor, accentColorHex, budget.length]);
    
    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        updateProfile({ theme: newTheme });
        
        // Apply theme-specific accent color
        const savedAccent = localStorage.getItem(newTheme === 'light' ? 'lightAccentColor' : 'darkAccentColor') as AccentColorTheme | null;
        const defaultAccent = newTheme === 'light' ? 'sapphire' : 'teal';
        setAccentColor(savedAccent || defaultAccent);
    };
    
    const handleAccentColorChange = (color: AccentColorTheme) => {
        setAccentColor(color);
        // Save preference for the current theme
        localStorage.setItem(theme === 'light' ? 'lightAccentColor' : 'darkAccentColor', color);
        // Also update the database with the latest choice as a fallback
        updateProfile({ accent_color: color });
    };

    const handleChartColorThemeChange = (theme: ChartColorTheme) => { 
        setChartColorTheme(theme); 
        localStorage.setItem('chartColorTheme', theme);
    };

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.setProperty('--color-accent-primary', accentColorHex);
        document.documentElement.style.setProperty('--color-accent-pill-bg', hexToRgba(accentColorHex, 0.15));
    }, [theme, accentColorHex]);

    const handleOpenAddTransaction = (type: 'income' | 'expense') => {
        setAddTransactionType(type);
        setCurrentView('add_transaction');
    };

    const handleSaveTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        const { data, error } = await supabase.from('transactions').insert({id: crypto.randomUUID(), ...transaction}).select().single();
        if (error) { addToast(`Failed to add transaction: ${error.message}`, 'error'); } 
        else {
            setTransactions(prev => [data as Transaction, ...prev]);
            setCurrentView('main');
            addToast('Transaction added successfully!');
        }
    };

    const handleUpdateTransaction = async (updatedTx: Transaction) => {
        const { data, error } = await supabase.from('transactions').update(updatedTx).match({ user_id: userId, id: updatedTx.id }).select().single();
        if (error) { addToast('Failed to update transaction', 'error'); }
        else {
            setTransactions(prev => prev.map(tx => tx.id === updatedTx.id ? data as Transaction : tx));
            addToast('Transaction updated!');
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        const { error } = await supabase.from('transactions').delete().match({ user_id: userId, id: id });
        if (error) { addToast('Failed to delete transaction.', 'error'); }
        else {
            setTransactions(prev => prev.filter(tx => tx.id !== id));
            addToast('Transaction deleted.', 'info');
        }
    };

    const handleSaveRecurringPayment = async (paymentData: Omit<RecurringPayment, 'id'>): Promise<boolean> => {
        const newPayment = { id: crypto.randomUUID(), user_id: userId, ...paymentData };
        const { data, error } = await supabase.from('recurring_payments').insert(newPayment).select().single();
        if (error) {
            addToast(`Failed to add recurring payment: ${error.message}`, 'error');
            return false;
        } else {
            setRecurringPayments(prev => [...prev, data as RecurringPayment].sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()));
            return true;
        }
    };

    const handleUpdateRecurringPayment = async (updatedPayment: RecurringPayment) => {
        const { data, error } = await supabase.from('recurring_payments').update(updatedPayment).match({ id: updatedPayment.id, user_id: userId }).select().single();
        if (error) {
            addToast(`Failed to update recurring payment: ${error.message}`, 'error');
        } else {
            setRecurringPayments(prev => prev.map(p => p.id === updatedPayment.id ? data as RecurringPayment : p).sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()));
        }
    };

    const handleDeleteRecurringPayment = async (id: string) => {
        const { error } = await supabase.from('recurring_payments').delete().match({ id: id, user_id: userId });
        if (error) {
            addToast('Failed to delete recurring payment.', 'error');
        } else {
            setRecurringPayments(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleUpdateBudget = async (newBudget: BudgetCategory[]) => {
        const { error: deleteError } = await supabase.from('budget_categories').delete().eq('user_id', userId);
        if (deleteError) {
            addToast('Error clearing old budget', 'error');
            return;
        }
        
        if (newBudget.length === 0) {
            setBudget([]);
            addToast('Budget cleared.', 'info');
            return;
        }
        
        const budgetToInsert = newBudget.map(b => ({
            user_id: userId,
            name: b.name,
            allocated: b.allocated,
        }));

        const { data, error: insertError } = await supabase.from('budget_categories').insert(budgetToInsert).select();

        if (insertError) {
            addToast(`Error saving budget: ${insertError.message}`, 'error');
        } else {
            setBudget(newBudget); // Optimistically update UI
            addToast('Budget saved successfully!');
        }
    };

  const handleNavigateToConfiguration = useCallback((view: ConfigView) => {
    setCurrentView(view);
    setActiveTab(TABS.PROFILE);
  }, []);

  const handleNavigateToView = useCallback((view: ProfileView) => {
    setCurrentView(view);
    setActiveTab(TABS.PROFILE);
  }, []);

  const handleAvatarClick = useCallback(() => {
    setCurrentView('main');
    setActiveTab(TABS.PROFILE);
  }, []);

  const handleBack = () => {
    const profileViews: string[] = ['family', 'accounts', 'health_report', 'achievements', 'help_support', 'personalization'];
    const configViews: string[] = ['manage_categories', 'categories_accounts', 'income', 'expense', 'accounts', 'tags', 'regional', 'language', 'budgeting', 'budget_cycle', 'notification_settings', 'default_preferences', 'appearance', 'security'];

    if (currentView === 'manage_categories') {
        setCurrentView('categories_accounts');
        setActiveTab(TABS.PROFILE);
    }
    else if (profileViews.includes(currentView) || configViews.includes(currentView)) {
        setCurrentView('main');
        setActiveTab(TABS.PROFILE);
    } else {
        setCurrentView('main');
    }
  };
  
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><p>Loading your financial dashboard...</p></div>
    }

  const renderContent = () => {
    const allTransactionsProps = {
        transactions,
        currencySymbol: CURRENCIES[currency].symbol,
        onBack: handleBack,
        onUpdateTransaction: handleUpdateTransaction,
        onDeleteTransaction: handleDeleteTransaction,
        categories,
        accounts,
        allTags: tags,
    };

    if (currentView !== 'main') {
        switch(currentView) {
            case 'add_transaction': return <AddTransactionView 
                onBack={handleBack}
                onSave={handleSaveTransaction}
                transactionType={addTransactionType}
                categories={categories}
                accounts={accounts}
                defaultPreferences={defaultPreferences}
                allTags={tags}
                currencySymbol={CURRENCIES[currency].symbol}
            />;
            case 'all_transactions': return <AllTransactions {...allTransactionsProps} focusSearchOnMount={false} />;
            case 'all_transactions_search': return <AllTransactions {...allTransactionsProps} focusSearchOnMount={true} />;
            case 'notifications': return <Notifications notifications={notifications} setNotifications={setNotifications} onBack={() => setCurrentView('main')} />;
            case 'scan_receipt': return <ScanReceipt />;
            case 'family': return <FamilyMembersManager members={familyMembers} setMembers={setFamilyMembers} onBack={handleBack} />;
            case 'accounts': return <LinkedAccountsManager accounts={linkedAccounts} setAccounts={setLinkedAccounts} onBack={handleBack} />;
            case 'achievements': return <AchievementsComponent achievements={achievements} onBack={handleBack} />;
            case 'health_report': return <FinancialHealthReport onBack={handleBack} transactions={transactions} budget={budget} financialSummary={financialSummary} currencySymbol={CURRENCIES[currency].symbol} />;
            case 'help_support': return <HelpAndSupport onBack={handleBack} />;
            case 'personalization': return <Personalization userName={userName} setUserName={(name) => {setUserName(name); updateProfile({user_name: name});}} profilePicture={profilePicture} setProfilePicture={(url) => {setProfilePicture(url); updateProfile({profile_picture_url: url});}} onBack={handleBack} />;
            default: return <Configuration 
                view={currentView as ConfigView} 
                onNavigate={handleNavigateToConfiguration}
                userId={userId}
                categories={categories} setCategories={setCategories}
                accounts={accounts} setAccounts={setAccounts}
                currency={currency} onCurrencyChange={(c) => {setCurrency(c); updateProfile({currency: c});}}
                language={language} onLanguageChange={(l) => {setLanguage(l); updateProfile({language: l})}}
                budgetCycle={budgetCycle} onBudgetCycleChange={(bc) => {setBudgetCycle(bc); updateProfile({budget_cycle: bc})}}
                notificationSettings={notificationSettings} onNotificationSettingsChange={(ns) => {setNotificationSettings(ns); updateProfile({notification_settings: ns})}}
                defaultPreferences={defaultPreferences} onDefaultPreferencesChange={(dp) => {setDefaultPreferences(dp); updateProfile({default_preferences: dp})}}
                accentColor={accentColor} onAccentColorChange={handleAccentColorChange}
                chartColorTheme={chartColorTheme} onChartColorThemeChange={handleChartColorThemeChange}
                tags={tags} setTags={setTags}
                financialYearStartMonth={financialYearStartMonth} onFinancialYearStartMonthChange={(m) => {setFinancialYearStartMonth(m); updateProfile({financial_year_start_month: m})}}
                isBudgetCarryoverEnabled={isBudgetCarryoverEnabled} onIsBudgetCarryoverEnabledChange={(val) => {setIsBudgetCarryoverEnabled(val); updateProfile({is_budget_carryover_enabled: val})}}
                selectedTheme={theme} onThemeChange={handleThemeChange}
                isPinSet={isPinSet} onIsPinSetChange={(val) => {setIsPinSet(val); updateProfile({is_pin_set: val})}}
            />
        }
    }

    switch (activeTab) {
      case TABS.HOME: return <HomeDashboard currencySymbol={CURRENCIES[currency].symbol} transactions={transactions} categories={categories} onViewAll={() => setCurrentView('all_transactions')} onNavigateToSearch={() => setCurrentView('all_transactions_search')} financialSummary={financialSummary} />;
      case TABS.PLANNER: return <Planner 
          currencySymbol={CURRENCIES[currency].symbol} 
          theme={theme} 
          pieChartPalette={piePalette} 
          budget={budget} 
          onUpdateBudget={handleUpdateBudget}
          isBudgetCarryoverEnabled={isBudgetCarryoverEnabled} 
          recurringPayments={recurringPayments} 
          transactions={transactions} 
          categories={categories}
          defaultPreferences={defaultPreferences}
          onSaveRecurringPayment={handleSaveRecurringPayment}
          onUpdateRecurringPayment={handleUpdateRecurringPayment}
          onDeleteRecurringPayment={handleDeleteRecurringPayment}
          onSaveTransaction={handleSaveTransaction}
          achievements={achievements}
        />;
      case TABS.ANALYSIS: return <Analysis theme={theme} incomeColor={barColor1} expenseColor={barColor2} />;
      case TABS.PROFILE: return <Profile 
        userName={userName}
        profilePicture={profilePicture}
        onNavigateToConfiguration={handleNavigateToConfiguration}
        onNavigateToView={handleNavigateToView}
        isPinSet={isPinSet}
        familyMembersCount={familyMembers.length}
        linkedAccountsCount={linkedAccounts.length}
        achievementsUnlockedCount={achievements.filter(a => a.unlocked).length}
        totalAchievementsCount={achievements.length}
        onSignOut={() => supabase.auth.signOut()}
      />;
      default: return <HomeDashboard currencySymbol={CURRENCIES[currency].symbol} transactions={transactions} categories={categories} onViewAll={() => setCurrentView('all_transactions')} onNavigateToSearch={() => setCurrentView('all_transactions_search')} financialSummary={financialSummary} />;
    }
  };

  const getHeaderInfo = () => {
      if (currentView !== 'main') {
          if (currentView === 'add_transaction') {
            return { title: 'Add Transaction', onBack: handleBack, isAppName: false };
          }
           if (currentView === 'all_transactions' || currentView === 'all_transactions_search') {
            return { title: 'All Transactions', onBack: handleBack, isAppName: false };
          }
          return { title: currentView.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), subtitle: 'Manage your settings', onBack: handleBack, isAppName: false };
      }
      
      const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
      };

      switch (activeTab) {
        case TABS.HOME:
          return { 
            title: `${getTimeBasedGreeting()}!`, 
            subtitle: userName, 
            isAppName: false,
            titleClassName: 'text-md font-medium text-text-secondary truncate',
            subtitleClassName: 'text-2xl font-bold text-text-primary truncate',
          };
        case TABS.PLANNER: return { title: 'Planner', isAppName: false };
        case TABS.ANALYSIS: return { title: 'Analysis', isAppName: false };
        case TABS.PROFILE: return { title: 'Profile', isAppName: false };
        default: return { 
          title: `${getTimeBasedGreeting()}!`, 
          subtitle: userName, 
          isAppName: false,
          titleClassName: 'text-md font-medium text-text-secondary truncate',
          subtitleClassName: 'text-2xl font-bold text-text-primary truncate',
        };
      }
  };
  const headerInfo = getHeaderInfo();
  const showProfileIcons = activeTab === TABS.HOME && currentView === 'main';

  return (
    <div className={`theme-${theme} font-sans bg-bg-primary h-screen text-text-primary flex flex-col`}>
      <div className="container mx-auto max-w-2xl">
        <Header 
            {...headerInfo}
            showProfileIcons={showProfileIcons}
            onCoachClick={() => setIsCoachModalOpen(true)}
            financialScore={healthScoreDetails.healthScore}
            isWelcomeState={healthScoreDetails.isWelcomeState}
            onFinancialScoreClick={() => setIsHealthModalOpen(true)}
            userName={userName}
            profilePicture={profilePicture}
            onAvatarClick={handleAvatarClick}
        />
      </div>
      <main className={`container mx-auto max-w-2xl flex-1 overflow-y-auto p-4 ${currentView === 'main' ? 'pb-24' : ''}`}>
        {renderContent()}
      </main>
      
      {currentView === 'main' && (
        <BottomNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onAddTransaction={() => handleOpenAddTransaction('expense')}
        />
      )}
      
      <AICoachModal 
        isOpen={isCoachModalOpen}
        onClose={() => setIsCoachModalOpen(false)}
      />
       <FinancialHealthDetailsModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        scores={healthScoreDetails}
        budgetWithSpending={healthScoreDetails.budgetWithSpending}
        currencySymbol={CURRENCIES[currency].symbol}
        isWelcomeState={healthScoreDetails.isWelcomeState}
      />
    </div>
  );
};


// --- AUTH ROUTER ---
const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary"><p>Loading...</p></div>;
    }

    return (
        <>
            {!session ? <Auth /> : <MainApp key={session.user.id} session={session} />}
        </>
    );
};


export default App;
