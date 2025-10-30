

import React from 'react';

export const TABS = {
  HOME: 'Home',
  PLANNER: 'Planner',
  ANALYSIS: 'Analysis',
  PROFILE: 'Profile',
} as const;

export const CURRENCIES = {
  USD: { name: 'United States Dollar', symbol: '$' },
  EUR: { name: 'Euro', symbol: '€' },
  GBP: { name: 'British Pound Sterling', symbol: '£' },
  INR: { name: 'Indian Rupee', symbol: '₹' },
};

export const LANGUAGES = {
  EN: { name: 'English' },
  ES: { name: 'Español' },
  HI: { name: 'हिन्दी' },
}

export const ACCENT_COLORS = {
    teal: '#64FFDA',
    maroon: '#EBA0AC',
    grape: '#9b59b6',
    sapphire: '#2980b9',
    forest: '#16a085',
    pumpkin: '#d35400',
}

export const CHART_COLOR_THEMES = {
    vibrant: ['#54A2E5', '#FF6B6B', '#FFD166', '#06D6A0', '#7A5AF8'],
    muted: ['#8E9D99', '#B2A398', '#C3B8AA', '#EBE3DB', '#D6CFC7'],
    sunset: ['#FF8C42', '#FF3C8E', '#A430E8', '#6623E0', '#3B1C99'],
    ocean: ['#0077B6', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF'],
    forest: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2'],
    pastel: ['#FAD2E1', '#E1BEE7', '#D1C4E9', '#C5CAE9', '#B3E5FC'],
    sapphire: ['#2980b9', '#d35400', '#16a085', '#f1c40f', '#8e44ad', '#2c3e50'],
};

export const FINANCIAL_YEAR_MONTHS = [
    { name: 'January', value: 1 }, { name: 'February', value: 2 }, { name: 'March', value: 3 },
    { name: 'April', value: 4 }, { name: 'May', value: 5 }, { name: 'June', value: 6 },
    { name: 'July', value: 7 }, { name: 'August', value: 8 }, { name: 'September', value: 9 },
    { name: 'October', value: 10 }, { name: 'November', value: 11 }, { name: 'December', value: 12 },
];

export const THEME_COLORS = {
    dark: {
      bgPrimary: '#0A192F',
      bgSecondary: '#172A45',
      textPrimary: '#CCD6F6',
      textSecondary: '#8892B0',
      accentPrimary: 'var(--color-accent-primary)',
      accentSecondary: '#FF6B6B',
      border: '#8892B033',
    },
    light: {
      bgPrimary: '#FAFAFA',
      bgSecondary: '#FFFFFF',
      textPrimary: '#212529',
      textSecondary: '#6C757D',
      accentPrimary: 'var(--color-accent-primary)',
      accentSecondary: '#DC3545',
      border: '#DEE2E6',
    },
};

const Icon: React.FC<React.SVGProps<SVGSVGElement> & { path: string }> = ({ path, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);
  
export const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);
export const ArrowDownCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ArrowUpCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" {...props} />;
export const HomeIconSolid: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 0 0 1.061 1.06l8.69-8.69Z" />
        <path d="M12 5.432 4.57 12.863v8.387a.75.75 0 0 0 .75.75h13.36a.75.75 0 0 0 .75-.75v-8.387L12 5.432Z" />
    </svg>
);
export const PlannerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" {...props} />;
export const PlannerIconSolid: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M3.75 3h16.5a.75.75 0 0 1 .75.75v16.5a.75.75 0 0 1-.75-.75H3.75a.75.75 0 0 1-.75-.75V3.75a.75.75 0 0 1 .75-.75ZM5.25 4.5v3h13.5v-3H5.25Z" />
    </svg>
);
export const ProfileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" {...props} />;
export const ProfileIconSolid: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
);
export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 4.5v15m7.5-7.5h-15" {...props} />;
export const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-2.72.272a25.114 25.114 0 0 1-1.465.132h-1.85a25.114 25.114 0 0 1-1.465-.132l-2.72-.272A2.25 2.25 0 0 1 3.75 14.9a2.25 2.25 0 0 1-1.5-2.097V8.614c0-1.136.847-2.1 1.98-2.193l2.72-.272a25.114 25.114 0 0 1 1.465-.132h1.85a25.114 25.114 0 0 1 1.465.132l2.72.272m-8.98 5.023c.338.03.68.044 1.022.044s.684-.014 1.022-.044m-2.044 0a.375.375 0 0 0-.375.375v.375c0 .207.168.375.375.375h1.5a.375.375 0 0 0 .375-.375v-.375a.375.375 0 0 0-.375-.375h-1.5z" {...props} />;
export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" {...props} />;
export const SparklesIconSolid: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036a3.375 3.375 0 0 0 2.456 2.456l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258a3.375 3.375 0 0 0-2.456 2.456l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a3.375 3.375 0 0 0-2.456-2.456l-1.036-.258a.75.75 0 0 1 0-1.456l1.036.258a3.375 3.375 0 0 0 2.456-2.456l.258-1.036A.75.75 0 0 1 18 1.5Z" />
    </svg>
);
export const SeedlingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" {...props}>
        <path d="M17 8c-4.42 0-8 3.58-8 8 0 1.04.2 2.02.56 2.92.22.56.81.85 1.39.64l1.4-.51c.54-.2.83-.8.63-1.34-.23-.62-.38-1.28-.38-1.96 0-3.31 2.69-6 6-6s6 2.69 6 6c0 .68-.15 1.34-.38 1.96-.2.54.09 1.14.63 1.34l1.4.51c.58.21 1.17-.08 1.39-.64.36-.9.56-1.88.56-2.92 0-4.42-3.58-8-8-8zM7.83 3.08C7.4 2.63 6.77 2.6 6.36 3l-1.87 1.87c-.41.41-.44 1.04-.03 1.45l.69.69C6.4 6.44 7.63 6 8.98 6c1.13 0 2.16.32 3.02.85l1.48-1.48C12.92 4.8 12.29 4.22 11.53 3.8L7.83 3.08z"/>
    </svg>
);
export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M6 12 3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.876L5.999 12Zm0 0h7.5" {...props} />;
export const DocumentReportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" {...props} />;
export const DocumentReportIconSolid: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4.5 2.25A2.25 2.25 0 0 0 2.25 4.5v15A2.25 2.25 0 0 0 4.5 21.75h15a2.25 2.25 0 0 0 2.25-2.25V9.173c0-.392-.123-.771-.349-1.077l-5.423-6.507A2.25 2.25 0 0 0 14.577 1.5H4.5A2.25 2.25 0 0 0 2.25 3V2.25Zm.75 10.5a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    </svg>
);
export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" {...props} />;
export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="m19.5 8.25-7.5 7.5-7.5-7.5" {...props} />;
export const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="m8.25 4.5 7.5 7.5-7.5 7.5" {...props} />;
export const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="m2.25 18 9-9 4.5 4.5L21.75 6" {...props} />;
export const TrendingDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="m2.25 6 9 9 4.5-4.5L21.75 18" {...props} />;
export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M6 18 18 6M6 6l12 12" {...props} />;
export const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487zm0 0L19.5 7.125" {...props} />;
export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" {...props} />;
export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" {...props} />;
export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" {...props} />;
export const ClipboardListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" {...props} />;
export const CreditCardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-5.25H21a.75.75 0 0 0 .75-.75V5.25a.75.75 0 0 0-.75-.75H5.25a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 .75.75Z" {...props} />;
export const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z M11.25 8.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" {...props} />;
export const PaperclipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81" {...props} />;
export const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.448-.1-.661L19.24 5.338A2.25 2.25 0 0 0 17.088 3.75H15M12 3.75v9" {...props} />;
export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.964A5.25 5.25 0 0 1 12 10.5a5.25 5.25 0 0 1 5.25 5.25m-3.75-2.965a5.25 5.25 0 1 0-7.5 0m-2.433 2.965a5.25 5.25 0 0 1 7.5 0m-7.5 0a3 3 0 0 0-4.682 2.72 8.986 8.986 0 0 0 3.74.479m-1.37-2.965A5.25 5.25 0 0 1 6 10.5a5.25 5.25 0 0 1 5.25 5.25m0 0a5.25 5.25 0 0 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" {...props} />;
export const DatabaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" {...props} />;
export const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5m-15 0H3m18 0h-1.5m-15 0H3m18 0h-1.5M12 4.5v.01M12 19.5v.01" {...props} />;
export const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" {...props} />;
export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M16.5 18.75h-9a9 9 0 0 1-9-9V7.5a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v2.25a9 9 0 0 1-9 9zM6 10.5h12M6 10.5a3 3 0 0 1-3-3V6m3 4.5a3 3 0 0 0 3-3V6m6 4.5a3 3 0 0 1 3-3V6" {...props} />;
export const QuestionMarkCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" {...props} />;
export const GlobeAltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c.504 0 1.002-.023 1.493-.066M12 21c-.504 0-1.002-.023-1.493-.066M12 3c.504 0 1.002.023 1.493.066M12 3c-.504 0-1.002-.023-1.493-.066M12 3a9.004 9.004 0 0 0-8.716 6.747M12 3a9.004 9.004 0 0 1 8.716 6.747m0 0H20.25m-16.5 0H3.75m16.5 0c.362 0 .71.012 1.05.034m-18.6 0c.34-.022.688-.034 1.05-.034m16.5 0a9.004 9.004 0 0 1-8.716 6.747m8.716-6.747a9.004 9.004 0 0 0-8.716-6.747M3.75 14.25c.362 0 .71.012 1.05.034m-1.05-.034c.34-.022.688-.034 1.05-.034" {...props} />;
export const PaintBrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3.375a.75.75 0 0 1 .75 0h3.75a.75.75 0 0 1 0 1.5h-3.75a.75.75 0 0 1-.75-.75Z" {...props} />;
export const LockClosedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" {...props} />;
export const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H3" {...props} />;
export const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" {...props} />;
export const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" {...props} />;
export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" {...props} />;
export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" {...props} />;
export const MinusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M5 12h14" {...props} />;
export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" {...props} />;
export const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3 4.5h14.25M7.5 9h9M10.5 13.5h3M3 18h18" {...props} />;
export const ArrowsUpDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon path="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" {...props} />;

