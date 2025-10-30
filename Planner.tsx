import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import BudgetPieChart from './charts/BudgetPieChart';
import { generateBudget } from '../services/geminiService';
import type { BudgetCategory, Theme, RecurringPayment, Transaction } from '../types';
import { SparklesIcon, PlusIcon, TrashIcon, PencilIcon, PlannerIcon, ClipboardListIcon } from '../constants';
import SubscriptionsAndBills from './SubscriptionsAndBills';

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
    accentColorHex: string;
    budget: BudgetCategory[];
    setBudget: React.Dispatch<React.SetStateAction<BudgetCategory[]>>;
    isBudgetCarryoverEnabled: boolean;
    recurringPayments: RecurringPayment[];
    setRecurringPayments: React.Dispatch<React.SetStateAction<RecurringPayment[]>>;
    transactions: Transaction[];
    expenseCategories: string[];
}

const Planner: React.FC<PlannerProps> = ({ 
    currencySymbol, 
    theme, 
    accentColorHex, 
    budget, 
    setBudget, 
    isBudgetCarryoverEnabled,
    recurringPayments,
    setRecurringPayments,
    transactions,
    expenseCategories
}) => {
  const [activeView, setActiveView] = useState<'budget' | 'bills'>('budget');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // AI Modal State
  const [income, setIncome] = useState('');
  const [fixedCosts, setFixedCosts] = useState('');

  // Edit Modal State
  const [categoryName, setCategoryName] = useState('');
  const [categoryAllocated, setCategoryAllocated] = useState('');

  const handleOpenEditModal = (category: BudgetCategory | null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setCategoryAllocated(category ? String(category.allocated) : '');
    setIsEditModalOpen(true);
  };

  const handleSaveCategory = () => {
    const allocated = parseFloat(categoryAllocated);
    if (categoryName && !isNaN(allocated) && allocated > 0) {
      if (editingCategory) {
        // Update existing
        setBudget(budget.map(cat => cat.name === editingCategory.name ? { ...cat, name: categoryName, allocated } : cat));
      } else {
        // Add new
        setBudget([...budget, { name: categoryName, allocated, spent: 0 }]);
      }
      setIsEditModalOpen(false);
    }
  };
  
  const handleDeleteCategory = (categoryNameToDelete: string) => {
    setBudget(budget.filter(cat => cat.name !== categoryNameToDelete));
  }

  const handleGenerateWithAI = async () => {
    const incomeNum = parseFloat(income);
    const fixedCostsNum = parseFloat(fixedCosts);

    if (isNaN(incomeNum) || isNaN(fixedCostsNum) || incomeNum <= 0 || fixedCostsNum < 0) {
      alert("Please enter valid numbers for income and fixed costs.");
      return;
    }
    
    setIsLoading(true);
    try {
      const newBudgetItems = await generateBudget(incomeNum, fixedCostsNum, currencySymbol);
      // Add 'spent' property to the AI-generated budget
      const budgetWithSpent = newBudgetItems.map(item => ({ ...item, spent: item.name === 'Fixed Costs' ? fixedCostsNum : 0 }));
      setBudget(budgetWithSpent);
      setIsAiModalOpen(false);
      setIncome('');
      setFixedCosts('');
    } catch(e) {
        console.error("Error generating budget with AI:", e);
        alert(e.message);
    } finally {
        setIsLoading(false);
    }
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
                            <input type="number" placeholder="e.g., 50000" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary">Your Fixed Monthly Costs (Rent, EMIs)</label>
                            <input type="number" placeholder="e.g., 20000" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
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
        <BudgetPieChart data={budget} currencySymbol={currencySymbol} theme={theme} accentColorHex={accentColorHex} />
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
                <button onClick={() => setActiveView('budget')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activeView === 'budget' ? 'bg-accent-primary text-accent-text' : 'text-text-secondary'}`}>
                    <PlannerIcon className="w-5 h-5" /> Budget Categories
                </button>
                <button onClick={() => setActiveView('bills')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activeView === 'bills' ? 'bg-accent-primary text-accent-text' : 'text-text-secondary'}`}>
                    <ClipboardListIcon className="w-5 h-5" /> Subscriptions & Bills
                </button>
            </div>
        </Card>

        {activeView === 'budget' ? renderBudgetView() : (
            <SubscriptionsAndBills
                currencySymbol={currencySymbol}
                recurringPayments={recurringPayments}
                setRecurringPayments={setRecurringPayments}
                transactions={transactions}
                expenseCategories={expenseCategories}
            />
        )}
    </div>
  );
};

export default Planner;