import React from 'react';
import Card from './ui/Card';
import { TrophyIcon } from '../constants';
import type { Achievement } from '../types';

interface AchievementsProps {
    achievements: Achievement[];
    onBack: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ achievements, onBack }) => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;

    return (
         <div className="space-y-4">
            <Card>
                <div className="flex flex-col items-center text-center p-4">
                    <TrophyIcon className="w-16 h-16 text-yellow-400" />
                    <h3 className="text-lg font-bold text-text-primary mt-2">Your Progress</h3>
                    <p className="text-text-secondary">You have unlocked {unlockedCount} of {totalCount} achievements.</p>
                </div>
            </Card>
            
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map(ach => (
                        <div key={ach.id} className={`flex items-center gap-4 p-4 rounded-lg ${ach.unlocked ? 'bg-bg-primary' : 'bg-bg-primary opacity-50'}`}>
                             <div className="text-5xl">{ach.emoji}</div>
                             <div>
                                <p className="font-bold text-text-primary">{ach.name}</p>
                                <p className="text-sm text-text-secondary">{ach.description}</p>
                                <p className={`text-xs font-bold mt-1 ${ach.unlocked ? 'text-accent-primary' : 'text-text-secondary'}`}>
                                    {ach.unlocked ? 'Unlocked' : 'Locked'}
                                </p>
                             </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Achievements;