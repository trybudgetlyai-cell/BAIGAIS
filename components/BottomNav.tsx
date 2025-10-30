
import React from 'react';
import { HomeIcon, PlannerIcon, ProfileIcon, PlusIcon, HomeIconSolid, PlannerIconSolid, ProfileIconSolid, DocumentReportIcon, DocumentReportIconSolid } from '../constants';
import type { Tab } from '../types';
import { TABS } from '../constants';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onAddTransaction: () => void;
}

interface NavItemProps {
  label: Tab;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, activeIcon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center w-full h-full transition-colors duration-200 focus:outline-none"
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* The pill container for the icon */}
      <div
        className={`flex items-center justify-center w-16 h-8 rounded-full transition-all duration-300 ease-in-out ${
          isActive ? 'bg-accent-pill-bg' : 'bg-transparent'
        }`}
      >
        {/* The icon itself. Its color changes based on active state */}
        <div className={`h-6 w-6 transition-colors duration-200 ${isActive ? 'text-accent-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
            {isActive ? activeIcon : icon}
        </div>
      </div>

      {/* The text label */}
      <span className={`mt-0.5 transition-all duration-200 ${
        isActive ? 'font-bold text-accent-primary text-sm' : 'font-normal text-xs text-text-secondary group-hover:text-text-primary'
      }`}>
        {label}
      </span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onAddTransaction }) => {
  const navItems = [
    { label: TABS.HOME, icon: <HomeIcon className="h-6 w-6" />, activeIcon: <HomeIconSolid className="h-6 w-6" /> },
    { label: TABS.PLANNER, icon: <PlannerIcon className="h-6 w-6" />, activeIcon: <PlannerIconSolid className="h-6 w-6" /> },
    { label: TABS.ANALYSIS, icon: <DocumentReportIcon className="h-6 w-6" />, activeIcon: <DocumentReportIconSolid className="h-6 w-6" /> },
    { label: TABS.PROFILE, icon: <ProfileIcon className="h-6 w-6" />, activeIcon: <ProfileIconSolid className="h-6 w-6" /> },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 h-16" role="navigation">
      <nav className="relative w-full h-full bg-bg-secondary border-t border-border flex items-center z-40">
        <div className="flex-1 flex justify-around">
          <NavItem {...navItems[0]} isActive={activeTab === navItems[0].label} onClick={() => setActiveTab(navItems[0].label)} />
          <NavItem {...navItems[1]} isActive={activeTab === navItems[1].label} onClick={() => setActiveTab(navItems[1].label)} />
        </div>
        
        <div className="w-20" aria-hidden="true"></div>

        <div className="flex-1 flex justify-around">
          <NavItem {...navItems[2]} isActive={activeTab === navItems[2].label} onClick={() => setActiveTab(navItems[2].label)} />
          <NavItem {...navItems[3]} isActive={activeTab === navItems[3].label} onClick={() => setActiveTab(navItems[3].label)} />
        </div>
      </nav>
      
      <button
          onClick={onAddTransaction}
          aria-label="Add transaction"
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-accent-primary rounded-full shadow-lg flex items-center justify-center text-accent-text hover:bg-opacity-90 transition-transform transform hover:scale-110 duration-300 z-50"
      >
        <PlusIcon className="w-8 h-8" />
      </button>
    </div>
  );
};

export default BottomNav;
