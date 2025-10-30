import React from 'react';
import Card from './ui/Card';
import { TrendingUpIcon, TrendingDownIcon } from '../constants';
import type { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  currencySymbol: string;
  onViewAll?: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, currencySymbol, onViewAll }) => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-text-primary font-sans">Recent transactions</h3>
        {onViewAll && (
          <button onClick={onViewAll} className="text-sm font-medium text-text-secondary hover:text-text-primary hover:underline transition-colors">
            See all
          </button>
        )}
      </div>
      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.slice(0, 5).map(tx => (
            <div key={tx.id} className="flex items-center justify-between bg-bg-primary p-3 rounded-md">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${tx.type === 'income' ? 'bg-accent-primary/20 text-accent-primary' : 'bg-accent-secondary/20 text-accent-secondary'}`}>
                  {tx.type === 'income' ? <TrendingUpIcon className="w-5 h-5" /> : <TrendingDownIcon className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{tx.description}</p>
                  <p className="text-xs text-text-secondary">{tx.category} · {tx.account} · {new Date(tx.date).toLocaleDateString()}</p>
                   {/* FIX: Check if tx.tags is an array before attempting to map over it. */}
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
          <p className="text-text-secondary text-center py-4">No transactions yet. Add one to get started!</p>
        )}
      </div>
    </Card>
  );
};

export default TransactionList;