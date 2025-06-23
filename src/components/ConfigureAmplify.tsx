'use client';

import { Amplify } from 'aws-amplify';
import { useEffect } from 'react';

export default function ConfigureAmplifyClientSide() {
  useEffect(() => {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
          userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID || '',
        }
      }
    }, { ssr: true });
  }, []);

  return null;
} 