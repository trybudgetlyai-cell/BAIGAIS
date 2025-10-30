import React, { useState, useRef } from 'react';
import CategoryManager from './CategoryManager';
import { 
    CreditCardIcon, 
    ChevronRightIcon, 
    ClockIcon,
    DatabaseIcon,
    TagIcon,
} from '../constants';
import Card from './ui/Card';
import ToggleButton from './ui/ToggleButton';
import type { Theme, Currency, Language, BudgetCycle, NotificationSettings, DefaultPreferences, AccentColorTheme, ConfigView, Category, ChartColorTheme } from '../types';
import { CURRENCIES, LANGUAGES, ACCENT_COLORS, FINANCIAL_YEAR_MONTHS, CHART_COLOR_THEMES } from '../constants';
import Button from './ui/Button';
import PinSecurityModal from './PinSecurityModal';
import { useToast } from '../contexts/ToastContext';


interface ConfigurationProps {
    view: ConfigView;
    onNavigate: (view: ConfigView) => void;
    userId: string;
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    accounts: string[];
    setAccounts: React.Dispatch<React.SetStateAction<string[]>>;
    currency: Currency;
    onCurrencyChange: (currency: Currency) => void;
    language: Language;
    onLanguageChange: (language: Language) => void;
    budgetCycle: BudgetCycle;
    onBudgetCycleChange: (cycle: BudgetCycle) => void;
    notificationSettings: NotificationSettings;
    onNotificationSettingsChange: (settings: NotificationSettings) => void;
    defaultPreferences: DefaultPreferences;
    onDefaultPreferencesChange: (settings: DefaultPreferences) => void;
    accentColor: AccentColorTheme;
    onAccentColorChange: (color: AccentColorTheme) => void;
    chartColorTheme: ChartColorTheme;
    onChartColorThemeChange: (theme: ChartColorTheme) => void;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    financialYearStartMonth: number;
    onFinancialYearStartMonthChange: (month: number) => void;
    isBudgetCarryoverEnabled: boolean;
    onIsBudgetCarryoverEnabledChange: (isEnabled: boolean) => void;
    selectedTheme: Theme;
    onThemeChange: (theme: Theme) => void;
    isPinSet: boolean;
    onIsPinSetChange: (isSet: boolean) => void;
}


