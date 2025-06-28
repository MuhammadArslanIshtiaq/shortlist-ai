# WebSocket Notifications Setup

This document explains how to set up real-time notifications for the Shortlist AI application.

## Overview

The notification system provides real-time updates for:
- New job applications
- AI analysis completion

## Backend Setup (Already Completed)

You have already set up:
1. DynamoDB table: `WebSocketConnections`
2. WebSocket API Gateway: `wss://m1449b7nei.execute-api.us-west-2.amazonaws.com/v1/`
3. Lambda functions: `handleSocketConnect`, `handleSocketDisconnect`
4. Updated: `submitApplication`, `processAnalysis` functions

## Frontend Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_WEBSOCKET_URL=wss://m1449b7nei.execute-api.us-west-2.amazonaws.com/v1/
```

### 2. Components Created

The following components have been created:

- **`src/contexts/WebSocketContext.tsx`**: Manages WebSocket connection and notifications
- **`src/components/NotificationHandler.tsx`**: Displays toast notifications
- **`src/components/NotificationPanel.tsx`**: Shows notification history in a dropdown

### 3. Integration

The WebSocket provider has been integrated into the dashboard layout at `src/app/dashboard/layout.tsx`.

## Features

### Real-time Notifications
- **New Applications**: Shows when someone applies for a job
- **AI Analysis Complete**: Shows when AI finishes analyzing a resume

### Notification Panel
- Click the bell icon in the header to view all notifications
- Shows connection status (connected/disconnected)
- Ability to mark notifications as read
- Clear all notifications

### Toast Notifications
- Automatic popup notifications for new events
- Different styles for different notification types
- Auto-dismiss after 5 seconds

## Message Format

The WebSocket expects messages in this format:

```json
{
  "type": "NEW_APPLICANT" | "ANALYSIS_COMPLETE",
  "applicantName": "John Doe",
  "jobTitle": "Software Engineer",
  "score": 85,
  "jobId": "job-123",
  "applicantId": "app-456",
  "message": "Custom message (optional)"
}
```

## Testing

1. Start the development server: `npm run dev`
2. Open the dashboard
3. Check the browser console for WebSocket connection status
4. Submit a test application or trigger AI analysis
5. Verify notifications appear in real-time

## Troubleshooting

### Connection Issues
- Check if the WebSocket URL is correct in `.env.local`
- Verify the API Gateway is deployed and accessible
- Check browser console for connection errors

### No Notifications
- Ensure the backend Lambda functions are sending messages to the WebSocket
- Check if the connection is established (green dot in notification panel)
- Verify the message format matches the expected structure

### Build Issues
- Make sure `react-hot-toast` is installed: `npm install react-hot-toast`
- Check for any TypeScript errors in the notification components 