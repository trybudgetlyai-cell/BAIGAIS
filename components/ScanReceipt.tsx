import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

const ScanReceipt: React.FC = () => {
  return (
    <Card className="space-y-4 text-center">
      <h2 className="text-xl font-bold text-text-primary">Scan Receipt</h2>
      <div className="relative w-full aspect-[4/3] bg-bg-primary rounded-lg overflow-hidden border border-border flex flex-col items-center justify-center p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-secondary/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="text-lg font-bold text-text-primary">Coming Soon!</h3>
        <p className="text-text-secondary">The receipt scanning feature is under development and will be available in a future update.</p>
      </div>
      <Button className="w-full" disabled={true}>
        Scan Receipt
      </Button>
    </Card>
  );
};

export default ScanReceipt;