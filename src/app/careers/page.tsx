'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Building2,
  Search,
  Filter,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { getPublicJobs } from '@/lib/api';

// Type definition for Job
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
  is_urgent: boolean;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching public jobs...');
      // Use the public jobs endpoint
      const jobsData = await getPublicJobs();
      console.log('Jobs data received:', jobsData);
      
      // Filter to only show OPEN jobs
      const openJobs = jobsData.filter((job: Job) => job.status === 'OPEN');
      console.log('Open jobs:', openJobs);
      setJobs(openJobs);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      
      // Check if it's an authentication error
      if (err instanceof Error && err.message.includes('401')) {
        setError('Jobs endpoint requires authentication. Please configure the /jobs GET endpoint to be public in your AWS API Gateway.');
      } else if (err instanceof Error && err.message.includes('403')) {
        setError('Access denied. Please configure the /jobs GET endpoint to be public in your AWS API Gateway.');
      } else {
        setError(`Failed to load jobs: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.employment_type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const uniqueLocations = [...new Set(jobs.map(job => job.location))];
  const uniqueTypes = [...new Set(jobs.map(job => job.employment_type))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Shortlist AI Careers</h1>
            </div>
            <a 
              href="/login" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Admin Login
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Team</h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover exciting opportunities and be part of our mission to revolutionize hiring with AI
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white/20 rounded-lg px-6 py-3">
              <p className="text-sm text-blue-100">Open Positions</p>
              <p className="text-2xl font-bold">{loading ? '...' : jobs.length}</p>
            </div>
            <div className="bg-white/20 rounded-lg px-6 py-3">
              <p className="text-sm text-blue-100">Companies</p>
              <p className="text-2xl font-bold">{loading ? '...' : new Set(jobs.map(job => job.company)).size}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="bg-red-50 border-b border-red-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-800 mb-4">{error}</p>
              <button
                onClick={fetchJobs}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading available positions...</p>
            </div>
          </div>
        </section>
      )}

      {/* Search and Filters */}
      {!loading && !error && (
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="lg:w-48">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="lg:w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Jobs List */}
      {!loading && !error && (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h3>
            <p className="text-gray-600">
              {searchTerm || locationFilter || typeFilter ? 'Filtered results' : 'All available positions'}
            </p>
          </div>

          <div className="space-y-6">
            {filteredJobs.map((job) => (
                <div key={job.jobId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            <a href={`/careers/${job.jobId}`} className="hover:text-blue-600 transition-colors">
                            {job.title}
                          </a>
                        </h4>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Building2 className="w-4 h-4 mr-2" />
                          {job.company}
                        </div>
                      </div>
                      <a 
                          href={`/careers/${job.jobId}`}
                        className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium"
                      >
                        View Details
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                          {formatSalary(job)}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                          Posted {new Date(job.createdAt * 1000).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.employment_type}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {job.experience_level}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.work_arrangement === 'Remote' 
                          ? 'bg-purple-100 text-purple-800'
                          : job.work_arrangement === 'Hybrid'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.work_arrangement}
                      </span>
                      {job.is_urgent && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Urgent
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <a
                      href={`/careers/${job.jobId}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                  {jobs.length === 0 
                    ? 'No open positions available at the moment. Please check back later.'
                    : 'Try adjusting your search criteria or filters to find more opportunities.'
                  }
              </p>
            </div>
          )}
        </div>
      </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Shortlist AI</span>
            </div>
            <p className="text-gray-400">
              © 2024 Shortlist AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 