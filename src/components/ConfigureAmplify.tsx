'use client';

import { Amplify } from 'aws-amplify';
import { useEffect } from 'react';

export default function ConfigureAmplifyClientSide() {
  useEffect(() => {
    const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
    const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID;
    
    // Only configure if environment variables are available
    if (userPoolId && userPoolClientId) {
      Amplify.configure({
        Auth: {
          Cognito: {
            userPoolId,
            userPoolClientId,
          }
        }
      }, { ssr: true });
    } else {
      console.warn('Amplify configuration skipped: Missing environment variables');
    }
  }, []);

  return null;
} 