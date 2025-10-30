

import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { ChatIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon, CloseIcon } from '../constants';
import type { EndOfCycleReview, BudgetCategory } from '../types';

interface EndOfCycleReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: () => void;
    review: EndOfCycleReview | null;
    previousBudget: BudgetCategory[];
    currencySymbol: string;
}

const ChangeIndicator: React.FC<{ change: number }> = ({ change }) => {
    if (change > 0) return <TrendingUpIcon className="w-4 h-4 text-green-400" />;
    if (change < 0) return <TrendingDownIcon className="w-4 h-4 text-accent-secondary" />;
    return <MinusIcon className="w-4 h-4 text-text-secondary" />;
};


const EndOfCycleReviewModal: React.FC<EndOfCycleReviewModalProps> = ({ isOpen, onClose, onApply, review, previousBudget, currencySymbol }) => {
    if (!isOpen || !review) return null;

    const previousBudgetMap = new Map<string, BudgetCategory>(previousBudget.map(cat => [cat.name, cat]));
    const newBudgetMap = new Map<string, number>(review.newBudget.map(cat => [cat.name, cat.allocated]));

    const allCategoryNames = Array.from(new Set([...previousBudget.map(c => c.name), ...review.newBudget.map(c => c.name)]));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-end z-50 animate-fade-in">
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes slide-in-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .animate-slide-in-up { animation: slide-in-up 0.3s ease-out forwards; }
            `}</style>
            <div 
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden="true"
            ></div>
            <div className="relative w-full max-w-2xl mx-auto max-h-[90vh] bg-bg-secondary rounded-t-2xl flex flex-col animate-slide-in-up">
                 <header className="flex justify-between items-center p-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <ChatIcon className="w-6 h-6 text-accent-primary" />
                        <h3 className="text-xl font-bold text-text-primary">AI Budget Review</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-bg-primary"><CloseIcon className="w-6 h-6 text-text-secondary" /></button>
                </header>

                <div className="flex-grow overflow-y-auto p-4">
                    <div className="bg-bg-primary p-4 rounded-lg mb-4">
                        <h4 className="font-bold text-text-primary mb-2">AI Summary</h4>
                        <p className="text-sm text-text-secondary">{review.summary}</p>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-bg-primary z-10">
                            <tr>
                                <th className="p-2 font-semibold text-text-secondary">Category</th>
                                <th className="p-2 text-right font-semibold text-text-secondary">Previous</th>
                                <th className="p-2 text-right font-semibold text-text-secondary">Actual Spent</th>
                                <th className="p-2 text-right font-semibold text-text-secondary">AI Suggestion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {allCategoryNames.map(name => {
                                const prev = previousBudgetMap.get(name);
                                const suggested = newBudgetMap.get(name);
                                const change = (suggested ?? 0) - (prev?.allocated ?? 0);

                                return (
                                    <tr key={name}>
                                        <td className="p-2 font-medium text-text-primary">{name}</td>
                                        <td className="p-2 text-right text-text-secondary">
                                            {prev ? `${currencySymbol}${prev.allocated}` : '—'}
                                        </td>
                                        <td className="p-2 text-right font-medium" style={{ color: prev && prev.spent > prev.allocated ? 'var(--color-accent-secondary)' : 'var(--color-text-primary)'}}>
                                            {prev ? `${currencySymbol}${prev.spent}` : '—'}
                                        </td>
                                        <td className="p-2 text-right font-bold text-accent-primary flex justify-end items-center gap-1">
                                            <ChangeIndicator change={change} />
                                            {suggested !== undefined ? `${currencySymbol}${suggested}` : '—'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex-shrink-0 p-4 border-t border-border bg-bg-secondary">
                    <div className="flex gap-4">
                        <Button onClick={onClose} variant="secondary" className="w-full">Dismiss</Button>
                        <Button onClick={onApply} className="w-full">Apply New Budget</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EndOfCycleReviewModal;
