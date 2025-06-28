'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getPublicJobs, getPublicJobById, Job } from '@/lib/api';

interface PublicDataContextType {
  // Public jobs data
  publicJobs: Job[];
  publicJobsLoading: boolean;
  publicJobsError: string | null;
  refreshPublicJobs: () => Promise<void>;
  
  // Individual job data
  getJobById: (jobId: string) => Job | undefined;
  fetchJobById: (jobId: string) => Promise<Job>;
  
  // Utility functions
  getOpenJobs: () => Job[];
  getJobsByCompany: (company: string) => Job[];
  getJobsByLocation: (location: string) => Job[];
  getJobsByType: (type: string) => Job[];
}

const PublicDataContext = createContext<PublicDataContextType | undefined>(undefined);

export const usePublicData = () => {
  const context = useContext(PublicDataContext);
  if (context === undefined) {
    throw new Error('usePublicData must be used within a PublicDataProvider');
  }
  return context;
};

interface PublicDataProviderProps {
  children: ReactNode;
}

export const PublicDataProvider: React.FC<PublicDataProviderProps> = ({ children }) => {
  const [publicJobs, setPublicJobs] = useState<Job[]>([]);
  const [publicJobsLoading, setPublicJobsLoading] = useState(true);
  const [publicJobsError, setPublicJobsError] = useState<string | null>(null);

  // Fetch all public jobs with retry mechanism
  const fetchPublicJobs = async (retryCount = 0) => {
    try {
      setPublicJobsLoading(true);
      setPublicJobsError(null);
      const jobsData = await getPublicJobs();
      setPublicJobs(jobsData);
    } catch (error) {
      console.error('Failed to fetch public jobs:', error);
      
      // Retry up to 2 times with exponential backoff
      if (retryCount < 2) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s
        setTimeout(() => {
          fetchPublicJobs(retryCount + 1);
        }, delay);
        return;
      }
      
      setPublicJobsError('Failed to load jobs. Please try again.');
    } finally {
      setPublicJobsLoading(false);
    }
  };

  // Refresh public jobs
  const refreshPublicJobs = useCallback(async () => {
    await fetchPublicJobs();
  }, []);

  // Get job by ID from cached data
  const getJobById = useCallback((jobId: string): Job | undefined => {
    return publicJobs.find(job => job.jobId === jobId);
  }, [publicJobs]);

  // Fetch individual job (with caching)
  const fetchJobById = useCallback(async (jobId: string): Promise<Job> => {
    // First check if we have it in our local state
    const localJob = publicJobs.find(job => job.jobId === jobId);
    if (localJob) {
      return localJob;
    }
    
    // If not in local state, fetch from API (will be cached)
    return getPublicJobById(jobId);
  }, [publicJobs]);

  // Utility functions
  const getOpenJobs = useCallback(() => {
    return publicJobs.filter(job => job.status === 'OPEN');
  }, [publicJobs]);

  const getJobsByCompany = useCallback((company: string) => {
    return publicJobs.filter(job => 
      job.company.toLowerCase().includes(company.toLowerCase())
    );
  }, [publicJobs]);

  const getJobsByLocation = useCallback((location: string) => {
    return publicJobs.filter(job => 
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  }, [publicJobs]);

  const getJobsByType = useCallback((type: string) => {
    return publicJobs.filter(job => job.employment_type === type);
  }, [publicJobs]);

  // Initial data fetch
  useEffect(() => {
    fetchPublicJobs();
  }, []);

  // Preload individual jobs when public jobs are loaded
  useEffect(() => {
    if (publicJobs.length > 0) {
      // Preload the first few jobs for faster navigation
      const jobsToPreload = publicJobs.slice(0, 5);
      jobsToPreload.forEach(job => {
        // This will cache the individual job data
        getPublicJobById(job.jobId).catch(() => {
          // Silently fail if preloading fails
        });
      });
    }
  }, [publicJobs]);

  const value: PublicDataContextType = {
    publicJobs,
    publicJobsLoading,
    publicJobsError,
    refreshPublicJobs,
    getJobById,
    fetchJobById,
    getOpenJobs,
    getJobsByCompany,
    getJobsByLocation,
    getJobsByType,
  };

  return (
    <PublicDataContext.Provider value={value}>
      {children}
    </PublicDataContext.Provider>
  );
}; 