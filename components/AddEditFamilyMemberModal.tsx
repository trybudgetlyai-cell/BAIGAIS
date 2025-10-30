import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import type { FamilyMember } from '../types';

interface AddEditFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: Omit<FamilyMember, 'id'>) => void;
  member: FamilyMember | null;
}

const AddEditFamilyMemberModal: React.FC<AddEditFamilyMemberModalProps> = ({ isOpen, onClose, onSave, member }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<FamilyMember['role']>('Child');

  useEffect(() => {
    if (isOpen) {
        setName(member?.name || '');
        setEmail(member?.email || '');
        setRole(member?.role || 'Child');
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim() && email.trim()) {
      onSave({ name, email, role });
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start z-50 p-4 pt-20">
      <Card className="w-full max-w-md">
        <h3 className="text-lg font-bold text-text-primary mb-4">{member ? 'Edit' : 'Add'} Family Member</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"/>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Role</label>
            <select name="role" value={role} onChange={(e) => setRole(e.target.value as FamilyMember['role'])} className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary appearance-none">
                <option value="Child">Child</option>
                <option value="Spouse">Spouse</option>
                <option value="Other">Other</option>
            </select>
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

export default AddEditFamilyMemberModal;