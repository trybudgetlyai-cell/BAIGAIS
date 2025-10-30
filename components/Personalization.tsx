
import React, { useState, useRef } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { UserCircleIcon, UploadIcon } from '../constants';
import { useToast } from '../contexts/ToastContext';
import Avatar from './ui/Avatar';

interface PersonalizationProps {
    userName: string;
    setUserName: (name: string) => void;
    profilePicture: string | null;
    setProfilePicture: (dataUrl: string | null) => void;
    onBack: () => void;
}

const Personalization: React.FC<PersonalizationProps> = ({ userName, setUserName, profilePicture, setProfilePicture, onBack }) => {
    const { addToast } = useToast();
    const [name, setName] = useState(userName);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (name.trim() === '') {
            addToast('User name cannot be empty.', 'error');
            return;
        }
        setUserName(name);
        addToast('Profile updated successfully!');
        onBack();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result as string);
                addToast('Profile picture updated!');
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
         <div className="space-y-4">
            <Card className="text-center">
                 <div className="relative inline-block mb-4">
                    <Avatar 
                        name={userName}
                        imageUrl={profilePicture}
                        sizeClassName="w-24 h-24"
                        textClassName="text-5xl"
                    />
                    <button 
                        onClick={handleUploadClick}
                        className="absolute bottom-0 right-0 bg-accent-primary text-accent-text p-2 rounded-full hover:bg-opacity-80 transition-colors"
                    >
                        <UploadIcon className="w-4 h-4" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>

                <div className="space-y-4 text-left">
                    <div>
                        <label htmlFor="userName" className="text-sm text-text-secondary">Your Name</label>
                        <input
                            id="userName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-1 bg-bg-primary p-2 rounded border border-border text-text-primary"
                        />
                    </div>
                </div>
                 <div className="mt-6">
                    <Button onClick={handleSave} className="w-full">Save Changes</Button>
                </div>
            </Card>
        </div>
    );
};

export default Personalization;
