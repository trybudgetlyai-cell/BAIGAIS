import React, { useState, useEffect, useMemo } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import type { Transaction, Category } from '../types';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  transaction: Transaction | null;
  categories: Category[];
  accounts: string[];
  allTags: string[];
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ isOpen, onClose, onSave, transaction, categories, accounts, allTags }) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [account, setAccount] = useState('');
  const [tags, setTags] = useState('');
  
  const { incomeCategories, expenseCategories, categoryMap } = useMemo(() => {
    // FIX: Explicitly type `map` to resolve type inference issues with `subCategories`.
    const income: (Category & { subCategories: Category[] })[] = [];
    const expense: (Category & { subCategories: Category[] })[] = [];
    const map = new Map<string, Category & { subCategories: Category[] }>(categories.map(c => [c.id, { ...c, subCategories: [] as Category[] }]));
    
    for (const cat of categories) {
        if (cat.parent_id) {
            map.get(cat.parent_id)?.subCategories.push(cat);
        } else {
            if (cat.type === 'income') income.push(map.get(cat.id)!);
            else expense.push(map.get(cat.id)!);
        }
    }
    return { incomeCategories: income, expenseCategories: expense, categoryMap: new Map(categories.map(c => [c.id, c])) };
  }, [categories]);

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(String(transaction.amount));
      setDescription(transaction.description);
      setCategory(transaction.category); // This is an ID
      setDate(new Date(transaction.date).toISOString().split('T')[0]);
      setAccount(transaction.account);
      setTags(transaction.tags?.join(', ') || '');
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSave = () => {
    const transactionAmount = parseFloat(amount);
    if (transactionAmount > 0 && description && category && date && account) {
       const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      onSave({
        id: transaction.id,
        date: new Date(date).toISOString(),
        description,
        amount: transactionAmount,
        category, // This is a category ID
        type,
        account,
        tags: tagArray,
      });
    } else {
      alert('Please fill all fields correctly.');
    }
  };
  
  const handleTypeChange = (newType: 'income' | 'expense') => {
      setType(newType);
      if (newType === 'income') {
          setCategory(incomeCategories[0]?.subCategories?.[0]?.id || '');
      } else {
          setCategory(expenseCategories[0]?.subCategories?.[0]?.id || '');
      }
  }

  const renderCategoryOptions = () => {
    const categoriesToRender = type === 'income' ? incomeCategories : expenseCategories;
    return categoriesToRender.map(parent => (
      <optgroup key={parent.id} label={parent.name}>
        {parent.subCategories?.map(child => (
          <option key={child.id} value={child.id}>{child.name}</option>
        ))}
      </optgroup>
    ));
  };

  const getCategoryName = (id: string) => {
    const cat = categoryMap.get(id);
    if (!cat) return 'Unknown';
    if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id);
        return `${parent?.name} > ${cat.name}`;
    }
    return cat.name;
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <Card className="w-full max-w-md">
        <h3 className="text-lg font-bold text-text-primary mb-4">Edit Transaction</h3>
        
        <div className="flex bg-bg-primary rounded-lg p-1 mb-4">
          <button onClick={() => handleTypeChange('income')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${type === 'income' ? 'bg-accent-primary text-accent-text' : 'text-text-secondary'}`}>Income</button>
          <button onClick={() => handleTypeChange('expense')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${type === 'expense' ? 'bg-accent-secondary text-accent-text' : 'text-text-secondary'}`}>Expense</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary">Amount</label>
            <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Description</label>
            <input type="text" placeholder="e.g., Coffee with friends" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-text-secondary">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary appearance-none">
                {renderCategoryOptions()}
                {/* Add a fallback option if the current category isn't in the standard list */}
                {!categories.some(c => c.id === category) && <option key={category} value={category}>{getCategoryName(category)}</option>}
              </select>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Account</label>
              <select value={account} onChange={(e) => setAccount(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary appearance-none">
                {accounts.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                {!accounts.includes(account) && <option key={account} value={account}>{account}</option>}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Tags (optional)</label>
            <input 
              type="text" 
              placeholder="e.g., vacation, work, kids" 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
              className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"
            />
             <p className="text-xs text-text-secondary mt-1">Separate tags with commas.</p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <Button onClick={onClose} variant="secondary" className="w-full">Cancel</Button>
          <Button onClick={handleSave} className="w-full">Save Changes</Button>
        </div>
      </Card>
    </div>
  );
};

export default EditTransactionModal;