export const DEFAULT_CATEGORIES = [
    { name: 'Salary', type: 'income', subCategories: [] },
    { name: 'Sold items', type: 'income', subCategories: [] },
    { name: 'Coupons', type: 'income', subCategories: [] },
    { name: 'Etc', type: 'income', subCategories: [] },
];

export const DEFAULT_EXPENSE_CATEGORIES = [
    { name: 'Housing', type: 'expense', subCategories: [{name: 'Rent/Mortgage', type: 'expense'}, {name: 'Property Tax', type: 'expense'}] },
    { name: 'Utilities', type: 'expense', subCategories: [{name: 'Electricity', type: 'expense'}, {name: 'Water', type: 'expense'}, {name: 'Internet', type: 'expense'}] },
    { name: 'Transportation', type: 'expense', subCategories: [{name: 'Fuel', type: 'expense'}, {name: 'Public Transit', type: 'expense'}] },
    { name: 'Food', type: 'expense', subCategories: [{name: 'Groceries', type: 'expense'}, {name: 'Dining Out', type: 'expense'}] },
    { name: 'Personal Care', type: 'expense', subCategories: [{name: 'Toiletries', type: 'expense'}, {name: 'Haircut', type: 'expense'}] },
];

export const getContrastingTextColor = (hexcolor: string): string => {
    if (hexcolor.startsWith('#')) {
      hexcolor = hexcolor.slice(1);
    }
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 4), 16);
    const b = parseInt(hexcolor.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#0A192F' : '#FFFFFF';
};

