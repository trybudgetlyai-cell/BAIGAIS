import React, { useState, useMemo, useRef, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { getFinancialInsight } from '../services/geminiService';
import { ChatIcon, SearchIcon, ChevronDownIcon, TrendingUpIcon, TrendingDownIcon } from '../constants';
import type { Transaction, Category } from '../types';
import SpendingBanner from './SpendingBanner';

interface HomeDashboardProps {
    currencySymbol: string;
    transactions: Transaction[];
    categories: Category[];
    onViewAll: () => void;
    financialSummary: {
        income: number;
        expenses: number;
        savings: number;
    };
    onNavigateToSearch: () => void;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ currencySymbol, transactions, categories, onViewAll, financialSummary, onNavigateToSearch }) => {
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'month' | 'year'>('month');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);
  
  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);
  
  const getCategoryName = (categoryId: string): string => {
    const category = categoryMap.get(categoryId);
    if (!category) return "Uncategorized";
    if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        return parent ? `${parent.name} / ${category.name}` : category.name;
    }
    return category.name;
  };


  const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    // Format: Sep 1-30, 2024
    return `${start.toLocaleString('default', { month: 'short' })} ${start.getDate()}-${end.getDate()}, ${now.getFullYear()}`;
  };

  const getCurrentYearRange = () => {
      const now = new Date();
      const year = now.getFullYear();
      // Format: Jan - Dec, 2024
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);
      return `${start.toLocaleString('default', { month: 'short' })} - ${end.toLocaleString('default', { month: 'short' })}, ${year}`;
  };

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    if (timeFilter === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else { // 'year'
        startDate = new Date(now.getFullYear(), 0, 1);
    }

    return transactions.filter(tx => new Date(tx.date) >= startDate);
  }, [transactions, timeFilter]);


  const handleFetchSummary = async () => {
    setIsSummaryLoading(true);
    const prompt = "Analyze this user's monthly financial data (income, expenses, savings). Provide a brief, one-paragraph summary of their financial health and one actionable tip.";
    const result = await getFinancialInsight(prompt, financialSummary, currencySymbol);
    setSummary(result);
    setIsSummaryLoading(false);
  };
  
  return (
    <div className="space-y-6">
        {/* Top Controls */}
        <div className="flex justify-between items-center gap-2">
            <div className="relative" ref={filterRef}>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 bg-bg-secondary p-2 -ml-2 rounded-lg text-text-primary hover:bg-border transition-colors text-left focus:outline-none"
                    aria-haspopup="true"
                    aria-expanded={isFilterOpen}
                >
                    <span className="font-bold text-xl">
                        {timeFilter === 'month' ? 'Current Month' : 'Current Year'}
                    </span>
                    <ChevronDownIcon className={`w-4 h-4 text-text-secondary transition-transform flex-shrink-0 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-dropdown-bg rounded-lg border border-border shadow-lg z-10 animate-fade-in-down">
                        <button
                            onClick={() => { setTimeFilter('month'); setIsFilterOpen(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-bg-primary rounded-t-lg"
                        >
                            <span className="text-xl text-text-primary">Current Month</span>
                            <span className="text-sm text-text-secondary block">{getCurrentMonthRange()}</span>
                        </button>
                        <div className="border-t border-border mx-3"></div>
                        <button
                            onClick={() => { setTimeFilter('year'); setIsFilterOpen(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-bg-primary rounded-b-lg"
                        >
                            <span className="text-xl text-text-primary">Current Year</span>
                            <span className="text-sm text-text-secondary block">{getCurrentYearRange()}</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-grow"></div>

            <button
                onClick={onNavigateToSearch}
                className="p-2.5 flex-shrink-0 rounded-lg bg-bg-secondary text-text-primary hover:bg-border focus:outline-none"
                aria-label="Search transactions"
            >
                <SearchIcon className="w-6 h-6" strokeWidth={2} />
            </button>
        </div>

        <SpendingBanner 
            currencySymbol={currencySymbol}
            income={financialSummary.income}
            expenses={financialSummary.expenses}
        />

        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-text-primary font-sans">Recent transactions</h3>
                <button onClick={onViewAll} className="text-sm font-medium text-text-secondary hover:text-text-primary hover:underline transition-colors">
                    See all
                </button>
            </div>
            <div className="space-y-3">
                {filteredTransactions.length > 0 ? (
                filteredTransactions.slice(0, 5).map(tx => (
                    <div key={tx.id} className="flex items-center justify-between bg-bg-secondary p-3 rounded-xl shadow-[5px_5px_20px_-8px_rgba(0,0,0,0.12),_-5px_5px_20px_-8px_rgba(0,0,0,0.12)]">
                        <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${tx.type === 'income' ? 'bg-accent-primary/20 text-accent-primary' : 'bg-accent-secondary/20 text-accent-secondary'}`}>
                            {tx.type === 'income' ? <TrendingUpIcon className="w-5 h-5" /> : <TrendingDownIcon className="w-5 h-5" />}
                            </div>
                            <div>
                            <p className="font-semibold text-text-primary">{tx.description}</p>
                            <p className="text-xs text-text-secondary">{getCategoryName(tx.category)} · {tx.account} · {new Date(tx.date).toLocaleDateString()}</p>
                            {Array.isArray(tx.tags) && tx.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                {tx.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-text-secondary/20 text-text-secondary px-1.5 py-0.5 rounded-full">
                                    #{tag}
                                    </span>
                                ))}
                                </div>
                            )}
                            </div>
                        </div>
                        <p className={`font-bold ${tx.type === 'income' ? 'text-accent-primary' : 'text-text-primary'}`}>
                            {tx.type === 'income' ? '+' : '-'}
                            {currencySymbol}
                            {tx.amount.toLocaleString()}
                        </p>
                    </div>
                ))
                ) : (
                <p className="text-text-secondary text-center py-4">No transactions for this period. Add one to get started!</p>
                )}
            </div>
        </div>

        <div>
            <h3 className="text-xl font-bold text-text-primary font-sans mb-4 -ml-2 p-2">AI Summary</h3>
            <Card>
                {isSummaryLoading ? (
                    <div className="space-y-2">
                        <div className="h-4 bg-text-secondary/20 rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-text-secondary/20 rounded animate-pulse w-3/4"></div>
                    </div>
                ) : summary ? (
                    <p className="text-text-secondary whitespace-pre-wrap">{summary}</p>
                ) : (
                    <Button onClick={handleFetchSummary} variant="secondary" className="w-full" disabled={isSummaryLoading}>
                        <ChatIcon className="w-5 h-5" />
                        Get AI Summary
                    </Button>
                )}
            </Card>
        </div>
    </div>
  );
};

export default HomeDashboard;