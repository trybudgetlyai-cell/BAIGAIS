import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import type { Category } from '../types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, type: 'income' | 'expense', parentId: string | null) => void;
  editingCategory: Category | null;
  parentCategory: Category | null;
  type: 'income' | 'expense';
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave, editingCategory, parentCategory, type }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
        setName(editingCategory?.name || '');
    }
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), type, parentCategory?.id || null);
    } else {
      alert('Category name cannot be empty.');
    }
  };

  const getTitle = () => {
      if (editingCategory) return `Edit "${editingCategory.name}"`;
      if (parentCategory) return `Add Sub-category to "${parentCategory.name}"`;
      return `Add New ${type === 'income' ? 'Income' : 'Expense'} Category`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <Card className="w-full max-w-md">
        <h3 className="text-lg font-bold text-text-primary mb-4">
          {getTitle()}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary">Category Name</label>
            <input 
              type="text" 
              placeholder="e.g., Salary or Groceries" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"
              autoFocus
            />
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

export default CategoryModal;