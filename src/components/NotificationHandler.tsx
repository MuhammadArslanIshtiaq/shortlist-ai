'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useData } from '@/contexts/DataContext';
import toast, { Toaster } from 'react-hot-toast';
import { UserPlus, Brain } from 'lucide-react';

export default function NotificationHandler() {
  const { lastMessage } = useWebSocket();
  const { applicants } = useData();
  const lastProcessedMessageId = useRef<string | null>(null);
  const router = useRouter();

  const handleAnalysisCompleteClick = (applicantId: string) => {
    // Find the applicant to determine their status
    const applicant = applicants.find(a => a.applicantId === applicantId);
    
    if (applicant) {
      // Navigate to the appropriate page based on applicant status
      switch (applicant.applicationStatus) {
        case 'SHORTLISTED':
          router.push(`/dashboard/applicants/shortlisted?applicantId=${applicantId}`);
          break;
        case 'TALENT_POOL':
          router.push(`/dashboard/applicants/talent-pool?applicantId=${applicantId}`);
          break;
        default:
          // For all other statuses (APPLIED, REVIEWED, etc.), go to main applicants page
          router.push(`/dashboard/applicants?applicantId=${applicantId}`);
          break;
      }
    } else {
      // If applicant not found, default to main applicants page
      router.push(`/dashboard/applicants?applicantId=${applicantId}`);
    }
  };

  useEffect(() => {
    console.log("🔔 NotificationHandler: lastMessage changed:", lastMessage);
    
    if (lastMessage && lastMessage.messageId) {
      // Check if we've already processed this message
      if (lastProcessedMessageId.current === lastMessage.messageId) {
        console.log("🔔 Message already processed, skipping:", lastMessage.messageId);
        return;
      }
      
      console.log("🔔 Processing notification:", lastMessage);
      const { type, applicantName, jobTitle, score, message, applicantId } = lastMessage;
      
      // Mark this message as processed
      lastProcessedMessageId.current = lastMessage.messageId;
      
      switch (type) {
        case 'NEW_APPLICANT':
          console.log("🔔 Showing NEW_APPLICANT toast");
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
              duration: Infinity, // Keep open until manually closed
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
          console.log("🔔 Showing ANALYSIS_COMPLETE toast");
          toast.success(
            <div 
              className="flex items-start space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => applicantId && handleAnalysisCompleteClick(applicantId)}
              title="Click to view applicant details"
            >
              <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">AI Analysis Complete</p>
                <p className="text-sm text-blue-700">
                  {applicantName ? `${applicantName}'s resume analyzed (Score: ${score || 'N/A'})` : message}
                </p>
                <p className="text-xs text-blue-600 mt-1 font-medium">Click to view details →</p>
              </div>
            </div>,
            {
              duration: Infinity, // Keep open until manually closed
              position: 'top-right',
              style: {
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1e40af',
                cursor: 'pointer',
              },
            }
          );
          break;
          
        default:
          console.log("🔔 Showing default toast for type:", type);
          toast.success(message, {
            duration: Infinity, // Keep open until manually closed
            position: 'top-right',
          });
      }
    }
  }, [lastMessage, router, applicants]);

  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        success: {
          duration: Infinity, // Keep open until manually closed
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        error: {
          duration: Infinity, // Keep open until manually closed
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
} 