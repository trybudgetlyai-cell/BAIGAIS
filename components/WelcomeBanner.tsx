import React from 'react';
import Card from './ui/Card';

interface WelcomeBannerProps {
  userName: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName }) => {
  const firstName = userName.split(' ')[0];
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const dynamicSubtitle = () => {
    const messages = [
      "Ready to take control of your finances?",
      "Every small step counts towards your big goals.",
      "Let's make today a financially successful day!",
      "Keeping an eye on your spending is smart!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <Card className="bg-bg-secondary p-5 text-left">
      <p className="text-2xl font-bold text-text-primary">{getTimeBasedGreeting()}, {firstName}!</p>
      <p className="text-sm text-text-secondary mt-1">{dynamicSubtitle()}</p>
    </Card>
  );
};

export default WelcomeBanner;