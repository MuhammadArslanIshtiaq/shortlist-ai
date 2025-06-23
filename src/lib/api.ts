import { fetchAuthSession } from 'aws-amplify/auth';

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

async function getAuthToken() {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString();
  } catch (e) {
    console.error("Auth session error", e);
    return null;
  }
}

// Function for authenticated API calls (for admin panel)
export const authenticatedFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `${token}`); // Bearer is not needed for Cognito user pool tokens with Lambda authorizers
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.error || `API call failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Function for public API calls (for applicant portal)
export const publicFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.error || `API call failed: ${response.statusText}`);
  }
  
  return response.json();
}; 