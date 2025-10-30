
import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { CloseIcon, TrendingUpIcon, TrendingDownIcon, SparklesIconSolid } from '../constants';
import type { BudgetCategory } from '../types';

interface ScoreDetails {
    healthScore: number | null;
    savingsScore: number;
    budgetingScore: number;
}

interface FinancialHealthDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: ScoreDetails;
  budgetWithSpending: (BudgetCategory & { spent: number })[];
  currencySymbol: string;
  isWelcomeState?: boolean;
}

const DetailGauge: React.FC<{ score: number }> = ({ score }) => {
    const size = 120;
    const strokeWidth = 12;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const getScoreColor = () => {
        if (score > 70) return 'text-accent-primary';
        if (score > 40) return 'text-yellow-400';
        return 'text-accent-secondary';
    };

    const progress = score / 100;
    const offset = circumference * (1 - progress);

    return (
        <div className="relative flex items-center justify-center mx-auto" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={center} cy={center} className="text-text-secondary/20" />
                <circle strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={center} cy={center} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={`transition-all duration-500 ease-in-out ${getScoreColor()}`} />
            </svg>
            <div className="absolute text-center">
                <span className={`text-3xl font-bold ${getScoreColor()}`}>{score}</span>
                <span className="text-xs text-text-secondary block">/ 100</span>
            </div>
        </div>
    );
};

const ScoreProgressBar: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = () => {
        if (score > 70) return 'bg-accent-primary';
        if (score > 40) return 'bg-yellow-400';
        return 'bg-accent-secondary';
    };
    return (
      <div className="w-full bg-bg-primary rounded-full h-2.5">
        <div className={`h-2.5 rounded-full transition-all duration-500 ${getScoreColor()}`} style={{ width: `${score}%` }}></div>
      </div>
    );
};


const FinancialHealthDetailsModal: React.FC<FinancialHealthDetailsModalProps> = ({ isOpen, onClose, scores, budgetWithSpending, currencySymbol, isWelcomeState }) => {
    if (!isOpen) return null;

    if (isWelcomeState) {
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
                        <h3 className="text-xl font-bold text-text-primary">Welcome to Your Dashboard!</h3>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-bg-primary"><CloseIcon className="w-6 h-6 text-text-secondary" /></button>
                    </header>
    
                    <div className="flex-grow overflow-y-auto p-6 text-center">
                        <SparklesIconSolid className="w-16 h-16 text-accent-primary mx-auto mb-4" />
                        <h4 className="text-2xl font-bold text-text-primary">Let's Get Your Financial Score</h4>
                        <p className="text-text-secondary mt-2 max-w-md mx-auto">
                            Your Financial Score is a simple way to track your financial health over time. It will appear here once you've added a few transactions.
                        </p>
                        <p className="text-text-secondary mt-4 max-w-md mx-auto">
                            Add your first income or expense to get started on your journey!
                        </p>
                        <Button onClick={onClose} className="mt-8 mx-auto">
                            Sounds Good!
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const overspentCategories = budgetWithSpending.filter(b => b.spent > b.allocated);

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
                    <h3 className="text-xl font-bold text-text-primary">Financial Health Breakdown</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-bg-primary"><CloseIcon className="w-6 h-6 text-text-secondary" /></button>
                </header>

                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    <div className="text-center">
                        <DetailGauge score={scores.healthScore || 0} />
                        <p className="text-sm text-text-secondary mt-2">This score reflects your overall financial well-being.</p>
                    </div>

                    <div className="bg-bg-primary p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <TrendingUpIcon className="w-5 h-5 text-accent-primary" />
                                <h4 className="font-bold text-text-primary">Savings Score</h4>
                            </div>
                            <span className="font-bold text-lg text-accent-primary">{scores.savingsScore}/100</span>
                        </div>
                        <ScoreProgressBar score={scores.savingsScore} />
                        <p className="text-xs text-text-secondary mt-2">Measures your ability to save money. A higher score means you're saving a healthy portion of your income. (50% weight)</p>
                    </div>

                    <div className="bg-bg-primary p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <TrendingDownIcon className="w-5 h-5 text-yellow-400" />
                                <h4 className="font-bold text-text-primary">Budgeting Score</h4>
                            </div>
                            <span className="font-bold text-lg text-yellow-400">{scores.budgetingScore}/100</span>
                        </div>
                        <ScoreProgressBar score={scores.budgetingScore} />
                         <p className="text-xs text-text-secondary mt-2">Measures how well you stick to your budget. A higher score means you're staying on track with your spending plan. (50% weight)</p>
                         {overspentCategories.length > 0 && (
                            <div className="mt-3">
                                <p className="text-xs font-bold text-accent-secondary">Areas to watch:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {overspentCategories.map(c => <span key={c.name} className="text-xs bg-accent-secondary/20 text-accent-secondary px-2 py-0.5 rounded-full">{c.name}</span>)}
                                </div>
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialHealthDetailsModal;
