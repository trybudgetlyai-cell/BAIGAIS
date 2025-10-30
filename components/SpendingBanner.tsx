import React from 'react';

// Define simple arrow icons locally as they are specific to this design
const UpArrowIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
    </svg>
);
  
const DownArrowIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5L5.25 12.75" />
    </svg>
);

interface SpendingBannerProps {
  currencySymbol: string;
  income: number;
  expenses: number;
}

const SpendingBanner: React.FC<SpendingBannerProps> = ({ currencySymbol, income, expenses }) => {
    const balance = income - expenses;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="flex justify-center gap-4 w-full">
                {/* Spending Pill */}
                <div className="flex-1 flex items-center gap-3 bg-accent-secondary text-accent-text rounded-full px-4 py-2 shadow-lg">
                    <div className="w-9 h-9 flex items-center justify-center bg-white/20 rounded-full flex-shrink-0">
                        <UpArrowIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm opacity-90 truncate">Spending</p>
                        <p className="text-xl font-bold truncate">{currencySymbol}{expenses.toLocaleString()}</p>
                    </div>
                </div>

                {/* Income Pill */}
                <div className="flex-1 flex items-center gap-3 bg-[#388E3C] text-accent-text rounded-full px-4 py-2 shadow-lg">
                    <div className="w-9 h-9 flex items-center justify-center bg-white/20 rounded-full flex-shrink-0">
                        <DownArrowIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm opacity-90 truncate">Income</p>
                        <p className="text-xl font-bold truncate">{currencySymbol}{income.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Balance Pill */}
            <div className="bg-balance-pill-bg border border-border px-6 py-2 rounded-full mt-4">
                <p className="text-md font-semibold text-text-primary">
                    Balance: {currencySymbol}{balance.toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default SpendingBanner;