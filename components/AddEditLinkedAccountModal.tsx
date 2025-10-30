import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import type { LinkedAccount } from '../types';

interface AddEditLinkedAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountData: Omit<LinkedAccount, 'id'>) => void;
  account: LinkedAccount | null;
}

const AddEditLinkedAccountModal: React.FC<AddEditLinkedAccountModalProps> = ({ isOpen, onClose, onSave, account }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<LinkedAccount['type']>('Bank');
  const [last4, setLast4] = useState('');

  useEffect(() => {
    if (isOpen) {
        setName(account?.name || '');
        setType(account?.type || 'Bank');
        setLast4(account?.last4 || '');
    }
  }, [account, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim() && last4.trim().length === 4 && /^\d{4}$/.test(last4.trim())) {
      onSave({ name, type, last4 });
    } else {
      alert('Please fill all fields correctly. Last 4 digits must be a 4-digit number.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start z-50 p-4 pt-20">
      <Card className="w-full max-w-md">
        <h3 className="text-lg font-bold text-text-primary mb-4">{account ? 'Edit' : 'Add'} Linked Account</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary">Account Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. ICICI Savings" className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-text-secondary">Account Type</label>
                <select name="type" value={type} onChange={(e) => setType(e.target.value as LinkedAccount['type'])} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary appearance-none">
                    <option value="Bank">Bank</option>
                    <option value="Credit Card">Credit Card</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Last 4 Digits</label>
                <input type="number" value={last4} onChange={(e) => setLast4(e.target.value)} placeholder="1234" maxLength={4} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
              </div>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Button onClick={onClose} variant="secondary" className="w-full">Cancel</Button>
          <Button onClick={handleSave} className="w-full">Save</Button>
        </div>
      </Card>
    </div>
  );
};

export default AddEditLinkedAccountModal;