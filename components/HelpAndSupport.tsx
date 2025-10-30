import React, { useState, useRef, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { getHelpChatResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { SendIcon } from '../constants';

interface HelpAndSupportProps {
    onBack: () => void;
}

const HelpAndSupport: React.FC<HelpAndSupportProps> = ({ onBack }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: "Hello! I'm here to help. Ask me anything about using the Budgetly AI app." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        
        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const responseText = await getHelpChatResponse(input);
        const modelMessage: ChatMessage = { role: 'model', text: responseText };
        setMessages(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };

    return (
        <div className="space-y-4">
            <Card>
                <div className="h-[70vh] flex flex-col bg-bg-primary rounded-lg p-2">
                    <div className="flex-grow space-y-4 p-2 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-accent-primary text-accent-text' : 'bg-bg-secondary text-text-primary'}`}>
                                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs p-3 rounded-lg bg-bg-secondary text-text-primary">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                     <div className="mt-4 flex gap-2 p-2 border-t border-border">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="e.g., How do I add a category?"
                            className="flex-grow bg-bg-secondary border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                            disabled={isLoading}
                        />
                        <Button onClick={handleSend} disabled={isLoading}>
                            <SendIcon className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default HelpAndSupport;