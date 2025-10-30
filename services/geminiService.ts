import { GoogleGenAI, Chat, Type } from "@google/genai";
import type { ChatMessage, BudgetCategory, Transaction, EndOfCycleReview } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

let chatInstance: Chat | null = null;
let helpChatInstance: Chat | null = null;

export interface PotentialSubscription {
    name: string;
    estimatedAmount: number;
    frequency: 'monthly' | 'quarterly' | 'annually' | 'unknown';
    firstDetectedDate: string; // ISO date string
}

export interface FinancialHealthReport {
    overallScore: number; // 0-100
    scoreRationale: string;
    spendingAnalysis: {
        summary: string;
        topSpendingCategory: string;
        potentialSavings: string;
    };
    budgetAdherence: {
        summary: string;
        overspentCategories: string[];
        underspentCategories: string[];
    };
    savingsPerformance: {
        summary: string;
        savingsRate: number; // as a percentage
        recommendation: string;
    };
}

const getChatInstance = (): Chat => {
    const systemInstruction = `You are Bubbly, a financial coach from Budgetly AI. Your tone is Friendly. Provide clear, actionable financial advice. Use markdown for formatting.`;
    
    if (chatInstance) {
        // This is a simplified approach. In a real app, you might want to check if the system instruction needs updating.
        return chatInstance;
    }
    
    chatInstance = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return chatInstance;
};

export const generateBudget = async (income: number, fixedCosts: number, currencySymbol: string): Promise<Omit<BudgetCategory, 'spent'>[]> => {
    try {
        const prompt = `
        Analyse the user's financial situation.
        - Monthly Income: ${currencySymbol}${income}
        - Fixed Costs (Needs like rent, EMIs): ${currencySymbol}${fixedCosts}

        Your task is to create a balanced monthly budget based on the 50/30/20 rule (50% Needs, 30% Wants, 20% Savings), after accounting for the mandatory fixed costs.

        Instructions:
        1.  The list of categories you generate should ONLY include the REMAINING budget after subtracting the fixed costs.
        2.  Do NOT include an item for "Fixed Costs" in your response, as the user has already provided it.
        3.  Create categories for common "Wants" (e.g., Dining Out, Entertainment, Shopping) and "Savings/Investments".
        4.  The sum of all 'allocated' amounts in your response should not exceed ${income - fixedCosts}.
        5.  Provide a realistic and diverse set of categories.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: {
                                type: Type.STRING,
                                description: 'Name of the budget category (e.g., Groceries, Savings).'
                            },
                            allocated: {
                                type: Type.NUMBER,
                                description: 'The suggested monthly budget amount for this category.'
                            },
                        },
                        required: ['name', 'allocated']
                    }
                }
            }
        });
        
        const resultText = response.text.trim();
        const budgetItems = JSON.parse(resultText) as Omit<BudgetCategory, 'spent'>[];
        
        // Add the user's fixed costs back into the budget
        const fullBudget = [{ name: 'Fixed Costs', allocated: fixedCosts }, ...budgetItems];
        
        return fullBudget;

    } catch (error) {
        console.error("Error generating budget:", error);
        if (error.message && error.message.includes('RESOURCE_EXHAUSTED')) {
            throw new Error("Budget generation failed: You've exceeded your API quota. Please check your billing details or try again later.");
        }
        throw new Error("Failed to generate budget from AI.");
    }
};


export const getFinancialInsight = async (prompt: string, data: unknown, currencySymbol: string): Promise<string> => {
    try {
        const fullPrompt = `${prompt}\n\nIMPORTANT: Use the currency symbol "${currencySymbol}" for all monetary values in your response.\n\nData:\n${JSON.stringify(data, null, 2)}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: fullPrompt }] },
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching financial insight:", error);
        if (error.message && error.message.includes('RESOURCE_EXHAUSTED')) {
            return "AI Summary is unavailable due to exceeded API quota. Please check your billing details or try again later.";
        }
        return "Sorry, I couldn't generate an insight at this moment.";
    }
};

