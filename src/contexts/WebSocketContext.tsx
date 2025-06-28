'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface Notification {
  type: 'NEW_APPLICANT' | 'ANALYSIS_COMPLETE';
  applicantName?: string;
  jobTitle?: string;
  score?: number;
  jobId?: string;
  applicantId?: string;
  timestamp: number;
  message: string;
  messageId?: string;
}

interface WebSocketContextType {
  lastMessage: Notification | null;
  isConnected: boolean;
  notifications: Notification[];
  clearNotifications: () => void;
  markAsRead: (index: number) => void;
  isFallbackMode: boolean;
  isConnectionDisabled: boolean;
  retryConnection: () => void;
  setLastMessage: (notification: Notification | null) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [lastMessage, setLastMessage] = useState<Notification | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [maxRetries] = useState(3);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [hasLoggedConnectionError, setHasLoggedConnectionError] = useState(false);
  const [isConnectionDisabled, setIsConnectionDisabled] = useState(false);
  
  const processedMessageIds = useRef<Set<string>>(new Set());
  const recentNotifications = useRef<Map<string, number>>(new Map());

  const connectWebSocket = () => {
    // Don't attempt to connect if disabled
    if (isConnectionDisabled) {
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://m1449b7nei.execute-api.us-west-2.amazonaws.com/v1/';
    
    if (!socketUrl) {
      if (!hasLoggedConnectionError) {
        console.error("WebSocket URL is not defined.");
        setHasLoggedConnectionError(true);
      }
      setIsFallbackMode(true);
      setIsConnectionDisabled(true);
      return;
    }

    if (connectionAttempts >= maxRetries) {
      if (!hasLoggedConnectionError) {
        console.error(`WebSocket connection failed after ${maxRetries} attempts. Giving up.`);
        console.error("Please check:");
        console.error("1. Your .env.local file has NEXT_PUBLIC_WEBSOCKET_URL set correctly");
        console.error("2. Your AWS API Gateway WebSocket API is deployed");
        console.error("3. The WebSocket URL is accessible from your browser");
        console.error("4. See AWS_WEBSOCKET_SETUP_GUIDE.md for detailed instructions");
        setHasLoggedConnectionError(true);
      }
      setIsFallbackMode(true);
      setIsConnectionDisabled(true);
      return;
    }

    try {
      const ws = new WebSocket(socketUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setIsFallbackMode(false);
        setConnectionAttempts(0);
        setHasLoggedConnectionError(false);
        setIsConnectionDisabled(false);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          const messageId = data.messageId || generateMessageId(data);
          
          if (processedMessageIds.current.has(messageId)) {
            return;
          }
          
          const now = Date.now();
          const recentKey = `${data.type}-${data.applicantId || data.applicantName}-${data.jobId || data.jobTitle}`;
          const recentTime = recentNotifications.current.get(recentKey);
          
          if (recentTime && (now - recentTime) < 5000) {
            return;
          }
          
          const notification: Notification = {
            type: data.type,
            applicantName: data.applicantName,
            jobTitle: data.jobTitle,
            score: data.score,
            jobId: data.jobId,
            applicantId: data.applicantId,
            timestamp: now,
            message: data.message || getDefaultMessage(data),
            messageId: messageId
          };
          
          processedMessageIds.current.add(messageId);
          recentNotifications.current.set(recentKey, now);
          
          if (processedMessageIds.current.size > 100) {
            const idsArray = Array.from(processedMessageIds.current);
            processedMessageIds.current = new Set(idsArray.slice(-50));
          }
          
          const tenSecondsAgo = now - 10000;
          for (const [key, timestamp] of recentNotifications.current.entries()) {
            if (timestamp < tenSecondsAgo) {
              recentNotifications.current.delete(key);
            }
          }
          
          setLastMessage(notification);
          setNotifications(prev => [notification, ...prev.slice(0, 49)]);
        } catch (error) {
          if (!hasLoggedConnectionError) {
            console.error("❌ Error parsing WebSocket message:", error);
            console.error("❌ Raw message that failed to parse:", event.data);
            setHasLoggedConnectionError(true);
          }
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        
        if (event.code !== 1000 && connectionAttempts < maxRetries && !isConnectionDisabled) {
          setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
            connectWebSocket();
          }, 3000);
        } else if (connectionAttempts >= maxRetries) {
          setIsFallbackMode(true);
          setIsConnectionDisabled(true);
        }
      };

      ws.onerror = (error) => {
        if (!hasLoggedConnectionError) {
          console.error("❌ WebSocket connection error:", error);
          console.error("🔍 WebSocket details:", {
            readyState: ws.readyState,
            url: ws.url,
            bufferedAmount: ws.bufferedAmount
          });
          console.error("💡 ReadyState meanings:");
          console.error("  0: CONNECTING");
          console.error("  1: OPEN");
          console.error("  2: CLOSING");
          console.error("  3: CLOSED");
          setHasLoggedConnectionError(true);
        }
        setIsConnected(false);
      };

      setSocket(ws);
    } catch (error) {
      if (!hasLoggedConnectionError) {
        console.error("❌ Error creating WebSocket connection:", error);
        setHasLoggedConnectionError(true);
      }
      setIsConnected(false);
      setIsFallbackMode(true);
      setIsConnectionDisabled(true);
    }
  };

  const generateMessageId = (data: any): string => {
    const components = [
      data.type,
      data.applicantId || data.applicantName,
      data.jobId || data.jobTitle,
      data.timestamp || Date.now()
    ].filter(Boolean);
    
    return components.join('-');
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connectionAttempts]);

  useEffect(() => {
    if (isFallbackMode && notifications.length === 0) {
      const demoNotification: Notification = {
        type: 'NEW_APPLICANT',
        applicantName: 'Demo User',
        jobTitle: 'Software Engineer',
        timestamp: Date.now(),
        message: 'Demo notification - WebSocket connection not available',
        messageId: 'demo-notification'
      };
      setNotifications([demoNotification]);
    }
  }, [isFallbackMode, notifications.length]);

  const getDefaultMessage = (data: any): string => {
    switch (data.type) {
      case 'NEW_APPLICANT':
        return `New application received from ${data.applicantName || 'an applicant'} for ${data.jobTitle || 'a job position'}`;
      case 'ANALYSIS_COMPLETE':
        return `AI analysis completed for ${data.applicantName || 'an applicant'} with score: ${data.score || 'N/A'}`;
      default:
        return 'New notification received';
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  // Manual retry function
  const retryConnection = () => {
    setConnectionAttempts(0);
    setHasLoggedConnectionError(false);
    setIsConnectionDisabled(false);
    setIsFallbackMode(false);
    connectWebSocket();
  };

  return (
    <WebSocketContext.Provider value={{ 
      lastMessage, 
      isConnected, 
      notifications, 
      clearNotifications, 
      markAsRead,
      isFallbackMode,
      isConnectionDisabled,
      retryConnection,
      setLastMessage
    }}>
      {children}
    </WebSocketContext.Provider>
  );
}; 