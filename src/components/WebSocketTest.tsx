'use client';

import { useWebSocket } from '@/contexts/WebSocketContext';
import { Wifi, WifiOff } from 'lucide-react';

export default function WebSocketTest() {
  const { isConnected, isFallbackMode } = useWebSocket();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isConnected ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-600" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">WebSocket Status</h3>
          <p className="text-xs text-gray-600">
            {isConnected 
              ? 'Connected - Real-time notifications active' 
              : isFallbackMode 
                ? 'Fallback mode - Using demo notifications'
                : 'Disconnected - Attempting to reconnect...'
            }
          </p>
        </div>
      </div>
    </div>
  );
} 