export const getGoalFeasibility = async (goal: unknown, financialData: unknown, currencySymbol: string): Promise<string> => {
    try {
        const prompt = `Analyze the feasibility of the financial goal based on the user's financial data.

        IMPORTANT: Use the currency symbol "${currencySymbol}" for all monetary values in your analysis.

        Goal: ${JSON.stringify(goal, null, 2)}
        Financial Data: ${JSON.stringify(financialData, null, 2)}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        feasibilityScore: {
                            type: Type.INTEGER,
                            description: "A score from 0-100 indicating how achievable the goal is with current savings habits. 100 is highly achievable."
                        },
                        projectedDate: {
                            type: Type.STRING,
                            description: "The estimated month and year of goal completion (e.g., 'December 2025')."
                        },
                        analysis: {
                            type: Type.STRING,
                            description: "A single, motivating summary sentence about the goal's progress."
                        },
                        accelerationTips: {
                            type: Type.ARRAY,
                            description: "An array of 2-3 short, actionable tips to reach the goal faster.",
                            items: {
                                type: Type.STRING,
                            }
                        }
                    },
                    required: ['feasibilityScore', 'projectedDate', 'analysis', 'accelerationTips']
                }
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching goal feasibility:", error);
         if (error.message && error.message.includes('RESOURCE_EXHAUSTED')) {
            return JSON.stringify({ error: "AI Forecast is unavailable due to exceeded API quota. Please check your billing details or try again later." });
        }
        return JSON.stringify({ error: "Sorry, I couldn't generate a forecast for your goal right now." });
    }
};


export const getChatResponse = async (message: string): Promise<string> => {
    try {
        const chat = getChatInstance();
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error getting chat response:", error);
        if (error.message && error.message.includes('RESOURCE_EXHAUSTED')) {
            return "I'm currently unable to respond due to exceeded API quota. Please check your plan and billing details, or try again in a while.";
        }
        return "I'm having trouble connecting right now. Please try again later.";
    }
};

export const findRecurringPayments = async (transactions: Transaction[]): Promise<PotentialSubscription[]> => {
    try {
        const expenseTransactions = transactions
            .filter(t => t.type === 'expense' && t.amount > 0)
            .slice(0, 100); // Limit to last 100 expenses for performance

        if (expenseTransactions.length < 5) {
            return []; // Not enough data to analyze
        }

        const prompt = `
        Analyze this list of user expense transactions to identify potential recurring payments like subscriptions or monthly bills.
        
        Instructions:
        1. Look for transactions with similar descriptions and amounts that occur at regular intervals (roughly monthly, quarterly, or annually).
        2. Consolidate variations in descriptions (e.g., "NETFLIX", "Netflix.com") into a single merchant name.
        3. For each recurring payment you identify, provide the merchant name, the most common transaction amount, the billing frequency, and the date of the first transaction you used for your analysis.
        4. Exclude one-off large purchases. Focus on bill-like payments.
        5. If the amount varies slightly, provide the average amount.
        
        Transaction Data:
        ${JSON.stringify(expenseTransactions.map(t => ({ date: t.date, description: t.description, amount: t.amount })), null, 2)}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: {
                                type: Type.STRING,
                                description: 'The name of the merchant or service (e.g., "Netflix", "Electricity Bill").'
                            },
                            estimatedAmount: {
                                type: Type.NUMBER,
                                description: 'The estimated recurring amount, rounded to the nearest integer.'
                            },
                            frequency: {
                                type: Type.STRING,
                                description: 'The detected billing frequency ("monthly", "quarterly", "annually", or "unknown").'
                            },
                            firstDetectedDate: {
                                type: Type.STRING,
                                description: 'The ISO date string of the first transaction in the detected pattern.'
                            }
                        },
                        required: ['name', 'estimatedAmount', 'frequency', 'firstDetectedDate']
                    }
                }
            }
        });

        const resultText = response.text.trim();
        return JSON.parse(resultText) as PotentialSubscription[];

    } catch (error) {
        console.error("Error finding recurring payments:", error);
        if (error.message && error.message.includes('RESOURCE_EXHAUSTED')) {
            throw new Error("AI analysis is unavailable due to exceeded API quota.");
        }
        throw new Error("AI analysis failed. Please try again later.");
    }
};