export const hexToRgba = (hex: string, alpha: number): string => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } 
    else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const generateContrastingColor = (hex: string): string => {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;
  
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
  
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    h = (h + 0.5) % 1;
  
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
  
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    g = Math.round(hue2rgb(p, q, h) * 255);
    b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
  
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

export const generateMonochromaticPalette = (baseHex: string, count: number): string[] => {
    const palette: string[] = [];
    if (count <= 0) return palette;
    
    let r = parseInt(baseHex.substring(1, 3), 16) / 255;
    let g = parseInt(baseHex.substring(3, 5), 16) / 255;
    let b = parseInt(baseHex.substring(5, 7), 16) / 255;
  
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
  
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    const lightnessStep = (count > 1) ? (0.95 - 0.35) / (count - 1) : 0;

    for (let i = 0; i < count; i++) {
        const newL = (count > 1) ? 0.35 + (i * lightnessStep) : l;

        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
      
        const q = newL < 0.5 ? newL * (1 + s) : newL + s - newL * s;
        const p = 2 * newL - q;
        const r_ = Math.round(hue2rgb(p, q, h + 1/3) * 255);
        const g_ = Math.round(hue2rgb(p, q, h) * 255);
        const b_ = Math.round(hue2rgb(p, q, h - 1/3) * 255);
      
        const color = "#" + ("000000" + ((r_ << 16) | (g_ << 8) | b_).toString(16)).slice(-6);
        palette.push(color);
    }
  
    return palette;
};