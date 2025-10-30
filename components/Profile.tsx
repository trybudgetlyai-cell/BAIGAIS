
import React from 'react';
import Card from './ui/Card';
import { 
    UsersIcon, 
    CreditCardIcon, 
    DatabaseIcon,
    CogIcon,
    ChevronRightIcon,
    UserCircleIcon,
    TrophyIcon,
    DocumentReportIcon,
    QuestionMarkCircleIcon,
    GlobeAltIcon,
    PaintBrushIcon,
    LockClosedIcon,
    LogoutIcon,
} from '../constants';
import type { ConfigView, ProfileView } from '../types';
import Button from './ui/Button';
import Avatar from './ui/Avatar';

interface SettingsSectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, icon, children }) => (
    <Card>
        {icon ? (
            <div className="flex items-center gap-3 mb-4">
                {icon}
                <h3 className="text-lg font-bold text-text-primary">{title}</h3>
            </div>
        ) : (
            <h3 className="text-lg font-bold text-text-primary mb-4">{title}</h3>
        )}
        <div>{children}</div>
    </Card>
);

interface ProfileProps {
    userName: string;
    profilePicture: string | null;
    onNavigateToConfiguration: (view: ConfigView) => void;
    onNavigateToView: (view: ProfileView) => void;
    isPinSet: boolean;
    familyMembersCount: number;
    linkedAccountsCount: number;
    achievementsUnlockedCount: number;
    totalAchievementsCount: number;
    onSignOut: () => void;
}

const Profile: React.FC<ProfileProps> = ({ 
    userName,
    profilePicture,
    onNavigateToConfiguration, 
    onNavigateToView,
    isPinSet,
    familyMembersCount,
    linkedAccountsCount,
    achievementsUnlockedCount,
    totalAchievementsCount,
    onSignOut,
}) => {

    const NavButton: React.FC<{onClick: () => void, title: string, subtitle: string, icon: React.ReactNode}> = ({ onClick, title, subtitle, icon }) => (
        <button 
            onClick={onClick} 
            className="w-full text-left flex items-center justify-between gap-4 p-3 hover:bg-bg-secondary/50 transition-colors"
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 bg-bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-text-primary truncate">{title}</p>
                    <p className="text-sm text-text-secondary truncate">{subtitle}</p>
                </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-text-secondary flex-shrink-0" />
        </button>
    );

  return (
    <div className="space-y-6">
        <Card className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
                <Avatar 
                    name={userName}
                    imageUrl={profilePicture}
                    sizeClassName="w-32 h-32"
                    textClassName="text-6xl"
                />
            </div>

            <div className="w-full max-w-xs">
                <h2 className="text-2xl font-bold text-text-primary truncate">{userName}</h2>
                <p className="text-sm text-text-secondary">Welcome to your financial hub.</p>
            </div>
        </Card>

        <SettingsSection title="Me">
            <div className="bg-bg-primary rounded-lg divide-y divide-border -m-3">
                 <NavButton 
                    onClick={() => onNavigateToView('personalization')}
                    icon={<UserCircleIcon className="w-6 h-6 text-accent-primary" />}
                    title="Personalization"
                    subtitle="Update your name and profile picture"
                />
                <NavButton 
                    onClick={() => onNavigateToView('achievements')}
                    icon={<TrophyIcon className="w-6 h-6 text-accent-primary" />}
                    title="Achievements"
                    subtitle={`View your progress (${achievementsUnlockedCount}/${totalAchievementsCount} unlocked)`}
                />
            </div>
        </SettingsSection>
        
        <SettingsSection title="Account">
            <div className="bg-bg-primary rounded-lg divide-y divide-border -m-3">
                <NavButton 
                    onClick={() => onNavigateToView('family')}
                    icon={<UsersIcon className="w-6 h-6 text-accent-primary" />}
                    title="Family Members"
                    subtitle={`Manage family access (${familyMembersCount} members)`}
                />
                <NavButton 
                    onClick={() => onNavigateToView('accounts')}
                    icon={<CreditCardIcon className="w-6 h-6 text-accent-primary" />}
                    title="Linked Accounts"
                    subtitle={`Manage connected accounts (${linkedAccountsCount} accounts)`}
                />
            </div>
        </SettingsSection>
        
        <SettingsSection title="Configuration">
            <div className="bg-bg-primary rounded-lg divide-y divide-border -m-3">
                <NavButton 
                    onClick={() => onNavigateToConfiguration('categories_accounts')}
                    icon={<DatabaseIcon className="w-6 h-6 text-accent-primary" />}
                    title="Categories, Accounts & Tags"
                    subtitle="Customize income, expenses, and more."
                />
                <NavButton 
                    onClick={() => onNavigateToConfiguration('budgeting')}
                    icon={<CogIcon className="w-6 h-6 text-accent-primary" />}
                    title="Budgeting Settings"
                    subtitle="Configure budget carryover and cycles."
                />
                <NavButton 
                    onClick={() => onNavigateToConfiguration('regional')}
                    icon={<GlobeAltIcon className="w-6 h-6 text-accent-primary" />}
                    title="Currency & Region"
                    subtitle="Set currency and financial year."
                />
            </div>
        </SettingsSection>
        
        <SettingsSection title="Preferences">
            <div className="bg-bg-primary rounded-lg divide-y divide-border -m-3">
                 <NavButton 
                    onClick={() => onNavigateToConfiguration('appearance')}
                    icon={<PaintBrushIcon className="w-6 h-6 text-accent-primary" />}
                    title="Appearance"
                    subtitle="Customize theme and accent colors."
                />
                 <NavButton 
                    onClick={() => onNavigateToConfiguration('security')}
                    icon={<LockClosedIcon className="w-6 h-6 text-accent-primary" />}
                    title="Security"
                    subtitle={`App Lock PIN is ${isPinSet ? 'Enabled' : 'Disabled'}`}
                />
            </div>
        </SettingsSection>

        <SettingsSection title="Reports & Help">
            <div className="bg-bg-primary rounded-lg divide-y divide-border -m-3">
                 <NavButton 
                    onClick={() => onNavigateToView('health_report')}
                    icon={<DocumentReportIcon className="w-6 h-6 text-accent-primary" />}
                    title="AI Financial Health Report"
                    subtitle="Get a detailed analysis of your finances."
                />
                <NavButton 
                    onClick={() => onNavigateToView('help_support')}
                    icon={<QuestionMarkCircleIcon className="w-6 h-6 text-accent-primary" />}
                    title="Help & Support"
                    subtitle="Ask questions and get help from our AI."
                />
            </div>
        </SettingsSection>

        <Button onClick={onSignOut} variant="danger" className="w-full rounded-full">
            <LogoutIcon className="w-5 h-5" />
            Sign Out
        </Button>
    </div>
  );
};

export default Profile;
