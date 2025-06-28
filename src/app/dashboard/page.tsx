'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  UserCheck, 
  UserX, 
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import { Job, Applicant } from '@/lib/api';

// Dashboard statistics interface
interface DashboardStats {
  totalJobs: number;
  totalApplications: number;
  shortlistedCandidates: number;
  rejectedApplications: number;
}

export default function Dashboard() {
  const { 
    jobs, 
    jobsLoading, 
    jobsError, 
    applicants, 
    applicantsLoading, 
    applicantsError,
    shortlistedApplicants,
    refreshJobs,
    refreshApplicants
  } = useData();

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalJobs: 0,
    totalApplications: 0,
    shortlistedCandidates: 0,
    rejectedApplications: 0
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate dashboard statistics when data changes
  useEffect(() => {
    if (!jobsLoading && !applicantsLoading) {
      const totalJobs = jobs.length;
      const totalApplications = applicants.length;
      const shortlistedCandidates = shortlistedApplicants.length;
      const rejectedApplications = applicants.filter((applicant: Applicant) => 
        applicant.applicationStatus === 'REJECTED'
      ).length;

      setDashboardStats({
        totalJobs,
        totalApplications,
        shortlistedCandidates,
        rejectedApplications
      });

      // Get recent jobs (sorted by creation date, most recent first)
      const sortedJobs = jobs
        .sort((a: Job, b: Job) => b.createdAt - a.createdAt)
        .slice(0, 5); // Show only the 5 most recent jobs

      setRecentJobs(sortedJobs);
    }
  }, [jobs, applicants, jobsLoading, applicantsLoading, shortlistedApplicants]);

  // Format salary range
  const formatSalary = (job: Job) => {
    if (!job.salary_min && !job.salary_max) {
      return 'Not specified';
    }
    
    const currency = job.salary_currency || 'USD';
    const currencySymbol = currency === 'USD' ? '$' : currency;
    
    if (job.salary_min && job.salary_max) {
      return `${currencySymbol}${job.salary_min.toLocaleString()} - ${currencySymbol}${job.salary_max.toLocaleString()}`;
    } else if (job.salary_min) {
      return `${currencySymbol}${job.salary_min.toLocaleString()}+`;
    } else {
      return `Up to ${currencySymbol}${job.salary_max?.toLocaleString()}`;
    }
  };

  // Get application count for a specific job
  const getApplicationCount = (jobId: string) => {
    const jobApplicants = applicants.filter(applicant => applicant.jobId === jobId);
    return jobApplicants.length;
  };

  const loading = jobsLoading || applicantsLoading;
  const error = jobsError || applicantsError;

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
            <div className="mt-4 space-x-2">
              {jobsError && (
                <button 
                  onClick={refreshJobs}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry Jobs
                </button>
              )}
              {applicantsError && (
                <button 
                  onClick={refreshApplicants}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry Applicants
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          {/* Date */}
          <div className="text-blue-100 text-sm font-medium mb-4">
            {currentDate}
          </div>
          
          {/* Content */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">Welcome back, Admin! 👋</h1>
              <p className="text-blue-100 text-lg">
                Your AI-powered shortlisting system is running smoothly. Here&apos;s what&apos;s happening today.
              </p>
            </div>
            
            {/* Icon */}
            <div className="ml-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Row */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Jobs</p>
                  <p className="text-3xl font-bold">{dashboardStats.totalJobs}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Briefcase className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                  <p className="text-3xl font-bold">{dashboardStats.totalApplications}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Shortlisted Candidates</p>
                  <p className="text-3xl font-bold">{dashboardStats.shortlistedCandidates}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <UserCheck className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Rejected Applications</p>
                  <p className="text-3xl font-bold">{dashboardStats.rejectedApplications}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <UserX className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Jobs</h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {recentJobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No jobs found</p>
                <p className="text-sm">Create your first job posting to get started.</p>
                <Link
                  href="/dashboard/create-job"
                  className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Job
                </Link>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Position</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Company</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Salary</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Posted</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Applications</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentJobs.map((job) => (
                      <tr key={job.jobId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                          <Link 
                            href={`/dashboard/jobs/${job.jobId}`}
                            className="flex items-center group"
                          >
                            <Building2 className="w-5 h-5 text-gray-400 mr-3 group-hover:text-blue-600 transition-colors" />
                            <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                              {job.title}
                            </span>
                          </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{job.company}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-700">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="w-4 h-4 mr-1" />
                            {formatSalary(job)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-1" />
                            {new Date(job.createdAt * 1000).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getApplicationCount(job.jobId)} apps
                        </span>
                      </td>
                      <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job.status === 'OPEN' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