export const generateFinancialHealthReport = async (
    transactions: Transaction[],
    budget: BudgetCategory[],
    income: number,
    expenses: number,
    currencySymbol: string,
): Promise<FinancialHealthReport> => {
    try {
        const recentTransactions = transactions.slice(0, 50); // limit for prompt size

        const prompt = `
        Analyze the user's financial data for the current cycle to generate a comprehensive Financial Health Report.
        
        **User Data:**
        - Currency: ${currencySymbol}
        - Total Income: ${income}
        - Total Expenses: ${expenses}
        - Budget Allocation: ${JSON.stringify(budget)}
        - Recent Transactions: ${JSON.stringify(recentTransactions.map(t => ({ description: t.description, amount: t.amount, category: t.category, type: t.type })))}

        **Your Task:**
        Generate a JSON object that strictly follows the provided schema.
        1.  **overallScore**: An integer from 0 to 100 representing the user's financial health. A score of 100 is excellent. Base this on savings rate, budget adherence, and spending habits. A savings rate of 20% or more is excellent.
        2.  **scoreRationale**: A brief, one-sentence explanation for the score.
        3.  **spendingAnalysis**:
            -   **summary**: A 1-2 sentence summary of spending patterns.
            -   **topSpendingCategory**: The name of the category with the highest spending.
            -   **potentialSavings**: A short, actionable tip to reduce spending in their top category.
        4.  **budgetAdherence**:
            -   **summary**: A 1-2 sentence summary of how well they are sticking to their budget.
            -   **overspentCategories**: An array of strings with the names of categories where spending exceeds the allocated budget. If none, return an empty array.
            -   **underspentCategories**: An array of strings with the names of categories where spending is significantly less than allocated. If none, return an empty array.
        5.  **savingsPerformance**:
            -   **summary**: A 1-2 sentence summary of their savings performance.
            -   **savingsRate**: Calculate the savings rate as a percentage ((Income - Expenses) / Income) * 100. Return it as a number rounded to two decimal places. If income is zero, return 0.
            -   **recommendation**: One actionable tip to improve their savings rate.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallScore: { type: Type.INTEGER },
                        scoreRationale: { type: Type.STRING },
                        spendingAnalysis: {
                            type: Type.OBJECT,
                            properties: {
                                summary: { type: Type.STRING },
                                topSpendingCategory: { type: Type.STRING },
                                potentialSavings: { type: Type.STRING },
                            },
                            required: ['summary', 'topSpendingCategory', 'potentialSavings']
                        },
                        budgetAdherence: {
                            type: Type.OBJECT,
                            properties: {
                                summary: { type: Type.STRING },
                                overspentCategories: { type: Type.ARRAY, items: { type: Type.STRING } },
                                underspentCategories: { type: Type.ARRAY, items: { type: Type.STRING } },
                            },
                             required: ['summary', 'overspentCategories', 'underspentCategories']
                        },
                        savingsPerformance: {
                            type: Type.OBJECT,
                            properties: {
                                summary: { type: Type.STRING },
                                savingsRate: { type: Type.NUMBER },
                                recommendation: { type: Type.STRING },
                            },
                            required: ['summary', 'savingsRate', 'recommendation']
                        },
                    },
                    required: ['overallScore', 'scoreRationale', 'spendingAnalysis', 'budgetAdherence', 'savingsPerformance']
                }
            }
        });

        const resultText = response.text.trim();
        return JSON.parse(resultText) as FinancialHealthReport;
    } catch (error) {
        console.error("Error generating financial health report:", error);
        if (error.message && error.message.includes('RESOURCE_EXHAUSTED')) {
            throw new Error("AI report is unavailable due to exceeded API quota.");
        }
        throw new Error("AI health report failed. Please try again later.");
    }
};

export const getHelpChatResponse = async (message: string): Promise<string> => {
    const systemInstruction = `You are a helpful assistant for the "Budgetly AI" app. Your goal is to answer user questions about how to use the app. Be friendly and concise. Use markdown for formatting lists or important terms.
    App Features:
    - Home: Dashboard with financial score, income/expense summary, and recent transactions.
    - Planner: Manage budget categories, view pie chart, and handle recurring bills/subscriptions. AI can help create a budget.
    - Insights: AI Coach Chat for financial advice.
    - Goals: Track financial goals and see AI forecasts on their feasibility.
    - Profile: Manage user profile, family members, linked accounts, and all app settings.
    `;
    
    if (!helpChatInstance) {
        helpChatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });
    }

    try {
        const response = await helpChatInstance.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error getting help chat response:", error);
        return "Sorry, I am unable to respond at the moment. Please try again later.";
    }
};

export const generateEndOfCycleReview = async (
    budgetWithSpending: BudgetCategory[],
    transactions: Transaction[],
    currencySymbol: string
): Promise<EndOfCycleReview> => {
    try {
        const recentTransactions = transactions.filter(t => t.type === 'expense').slice(0, 50);

        const prompt = `
        Analyze the user's budget performance for the last cycle and propose an optimized budget for the next one.

        **Last Cycle's Data:**
        - Currency: ${currencySymbol}
        - Budget Plan & Actual Spending: ${JSON.stringify(budgetWithSpending.map(b => ({ category: b.name, allocated: b.allocated, spent: b.spent })))}
        - Recent Expense Transactions: ${JSON.stringify(recentTransactions.map(t => ({ description: t.description, amount: t.amount, category: t.category })))}

        **Your Task:**
        Generate a JSON object response with two keys: "summary" and "newBudget".
        1.  **summary**: Write a brief, 2-3 sentence summary of the user's spending habits. Highlight one area of overspending and one area where they did well.
        2.  **newBudget**: Create a new budget as an array of objects, each with "name" and "allocated" properties.
            -   The new budget should be more realistic based on the actual spending data.
            -   Slightly reduce budgets for overspent categories and potentially reallocate those funds to savings or other underfunded areas.
            -   Keep category names consistent with the original budget. You can add a new category if you see a clear pattern of spending that isn't budgeted for, but prefer adjusting existing ones.
            -   The total allocated amount of the new budget should be similar to the old one.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: {
                            type: Type.STRING,
                            description: "A brief summary of the user's performance and spending habits in the last cycle."
                        },
                        newBudget: {
                            type: Type.ARRAY,
                            description: "The new, optimized budget proposal.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    allocated: { type: Type.NUMBER }
                                },
                                required: ['name', 'allocated']
                            }
                        }
                    },
                    required: ['summary', 'newBudget']
                }
            }
        });

        const resultText = response.text.trim();
        return JSON.parse(resultText) as EndOfCycleReview;

    } catch (error) {
        console.error("Error generating end-of-cycle review:", error);
        if (error.message && error.message.includes('RESOURCE_EXHAUSTED')) {
            throw new Error("AI review is unavailable due to exceeded API quota.");
        }
        throw new Error("AI budget review failed. Please try again later.");
    }
};