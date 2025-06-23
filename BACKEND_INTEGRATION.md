# Backend Integration Setup

This document provides instructions for connecting the Shortlist AI frontend with the AWS backend.

## Prerequisites

1. AWS backend deployed 
2. AWS Cognito User Pool configured
3. API Gateway endpoint available
4. S3 bucket for resume uploads configured

## Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# AWS Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-west-2_xxxxxxxxx
NEXT_PUBLIC_COGNITO_APP_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxx

# API Gateway Configuration
NEXT_PUBLIC_API_GATEWAY_URL=https://xxxx.execute-api.us-west-2.amazonaws.com/v1

# AWS Region
NEXT_PUBLIC_AWS_REGION=us-west-2
```

## Steps to Configure

1. **Get Cognito User Pool ID and Client ID:**
   - Go to AWS Cognito Console
   - Select your User Pool
   - Copy the User Pool ID
   - Go to App Integration > App client and analytics
   - Copy the App client ID

2. **Get API Gateway URL:**
   - Go to API Gateway Console
   - Select your API
   - Copy the Invoke URL
   - Add `/v1` to the end

3. **Update the .env.local file** with your actual values

4. **Test the Integration:**
   - Run `npm run dev`
   - Try logging in with a user from your Cognito User Pool
   - Test creating a job (admin panel)
   - Test applying for a job (careers page)

## Features Implemented

### Authentication
- ✅ AWS Cognito integration
- ✅ Protected admin routes
- ✅ Login/logout functionality

### Admin Panel
- ✅ Job creation with API integration
- ✅ Authenticated API calls
- ✅ Error handling and loading states

### Careers Portal
- ✅ Public job listings
- ✅ Application form with file upload
- ✅ S3 presigned URL integration
- ✅ Public API calls

### API Client
- ✅ Authenticated fetch for admin operations
- ✅ Public fetch for applicant operations
- ✅ Automatic token handling
- ✅ Error handling

## Troubleshooting

1. **Authentication Issues:**
   - Verify Cognito User Pool ID and Client ID
   - Check if users exist in the User Pool
   - Ensure the User Pool is in the correct region

2. **API Connection Issues:**
   - Verify API Gateway URL is correct
   - Check if the API is deployed
   - Ensure CORS is configured properly

3. **File Upload Issues:**
   - Verify S3 bucket permissions
   - Check if the presigned URL endpoint is working
   - Ensure file size limits are appropriate

## Next Steps

1. Deploy the frontend to a hosting service (Vercel, Netlify, etc.)
2. Set up environment variables in the hosting platform
3. Configure custom domain if needed
4. Set up monitoring and logging
5. Implement additional features as needed 