# AWS WebSocket API Gateway Setup Guide

## 🚨 Current Issue
Your WebSocket connection is failing because the API Gateway endpoint `wss://m1449b7nei.execute-api.us-west-2.amazonaws.com/v1/` is not accessible.

## 🔧 Step-by-Step Fix

### 1. Check API Gateway Deployment

**Go to AWS API Gateway Console:**
1. Navigate to [API Gateway Console](https://console.aws.amazon.com/apigateway/)
2. Select your WebSocket API
3. Check if it's deployed

**If not deployed:**
1. Go to "Stages" in the left sidebar
2. Click on your stage (usually "prod" or "dev")
3. Click "Deploy API"
4. Note the WebSocket URL

### 2. Verify Route Configuration

**Check your WebSocket routes:**
1. Go to "Routes" in the left sidebar
2. Ensure you have these routes configured:
   - `$connect` → `handleSocketConnect` Lambda
   - `$disconnect` → `handleSocketDisconnect` Lambda
   - `$default` → (optional, for unhandled messages)

### 3. Check Lambda Function Permissions

**Verify Lambda execution role has these permissions:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:GetItem",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/WebSocketConnections"
    },
    {
      "Effect": "Allow",
      "Action": [
        "execute-api:ManageConnections"
      ],
      "Resource": "arn:aws:execute-api:*:*:*/@connections/*"
    }
  ]
}
```

### 4. Check DynamoDB Table

**Verify WebSocketConnections table exists:**
1. Go to [DynamoDB Console](https://console.aws.amazon.com/dynamodb/)
2. Check if `WebSocketConnections` table exists
3. Verify the partition key is `connectionId`

### 5. Test Lambda Functions

**Test handleSocketConnect:**
```javascript
// Test event
{
  "requestContext": {
    "connectionId": "test-connection-123",
    "routeKey": "$connect"
  }
}
```

**Test handleSocketDisconnect:**
```javascript
// Test event
{
  "requestContext": {
    "connectionId": "test-connection-123",
    "routeKey": "$disconnect"
  }
}
```

### 6. Check CloudWatch Logs

**Check Lambda function logs:**
1. Go to [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/)
2. Navigate to "Log groups"
3. Find your Lambda function logs
4. Look for any errors in the recent logs

### 7. Verify CORS Configuration

**Add CORS to your WebSocket API:**
1. In API Gateway, go to your WebSocket API
2. Click "Actions" → "Enable CORS"
3. Set allowed origins to `*` (or your domain)
4. Deploy the API again

### 8. Test the Endpoint

**Manual test in browser console:**
```javascript
const ws = new WebSocket('wss://m1449b7nei.execute-api.us-west-2.amazonaws.com/v1/');
ws.onopen = () => console.log('✅ Connected!');
ws.onerror = (error) => console.error('❌ Error:', error);
ws.onclose = (event) => console.log('🔌 Closed:', event.code, event.reason);
```

## 🔍 Common Issues & Solutions

### Issue 1: API Not Deployed
**Solution:** Deploy your WebSocket API to a stage

### Issue 2: Lambda Function Errors
**Solution:** Check CloudWatch logs and fix Lambda function code

### Issue 3: Missing Permissions
**Solution:** Update Lambda execution role with required permissions

### Issue 4: DynamoDB Table Missing
**Solution:** Create the WebSocketConnections table

### Issue 5: Route Configuration
**Solution:** Ensure $connect and $disconnect routes are properly configured

## 📋 Checklist

- [ ] WebSocket API is deployed to a stage
- [ ] $connect route points to handleSocketConnect Lambda
- [ ] $disconnect route points to handleSocketDisconnect Lambda
- [ ] Lambda functions have proper execution role
- [ ] DynamoDB table WebSocketConnections exists
- [ ] CORS is enabled (if needed)
- [ ] Lambda functions are working (check CloudWatch logs)
- [ ] WebSocket URL is correct

## 🧪 Testing Steps

1. **Deploy API** if not already deployed
2. **Test Lambda functions** manually
3. **Check CloudWatch logs** for errors
4. **Test WebSocket connection** in browser console
5. **Update frontend** with correct WebSocket URL

## 📞 Next Steps

After fixing the backend:
1. Update your `.env.local` file with the correct WebSocket URL
2. Restart your development server
3. Test the connection using the debug tools

Let me know what you find in the AWS console and I can help you fix any specific issues! 