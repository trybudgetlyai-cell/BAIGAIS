import React, { useState, useEffect, useMemo, useRef } from 'react';
import Button from './ui/Button';
import type { Transaction, DefaultPreferences, Category } from '../types';
import { CalendarIcon, ClockIcon, ClipboardListIcon, CreditCardIcon, PencilIcon, TagIcon, PaperclipIcon, SaveIcon } from '../constants';
import BottomSheetSelector from './ui/BottomSheetSelector';

interface AddTransactionViewProps {
  onBack: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  transactionType: 'income' | 'expense';
  categories: Category[];
  accounts: string[];
  defaultPreferences: DefaultPreferences;
  allTags: string[];
  currencySymbol: string;
}

const AddTransactionView: React.FC<AddTransactionViewProps> = ({ 
    onBack, onSave, transactionType, categories, accounts, defaultPreferences, allTags, currencySymbol 
}) => {
  const [type, setType] = useState(transactionType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [account, setAccount] = useState('');
  const [tags, setTags] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false);
  const [isAccountSelectorOpen, setIsAccountSelectorOpen] = useState(false);

  const { incomeCategories, expenseCategories, categoryMap } = useMemo(() => {
    const income: (Category & { subCategories: Category[] })[] = [];
    const expense: (Category & { subCategories: Category[] })[] = [];
    const catMap = new Map<string, Category & { subCategories: Category[] }>(categories.map(c => [c.id, { ...c, subCategories: [] as Category[] }]));
    
    for (const cat of categories) {
        if (cat.parent_id) {
            catMap.get(cat.parent_id)?.subCategories.push(cat);
        } else {
            if (cat.type === 'income') income.push(catMap.get(cat.id)!);
            else expense.push(catMap.get(cat.id)!);
        }
    }
    return { incomeCategories: income, expenseCategories: expense, categoryMap: new Map(categories.map(c => [c.id, c])) };
  }, [categories]);
  
  const categoryOptions = useMemo(() => {
    const categoriesToRender = type === 'income' ? incomeCategories : expenseCategories;
    return categoriesToRender.map(parent => ({
        label: parent.name,
        children: parent.subCategories.map(child => ({ id: child.id, name: child.name }))
    }));
  }, [type, incomeCategories, expenseCategories]);
  
  const getCategoryName = (id: string): string => {
      const category = categoryMap.get(id);
      if (!category) return "Select Category";
      if (category.parent_id) {
          const parent = categoryMap.get(category.parent_id);
          return parent ? `${parent.name} / ${category.name}` : category.name;
      }
      return category.name; // This case might not be ideal, as it's a parent.
  };

  useEffect(() => {
    setType(transactionType);
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime(new Date().toTimeString().slice(0, 5));
    setCategory(transactionType === 'income' ? (incomeCategories[0]?.subCategories?.[0]?.id || '') : (expenseCategories[0]?.subCategories?.[0]?.id || ''));
    setAccount(defaultPreferences.account || accounts[0] || '');
    setTags('');
    setAttachment(null);
  }, [transactionType, incomeCategories, expenseCategories, accounts, defaultPreferences]);
  
  useEffect(() => {
    // Reset category when type changes
    if (type === 'income') {
        setCategory(incomeCategories[0]?.subCategories?.[0]?.id || '');
    } else {
        setCategory(expenseCategories[0]?.subCategories?.[0]?.id || '');
    }
  }, [type, incomeCategories, expenseCategories]);


  const handleSave = () => {
    const transactionAmount = parseFloat(amount);
    if (transactionAmount > 0 && description && category && date && account) {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const combinedDateTime = new Date(`${date}T${time || '00:00:00'}`).toISOString();

      onSave({
        date: combinedDateTime,
        description,
        amount: transactionAmount,
        category,
        type,
        account,
        tags: tagArray,
      });
      // Note: Attachment handling would require backend logic. For now, it's a UI feature.
    } else {
      alert('Please fill all required fields correctly (Amount, Note, Category, Date, Account).');
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          setAttachment(file);
      }
  };
  
  const FormRow: React.FC<{ icon: React.ReactNode; children: React.ReactNode; }> = ({ icon, children }) => (
    <div className="flex items-center gap-4 bg-bg-secondary p-3 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-accent-primary">
      <div className="text-accent-primary">{icon}</div>
      <div className="flex-grow">{children}</div>
    </div>
  );

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6 pb-24">
          <div className="flex bg-bg-secondary rounded-full p-1">
            <button type="button" onClick={() => setType('income')} className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${type === 'income' ? 'bg-accent-primary text-accent-text' : 'text-text-primary'}`}>Income</button>
            <button type="button" onClick={() => setType('expense')} className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${type === 'expense' ? 'bg-accent-secondary text-accent-text' : 'text-text-primary'}`}>Expense</button>
          </div>
          
          <div className="bg-bg-secondary p-4 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-accent-primary text-center">
              <label htmlFor="amount" className="text-sm text-text-secondary">{type === 'income' ? 'Income Amount' : 'Expense Amount'}</label>
              <div className="flex justify-center items-center mt-1">
                  <span className="text-3xl font-bold text-text-primary mr-1">{currencySymbol}</span>
                  <input 
                      type="number"
                      id="amount"
                      placeholder="0.00" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)} 
                      className="flex-1 min-w-0 bg-transparent p-0 border-none text-5xl font-bold text-text-primary text-center focus:ring-0 focus:outline-none"
                      required
                  />
              </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="text-sm text-text-secondary mb-1 ml-1 block">Date</label>
                  <FormRow icon={<CalendarIcon className="w-6 h-6" />}>
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent p-0 border-none text-text-primary focus:ring-0 focus:outline-none" required />
                  </FormRow>
              </div>
              <div>
                  <label className="text-sm text-text-secondary mb-1 ml-1 block">Time</label>
                  <FormRow icon={<ClockIcon className="w-6 h-6" />}>
                      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-transparent p-0 border-none text-text-primary focus:ring-0 focus:outline-none" required />
                  </FormRow>
              </div>
          </div>
          
          <div className="space-y-4">
              <div>
                  <label className="text-sm text-text-secondary mb-1 ml-1 block">Category</label>
                  <FormRow icon={<ClipboardListIcon className="w-6 h-6" />}>
                       <button 
                          type="button" 
                          onClick={() => setIsCategorySelectorOpen(true)} 
                          className="w-full bg-transparent p-0 border-none text-text-primary text-left truncate"
                      >
                          {getCategoryName(category)}
                      </button>
                  </FormRow>
              </div>
              <div>
                  <label className="text-sm text-text-secondary mb-1 ml-1 block">Account</label>
                  <FormRow icon={<CreditCardIcon className="w-6 h-6" />}>
                      <button 
                          type="button" 
                          onClick={() => setIsAccountSelectorOpen(true)} 
                          className="w-full bg-transparent p-0 border-none text-text-primary text-left"
                      >
                          {account || 'Select Account'}
                      </button>
                  </FormRow>
              </div>
          </div>

          <div>
              <h3 className="text-md font-bold text-text-secondary mb-2 ml-1">Other Details</h3>
              <div className="space-y-4">
                  <FormRow icon={<PencilIcon className="w-6 h-6" />}>
                      <input type="text" placeholder="Write a note..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-transparent p-0 border-none text-text-primary focus:ring-0 focus:outline-none" required />
                  </FormRow>
                  <FormRow icon={<TagIcon className="w-6 h-6" />}>
                      <input type="text" placeholder="Tags (e.g., vacation, work)" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full bg-transparent p-0 border-none text-text-primary focus:ring-0 focus:outline-none" />
                  </FormRow>
                  <FormRow icon={<PaperclipIcon className="w-6 h-6" />}>
                      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="text-text-primary w-full text-left">
                          {attachment ? attachment.name : 'Attach a file'}
                      </button>
                  </FormRow>
              </div>
          </div>
          
          <button
            type="submit"
            aria-label="Save Transaction"
            className="fixed bottom-6 right-6 w-16 h-16 bg-accent-primary rounded-full shadow-lg flex items-center justify-center text-accent-text hover:bg-opacity-90 transition-transform transform hover:scale-110 duration-300 z-50"
          >
              <SaveIcon className="w-8 h-8" />
          </button>
        </form>

        <BottomSheetSelector
            isOpen={isCategorySelectorOpen}
            onClose={() => setIsCategorySelectorOpen(false)}
            title="Select Category"
            options={categoryOptions}
            onSelect={(value) => {
                setCategory(value);
                setIsCategorySelectorOpen(false);
            }}
            selectedValue={category}
        />
        
        <BottomSheetSelector
            isOpen={isAccountSelectorOpen}
            onClose={() => setIsAccountSelectorOpen(false)}
            title="Select Account"
            options={accounts}
            onSelect={(value) => {
                setAccount(value);
                setIsAccountSelectorOpen(false);
            }}
            selectedValue={account}
        />
      </>
  );
};

export default AddTransactionView;