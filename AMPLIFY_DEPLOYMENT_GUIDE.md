# AWS Amplify Deployment Guide

## Prerequisites

Before deploying to AWS Amplify, ensure you have:

1. **AWS Account** with appropriate permissions
2. **GitHub Repository** with your Next.js application
3. **AWS Cognito User Pool** configured
4. **API Gateway** endpoints set up
5. **WebSocket API** (optional, for real-time notifications)

## Environment Variables

Configure these environment variables in your AWS Amplify app settings:

### Required Environment Variables

```bash
# AWS Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_COGNITO_APP_CLIENT_ID=your-app-client-id

# API Gateway Configuration
NEXT_PUBLIC_API_GATEWAY_URL=https://your-api-gateway-url.amazonaws.com/prod
```

### Optional Environment Variables

```bash
# WebSocket Configuration (for real-time notifications)
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-websocket-api.amazonaws.com/v1
```

## Deployment Steps

### 1. Connect Repository

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Choose your Git provider (GitHub, GitLab, etc.)
4. Select your repository and branch

### 2. Configure Build Settings

The `amplify.yml` file is already configured in your repository. It includes:

- **PreBuild Phase**: Installs dependencies with `npm ci`
- **Build Phase**: Builds the Next.js application with `npm run build`
- **Artifacts**: Serves from `.next` directory
- **Cache**: Caches `node_modules` and `.next/cache`

### 3. Set Environment Variables

1. In Amplify Console, go to your app
2. Navigate to "Environment variables"
3. Add the required environment variables listed above

### 4. Deploy

1. Click "Save and deploy"
2. Monitor the build process in the console
3. Check for any build errors

## Troubleshooting

### Common Build Errors

1. **Environment Variables Missing**
   - Ensure all required environment variables are set in Amplify
   - Check that variable names match exactly (case-sensitive)

2. **Build Timeout**
   - The build process may take 5-10 minutes
   - If it times out, check for infinite loops or heavy operations

3. **Memory Issues**
   - Ensure your build doesn't exceed memory limits
   - Optimize bundle size if needed

### Build Logs

If deployment fails, check the build logs for:

- Missing dependencies
- TypeScript compilation errors
- Environment variable issues
- Memory/timeout errors

### Local Testing

Before deploying, test locally:

```bash
# Install dependencies
npm ci

# Build the application
npm run build

# Start production server
npm start
```

## Post-Deployment

### Custom Domain (Optional)

1. In Amplify Console, go to "Domain management"
2. Add your custom domain
3. Configure DNS settings as instructed

### Monitoring

- Monitor build times and success rates
- Set up notifications for build failures
- Check application performance

## Security Considerations

1. **Environment Variables**: Never commit sensitive values to Git
2. **CORS**: Configure CORS settings in your API Gateway
3. **Authentication**: Ensure Cognito is properly configured
4. **HTTPS**: Amplify automatically provides HTTPS

## Performance Optimization

1. **Caching**: Leverage Amplify's caching capabilities
2. **CDN**: Amplify automatically uses CloudFront
3. **Bundle Size**: Monitor and optimize your JavaScript bundle
4. **Images**: Use Next.js Image optimization

## Support

If you encounter issues:

1. Check the build logs in Amplify Console
2. Verify environment variables are correctly set
3. Test the build process locally
4. Review AWS Amplify documentation
5. Check for any breaking changes in Next.js or dependencies 