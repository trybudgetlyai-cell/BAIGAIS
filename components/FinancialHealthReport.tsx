import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { SparklesIcon } from '../constants';
import type { Transaction, BudgetCategory } from '../types';
import { generateFinancialHealthReport, FinancialHealthReport as ReportData } from '../services/geminiService';
import { useToast } from '../contexts/ToastContext';

interface FinancialHealthReportProps {
    onBack: () => void;
    transactions: Transaction[];
    budget: BudgetCategory[];
    financialSummary: {
        income: number;
        expenses: number;
    };
    currencySymbol: string;
}

const ReportGauge: React.FC<{ score: number }> = ({ score }) => {
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

const FinancialHealthReport: React.FC<FinancialHealthReportProps> = ({ onBack, transactions, budget, financialSummary, currencySymbol }) => {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<ReportData | null>(null);

    const handleGenerateReport = async () => {
        setIsLoading(true);
        setReport(null);
        try {
            const result = await generateFinancialHealthReport(transactions, budget, financialSummary.income, financialSummary.expenses, currencySymbol);
            setReport(result);
        } catch (e) {
            addToast(e.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-4">
            {!report && (
                 <Card className="text-center p-8">
                    <h3 className="text-lg font-bold text-text-primary">Ready for your check-up?</h3>
                    <p className="text-text-secondary my-4">Get a comprehensive, AI-powered analysis of your financial health, including a financial score, spending habits, and personalized tips for improvement.</p>
                    <Button onClick={handleGenerateReport} disabled={isLoading} className="w-full max-w-xs mx-auto">
                        {isLoading ? 'Analyzing your finances...' : <><SparklesIcon className="w-5 h-5"/> Generate My Report</>}
                    </Button>
                </Card>
            )}

            {isLoading && (
                 <Card>
                    <div className="flex justify-center items-center p-8">
                        <div className="flex flex-col items-center gap-2">
                             <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent-primary"></div>
                            <p className="text-text-secondary mt-4">Generating your report...</p>
                        </div>
                    </div>
                 </Card>
            )}

            {report && (
                <div className="space-y-4">
                    <Card className="text-center">
                        <h3 className="text-lg font-bold text-text-primary">Overall Financial Score</h3>
                        <div className="my-4">
                           <ReportGauge score={report.overallScore} />
                        </div>
                        <p className="text-text-secondary italic">"{report.scoreRationale}"</p>
                    </Card>

                    <Card>
                        <h4 className="font-bold text-text-primary mb-2">Spending Analysis</h4>
                        <p className="text-sm text-text-secondary mb-2">{report.spendingAnalysis.summary}</p>
                        <div className="bg-bg-primary p-3 rounded-lg">
                            <p className="text-xs text-text-secondary">Top Category:</p>
                            <p className="font-semibold text-text-primary">{report.spendingAnalysis.topSpendingCategory}</p>
                            <p className="text-xs text-text-secondary mt-2">💡 Tip:</p>
                            <p className="text-sm text-text-primary">{report.spendingAnalysis.potentialSavings}</p>
                        </div>
                    </Card>
                    
                     <Card>
                        <h4 className="font-bold text-text-primary mb-2">Budget Adherence</h4>
                        <p className="text-sm text-text-secondary">{report.budgetAdherence.summary}</p>
                        {report.budgetAdherence.overspentCategories.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs text-accent-secondary font-bold">Overspent:</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {report.budgetAdherence.overspentCategories.map(cat => (
                                        <span key={cat} className="text-xs bg-accent-secondary/20 text-accent-secondary px-2 py-1 rounded-full">{cat}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {report.budgetAdherence.underspentCategories.length > 0 && (
                             <div className="mt-2">
                                <p className="text-xs text-green-400 font-bold">Underspent:</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {report.budgetAdherence.underspentCategories.map(cat => (
                                        <span key={cat} className="text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded-full">{cat}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card>
                        <h4 className="font-bold text-text-primary mb-2">Savings Performance</h4>
                        <p className="text-sm text-text-secondary mb-2">{report.savingsPerformance.summary}</p>
                         <div className="bg-bg-primary p-3 rounded-lg">
                            <p className="text-xs text-text-secondary">Current Savings Rate:</p>
                            <p className="font-semibold text-accent-primary text-lg">{report.savingsPerformance.savingsRate.toFixed(2)}%</p>
                            <p className="text-xs text-text-secondary mt-2">💡 Recommendation:</p>
                            <p className="text-sm text-text-primary">{report.savingsPerformance.recommendation}</p>
                        </div>
                    </Card>
                     <Button onClick={handleGenerateReport} variant="secondary" disabled={isLoading} className="w-full">
                        {isLoading ? 'Re-analyzing...' : 'Regenerate Report'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FinancialHealthReport;