const Configuration: React.FC<ConfigurationProps> = ({ 
    view,
    onNavigate,
    userId,
    categories,
    setCategories,
    accounts,
    setAccounts,
    currency,
    onCurrencyChange,
    language,
    onLanguageChange,
    budgetCycle,
    onBudgetCycleChange,
    notificationSettings,
    onNotificationSettingsChange,
    defaultPreferences,
    onDefaultPreferencesChange,
    accentColor,
    onAccentColorChange,
    chartColorTheme,
    onChartColorThemeChange,
    tags,
    setTags,
    financialYearStartMonth,
    onFinancialYearStartMonthChange,
    isBudgetCarryoverEnabled,
    onIsBudgetCarryoverEnabledChange,
    selectedTheme,
    onThemeChange,
    isPinSet,
    onIsPinSetChange,
}) => {
    const { addToast } = useToast();
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);

    const NavButton: React.FC<{onClick: () => void, icon: React.ReactNode, title: string, subtitle: string}> = ({ onClick, icon, title, subtitle }) => (
         <button 
            onClick={onClick} 
            className="w-full text-left flex items-center justify-between gap-4 p-4 rounded-lg hover:bg-bg-primary transition-colors"
        >
            <div className="flex items-center gap-4">
                {icon}
                <div>
                    <p className="font-semibold text-text-primary">{title}</p>
                    <p className="text-sm text-text-secondary">{subtitle}</p>
                </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
        </button>
    );
    
    const handleSavePin = (pin: string) => {
        console.log("PIN set:", pin);
        onIsPinSetChange(true);
        setIsPinModalOpen(false);
        addToast('Security PIN has been set successfully!');
    };
    
    const renderContent = () => {
        switch(view) {
            case 'categories_accounts':
                 return (
                    <Card>
                        <div className="space-y-1">
                            <NavButton 
                                onClick={() => onNavigate('manage_categories')}
                                icon={<DatabaseIcon className="w-6 h-6 text-accent-primary" />}
                                title="Manage Categories"
                                subtitle="Organize income and expense categories."
                            />
                            {/* Keep Accounts and Tags separate for now */}
                             <div className="border-t border-border mx-4"></div>
                            <NavButton 
                                onClick={() => onNavigate('accounts')}
                                icon={<CreditCardIcon className="w-6 h-6 text-yellow-400" />}
                                title="Accounts"
                                subtitle="Manage your payment accounts."
                            />
                            <div className="border-t border-border mx-4"></div>
                            <NavButton 
                                onClick={() => onNavigate('tags')}
                                icon={<TagIcon className="w-6 h-6 text-sky-400" />}
                                title="Tags"
                                subtitle="Manage your transaction tags."
                            />
                        </div>
                    </Card>
                );
            case 'manage_categories':
                 return <CategoryManager categories={categories} setCategories={setCategories} userId={userId} />;
            case 'accounts': // This now only handles the flat list of accounts.
                const AccountManager: React.FC<{items: string[], setItems: (items: string[]) => void}> = ({items, setItems}) => {
                    const [newItem, setNewItem] = useState('');
                    return <Card>
                        <div className="space-y-2 mb-4">
                            {items.map(item => <div key={item} className="bg-bg-primary p-3 rounded-md text-text-primary">{item}</div>)}
                        </div>
                        <div className="flex gap-2">
                            <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="New account name" className="w-full bg-bg-primary p-2 rounded border border-border text-text-primary" />
                            <Button onClick={() => {setItems([...items, newItem]); setNewItem('')}}>Add</Button>
                        </div>
                    </Card>
                };
                return <AccountManager items={accounts} setItems={setAccounts} />;
            case 'tags': // This now only handles the flat list of tags.
                 const TagManager: React.FC<{items: string[], setItems: (items: string[]) => void}> = ({items, setItems}) => {
                    const [newItem, setNewItem] = useState('');
                    return <Card>
                        <div className="space-y-2 mb-4">
                            {items.map(item => <div key={item} className="bg-bg-primary p-3 rounded-md text-text-primary">{item}</div>)}
                        </div>
                        <div className="flex gap-2">
                            <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="New tag name" className="w-full bg-bg-primary p-2 rounded border border-border text-text-primary" />
                            <Button onClick={() => {setItems([...items, newItem]); setNewItem('')}}>Add</Button>
                        </div>
                    </Card>
                };
                return <TagManager items={tags} setItems={setTags} />;
            case 'regional':
                 return (
                    <Card>
                        <div>
                            <h3 className="font-bold text-text-primary mb-4">Select Currency</h3>
                            <div className="space-y-2">
                                {(Object.keys(CURRENCIES) as Currency[]).map((code) => (
                                    <label key={code} htmlFor={`currency-${code}`} className="flex items-center justify-between p-3 bg-bg-primary rounded-lg cursor-pointer hover:bg-bg-secondary/50 transition-colors">
                                        <span className="font-semibold text-text-primary">{CURRENCIES[code].symbol} {code} - {CURRENCIES[code].name}</span>
                                        <div className="relative flex items-center justify-center w-6 h-6">
                                            <input 
                                                type="radio" 
                                                id={`currency-${code}`} 
                                                name="currency" 
                                                value={code} 
                                                checked={currency === code} 
                                                onChange={() => onCurrencyChange(code)} 
                                                className="opacity-0 absolute w-full h-full cursor-pointer"
                                            />
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${currency === code ? 'border-accent-primary' : 'border-text-secondary'}`}>
                                                {currency === code && <div className="w-2.5 h-2.5 bg-accent-primary rounded-full"></div>}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-border my-4"></div>
                        <div>
                             <label className="font-bold text-text-primary" htmlFor="fy-start">Financial Year Start</label>
                             <p className="text-xs text-text-secondary mb-2">Aligns annual reports with your tax year.</p>
                             <select 
                                id="fy-start"
                                value={financialYearStartMonth} 
                                onChange={(e) => onFinancialYearStartMonthChange(parseInt(e.target.value))} 
                                className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary appearance-none"
                            >
                                {FINANCIAL_YEAR_MONTHS.map(month => <option key={month.value} value={month.value}>{month.name}</option>)}
                            </select>
                        </div>
                    </Card>
                );
            case 'language':
                 return (
                    <Card>
                        <h3 className="font-bold text-text-primary mb-4">Select Language</h3>
                        <div className="space-y-2">
                            {(Object.keys(LANGUAGES) as Language[]).map((code) => (
                                <label key={code} htmlFor={`lang-${code}`} className="flex items-center justify-between p-3 bg-bg-primary rounded-lg cursor-pointer hover:bg-bg-secondary/50 transition-colors">
                                    <span className="font-semibold text-text-primary">{LANGUAGES[code].name}</span>
                                    <div className="relative flex items-center justify-center w-6 h-6">
                                        <input 
                                            type="radio" 
                                            id={`lang-${code}`} 
                                            name="language" 
                                            value={code} 
                                            checked={language === code} 
                                            onChange={() => onLanguageChange(code)} 
                                            className="opacity-0 absolute w-full h-full cursor-pointer"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${language === code ? 'border-accent-primary' : 'border-text-secondary'}`}>
                                            {language === code && <div className="w-2.5 h-2.5 bg-accent-primary rounded-full"></div>}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </Card>
                );
            case 'budgeting':
                return (
                     <Card>
                        <div className="space-y-1">
                            <div>
                                <h3 className="font-bold text-text-primary mb-2 p-4">Budget Carryover</h3>
                                <p className="text-sm text-text-secondary mb-4 px-4">
                                    When enabled, any unspent or overspent funds from a budget category will automatically roll over to the next month, adjusting that category's available amount.
                                </p>
                                <div className="p-4">
                                    <ToggleButton 
                                        label="Enable Budget Carryover" 
                                        enabled={isBudgetCarryoverEnabled} 
                                        onClick={() => onIsBudgetCarryoverEnabledChange(!isBudgetCarryoverEnabled)} 
                                    />
                                </div>
                            </div>
                            <div className="border-t border-border mx-4"></div>
                             <NavButton 
                                onClick={() => onNavigate('budget_cycle')}
                                icon={<ClockIcon className="w-6 h-6 text-accent-primary" />}
                                title="Budget Cycle"
                                subtitle="Set your monthly budget start day."
                            />
                        </div>
                    </Card>
                )
            case 'budget_cycle':
                return (
                    <Card>
                        <h3 className="font-bold text-text-primary mb-4">Budget Start Day</h3>
                        <div className="space-y-2">
                            <label htmlFor="cycle-monthly" className="flex items-center justify-between p-3 bg-bg-primary rounded-lg cursor-pointer hover:bg-bg-secondary/50 transition-colors">
                                <span className="font-semibold text-text-primary">Monthly (from 1st of the month)</span>
                                <div className="relative flex items-center justify-center w-6 h-6">
                                    <input type="radio" id="cycle-monthly" name="budgetCycle" checked={budgetCycle.type === 'monthly'} onChange={() => onBudgetCycleChange({ type: 'monthly', dayOfMonth: 1 })} className="opacity-0 absolute w-full h-full cursor-pointer" />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${budgetCycle.type === 'monthly' ? 'border-accent-primary' : 'border-text-secondary'}`}>
                                        {budgetCycle.type === 'monthly' && <div className="w-2.5 h-2.5 bg-accent-primary rounded-full"></div>}
                                    </div>
                                </div>
                            </label>
                            <div className="p-3 bg-bg-primary rounded-lg">
                                <label htmlFor="cycle-custom" className="flex items-center justify-between cursor-pointer">
                                    <span className="font-semibold text-text-primary">Custom Start Day</span>
                                    <div className="relative flex items-center justify-center w-6 h-6">
                                        <input type="radio" id="cycle-custom" name="budgetCycle" checked={budgetCycle.type === 'custom_day'} onChange={() => { if (budgetCycle.type !== 'custom_day') { onBudgetCycleChange({ type: 'custom_day', dayOfMonth: 15 }); } }} className="opacity-0 absolute w-full h-full cursor-pointer" />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${budgetCycle.type === 'custom_day' ? 'border-accent-primary' : 'border-text-secondary'}`}>
                                            {budgetCycle.type === 'custom_day' && <div className="w-2.5 h-2.5 bg-accent-primary rounded-full"></div>}
                                        </div>
                                    </div>
                                </label>
                                {budgetCycle.type === 'custom_day' && (
                                    <div className="mt-4">
                                        <label className="text-sm text-text-secondary" htmlFor="start-day-input">Select the day of the month your budget starts:</label>
                                        <input 
                                            id="start-day-input"
                                            type="number" 
                                            min="1" 
                                            max="31"
                                            value={budgetCycle.dayOfMonth}
                                            onChange={(e) => {
                                                const day = parseInt(e.target.value);
                                                if (day >= 1 && day <= 31) {
                                                    onBudgetCycleChange({ type: 'custom_day', dayOfMonth: day });
                                                }
                                            }}
                                            className="w-full mt-1 bg-bg-secondary p-2 rounded border border-border text-text-primary"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                );
            case 'notification_settings':
                return (
                    <Card>
                        <div className="space-y-4">
                            <ToggleButton label="Push Notifications" enabled={notificationSettings.pushEnabled} onClick={() => onNotificationSettingsChange({ ...notificationSettings, pushEnabled: !notificationSettings.pushEnabled })} />
                            <ToggleButton label="Email Summaries (Weekly)" enabled={notificationSettings.emailSummariesEnabled} onClick={() => onNotificationSettingsChange({ ...notificationSettings, emailSummariesEnabled: !notificationSettings.emailSummariesEnabled })} />
                            
                            <div className="border-t border-border"></div>

                            <div className="pt-2">
                                <label className="text-sm text-text-secondary block mb-1">Large Transaction Alert</label>
                                <p className="text-xs text-text-secondary mb-2">Get an alert for any single transaction over this amount. Set to 0 to disable.</p>
                                <input 
                                    type="number" 
                                    value={notificationSettings.largeTransactionAmount}
                                    onChange={(e) => onNotificationSettingsChange({ ...notificationSettings, largeTransactionAmount: parseInt(e.target.value) || 0 })}
                                    className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"
                                    placeholder="Enter amount"
                                />
                            </div>

                            <div className="pt-2">
                                <label className="text-sm text-text-secondary block mb-1">Budget Threshold Alert</label>
                                <p className="text-xs text-text-secondary mb-2">Get an alert when you've spent a certain percentage of any budget category.</p>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        step="5"
                                        value={notificationSettings.budgetThresholdPercent}
                                        onChange={(e) => onNotificationSettingsChange({ ...notificationSettings, budgetThresholdPercent: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-bg-primary rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="font-bold text-text-primary w-12 text-right">{notificationSettings.budgetThresholdPercent}%</span>
                                </div>
                                <p className="text-xs text-text-secondary mt-2 text-center">Set to 0% to disable.</p>
                            </div>
                        </div>
                    </Card>
                );
            case 'default_preferences':
                return (
                    <Card>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-text-primary mb-2">Default Transaction Type</h3>
                                <div className="flex bg-bg-primary rounded-lg p-1">
                                    <button onClick={() => onDefaultPreferencesChange({ ...defaultPreferences, transactionType: 'income' })} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${defaultPreferences.transactionType === 'income' ? 'bg-accent-primary text-accent-text' : 'text-text-secondary'}`}>Income</button>
                                    <button onClick={() => onDefaultPreferencesChange({ ...defaultPreferences, transactionType: 'expense' })} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${defaultPreferences.transactionType === 'expense' ? 'bg-accent-secondary text-white' : 'text-text-secondary'}`}>Expense</button>
                                </div>
                            </div>
                            <div>
                                <label className="font-bold text-text-primary" htmlFor="default-account">Default Account</label>
                                <p className="text-xs text-text-secondary mb-2">This account will be pre-selected when adding a transaction.</p>
                                <select 
                                    id="default-account"
                                    value={defaultPreferences.account} 
                                    onChange={(e) => onDefaultPreferencesChange({ ...defaultPreferences, account: e.target.value })} 
                                    className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary appearance-none"
                                >
                                    {accounts.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                                </select>
                            </div>
                        </div>
                    </Card>
                );
            case 'appearance':
                return (
                    <Card>
                         <div className="p-3 bg-bg-primary rounded-lg flex justify-between items-center mb-4">
                            <div>
                                <p className="font-semibold text-text-primary">Theme</p>
                                <p className="text-sm text-text-secondary">Switch between light and dark mode.</p>
                            </div>
                            <div className="flex bg-bg-secondary rounded-lg p-1">
                                <button onClick={() => onThemeChange('light')} className={`px-3 py-1 text-sm rounded-md ${selectedTheme === 'light' ? 'bg-accent-primary text-accent-text' : ''}`}>Light</button>
                                <button onClick={() => onThemeChange('dark')} className={`px-3 py-1 text-sm rounded-md ${selectedTheme === 'dark' ? 'bg-accent-primary text-accent-text' : ''}`}>Dark</button>
                            </div>
                        </div>
                         <h3 className="font-bold text-text-primary my-4">Select Accent Color</h3>
                         <div className="grid grid-cols-3 gap-4">
                            {(Object.keys(ACCENT_COLORS) as AccentColorTheme[]).map(colorKey => (
                                <button key={colorKey} onClick={() => onAccentColorChange(colorKey)} className="flex flex-col items-center gap-2 p-2 rounded-lg transition-all" style={{ backgroundColor: accentColor === colorKey ? 'var(--color-bg-primary)' : 'transparent'}}>
                                    <div className="w-12 h-12 rounded-full border-4" style={{ backgroundColor: ACCENT_COLORS[colorKey], borderColor: accentColor === colorKey ? ACCENT_COLORS[colorKey] : 'transparent' }}></div>
                                    <span className="capitalize text-sm text-text-primary">{colorKey}</span>
                                </button>
                            ))}
                         </div>
                         <div className="border-t border-border my-6"></div>
                         <h3 className="font-bold text-text-primary mb-4">Select Chart Color Theme</h3>
                            
                            <button
                                onClick={() => onChartColorThemeChange('accent')}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-colors flex justify-between items-center ${chartColorTheme === 'accent' ? 'border-accent-primary bg-bg-primary' : 'border-transparent hover:bg-bg-primary'}`}
                            >
                                <div>
                                    <p className="font-semibold text-text-primary">From Accent Color</p>
                                    <p className="text-xs text-text-secondary italic mt-1">Colors adapt to your chosen accent.</p>
                                </div>
                                <div className="relative flex items-center justify-center w-6 h-6">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${chartColorTheme === 'accent' ? 'border-accent-primary' : 'border-text-secondary'}`}>
                                        {chartColorTheme === 'accent' && <div className="w-2.5 h-2.5 bg-accent-primary rounded-full"></div>}
                                    </div>
                                </div>
                            </button>

                            <div className="grid grid-cols-3 gap-3 mt-4">
                                {([
                                    { id: 'vibrant', name: 'Vibrant', palette: CHART_COLOR_THEMES.vibrant },
                                    { id: 'muted', name: 'Muted', palette: CHART_COLOR_THEMES.muted },
                                    { id: 'sunset', name: 'Sunset', palette: CHART_COLOR_THEMES.sunset },
                                    { id: 'ocean', name: 'Ocean', palette: CHART_COLOR_THEMES.ocean },
                                    { id: 'forest', name: 'Forest', palette: CHART_COLOR_THEMES.forest },
                                    { id: 'pastel', name: 'Pastel', palette: CHART_COLOR_THEMES.pastel },
                                ] as const).map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => onChartColorThemeChange(theme.id)}
                                        className={`p-3 rounded-lg border-2 transition-colors text-center ${chartColorTheme === theme.id ? 'border-accent-primary bg-bg-primary' : 'border-transparent hover:bg-bg-primary'}`}
                                    >
                                        <p className="font-semibold text-text-primary text-sm mb-2">{theme.name}</p>
                                        <div className="flex justify-center gap-1">
                                            {theme.palette.slice(0, 5).map(color => (
                                                <div key={color} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                    </Card>
                );
            case 'security':
                return (
                     <Card>
                         <ToggleButton 
                            label="App Lock PIN"
                            enabled={isPinSet}
                            onClick={() => {
                                if (isPinSet) {
                                    onIsPinSetChange(false);
                                    addToast('Security PIN has been removed.', 'info');
                                } else {
                                    setIsPinModalOpen(true);
                                }
                            }}
                        />
                        <p className="text-xs text-text-secondary mt-2 px-1">Enable a 4-digit PIN to secure your app from unauthorized access.</p>
                     </Card>
                );
        }
    };
    
    return (
         <div className="space-y-4">
            {renderContent()}
            <PinSecurityModal
                isOpen={isPinModalOpen}
                onClose={() => setIsPinModalOpen(false)}
                onSave={handleSavePin}
            />
        </div>
    );
};

export default Configuration;