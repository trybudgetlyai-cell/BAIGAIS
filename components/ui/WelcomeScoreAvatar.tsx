import React from 'react';
import { SeedlingIcon } from '../../constants';

const WelcomeScoreAvatar: React.FC = () => {
  return (
    <div
      className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 bg-bg-secondary border-2 border-green-500`}
      aria-label="Welcome! Add transactions to see your score."
    >
      <SeedlingIcon className={`w-7 h-7 text-green-500`} />
    </div>
  );
};

export default WelcomeScoreAvatar;
