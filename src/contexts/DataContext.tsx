'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getJobs, 
  getApplicantsWithJobTitles, 
  Job, 
  Applicant 
} from '@/lib/api';

interface DataContextType {
  // Jobs data
  jobs: Job[];
  jobsLoading: boolean;
  jobsError: string | null;
  refreshJobs: () => Promise<void>;
  
  // Applicants data
  applicants: Applicant[];
  applicantsLoading: boolean;
  applicantsError: string | null;
  refreshApplicants: () => Promise<void>;
  
  // Filtered applicants
  shortlistedApplicants: Applicant[];
  talentPoolApplicants: Applicant[];
  
  // Utility functions
  getJobById: (jobId: string) => Job | undefined;
  getApplicantsByJobId: (jobId: string) => Applicant[];
  getApplicantsByStatus: (status: string) => Applicant[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);
  
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(true);
  const [applicantsError, setApplicantsError] = useState<string | null>(null);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      setJobsError(null);
      const jobsData = await getJobs();
      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobsError('Failed to load jobs. Please try again.');
    } finally {
      setJobsLoading(false);
    }
  };

  // Fetch applicants with job titles
  const fetchApplicants = async () => {
    try {
      setApplicantsLoading(true);
      setApplicantsError(null);
      const applicantsData = await getApplicantsWithJobTitles();
      setApplicants(applicantsData);
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
      setApplicantsError('Failed to load applicants. Please try again.');
    } finally {
      setApplicantsLoading(false);
    }
  };

  // Refresh functions
  const refreshJobs = async () => {
    await fetchJobs();
  };

  const refreshApplicants = async () => {
    await fetchApplicants();
  };

  // Computed values
  const shortlistedApplicants = applicants.filter(
    applicant => applicant.applicationStatus === 'SHORTLISTED'
  );

  const talentPoolApplicants = applicants.filter(
    applicant => applicant.applicationStatus === 'TALENT_POOL'
  );

  // Utility functions
  const getJobById = (jobId: string): Job | undefined => {
    return jobs.find(job => job.jobId === jobId);
  };

  const getApplicantsByJobId = (jobId: string): Applicant[] => {
    return applicants.filter(applicant => applicant.jobId === jobId);
  };

  const getApplicantsByStatus = (status: string): Applicant[] => {
    return applicants.filter(applicant => applicant.applicationStatus === status);
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch jobs and applicants in parallel
      await Promise.all([fetchJobs(), fetchApplicants()]);
    };

    fetchInitialData();
  }, []);

  const value: DataContextType = {
    jobs,
    jobsLoading,
    jobsError,
    refreshJobs,
    applicants,
    applicantsLoading,
    applicantsError,
    refreshApplicants,
    shortlistedApplicants,
    talentPoolApplicants,
    getJobById,
    getApplicantsByJobId,
    getApplicantsByStatus,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 