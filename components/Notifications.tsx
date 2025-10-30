import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { BellIcon, SparklesIcon, StarIcon, TrashIcon } from '../constants';
import type { Notification } from '../types';

interface NotificationsProps {
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    onBack: () => void;
}

const NotificationIcon: React.FC<{type: Notification['type']}> = ({ type }) => {
    switch (type) {
        case 'alert':
            return <BellIcon className="w-6 h-6 text-accent-secondary" />;
        case 'ai':
            return <SparklesIcon className="w-6 h-6 text-accent-primary" />;
        case 'info':
            return <StarIcon className="w-6 h-6 text-yellow-400" />;
        default:
            return <BellIcon className="w-6 h-6 text-text-secondary" />;
    }
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, setNotifications, onBack }) => {
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };
    
    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({...n, read: true})));
    };

    const handleDelete = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    
    const handleClearAll = () => {
        setNotifications([]);
    };

  return (
    <div className="space-y-4">
        {/* Removed redundant header; App.tsx provides a global header for this view. */}
        <Card>
            {notifications.length > 0 ? (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-text-secondary font-semibold">
                            {unreadCount > 0 ? `${unreadCount} Unread` : 'All caught up!'}
                        </p>
                        <div className="flex gap-2">
                            <Button onClick={handleMarkAllRead} variant="secondary" className="text-xs px-2 py-1" disabled={unreadCount === 0}>
                                Mark all as read
                            </Button>
                            <Button onClick={handleClearAll} variant="danger" className="text-xs px-2 py-1" disabled={notifications.length === 0}>
                                Clear All
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                        {notifications.map(n => (
                            <div 
                                key={n.id} 
                                className={`flex items-start gap-4 p-3 rounded-lg transition-colors ${!n.read ? 'bg-bg-primary' : 'bg-transparent'}`}
                                onClick={() => handleMarkAsRead(n.id)}
                                role="button"
                                tabIndex={0}
                            >
                                <div className="flex-shrink-0 mt-1 relative">
                                    {!n.read && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-primary rounded-full border-2 border-bg-secondary"></div>}
                                    <NotificationIcon type={n.type} />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold text-text-primary">{n.title}</p>
                                    <p className="text-sm text-text-secondary">{n.message}</p>
                                    <p className="text-xs text-text-secondary/70 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }} className="text-text-secondary hover:text-accent-secondary p-1">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center text-text-secondary py-8">
                    <BellIcon className="w-12 h-12 mx-auto text-text-secondary/50 mb-4" />
                    <h3 className="font-bold text-text-primary">All caught up!</h3>
                    <p>You have no new notifications.</p>
                </div>
            )}
        </Card>
    </div>
  );
};

export default Notifications;