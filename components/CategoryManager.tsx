import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import CategoryModal from './CategoryModal';
import { PencilIcon, TrashIcon, PlusIcon, ChevronDownIcon } from '../constants';
import type { Category } from '../types';
import { supabase } from '../App';
import { useToast } from '../contexts/ToastContext';

interface CategoryManagerProps {
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    userId: string;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, setCategories, userId }) => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [parentCategory, setParentCategory] = useState<Category | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const { incomeCategories, expenseCategories } = useMemo(() => {
        // FIX: Explicitly type `categoryMap` to resolve type inference issues with `subCategories`.
        const income: (Category & { subCategories: Category[] })[] = [];
        const expense: (Category & { subCategories: Category[] })[] = [];
        const categoryMap = new Map<string, Category & { subCategories: Category[] }>(categories.map(c => [c.id, { ...c, subCategories: [] as Category[] }]));
        
        for (const category of categories) {
            if (category.parent_id) {
                categoryMap.get(category.parent_id)?.subCategories.push(category);
            } else {
                if (category.type === 'income') income.push(categoryMap.get(category.id)!);
                else expense.push(categoryMap.get(category.id)!);
            }
        }
        return { incomeCategories: income, expenseCategories: expense };
    }, [categories]);

    const handleOpenModal = (editing: Category | null, parent: Category | null) => {
        setEditingCategory(editing);
        setParentCategory(parent);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setParentCategory(null);
    };

    const handleSaveCategory = async (name: string, type: 'income' | 'expense', parentId: string | null) => {
        if (editingCategory) { // Update
            const { data, error } = await supabase.from('categories').update({ name }).eq('id', editingCategory.id).select().single();
            if (error) { addToast(`Error: ${error.message}`, 'error'); }
            else {
                setCategories(prev => prev.map(c => c.id === editingCategory.id ? data as Category : c));
                addToast('Category updated!');
            }
        } else { // Insert
            const { data, error } = await supabase.from('categories').insert({ name, type, parent_id: parentId, user_id: userId }).select().single();
            if (error) { addToast(`Error: ${error.message}`, 'error'); }
            else {
                setCategories(prev => [...prev, data as Category]);
                addToast('Category added!');
            }
        }
        handleCloseModal();
    };

    const handleDeleteCategory = async (id: string) => {
        if (window.confirm(`Are you sure you want to delete this category? All its sub-categories will also be deleted.`)) {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) { addToast(`Error: ${error.message}`, 'error'); }
            else {
                setCategories(prev => prev.filter(c => c.id !== id && c.parent_id !== id));
                addToast('Category deleted.', 'info');
            }
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const renderIncomeView = () => (
        <div>
            <div className="grid grid-cols-3 gap-4">
                {incomeCategories.map(parent => (
                    <Card key={parent.id} className="aspect-square flex flex-col items-center justify-center text-center p-2 relative group cursor-pointer transition-all hover:bg-bg-primary">
                        <p className="font-semibold text-text-primary px-2 break-words">{parent.name}</p>
                        
                        <div className="absolute top-1 right-1 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(parent, null)} className="text-text-secondary hover:text-accent-primary bg-bg-primary hover:bg-bg-secondary p-1 rounded-full shadow-md" aria-label={`Edit ${parent.name}`}>
                                <PencilIcon className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteCategory(parent.id)} className="text-text-secondary hover:text-accent-secondary bg-bg-primary hover:bg-bg-secondary p-1 rounded-full shadow-md" aria-label={`Delete ${parent.name}`}>
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
    
            <button
                onClick={() => handleOpenModal(null, null)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-accent-primary text-accent-text rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-90 transition-transform transform hover:scale-110 duration-300 z-50"
                aria-label="Add new income category"
            >
                <PlusIcon className="w-8 h-8" />
            </button>
        </div>
    );
    
    const renderExpenseView = () => (
         <div className="space-y-2">
            {expenseCategories.map(parent => (
                <div key={parent.id} className="bg-bg-primary rounded-lg">
                    <div className="flex justify-between items-center p-3">
                        <div className="flex items-center gap-2">
                            <button onClick={() => toggleExpand(parent.id)} className="p-1">
                                <ChevronDownIcon className={`w-5 h-5 text-text-secondary transition-transform ${expandedCategories.has(parent.id) ? 'rotate-180' : ''}`} />
                            </button>
                            <p className="font-semibold text-text-primary">{parent.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => handleOpenModal(null, parent)} className="text-text-secondary hover:text-accent-primary" title="Add sub-category"><PlusIcon className="w-5 h-5" /></button>
                            <button onClick={() => handleOpenModal(parent, null)} className="text-text-secondary hover:text-accent-primary"><PencilIcon className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteCategory(parent.id)} className="text-text-secondary hover:text-accent-secondary"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </div>
                    {expandedCategories.has(parent.id) && (
                        <div className="pl-10 pr-3 pb-3 space-y-2">
                            {parent.subCategories?.map(child => (
                                <div key={child.id} className="flex justify-between items-center bg-bg-secondary p-2 rounded-md">
                                    <p className="text-text-secondary">{child.name}</p>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleOpenModal(child, parent)} className="text-text-secondary hover:text-accent-primary"><PencilIcon className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteCategory(child.id)} className="text-text-secondary hover:text-accent-secondary"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                             {parent.subCategories?.length === 0 && <p className="text-xs text-text-secondary text-center py-2">No sub-categories yet.</p>}
                        </div>
                    )}
                </div>
            ))}
            <Button onClick={() => handleOpenModal(null, null)} variant="secondary" className="w-full mt-4">
                <PlusIcon className="w-5 h-5" /> Add New Expense Category
            </Button>
        </div>
    );

    return (
        <Card>
            <div className="flex bg-bg-primary rounded-lg p-1 mb-4">
                <button onClick={() => setActiveTab('income')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'income' ? 'bg-accent-primary text-accent-text' : 'text-text-secondary'}`}>Income</button>
                <button onClick={() => setActiveTab('expense')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'expense' ? 'bg-accent-primary text-accent-text' : 'text-text-secondary'}`}>Expense</button>
            </div>
            
            {activeTab === 'income' ? renderIncomeView() : renderExpenseView()}

            <CategoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCategory}
                editingCategory={editingCategory}
                parentCategory={parentCategory}
                type={activeTab}
            />
        </Card>
    );
};

export default CategoryManager;