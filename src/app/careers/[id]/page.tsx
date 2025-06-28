'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Building2,
  MapPin, 
  DollarSign, 
  Calendar, 
  ArrowLeft,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { submitApplication } from '@/lib/api';
import { usePublicData } from '@/contexts/PublicDataContext';
import { Job } from '@/lib/api';

// Application Form Modal Component
const ApplicationModal = ({ isOpen, onClose, job }: { 
  isOpen: boolean; 
  onClose: () => void; 
  job: Job; 
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    resume: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      resume: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Manual validation
    const errors: string[] = [];
    
    if (!formData.firstName.trim()) {
      errors.push('First name is required');
    }
    
    if (!formData.lastName.trim()) {
      errors.push('Last name is required');
    }
    
    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!formData.location.trim()) {
      errors.push('Location is required');
    }
    
    if (!formData.resume) {
      errors.push('Please upload your resume');
    }
    
    if (errors.length > 0) {
      setSubmitError(errors.join(', '));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress('Preparing application...');

    try {
      // Submit the application using the real API
      setUploadProgress('Getting upload URL...');
      await submitApplication({
        jobId: job.jobId,
        firstName: formData.firstName,
        lastName: formData.lastName,
          email: formData.email,
        phone: formData.phone || undefined,
        location: formData.location,
        linkedin: formData.linkedin || undefined,
        portfolio: formData.portfolio || undefined,
        resume: formData.resume!
      });
      
      setUploadProgress('Uploading resume...');
      
      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setUploadProgress('');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          portfolio: '',
          resume: null
        });
      }, 3000);
    } catch (error) {
      console.error('Application submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
      setUploadProgress('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Submitted!</h3>
          <p className="text-gray-600 mb-4">
            Thank you for your application. We&apos;ll review your submission and get back to you soon.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">{job.company}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800">{submitError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Website</label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV *</label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Choose a file
                </span>
                <span className="text-gray-500"> or drag and drop</span>
              </label>
              <p className="text-sm text-gray-500 mt-1">PDF, DOC, or DOCX (max 10MB)</p>
              {formData.resume && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm text-green-800 font-medium">{formData.resume.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {uploadProgress}
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const { getJobById, fetchJobById, publicJobsLoading, publicJobs } = usePublicData();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  useEffect(() => {
    if (jobId && jobId !== 'undefined' && jobId !== 'null' && jobId.trim() !== '') {
      // If public jobs are still loading, wait for them to finish
      if (publicJobsLoading) {
        return;
      }

      // First check if we have the job in cache immediately
      const cachedJob = getJobById(jobId);
      if (cachedJob) {
        setJob(cachedJob);
        setLoading(false);
        return;
      }

      // If not in cache and public jobs are loaded but job not found, fetch individual job
      if (publicJobs.length > 0) {
        fetchJob();
      } else {
        // If no public jobs loaded yet, wait a bit more
        const timer = setTimeout(() => {
          fetchJob();
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    } else {
      console.error('Invalid jobId:', jobId);
      setError(`Invalid job ID: ${jobId}`);
      setLoading(false);
    }
  }, [jobId, publicJobsLoading, publicJobs.length]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching job with ID:', jobId);
      
      // Fetch from API (will be cached)
      const jobData = await fetchJobById(jobId);
      setJob(jobData);
    } catch (err) {
      console.error('Failed to fetch job:', err);
      setError('Failed to load job details. Please try again.');
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

  // Show loading if we're loading public jobs OR if we're loading the specific job
  const showLoading = publicJobsLoading || (loading && !job);

  if (showLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 animate-pulse"></div>
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Loading Message */}
          <div className="text-center mb-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">
              {publicJobsLoading ? 'Loading job listings...' : 'Loading job details...'}
            </p>
          </div>

          {/* Job Header Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-36 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-8 w-28 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || (!job && !showLoading)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Job Not Found</h2>
            <p className="text-red-700 mb-4">{error || 'The job you are looking for does not exist or is no longer available.'}</p>
            <Link
                href="/careers"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Careers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Ensure job is not null before rendering
  if (!job) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/careers"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Shortlist AI Careers</h1>
            </div>
            <Link 
              href="/login" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Job Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-4">
                {job.is_urgent && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Urgent Hiring
                  </span>
                )}
        </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Building2 className="w-5 h-5 mr-2" />
                    {job.company}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {job.employment_type}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {job.experience_level}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  job.work_arrangement === 'Remote' 
                    ? 'bg-purple-100 text-purple-800'
                    : job.work_arrangement === 'Hybrid'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {job.work_arrangement}
                </span>
              </div>
            </div>

            <div className="lg:ml-8 mt-6 lg:mt-0">
              <button
                onClick={() => setIsApplicationModalOpen(true)}
                disabled={!job}
                className="w-full lg:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!job ? 'Loading...' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Requirements & Skills</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                </div>
            </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Benefits & Perks</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{job.benefits}</p>
                </div>
            </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About {job.company}</h3>
              <p className="text-gray-600 mb-4">
                We&apos;re a forward-thinking company focused on innovation and growth. Join our team and be part of something amazing.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Company website</span>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Employment Type</span>
                  <span className="font-medium text-gray-900">{job.employment_type}</span>
                  </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Experience Level</span>
                  <span className="font-medium text-gray-900">{job.experience_level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="font-medium text-gray-900">
                    {job.location}
                  </span>
                </div>
                {job.application_deadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Application Deadline</span>
                    <span className="font-medium text-gray-900">
                      {new Date(job.application_deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                </div>
                </div>

            {/* Apply CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Ready to Apply?</h3>
              <p className="text-blue-100 mb-4">
                Take the next step in your career and join our team.
              </p>
                <button
                onClick={() => setIsApplicationModalOpen(true)}
                className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Apply Now
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal 
        isOpen={isApplicationModalOpen} 
        onClose={() => setIsApplicationModalOpen(false)} 
        job={job} 
      />
    </div>
  );
} 