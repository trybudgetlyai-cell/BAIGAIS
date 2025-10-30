import React from 'react';

const ToggleButton: React.FC<{ label: string, enabled: boolean, onClick: () => void }> = ({ label, enabled, onClick }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-text-primary">{label}</span>
        <button onClick={onClick} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-accent-primary' : 'bg-border'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow-lg ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

export default ToggleButton;