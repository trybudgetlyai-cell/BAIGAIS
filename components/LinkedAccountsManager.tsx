import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useToast } from '../contexts/ToastContext';
import { PlusIcon, PencilIcon, TrashIcon } from '../constants';
import AddEditLinkedAccountModal from './AddEditLinkedAccountModal';
import type { LinkedAccount } from '../types';

interface LinkedAccountsManagerProps {
    accounts: LinkedAccount[];
    setAccounts: React.Dispatch<React.SetStateAction<LinkedAccount[]>>;
    onBack: () => void;
}

const LinkedAccountsManager: React.FC<LinkedAccountsManagerProps> = ({ accounts, setAccounts, onBack }) => {
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<LinkedAccount | null>(null);

    const handleOpenModal = (account: LinkedAccount | null) => {
        setEditingAccount(account);
        setIsModalOpen(true);
    };

    const handleSaveAccount = (accountData: Omit<LinkedAccount, 'id'>) => {
        if (editingAccount) {
            setAccounts(prev => prev.map(a => a.id === editingAccount.id ? { ...editingAccount, ...accountData } : a));
            addToast('Linked account updated!');
        } else {
            const newAccount: LinkedAccount = { id: `acc${Date.now()}`, ...accountData };
            setAccounts(prev => [...prev, newAccount]);
            addToast('Linked account added!');
        }
        setIsModalOpen(false);
    };

    const handleRemoveAccount = (id: string) => {
        setAccounts(prev => prev.filter(acc => acc.id !== id));
        addToast('Linked account removed.', 'info');
    };

    return (
        <div className="space-y-4">
            <Card>
                <div className="space-y-2">
                    {accounts.map(acc => (
                         <div key={acc.id} className="flex justify-between items-center bg-bg-primary p-3 rounded-md">
                            <div>
                                <p className="font-semibold text-text-primary">{acc.name} <span className="text-xs font-normal text-text-secondary">({acc.type})</span></p>
                                <p className="text-sm text-text-secondary">**** **** **** {acc.last4}</p>
                            </div>
                             <div className="flex items-center gap-2">
                                <button onClick={() => handleOpenModal(acc)} className="text-text-secondary hover:text-accent-primary p-1 rounded-full">
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleRemoveAccount(acc.id)} className="text-accent-secondary hover:text-red-500 transition-colors p-1 rounded-full">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <Button onClick={() => handleOpenModal(null)} variant="secondary" className="w-full">
                        <PlusIcon className="w-5 h-5"/> Add Account
                    </Button>
                </div>
            </Card>

            <AddEditLinkedAccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAccount}
                account={editingAccount}
            />
        </div>
    );
};

export default LinkedAccountsManager;