import { fetchAuthSession } from 'aws-amplify/auth';

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

// Cache for storing API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Clear expired cache entries
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > value.ttl) {
      cache.delete(key);
    }
  }
};

// Run cleanup every minute
setInterval(cleanupCache, 60 * 1000);

async function getAuthToken() {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString();
  } catch (e) {
    console.error("Auth session error", e);
    return null;
  }
}

// Generic cached fetch function
const cachedFetch = async (key: string, fetchFn: () => Promise<any>, ttl: number = CACHE_TTL) => {
  // Check if request is already pending
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  // Check cache first
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }

  // Create new request
  const request = fetchFn().then(data => {
    cache.set(key, { data, timestamp: Date.now(), ttl });
    pendingRequests.delete(key);
    return data;
  }).catch(error => {
    pendingRequests.delete(key);
    throw error;
  });

  pendingRequests.set(key, request);
  return request;
};

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

// Function for public API calls (for applicant portal) with timeout
export const publicFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  // Add timeout to prevent hanging requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, { 
      ...options, 
      headers,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || `API call failed: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
};

// Jobs API functions with caching
export const getJobs = async () => {
  return cachedFetch('jobs', () => authenticatedFetch('/jobs'));
};

export const getJobById = async (id: string) => {
  console.log('getJobById called with id:', id, 'type:', typeof id);
  if (!id || id === 'undefined') {
    throw new Error('Invalid job ID provided');
  }
  return cachedFetch(`job-${id}`, () => authenticatedFetch(`/jobs/${id}`));
};

// Batch fetch multiple jobs by IDs
export const getJobsByIds = async (ids: string[]) => {
  if (!ids.length) return [];
  
  // Use Promise.all for parallel requests with caching
  const jobs = await Promise.all(
    ids.map(id => getJobById(id))
  );
  
  return jobs;
};

export const createJob = async (jobData: {
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
  requirements?: string;
  benefits?: string;
  application_deadline?: string | null;
  is_urgent: boolean;
  status?: string;
}) => {
  return authenticatedFetch('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData)
  });
};

export const updateJob = async (id: string, jobData: {
  title?: string;
  company?: string;
  location?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string;
  employment_type?: string;
  experience_level?: string;
  work_arrangement?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  application_deadline?: string | null;
  is_urgent?: boolean;
  status?: string;
}) => {
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
      } catch {
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
      } catch {
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

// Public jobs API for careers page with caching
export const getPublicJobs = async () => {
  return cachedFetch('public-jobs', () => publicFetch('/jobs'), 15 * 60 * 1000); // 15 minutes TTL for public jobs
};

export const getPublicJobById = async (id: string) => {
  return cachedFetch(`public-job-${id}`, () => publicFetch(`/jobs/${id}`), 15 * 60 * 1000); // 15 minutes TTL for public jobs
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

// Applicants API functions with caching
export const getApplicants = async () => {
  return cachedFetch('applicants', () => authenticatedFetch('/applicants'));
};

// Batch fetch applicants with job titles (optimized)
export const getApplicantsWithJobTitles = async () => {
  return cachedFetch('applicants-with-jobs', async () => {
    const [applicants, jobs] = await Promise.all([
      authenticatedFetch('/applicants'),
      authenticatedFetch('/jobs')
    ]);

    // Create a map of job IDs to job titles for O(1) lookup
    const jobTitleMap = new Map(jobs.map((job: any) => [job.jobId, job.title]));

    // Add job titles to applicants
    return applicants.map((applicant: any) => ({
      ...applicant,
      jobTitle: jobTitleMap.get(applicant.jobId) || 'Unknown Job'
    }));
  });
};

// Get applicants by status with job titles
export const getApplicantsByStatus = async (status: string) => {
  return cachedFetch(`applicants-${status}`, async () => {
    const applicantsWithJobs = await getApplicantsWithJobTitles();
    return applicantsWithJobs.filter((applicant: any) => applicant.applicationStatus === status);
  });
};

// Update applicant status
export const updateApplicantStatus = async (applicantId: string, jobId: string, status: string) => {
  try {
    const token = await getAuthToken();
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    if (token) {
      headers.set('Authorization', `${token}`);
    }
    
    const response = await fetch(`${API_URL}/applicants/${applicantId}/${jobId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || `API call failed: ${response.statusText}`);
    }

    // Invalidate related cache entries
    cache.delete('applicants');
    cache.delete('applicants-with-jobs');
    cache.delete(`applicants-${status}`);
    
    return response.json();
  } catch (error) {
    console.error('Update applicant status error:', error);
    throw error;
  }
};

// Get pre-signed URL for viewing resume
export const getResumeDownloadUrl = async (applicantId: string) => {
  return cachedFetch(`resume-${applicantId}`, () => authenticatedFetch(`/applicants/${applicantId}/resume`), 10 * 60 * 1000); // 10 minutes TTL for resume URLs
};

// Type definition for Job (for reference)
export interface Job {
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

// Type definition for Applicant
export interface Applicant {
  applicantId: string;
  jobId: string;
  jobTitle?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeS3Uri?: string;
  applicationStatus: string;
  matchingScore?: number;
  submittedAt: number;
  analysis?: {
    overallScore: number;
    scoreBreakdown: {
      educationMatch: number;
      experienceMatch: number;
      skillsMatch: number;
    };
    strengths: string[];
    weaknesses: string[];
    summary: string;
  };
} 