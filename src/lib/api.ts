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

// Jobs API functions
export const getJobs = async () => {
  return authenticatedFetch('/jobs');
};

export const getJobById = async (id: string) => {
  console.log('getJobById called with id:', id, 'type:', typeof id);
  if (!id || id === 'undefined') {
    throw new Error('Invalid job ID provided');
  }
  return authenticatedFetch(`/jobs/${id}`);
};

export const createJob = async (jobData: any) => {
  return authenticatedFetch('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData)
  });
};

export const updateJob = async (id: string, jobData: any) => {
  return authenticatedFetch(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jobData)
  });
};

export const deleteJob = async (id: string) => {
  return authenticatedFetch(`/jobs/${id}`, {
    method: 'DELETE'
  });
};

// Public jobs API for careers page
export const getPublicJobs = async () => {
  return publicFetch('/jobs/public');
};

export const getPublicJobById = async (id: string) => {
  return publicFetch(`/jobs/public/${id}`);
}; 