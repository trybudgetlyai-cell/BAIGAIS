
import React from 'react';
import { ArrowLeftIcon, SparklesIcon, SparklesIconSolid } from '../constants';
import Avatar from './ui/Avatar';
import FinancialScoreAvatar from './ui/FinancialScoreAvatar';
import WelcomeScoreAvatar from './ui/WelcomeScoreAvatar';

interface HeaderProps {
  title: string;
  subtitle?: string;
  isAppName: boolean;
  onBack?: () => void;
  showProfileIcons?: boolean;
  onCoachClick?: () => void;
  financialScore?: number | null;
  isWelcomeState?: boolean;
  onFinancialScoreClick?: () => void;
  userName: string;
  profilePicture: string | null;
  onAvatarClick?: () => void;
  titleClassName?: string;
  subtitleClassName?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, isAppName, onBack, showProfileIcons, onCoachClick, financialScore, isWelcomeState, onFinancialScoreClick, userName, profilePicture, onAvatarClick, titleClassName, subtitleClassName }) => {

  const defaultTitleClasses = `text-2xl font-bold truncate ${isAppName ? 'font-sans text-accent-primary' : 'text-text-primary'}`;
  const defaultSubtitleClasses = 'text-sm text-text-secondary truncate';
  
  const getDisplayName = (name: string): string => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      const firstName = parts[0];
      const lastInitial = `${parts[parts.length - 1].charAt(0)}.`;
      return `${firstName} ${lastInitial}`;
    }
    return parts[0] || '';
  };
  
  const displayName = getDisplayName(userName);

  return (
    <header className="p-4 flex justify-between items-center gap-4">
      <div className="flex items-center gap-2 flex-grow min-w-0">
        {onBack && (
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-bg-secondary flex-shrink-0">
                <ArrowLeftIcon className="w-6 h-6 text-text-primary"/>
            </button>
        )}
        <div className="min-w-0">
            <h1 className={titleClassName || defaultTitleClasses}>{title}</h1>
            {subtitle === userName && !onBack ? (
                // Custom name rendering for the home screen: "FirstName L."
                <p className={subtitleClassName || 'text-2xl font-bold text-text-primary truncate'}>{displayName}</p>
            ) : (
                // Default subtitle for other screens
                subtitle && <p className={subtitleClassName || defaultSubtitleClasses}>{subtitle}</p>
            )}
        </div>
      </div>
      
      {showProfileIcons && (
        <div className="flex items-center gap-1 flex-shrink-0">
            <div className="flex flex-col items-center -my-2">
                 <button onClick={onCoachClick} className="text-accent-primary p-2 relative w-12 h-12 flex items-center justify-center">
                    <SparklesIcon className="w-7 h-7 absolute icon-pulse-in" />
                    <SparklesIconSolid className="w-7 h-7 absolute icon-pulse-out" />
                </button>
                <span className="inline-block text-xs font-black text-text-secondary font-robotic -mt-2 pointer-events-none tracking-wider">BUBBLY</span>
            </div>
        
            {isWelcomeState && onFinancialScoreClick && (
                <button 
                    onClick={onFinancialScoreClick} 
                    className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-accent-primary"
                    aria-label="Welcome! Add transactions to see your score."
                >
                    <WelcomeScoreAvatar />
                </button>
            )}
            {!isWelcomeState && financialScore !== undefined && financialScore !== null && onFinancialScoreClick && (
              <button 
                onClick={onFinancialScoreClick} 
                className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-accent-primary"
                aria-label={`Financial score: ${financialScore}. Click for details.`}
              >
                <FinancialScoreAvatar score={financialScore} />
              </button>
            )}
            {onAvatarClick && (
                <button onClick={onAvatarClick} className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-accent-primary">
                    <Avatar name={userName} imageUrl={profilePicture} sizeClassName="w-14 h-14" textClassName="text-2xl" />
                </button>
            )}
        </div>
      )}
    </header>
  );
};

export default Header;
