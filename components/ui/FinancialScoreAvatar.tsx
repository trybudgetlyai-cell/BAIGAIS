import React from 'react';

interface FinancialScoreAvatarProps {
  score: number;
}

const FinancialScoreAvatar: React.FC<FinancialScoreAvatarProps> = ({ score }) => {
  const getScoreInfo = (s: number): { borderColor: string; textColor: string } => {
    if (s > 70) return { borderColor: 'border-accent-primary', textColor: 'text-accent-primary' };
    if (s > 40) return { borderColor: 'border-yellow-400', textColor: 'text-yellow-400' };
    return { borderColor: 'border-accent-secondary', textColor: 'text-accent-secondary' };
  };

  const { borderColor, textColor } = getScoreInfo(score);

  return (
    <div
      className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 bg-bg-secondary border-2 ${borderColor}`}
      aria-label={`Financial score: ${score}`}
    >
      <span className={`text-2xl font-bold ${textColor}`}>
        {score}
      </span>
    </div>
  );
};

export default FinancialScoreAvatar;
