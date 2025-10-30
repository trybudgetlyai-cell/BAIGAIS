

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { TrendingUpIcon, TrendingDownIcon, PencilIcon, TrashIcon, SearchIcon, FilterIcon, ArrowsUpDownIcon } from '../constants';
import type { Transaction, Category } from '../types';
import EditTransactionModal from './EditTransactionModal';

interface AllTransactionsProps {
  transactions: Transaction[];
  currencySymbol: string;
  onBack: () => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  categories: Category[];
  accounts: string[];
  allTags: string[];
  focusSearchOnMount?: boolean;
}

const TRANSACTIONS_PER_PAGE = 10;

const AllTransactions: React.FC<AllTransactionsProps> = ({ 
    transactions, 
    currencySymbol, 
    onBack, 
    onUpdateTransaction,
    onDeleteTransaction,
    categories,
    accounts,
    allTags,
    focusSearchOnMount = false,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [timePeriod, setTimePeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('1M');
  const [currentPage, setCurrentPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);

  useEffect(() => {
    if (focusSearchOnMount) {
        searchInputRef.current?.focus();
    }
  }, [focusSearchOnMount]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchTerm, timePeriod]);
  
  const getCategoryName = (categoryId: string) => {
      const category = categoryMap.get(categoryId);
      if (!category) return categoryId; // Fallback to ID if not found
      if (category.parent_id) {
          const parent = categoryMap.get(category.parent_id);
          return `${parent?.name} > ${category.name}`;
      }
      return category.name;
  };

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startDate = new Date(now);

    switch (timePeriod) {
        case '1M':
            startDate.setMonth(now.getMonth() - 1);
            break;
        case '3M':
            startDate.setMonth(now.getMonth() - 3);
            break;
        case '6M':
            startDate.setMonth(now.getMonth() - 6);
            break;
        case '1Y':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
    }
    
    return transactions
      .filter(tx => {
          const txDate = new Date(tx.date);
          return txDate >= startDate && txDate <= now;
      })
      .filter(tx => filterType === 'all' || tx.type === filterType)
      .filter(tx => tx.description.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [transactions, filterType, searchTerm, timePeriod]);

  const totalPages = Math.ceil(filteredTransactions.length / TRANSACTIONS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
      (currentPage - 1) * TRANSACTIONS_PER_PAGE,
      currentPage * TRANSACTIONS_PER_PAGE
  );
  
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    paginatedTransactions.forEach(tx => {
      const date = new Date(tx.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(tx);
    });
    return groups;
  }, [paginatedTransactions]);

  const handleEdit = (transaction: Transaction) => {
      setEditingTransaction(transaction);
  };
  
  const handleSaveEdit = (transaction: Transaction) => {
      onUpdateTransaction(transaction);
      setEditingTransaction(null);
  }

  const handleDelete = (id: string) => {
      if (window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
          onDeleteTransaction(id);
      }
  };


  return (
    <div className="space-y-4">
      <Card>
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon className="w-5 h-5 text-text-secondary" />
                    </span>
                    <input 
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search by description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-bg-primary p-2.5 pl-10 rounded-lg border border-border text-text-primary"
                    />
                </div>
                 <button className="p-2.5 flex-shrink-0 rounded-lg bg-bg-primary text-text-primary hover:bg-border focus:outline-none" aria-label="Filter transactions">
                    <FilterIcon className="w-6 h-6" strokeWidth={2} />
                </button>
                <button className="p-2.5 flex-shrink-0 rounded-lg bg-bg-primary text-text-primary hover:bg-border focus:outline-none" aria-label="Sort transactions">
                    <ArrowsUpDownIcon className="w-6 h-6" strokeWidth={2} />
                </button>
            </div>

            <div className="flex bg-bg-primary rounded-lg p-1">
                <button onClick={() => setFilterType('all')} className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors ${filterType === 'all' ? 'bg-accent-primary text-accent-text' : 'text-text-secondary'}`}>All</button>
                <button onClick={() => setFilterType('income')} className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors ${filterType === 'income' ? 'bg-[#388E3C] text-accent-text' : 'text-text-secondary'}`}>Income</button>
                <button onClick={() => setFilterType('expense')} className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors ${filterType === 'expense' ? 'bg-accent-secondary text-accent-text' : 'text-text-secondary'}`}>Expense</button>
            </div>
            <div className="flex justify-center gap-1 rounded-md bg-bg-primary p-1">
                {([
                    { label: '1M', value: '1M' },
                    { label: '3M', value: '3M' },
                    { label: '6M', value: '6M' },
                    { label: '1Y', value: '1Y' }
                ] as const).map((period) => (
                    <button 
                        key={period.value} 
                        onClick={() => setTimePeriod(period.value)} 
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors w-full ${
                            timePeriod === period.value
                            ? 'bg-accent-primary text-accent-text' 
                            : 'text-text-secondary hover:bg-text-secondary/20'
                        }`}
                    >
                        {period.label}
                    </button>
                ))}
            </div>
        </div>
      </Card>
      
      <div className="space-y-4">
        {Object.entries(groupedTransactions).map(([date, txs]) => (
          <div key={date}>
            <p className="text-sm font-semibold text-text-secondary mb-2">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <Card>
              <div className="space-y-2">
                {(txs as Transaction[]).map(tx => (
                   <div key={tx.id} className="flex items-center justify-between bg-bg-primary p-3 rounded-md">
                        <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${tx.type === 'income' ? 'bg-accent-primary/20 text-accent-primary' : 'bg-accent-secondary/20 text-accent-secondary'}`}>
                            {tx.type === 'income' ? <TrendingUpIcon className="w-5 h-5" /> : <TrendingDownIcon className="w-5 h-5" />}
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold text-text-primary">{tx.description}</p>
                                <p className="text-xs text-text-secondary">{getCategoryName(tx.category)} · {tx.account}</p>
                                {Array.isArray(tx.tags) && tx.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                    {(tx.tags as string[]).map(tag => (
                                        <span key={tag} className="text-xs bg-text-secondary/20 text-text-secondary px-1.5 py-0.5 rounded-full">
                                        #{tag}
                                        </span>
                                    ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className={`font-bold text-right w-24 truncate ${tx.type === 'income' ? 'text-accent-primary' : 'text-text-primary'}`}>
                                {tx.type === 'income' ? '+' : '-'}
                                {currencySymbol}
                                {tx.amount.toLocaleString()}
                            </p>
                            <button onClick={() => handleEdit(tx)} className="text-text-secondary hover:text-accent-primary p-1"><PencilIcon className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(tx.id)} className="text-text-secondary hover:text-accent-secondary p-1"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
              </div>
            </Card>
          </div>
        ))}
        {filteredTransactions.length === 0 && (
            <p className="text-center text-text-secondary py-8">No transactions match your filters.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
            <Button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="secondary"
            >
                Previous
            </Button>
            <span className="text-sm text-text-secondary">
                Page {currentPage} of {totalPages}
            </span>
            <Button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                variant="secondary"
            >
                Next
            </Button>
        </div>
      )}

      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSave={handleSaveEdit}
        transaction={editingTransaction}
        categories={categories}
        accounts={accounts}
        allTags={allTags}
      />
    </div>
  );
};

export default AllTransactions;