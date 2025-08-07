'use client';

import { 
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserPlus,
  UserX,
  FileText,
  MapPin,
  Check,
  X as CloseIcon,
  Loader2,
  AlertCircle,
  Star,
  Brain
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getResumeDownloadUrl, updateApplicantStatus, Applicant } from '@/lib/api';
import { useData } from '@/contexts/DataContext';

// Filter Modal Component
const FilterModal = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  onApplyFilters,
  uniqueJobs,
  uniqueLocations
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  filters: {
    job: string;
    location: string;
    minScore: string;
    maxScore: string;
  };
  onFiltersChange: (filters: {
    job: string;
    location: string;
    minScore: string;
    maxScore: string;
  }) => void;
  onApplyFilters: () => void;
  uniqueJobs: string[];
  uniqueLocations: string[];
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filter Shortlisted Applicants</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Job Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <select
                value={filters.job}
                onChange={(e) => onFiltersChange({ ...filters, job: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Jobs</option>
                {uniqueJobs.map((job) => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Score Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Score Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minScore}
                  onChange={(e) => onFiltersChange({ ...filters, minScore: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxScore}
                  onChange={(e) => onFiltersChange({ ...filters, maxScore: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApplyFilters();
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Circular Progress Component for Scores
const CircularProgress = ({ score, size = 50 }: { score: number; size?: number }) => {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStrokeColor = (score: number) => {
    if (score >= 90) return 'stroke-green-600';
    if (score >= 80) return 'stroke-blue-600';
    if (score >= 70) return 'stroke-yellow-600';
    return 'stroke-red-600';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={getStrokeColor(score)}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute">
        <span className={`text-xs font-semibold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
    </div>
  );
};

// Action Dropdown Component
const ActionDropdown = ({ applicantId, jobId, onStatusUpdate }: { 
  applicantId: string; 
  jobId: string;
  onStatusUpdate?: (newStatus: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'info' | 'warning'
  });

  const handleAction = async (action: string) => {
    console.log(`${action} for applicant ${applicantId}`);
    setIsOpen(false);
    
    try {
      let newStatus = '';
      let popupTitle = '';
      let popupMessage = '';
      let popupType: 'success' | 'info' | 'warning' = 'info';
      let shouldUpdateStatus = true;
      
      // Determine new status and popup configuration
      switch (action) {
        case 'schedule':
          // Special case: show popup but don't update status in database
          popupTitle = 'Interview Scheduled';
          popupMessage = 'The interview has been scheduled successfully.';
          popupType = 'success';
          shouldUpdateStatus = false;
          break;
        case 'talentpool':
          newStatus = 'TALENT_POOL';
          popupTitle = 'Added to Talent Pool';
          popupMessage = 'The applicant has been added to the talent pool.';
          popupType = 'success';
          break;
        case 'reject':
          newStatus = 'REJECTED';
          popupTitle = 'Applicant Rejected';
          popupMessage = 'The applicant has been marked as not moving forward.';
          popupType = 'warning';
          break;
        default:
          return;
      }
      
      // Update status in database only if needed
      if (shouldUpdateStatus) {
        await updateApplicantStatus(applicantId, jobId, newStatus);
        
        // Call the callback to update the UI
        if (onStatusUpdate) {
          onStatusUpdate(newStatus);
        }
      }
      
      // Show success popup
      setPopupConfig({
        isOpen: true,
        title: popupTitle,
        message: popupMessage,
        type: popupType
      });
      
    } catch (error) {
      console.error('Failed to update applicant status:', error);
      setPopupConfig({
        isOpen: true,
        title: 'Error',
        message: 'Failed to update applicant status. Please try again.',
        type: 'warning'
      });
    }
  };

  const closePopup = () => {
    setPopupConfig(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="py-1">
              <button
                onClick={() => handleAction('schedule')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                Schedule Interview
              </button>
              <button
                onClick={() => handleAction('talentpool')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2 text-blue-600" />
                Add to Talent Pool
              </button>
              <button
                onClick={() => handleAction('reject')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <UserX className="w-4 h-4 mr-2 text-red-600" />
                Not Moving Forward
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Popup Message */}
      {popupConfig.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                {popupConfig.type === 'success' ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : popupConfig.type === 'warning' ? (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">{popupConfig.title}</h3>
              </div>
              <p className="text-gray-600 mb-6">{popupConfig.message}</p>
              <div className="flex justify-end">
                <button
                  onClick={closePopup}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Applicant Detail Modal Component
const ApplicantDetailModal = ({ 
  isOpen, 
  onClose, 
  applicant 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  applicant: Applicant | null; 
}) => {
  const [resumeLoading, setResumeLoading] = useState(false);

  const handleViewResume = async () => {
    if (!applicant) return;
    
    try {
      setResumeLoading(true);
      const { downloadUrl } = await getResumeDownloadUrl(applicant.applicantId);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Failed to get resume download URL:', error);
      alert('Failed to open resume. Please try again.');
    } finally {
      setResumeLoading(false);
    }
  };

  if (!isOpen || !applicant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Shortlisted Applicant Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Applicant Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {applicant.firstName[0]}{applicant.lastName[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {applicant.firstName} {applicant.lastName}
                  </h3>
                  <p className="text-gray-600">{applicant.email}</p>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {applicant.location}
                  </div>
                  {applicant.jobTitle && (
                    <p className="text-sm text-gray-500 mt-1">Applied for: {applicant.jobTitle}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {applicant.matchingScore && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                      {applicant.matchingScore}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Match Score</p>
                  </div>
                )}
              </div>
            </div>

            {/* Score Breakdown */}
            {applicant.analysis?.scoreBreakdown && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Detailed Score Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Skills Match</span>
                      <CircularProgress score={Number(applicant.analysis.scoreBreakdown.skillsMatch)} size={40} />
                    </div>
                    <p className="text-xs text-gray-600">Skills alignment with job requirements</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Education Match</span>
                      <CircularProgress score={Number(applicant.analysis.scoreBreakdown.educationMatch)} size={40} />
                    </div>
                    <p className="text-xs text-gray-600">Educational background fit</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Experience Match</span>
                      <CircularProgress score={Number(applicant.analysis.scoreBreakdown.experienceMatch)} size={40} />
                    </div>
                    <p className="text-xs text-gray-600">Work experience relevance</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Summary */}
            <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                AI Summary
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {applicant.analysis?.summary || 
                  (applicant.matchingScore ? 
                    `This applicant has a ${applicant.matchingScore}% match score for the position. The candidate shows strong potential based on their background and qualifications.` : 
                    'This applicant has been evaluated for this position.'
                  )
                }
              </p>
            </div>

            {/* Strengths & Areas for Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Key Strengths
                </h4>
                <ul className="space-y-2">
                  {applicant.analysis?.strengths && applicant.analysis.strengths.length > 0 ? (
                    applicant.analysis.strengths.map((strength: string, index: number) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        {strength}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        Strong matching score for this position
                      </li>
                      <li className="text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        Relevant experience and skills
                      </li>
                      <li className="text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        Promising candidate profile
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {applicant.analysis?.weaknesses && applicant.analysis.weaknesses.length > 0 ? (
                    applicant.analysis.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        {weakness}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="text-gray-700 flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        Schedule interview to assess cultural fit
                      </li>
                      <li className="text-gray-700 flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        Review resume for additional details
                      </li>
                      <li className="text-gray-700 flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        Consider technical assessment if applicable
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applicant.phone && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">{applicant.phone}</p>
                  </div>
                )}
                {applicant.linkedinUrl && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">LinkedIn:</span>
                    <a 
                      href={applicant.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 block"
                    >
                      View Profile
                    </a>
                  </div>
                )}
                {applicant.portfolioUrl && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Portfolio:</span>
                    <a 
                      href={applicant.portfolioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 block"
                    >
                      View Portfolio
                    </a>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-700">Application Date:</span>
                  <p className="text-gray-900">{new Date(applicant.submittedAt * 1000).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                {applicant.resumeS3Uri ? (
                  <button
                    onClick={handleViewResume}
                    disabled={resumeLoading}
                    className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    {resumeLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    View Resume
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm">No resume available</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  <UserCheck className="w-4 h-4 mr-1" />
                  SHORTLISTED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ShortlistedApplicants() {
  const { 
    shortlistedApplicants, 
    applicantsLoading, 
    applicantsError, 
    refreshApplicants 
  } = useData();

  const searchParams = useSearchParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    job: '',
    location: '',
    minScore: '',
    maxScore: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // Get unique jobs and locations for filter options
  const uniqueJobs = [...new Set(shortlistedApplicants.map(a => a.jobTitle).filter((job): job is string => Boolean(job)))];
  const uniqueLocations = [...new Set(shortlistedApplicants.map(a => a.location).filter((location): location is string => Boolean(location)))];

  // Handle applicantId from query parameter
  useEffect(() => {
    const applicantId = searchParams.get('applicantId');
    if (applicantId && shortlistedApplicants.length > 0) {
      const applicant = shortlistedApplicants.find(a => a.applicantId === applicantId);
      if (applicant) {
        setSelectedApplicant(applicant);
        // Remove the query parameter from the URL
        const url = new URL(window.location.href);
        url.searchParams.delete('applicantId');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [searchParams, shortlistedApplicants]);

  // Additional effect to handle applicantId when applicants data loads after the page
  useEffect(() => {
    const applicantId = searchParams.get('applicantId');
    if (applicantId && shortlistedApplicants.length > 0 && !selectedApplicant) {
      const applicant = shortlistedApplicants.find(a => a.applicantId === applicantId);
      if (applicant) {
        setSelectedApplicant(applicant);
        // Remove the query parameter from the URL
        const url = new URL(window.location.href);
        url.searchParams.delete('applicantId');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [shortlistedApplicants, searchParams, selectedApplicant]);

  // Filter applicants based on search and filters
  const filteredApplicants = shortlistedApplicants.filter(applicant => {
    const matchesSearch = 
      applicant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (applicant.jobTitle && applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesJob = !filters.job || applicant.jobTitle === filters.job;
    const matchesLocation = !filters.location || applicant.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const score = applicant.matchingScore || 0;
    const matchesMinScore = !filters.minScore || score >= parseFloat(filters.minScore);
    const matchesMaxScore = !filters.maxScore || score <= parseFloat(filters.maxScore);
    
    return matchesSearch && matchesJob && matchesLocation && matchesMinScore && matchesMaxScore;
  });

  const handleStatusUpdate = async (applicantId: string, jobId: string, newStatus: string) => {
    try {
      await updateApplicantStatus(applicantId, jobId, newStatus);
      // Refresh applicants data to get updated status
      await refreshApplicants();
    } catch (error) {
      console.error('Failed to update applicant status:', error);
      alert('Failed to update applicant status. Please try again.');
    }
  };

  const handleResumeView = async (applicantId: string) => {
    try {
      const { downloadUrl } = await getResumeDownloadUrl(applicantId);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Failed to get resume download URL:', error);
      alert('Failed to open resume. Please try again.');
    }
  };

  if (applicantsLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading shortlisted applicants...</span>
        </div>
      </div>
    );
  }

  if (applicantsError) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{applicantsError}</p>
            <div className="mt-4">
              <button 
                onClick={refreshApplicants}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Shortlisted Applicants</h1>
          </div>
          <p className="text-gray-600">Review and manage applicants who have been shortlisted for interviews</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search shortlisted applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Applicants Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Job</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Resume</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      {shortlistedApplicants.length === 0 ? 'No shortlisted applicants found' : 'No shortlisted applicants match your search criteria'}
                    </td>
                  </tr>
                ) : (
                  filteredApplicants.map((applicant) => (
                    <tr key={applicant.applicantId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">
                              {applicant.firstName[0]}{applicant.lastName[0]}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {applicant.firstName} {applicant.lastName}
                          </span>
                      </div>
                    </td>
                      <td className="px-6 py-4 text-gray-700">{applicant.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-4 h-4 mr-1" />
                          {applicant.location}
                      </div>
                    </td>
                      <td className="px-6 py-4 text-gray-700">{applicant.jobTitle || 'N/A'}</td>
                    <td className="px-6 py-4">
                        {applicant.matchingScore ? (
                          <button
                            onClick={() => setSelectedApplicant(applicant)}
                            className="hover:scale-105 transition-transform cursor-pointer group relative"
                            title="Click to view detailed analysis"
                          >
                            <CircularProgress score={applicant.matchingScore} />
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              View Details
                            </div>
                          </button>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                    </td>
                    <td className="px-6 py-4">
                        {applicant.resumeS3Uri ? (
                          <button
                            onClick={() => applicant.resumeS3Uri && handleResumeView(applicant.applicantId)}
                        className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View Resume
                          </button>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                    </td>
                    <td className="px-6 py-4">
                        <ActionDropdown applicantId={applicant.applicantId} jobId={applicant.jobId} onStatusUpdate={(newStatus) => {
                          handleStatusUpdate(applicant.applicantId, applicant.jobId, newStatus);
                        }} />
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredApplicants.length}</span> of <span className="font-medium">{shortlistedApplicants.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>

        {/* Filter Modal */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
          onApplyFilters={() => {
            // Filters are applied automatically when state changes
          }}
          uniqueJobs={uniqueJobs}
          uniqueLocations={uniqueLocations}
        />

        {/* Applicant Detail Modal */}
        <ApplicantDetailModal
          isOpen={!!selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          applicant={selectedApplicant}
        />
      </div>
    </div>
  );
} 