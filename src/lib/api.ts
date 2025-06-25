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
  try {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': await getAuthToken() || ''
      }
    });
    
    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.error || errorBody.message || errorMessage;
      } catch (parseError) {
        // If response is empty or not JSON, use the status text
        console.log('Response is not JSON, using status text');
      }
      throw new Error(errorMessage);
    }
    
    // Check if response has content before trying to parse JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch (parseError) {
        console.log('Response is JSON but parsing failed, returning success');
        return { success: true };
      }
    } else {
      // If no JSON content type, assume success
      return { success: true };
    }
  } catch (error) {
    console.error('Delete job error:', error);
    throw error;
  }
};

// Public jobs API for careers page
export const getPublicJobs = async () => {
  return publicFetch('/jobs');
};

export const getPublicJobById = async (id: string) => {
  return publicFetch(`/jobs/${id}`);
};

// Submit job application with file upload
export const submitApplication = async (applicationData: {
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
  resume: File;
}) => {
  const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  
  try {
    // Step 1: Get presigned URL from Lambda
    const presignedRequestData = {
      jobId: applicationData.jobId,
      fileName: applicationData.resume.name,
      contentType: applicationData.resume.type,
      firstName: applicationData.firstName,
      lastName: applicationData.lastName,
      email: applicationData.email,
      phone: applicationData.phone || '',
      location: applicationData.location,
      linkedinUrl: applicationData.linkedin || '',
      portfolioUrl: applicationData.portfolio || ''
    };

    console.log('Requesting presigned URL with data:', presignedRequestData);

    const presignedResponse = await fetch(`${API_URL}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(presignedRequestData)
    });

    if (!presignedResponse.ok) {
      const errorBody = await presignedResponse.json();
      throw new Error(errorBody.error || `Failed to get upload URL: ${presignedResponse.statusText}`);
    }

    const { applicantId, uploadUrl } = await presignedResponse.json();
    console.log('Received presigned URL:', uploadUrl);

    // Step 2: Upload file directly to S3 using presigned URL with the same Content-Type
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: applicationData.resume,
      headers: {
        'Content-Type': applicationData.resume.type,
      }
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file to S3: ${uploadResponse.statusText}`);
    }

    console.log('File uploaded successfully to S3');

    return {
      applicantId,
      success: true,
      message: 'Application submitted successfully'
    };

  } catch (error) {
    console.error('Application submission error:', error);
    throw error;
  }
};

// Type definition for Job (for reference)
interface Job {
  jobId: string;
  title: string;
  company: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  employment_type: string;
  experience_level: string;
  work_arrangement: string;
  description: string;
  requirements: string;
  benefits: string;
  application_deadline: string | null;
  createdAt: number;
  status: string;
  applications_count?: number;
  shortlisted_ai_count?: number;
  is_urgent: boolean;
  jdBucket?: string;
  jdKey?: string;
} 