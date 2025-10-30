import React from 'react';
import { CloseIcon, CheckCircleIcon } from '../../constants';

interface GroupedOption {
    label: string;
    children: { id: string; name: string }[];
}

type Option = GroupedOption | string;

function isGroupedOption(option: Option): option is GroupedOption {
    return typeof option === 'object' && (option as GroupedOption).label !== undefined;
}

interface BottomSheetSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    options: Option[];
    onSelect: (value: string) => void;
    selectedValue: string;
}

const BottomSheetSelector: React.FC<BottomSheetSelectorProps> = ({ isOpen, onClose, title, options, onSelect, selectedValue }) => {
    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="absolute inset-0 bg-black bg-opacity-60"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <div
                className={`absolute bottom-0 left-0 right-0 bg-bg-secondary rounded-t-2xl shadow-lg transform transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ maxHeight: '80vh' }}
            >
                <div className="p-4 border-b border-border flex justify-between items-center sticky top-0 bg-bg-secondary z-10 rounded-t-2xl">
                    <h3 className="text-lg font-bold text-text-primary">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-primary">
                        <CloseIcon className="w-6 h-6 text-text-secondary" />
                    </button>
                </div>
                
                <div className="overflow-y-auto p-4">
                    {options.map((option, index) => {
                        if (isGroupedOption(option)) {
                            return (
                                <div key={option.label} className="mb-4">
                                    <h4 className="text-sm font-bold text-text-secondary uppercase px-2 py-1">{option.label}</h4>
                                    <div className="space-y-1 mt-1">
                                        {option.children.map(child => (
                                            <button
                                                key={child.id}
                                                onClick={() => onSelect(child.id)}
                                                className={`w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors ${selectedValue === child.id ? 'bg-accent-pill-bg' : 'hover:bg-bg-primary'}`}
                                            >
                                                <span className={`${selectedValue === child.id ? 'text-accent-primary font-semibold' : 'text-text-primary'}`}>{child.name}</span>
                                                {selectedValue === child.id && <CheckCircleIcon className="w-6 h-6 text-accent-primary" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        } else {
                            // Simple string options for accounts
                             return (
                                <button
                                    key={index}
                                    onClick={() => onSelect(option)}
                                    className={`w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors mb-1 ${selectedValue === option ? 'bg-accent-pill-bg' : 'hover:bg-bg-primary'}`}
                                >
                                    <span className={`${selectedValue === option ? 'text-accent-primary font-semibold' : 'text-text-primary'}`}>{option}</span>
                                    {selectedValue === option && <CheckCircleIcon className="w-6 h-6 text-accent-primary" />}
                                </button>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export default BottomSheetSelector;
