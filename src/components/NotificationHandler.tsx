'use client';

import { useEffect, useRef } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, UserPlus, Brain, X } from 'lucide-react';

export default function NotificationHandler() {
  const { lastMessage } = useWebSocket();
  const lastProcessedMessageId = useRef<string | null>(null);

  useEffect(() => {
    if (lastMessage && lastMessage.messageId) {
      // Check if we've already processed this message
      if (lastProcessedMessageId.current === lastMessage.messageId) {
        return;
      }
      
      const { type, applicantName, jobTitle, score, message } = lastMessage;
      
      // Mark this message as processed
      lastProcessedMessageId.current = lastMessage.messageId;
      
      switch (type) {
        case 'NEW_APPLICANT':
          toast.success(
            <div className="flex items-start space-x-3">
              <UserPlus className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">New Application</p>
                <p className="text-sm text-green-700">
                  {applicantName ? `${applicantName} applied for ${jobTitle || 'a position'}` : message}
                </p>
              </div>
            </div>,
            {
              duration: 5000,
              position: 'top-right',
              style: {
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
              },
            }
          );
          break;
          
        case 'ANALYSIS_COMPLETE':
          toast.success(
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">AI Analysis Complete</p>
                <p className="text-sm text-blue-700">
                  {applicantName ? `${applicantName}'s resume analyzed (Score: ${score || 'N/A'})` : message}
                </p>
              </div>
            </div>,
            {
              duration: 5000,
              position: 'top-right',
              style: {
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1e40af',
              },
            }
          );
          break;
          
        default:
          toast.success(message, {
            duration: 4000,
            position: 'top-right',
          });
      }
    }
  }, [lastMessage]);

  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        success: {
          duration: 5000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
} 