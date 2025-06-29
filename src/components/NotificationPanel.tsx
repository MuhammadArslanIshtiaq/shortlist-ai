'use client';

import { useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { 
  Bell, 
  X, 
  UserPlus, 
  Brain, 
  Trash2,
  Clock
} from 'lucide-react';

export default function NotificationPanel() {
  const { notifications, isConnected, clearNotifications, markAsRead } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.length;

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_APPLICANT':
        return <UserPlus className="w-5 h-5 text-green-600" />;
      case 'ANALYSIS_COMPLETE':
        return <Brain className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'NEW_APPLICANT':
        return 'border-l-green-500 bg-green-50';
      case 'ANALYSIS_COMPLETE':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {!isConnected && (
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gray-400 rounded-full"></div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={clearNotifications}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Connection Status */}
          <div className={`px-4 py-2 text-xs ${
            isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-64">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
                <p className="text-sm">You&apos;ll see real-time updates here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={`p-4 border-l-4 ${getNotificationColor(notification.type)} hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.type === 'NEW_APPLICANT' ? 'New Application' : 'AI Analysis Complete'}
                          </p>
                          <button
                            onClick={() => markAsRead(index)}
                            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 