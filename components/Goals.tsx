
import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { PlusIcon, TrophyIcon } from '../constants';
import type { Goal, Achievement, Theme } from '../types';
import { getGoalFeasibility } from '../services/geminiService';

const mockGoals: Goal[] = [
  { id: '1', name: 'Family Vacation', targetAmount: 5000, currentAmount: 3500, emoji: '🏖️' },
  { id: '2', name: 'New Car Fund', targetAmount: 20000, currentAmount: 8000, emoji: '🚗' },
  { id: '3', name: 'Education Fund', targetAmount: 50000, currentAmount: 12500, emoji: '🎓' },
];

const GoalProgressBar: React.FC<{ current: number; target: number }> = ({ current, target }) => {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <div className="w-full bg-bg-primary rounded-full h-2.5">
      <div className="bg-accent-primary h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const FeasibilityGauge: React.FC<{ score: number }> = ({ score }) => {
    const size = 60;
    const strokeWidth = 6;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const getScoreColor = () => {
        if (score > 70) return 'text-accent-primary';
        if (score > 40) return 'text-yellow-400';
        return 'text-accent-secondary';
    };

    const progress = score / 100;
    const offset = circumference * (1 - progress);

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={center}
                    cy={center}
                    className="text-text-secondary/20"
                />
                <circle
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={center}
                    cy={center}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`transition-all duration-500 ease-in-out ${getScoreColor()}`}
                />
            </svg>
            <span className={`absolute text-lg font-bold ${getScoreColor()}`}>{score}</span>
        </div>
    );
};


interface Forecast {
    feasibilityScore?: number;
    projectedDate?: string;
    analysis?: string;
    accelerationTips?: string[];
    error?: string;
}

interface GoalsProps {
    currencySymbol: string;
    theme: Theme;
    achievements: Achievement[];
}

const Goals: React.FC<GoalsProps> = ({ currencySymbol, theme, achievements }) => {
    const [forecasts, setForecasts] = useState<Record<string, Forecast>>({});
    const [loadingForecastId, setLoadingForecastId] = useState<string | null>(null);
  
    const handleFetchForecast = async (goal: Goal) => {
      if (loadingForecastId) return; // Prevent multiple requests while one is loading
      setLoadingForecastId(goal.id);
  
      const mockFinancialData = {
          monthlySavings: 1000, // example data
          income: 5200,
      };
      const resultString = await getGoalFeasibility(goal, mockFinancialData, currencySymbol);
      try {
          const parsedResult = JSON.parse(resultString);
          setForecasts(prev => ({...prev, [goal.id]: parsedResult}));
      } catch (e) {
           console.error("Failed to parse forecast JSON:", e);
           setForecasts(prev => ({...prev, [goal.id]: { error: "Could not read the AI's forecast. Please try again." }}));
      }
      setLoadingForecastId(null);
    };

  return (
    <div className="space-y-6">
        <div className="space-y-4">
            {mockGoals.map((goal) => {
                const forecast = forecasts[goal.id];
                const isLoading = loadingForecastId === goal.id;

                return (
                    <Card key={goal.id}>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">{goal.emoji}</span>
                            <div className="flex-grow">
                                <p className="font-bold text-text-primary">{goal.name}</p>
                                <p className="text-sm text-text-secondary">
                                    {currencySymbol}{goal.currentAmount.toLocaleString()} / {currencySymbol}{goal.targetAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <GoalProgressBar current={goal.currentAmount} target={goal.targetAmount} />
                        </div>
                        
                        <div className="mt-4">
                            {isLoading ? (
                                <div className="bg-bg-primary p-4 rounded-lg">
                                    <h4 className="font-bold text-accent-primary mb-2">AI Goal Forecast</h4>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-text-secondary/20 rounded animate-pulse w-full"></div>
                                        <div className="h-4 bg-text-secondary/20 rounded animate-pulse w-3/4"></div>
                                    </div>
                                </div>
                            ) : forecast ? (
                                <div className="bg-bg-primary p-4 rounded-lg">
                                    <h4 className="font-bold text-accent-primary mb-2">AI Goal Forecast</h4>
                                    {forecast.error ? (
                                        <p className="text-sm text-accent-secondary">{forecast.error}</p>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {typeof forecast.feasibilityScore === 'number' && (
                                                <div className="flex flex-col items-center">
                                                    <FeasibilityGauge score={forecast.feasibilityScore} />
                                                    <p className="text-xs font-bold mt-1 text-text-secondary">Feasibility</p>
                                                </div>
                                            )}
                                            <div className="flex-grow">
                                                {forecast.projectedDate && (
                                                    <p className="text-sm text-text-secondary">
                                                        <span className="font-bold text-text-primary">Projected Completion:</span> {forecast.projectedDate}
                                                    </p>
                                                )}
                                                {forecast.analysis && (
                                                    <p className="text-sm italic text-text-secondary mt-1">"{forecast.analysis}"</p>
                                                )}
                                                {forecast.accelerationTips && forecast.accelerationTips.length > 0 && (
                                                    <div className="mt-3">
                                                        <h5 className="text-sm font-bold text-text-primary">Acceleration Tips:</h5>
                                                        <ul className="list-disc list-inside text-sm text-text-secondary space-y-1 mt-1">
                                                            {forecast.accelerationTips.map((tip, i) => <li key={i}>{tip}</li>)}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Button
                                    onClick={() => handleFetchForecast(goal)}
                                    variant="secondary"
                                    className="w-full"
                                    disabled={!!loadingForecastId}
                                >
                                    {loadingForecastId ? 'Analyzing...' : 'Get AI Forecast'}
                                </Button>
                            )}
                        </div>
                    </Card>
                );
            })}
        </div>

        <Card>
            <div className="flex items-center gap-2">
                 <TrophyIcon className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-bold text-text-primary">Achievements</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                {achievements.slice(0, 3).map(ach => (
                     <div key={ach.id} className={`${ach.unlocked ? 'opacity-100' : 'opacity-40'}`}>
                         <div className="text-4xl">{ach.emoji}</div>
                         <p className="text-xs font-semibold mt-1 text-text-primary">{ach.name}</p>
                         <p className="text-xs text-text-secondary">{ach.unlocked ? 'Unlocked' : 'Locked'}</p>
                     </div>
                ))}
            </div>
             {achievements.length > 3 && (
                <p className="text-xs text-center mt-4 text-text-secondary">And {achievements.length - 3} more... view them in your Profile!</p>
            )}
        </Card>
    </div>
  );
};

export default Goals;
