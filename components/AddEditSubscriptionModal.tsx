import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import ToggleButton from './ui/ToggleButton';
import type { RecurringPayment } from '../types';
import { formatDateForPicker } from '../services/dateUtils';

interface AddEditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: Omit<RecurringPayment, 'id' | 'user_id'>) => Promise<void>;
  payment: RecurringPayment | null;
  expenseCategories: string[];
  currencySymbol: string;
}

const AddEditSubscriptionModal: React.FC<AddEditSubscriptionModalProps> = ({ 
    isOpen, onClose, onSave, payment, expenseCategories, currencySymbol 
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isVariable, setIsVariable] = useState(false);
  const [category, setCategory] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [nextDueDate, setNextDueDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setName(payment?.name || '');
        setAmount(payment?.amount ? String(payment.amount) : '');
        setIsVariable(payment?.isVariable || false);
        setCategory(payment?.category || expenseCategories[0] || '');
        setBillingCycle(payment?.billingCycle || 'monthly');
        setNextDueDate(payment?.nextDueDate ? formatDateForPicker(payment.nextDueDate) : formatDateForPicker(new Date().toISOString()));
        setIsSaving(false);
    }
  }, [payment, isOpen, expenseCategories]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const paymentAmount = parseFloat(amount);
    if (paymentAmount > 0 && name && category && nextDueDate) {
      setIsSaving(true);
      await onSave({
        name,
        amount: paymentAmount,
        isVariable,
        category,
        billingCycle,
        nextDueDate: new Date(nextDueDate).toISOString(),
        isActive: true, // Always active on save/create
      });
      setIsSaving(false);
    } else {
      alert('Please fill all fields correctly.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <Card className="w-full max-w-md">
        <h3 className="text-lg font-bold text-text-primary mb-4">{payment ? 'Edit' : 'Add'} Subscription or Bill</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary">Name</label>
            <input type="text" placeholder="e.g., Netflix, Electricity Bill" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Amount ({currencySymbol})</label>
            <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
          </div>
          <div>
            <ToggleButton label="Variable Amount (Estimate)" enabled={isVariable} onClick={() => setIsVariable(!isVariable)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-text-secondary">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary appearance-none">
                {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
             <div>
                <label className="text-sm text-text-secondary">Billing Cycle</label>
                <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value as any)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary appearance-none">
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Next Due Date</label>
            <input type="date" value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <Button onClick={onClose} variant="secondary" className="w-full" disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} className="w-full" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddEditSubscriptionModal;