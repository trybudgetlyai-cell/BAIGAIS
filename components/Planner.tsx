
import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import BudgetPieChart from './charts/BudgetPieChart';
import { generateBudget } from '../services/geminiService';
import type { Achievement, BudgetCategory, Theme, RecurringPayment, Transaction, Category, DefaultPreferences } from '../types';
import { SparklesIcon, PlusIcon, TrashIcon, PencilIcon, PlannerIcon, ClipboardListIcon, CheckCircleIcon, StarIcon } from '../constants';
import SubscriptionsAndBills from './SubscriptionsAndBills';
import { useToast } from '../contexts/ToastContext';
import Goals from './Goals';

const BudgetProgressBar: React.FC<{ current: number; target: number }> = ({ current, target }) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isOverBudget = current > target;
  return (
    <div className="w-full bg-bg-primary rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-accent-secondary' : 'bg-accent-primary'}`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

interface PlannerProps {
    currencySymbol: string;
    theme: Theme;
    pieChartPalette: string[];
    budget: BudgetCategory[];
    onUpdateBudget: (newBudget: BudgetCategory[]) => void;
    isBudgetCarryoverEnabled: boolean;
    recurringPayments: RecurringPayment[];
    transactions: Transaction[];
    categories: Category[];
    defaultPreferences: DefaultPreferences;
    onSaveRecurringPayment: (payment: Omit<RecurringPayment, 'id'>) => Promise<boolean>;
    onUpdateRecurringPayment: (payment: RecurringPayment) => Promise<void>;
    onDeleteRecurringPayment: (id: string) => Promise<void>;
    onSaveTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    achievements: Achievement[];
}

const Planner: React.FC<PlannerProps> = ({ 
    currencySymbol, 
    theme, 
    pieChartPalette, 
    budget, 
    onUpdateBudget,
    isBudgetCarryoverEnabled,
    recurringPayments,
    transactions,
    categories,
    defaultPreferences,
    onSaveRecurringPayment,
    onUpdateRecurringPayment,
    onDeleteRecurringPayment,
    onSaveTransaction,
    achievements,
}) => {
  const { addToast } = useToast();
  const [activePlannerView, setActivePlannerView] = useState<'budget' | 'bills' | 'goals'>('budget');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // AI Modal State
  const [income, setIncome] = useState('');

  // Edit Modal State
  const [categoryName, setCategoryName] = useState('');
  const [categoryAllocated, setCategoryAllocated] = useState('');
  
  const expenseCategories = useMemo(() => categories.filter(c => c.type === 'expense' && !c.parent_id), [categories]);
  const expenseCategoryNames = useMemo(() => expenseCategories.map(c => c.name), [expenseCategories]);

  const monthlyRecurringCosts = useMemo(() => {
    return recurringPayments.reduce((total, p) => {
        switch (p.billingCycle) {
            case 'monthly': return total + p.amount;
            case 'quarterly': return total + (p.amount / 3);
            case 'annually': return total + (p.amount / 12);
            default: return total;
        }
    }, 0);
  }, [recurringPayments]);


  const handleOpenEditModal = (category: BudgetCategory | null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setCategoryAllocated(category ? String(category.allocated) : '');
    setIsEditModalOpen(true);
  };

  const handleSaveCategory = () => {
    const allocated = parseFloat(categoryAllocated);
    if (categoryName && !isNaN(allocated) && allocated > 0) {
      let newBudget;
      if (editingCategory) {
        newBudget = budget.map(cat => cat.name === editingCategory.name ? { ...cat, name: categoryName, allocated } : cat);
      } else {
        newBudget = [...budget, { name: categoryName, allocated, spent: 0 }];
      }
      onUpdateBudget(newBudget);
      setIsEditModalOpen(false);
    }
  };
  
  const handleDeleteCategory = (categoryNameToDelete: string) => {
    const newBudget = budget.filter(cat => cat.name !== categoryNameToDelete);
    onUpdateBudget(newBudget);
  }

  const handleGenerateWithAI = async () => {
    const incomeNum = parseFloat(income);
    const fixedCostsNum = Math.round(monthlyRecurringCosts);

    if (isNaN(incomeNum) || incomeNum <= 0) {
      addToast("Please enter a valid number for income.", 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      const newBudgetItems = await generateBudget(incomeNum, fixedCostsNum, currencySymbol);
      const budgetWithSpent = newBudgetItems.map(item => ({ ...item, spent: item.name === 'Fixed Costs' ? fixedCostsNum : 0 }));
      onUpdateBudget(budgetWithSpent);
      setIsAiModalOpen(false);
      setIncome('');
    } catch(e) {
        console.error("Error generating budget with AI:", e);
        addToast(e.message, 'error');
    } finally {
        setIsLoading(false);
    }
  };

  const getNextDueDate = (payment: RecurringPayment): string => {
    const currentDate = new Date(payment.nextDueDate);
    switch (payment.billingCycle) {
        case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
        case 'quarterly':
            currentDate.setMonth(currentDate.getMonth() + 3);
            break;
        case 'annually':
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            break;
    }
    return currentDate.toISOString();
  };

  const handleMarkBillAsPaid = (payment: RecurringPayment) => {
    const categoryObject = categories.find(c => c.name === payment.category && c.type === 'expense' && !c.parent_id);
    
    if (!categoryObject) {
        addToast(`Could not find a main budget category named "${payment.category}". Please edit the bill and assign it to a valid category.`, 'error');
        return;
    }

    const newTransaction: Omit<Transaction, 'id'> = {
        date: new Date().toISOString(),
        description: `Payment: ${payment.name}`,
        amount: payment.amount,
        category: categoryObject.id,
        type: 'expense',
        account: defaultPreferences.account,
        tags: ['recurring', payment.billingCycle]
    };
    onSaveTransaction(newTransaction);
    
    const updatedPayment: RecurringPayment = {
        ...payment,
        nextDueDate: getNextDueDate(payment),
    };
    onUpdateRecurringPayment(updatedPayment);

    addToast(`${payment.name} marked as paid.`, 'success');
  };
  
  const totalAllocated = budget.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = budget.reduce((sum, cat) => sum + cat.spent, 0);
  const totalCarryover = isBudgetCarryoverEnabled ? budget.reduce((sum, cat) => sum + (cat.carryover || 0), 0) : 0;
  const totalBudget = totalAllocated + totalCarryover;
  
  const renderBudgetView = () => (
    <div className="space-y-6">
        {/* --- AI Budget Builder Modal --- */}
        {isAiModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                <Card className="w-full max-w-md">
                    <h3 className="text-lg font-bold text-text-primary mb-4">Build Budget with AI</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-text-secondary">Your Total Monthly Income</label>
                            <input type="number" placeholder="e.g., 5000" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
                        </div>
                        <div className="bg-bg-primary p-3 rounded-lg text-center">
                            <p className="text-sm text-text-secondary">Your recurring bills will be automatically included as 'Fixed Costs':</p>
                            <p className="text-lg font-bold text-text-primary">{currencySymbol}{monthlyRecurringCosts.toFixed(2)} / month</p>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <Button onClick={() => setIsAiModalOpen(false)} variant="secondary" className="w-full">Cancel</Button>
                        <Button onClick={handleGenerateWithAI} disabled={isLoading} className="w-full">
                            {isLoading ? 'Generating...' : <><SparklesIcon className="w-5 h-5"/> Generate</>}
                        </Button>
                    </div>
                </Card>
            </div>
        )}

        {/* --- Add/Edit Category Modal --- */}
        {isEditModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                <Card className="w-full max-w-md">
                    <h3 className="text-lg font-bold text-text-primary mb-4">{editingCategory ? 'Edit' : 'Add'} Category</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-text-secondary">Category Name</label>
                            <input type="text" placeholder="e.g., Groceries" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary">Allocated Amount ({currencySymbol})</label>
                            <input type="number" placeholder="e.g., 800" value={categoryAllocated} onChange={(e) => setCategoryAllocated(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <Button onClick={() => setIsEditModalOpen(false)} variant="secondary" className="w-full">Cancel</Button>
                        <Button onClick={handleSaveCategory} className="w-full">Save</Button>
                    </div>
                </Card>
            </div>
        )}

      <Card>
        <h3 className="text-lg font-bold text-text-primary mb-2">Budget Overview</h3>
        <p className="text-sm text-text-secondary mb-4">Total Budget: {currencySymbol}{totalBudget.toLocaleString()} | Total Spent: {currencySymbol}{totalSpent.toLocaleString()}</p>
        <BudgetPieChart data={budget} currencySymbol={currencySymbol} theme={theme} palette={pieChartPalette} />
      </Card>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-text-primary">Budget Categories</h3>
        </div>
        <div className="space-y-4">
          {budget.map(category => {
            const categoryCarryover = isBudgetCarryoverEnabled ? (category.carryover || 0) : 0;
            const totalTarget = category.allocated + categoryCarryover;
            const isOverBudget = category.spent > totalTarget;

            const carryoverText = categoryCarryover > 0 
                ? `(+${currencySymbol}${categoryCarryover.toLocaleString()} from last month)`
                : categoryCarryover < 0 
                ? `(${currencySymbol}${Math.abs(categoryCarryover).toLocaleString()} overspent)`
                : '';

            const associatedBills = recurringPayments.filter(p => p.category === category.name);

            return (
                <div key={category.name}>
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-semibold text-text-primary">{category.name}</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs ${isOverBudget ? 'text-accent-secondary' : 'text-text-secondary'}`}>
                            {currencySymbol}{category.spent.toLocaleString()} / {currencySymbol}{totalTarget.toLocaleString()}
                            </span>
                            <button onClick={() => handleOpenEditModal(category)} className="text-text-secondary hover:text-accent-primary"><PencilIcon className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteCategory(category.name)} className="text-text-secondary hover:text-accent-secondary"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <BudgetProgressBar current={category.spent} target={totalTarget} />
                    {isBudgetCarryoverEnabled && carryoverText && (
                        <p className={`text-xs mt-1 ${categoryCarryover > 0 ? 'text-green-400' : 'text-accent-secondary'}`}>
                            {carryoverText}
                        </p>
                    )}
                     {associatedBills.length > 0 && (
                        <div className="mt-2 text-xs text-text-secondary flex flex-wrap gap-x-2 gap-y-1">
                            <span className="font-semibold">Includes:</span>
                            {associatedBills.map(b => (
                                <span key={b.id} className="bg-bg-primary px-1.5 py-0.5 rounded">{b.name}</span>
                            ))}
                        </div>
                    )}
                </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-6">
          <Button onClick={() => handleOpenEditModal(null)} variant="secondary" className="w-full">
            <PlusIcon className="w-5 h-5"/> Add Category
          </Button>
           <Button onClick={() => setIsAiModalOpen(true)} className="w-full">
            <SparklesIcon className="w-5 h-5"/> Build with AI
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
        <Card>
            <div className="flex bg-bg-primary rounded-lg p-1">
                <button onClick={() => setActivePlannerView('budget')} className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activePlannerView === 'budget' ? 'bg-accent-primary text-accent-text' : 'text-text-secondary'}`}>
                    <PlannerIcon className="w-5 h-5" /> Budget
                </button>
                <button onClick={() => setActivePlannerView('bills')} className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activePlannerView === 'bills' ? 'bg-accent-primary text-accent-text' : 'text-text-secondary'}`}>
                    <ClipboardListIcon className="w-5 h-5" /> Bills
                </button>
                <button onClick={() => setActivePlannerView('goals')} className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activePlannerView === 'goals' ? 'bg-accent-primary text-accent-text' : 'text-text-secondary'}`}>
                    <StarIcon className="w-5 h-5" /> Goals
                </button>
            </div>
        </Card>

        {activePlannerView === 'budget' && renderBudgetView()}
        {activePlannerView === 'bills' && (
            <SubscriptionsAndBills
                currencySymbol={currencySymbol}
                recurringPayments={recurringPayments}
                transactions={transactions}
                expenseCategories={expenseCategoryNames}
                onSavePayment={onSaveRecurringPayment}
                onUpdatePayment={onUpdateRecurringPayment}
                onDeletePayment={onDeleteRecurringPayment}
                onMarkBillAsPaid={handleMarkBillAsPaid}
            />
        )}
        {activePlannerView === 'goals' && <Goals currencySymbol={currencySymbol} theme={theme} achievements={achievements} />}
    </div>
  );
};

export default Planner;
