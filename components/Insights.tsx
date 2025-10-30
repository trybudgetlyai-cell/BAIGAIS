import React, { useState, useRef, useEffect } from 'react';
import Button from './ui/Button';
import { getChatResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { SendIcon, SparklesIcon, CloseIcon } from '../constants';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AICoachModal: React.FC<AICoachModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: "Hello! I'm Bubbly your AI Financial Coach. Ask me how to improve your score or save more!" }
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

        const responseText = await getChatResponse(input);
        const modelMessage: ChatMessage = { role: 'model', text: responseText };
        setMessages(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-end z-50 animate-fade-in">
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes slide-in-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .animate-slide-in-up { animation: slide-in-up 0.3s ease-out forwards; }
            `}</style>
            <div 
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden="true"
            ></div>
            <div className="relative w-full max-w-2xl mx-auto h-[90vh] bg-bg-secondary rounded-t-2xl flex flex-col animate-slide-in-up">
                <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-accent-primary" />
                        <h2 className="text-xl font-bold text-text-primary">Bubbly</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-primary">
                        <CloseIcon className="w-6 h-6 text-text-secondary" />
                    </button>
                </header>

                <div className="flex-grow flex flex-col overflow-y-auto p-4">
                    <div className="flex-grow space-y-4 py-2">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-accent-primary text-accent-text rounded-br-lg' : 'bg-bg-primary text-text-primary rounded-bl-lg'}`}>
                                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs p-3 rounded-2xl bg-bg-primary text-text-primary rounded-bl-lg">
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
                </div>
                <div className="p-4 border-t border-border flex-shrink-0">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask for financial advice..."
                            className="flex-grow bg-bg-primary border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                            disabled={isLoading}
                        />
                        <Button onClick={handleSend} disabled={isLoading} className="w-12 h-12 flex-shrink-0">
                            <SendIcon className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AICoachModal;