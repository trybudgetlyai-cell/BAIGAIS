import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useToast } from '../contexts/ToastContext';
import { PlusIcon, PencilIcon, TrashIcon } from '../constants';
import AddEditFamilyMemberModal from './AddEditFamilyMemberModal';
import type { FamilyMember } from '../types';

interface FamilyMembersManagerProps {
    members: FamilyMember[];
    setMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
    onBack: () => void;
}

const FamilyMembersManager: React.FC<FamilyMembersManagerProps> = ({ members, setMembers, onBack }) => {
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

    const handleOpenModal = (member: FamilyMember | null) => {
        setEditingMember(member);
        setIsModalOpen(true);
    };

    const handleSaveMember = (memberData: Omit<FamilyMember, 'id'>) => {
        if (editingMember) {
            setMembers(prev => prev.map(m => m.id === editingMember.id ? { ...editingMember, ...memberData } : m));
            addToast('Family member updated!');
        } else {
            const newMember: FamilyMember = { id: Date.now().toString(), ...memberData };
            setMembers(prev => [...prev, newMember]);
            addToast('Family member added!');
        }
        setIsModalOpen(false);
    };

    const handleRemoveMember = (id: string) => {
        setMembers(prev => prev.filter(member => member.id !== id));
        addToast('Family member removed.', 'info');
    };
    
    return (
         <div className="space-y-4">
            <Card>
                <div className="space-y-2">
                    {members.map(member => (
                        <div key={member.id} className="flex justify-between items-center bg-bg-primary p-3 rounded-md">
                            <div>
                                <p className="font-semibold text-text-primary">{member.name} <span className="text-xs font-normal text-text-secondary">({member.role})</span></p>
                                <p className="text-sm text-text-secondary">{member.email}</p>
                            </div>
                            {member.role !== 'Admin' && (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleOpenModal(member)} className="text-text-secondary hover:text-accent-primary p-1 rounded-full">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleRemoveMember(member.id)} className="text-accent-secondary hover:text-red-500 transition-colors p-1 rounded-full">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <Button onClick={() => handleOpenModal(null)} variant="secondary" className="w-full">
                        <PlusIcon className="w-5 h-5"/> Add Member
                    </Button>
                </div>
            </Card>

            <AddEditFamilyMemberModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveMember}
                member={editingMember}
            />
        </div>
    );
};

export default FamilyMembersManager;