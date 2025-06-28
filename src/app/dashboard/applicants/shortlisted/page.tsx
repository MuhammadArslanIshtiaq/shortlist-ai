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
  Star
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getResumeDownloadUrl, updateApplicantStatus } from '@/lib/api';
import { useData } from '@/contexts/DataContext';
import { Applicant } from '@/lib/api';

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
const CircularProgress = ({ score }: { score: number }) => {
  const radius = 20;
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
      <svg className="transform -rotate-90" width="50" height="50">
          <circle
          cx="25"
          cy="25"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
          cx="25"
          cy="25"
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

export default function ShortlistedApplicants() {
  const { 
    shortlistedApplicants, 
    applicantsLoading, 
    applicantsError, 
    refreshApplicants 
  } = useData();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    job: '',
    location: '',
    minScore: '',
    maxScore: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique jobs and locations for filter options
  const uniqueJobs = [...new Set(shortlistedApplicants.map(a => a.jobTitle).filter((job): job is string => Boolean(job)))];
  const uniqueLocations = [...new Set(shortlistedApplicants.map(a => a.location).filter((location): location is string => Boolean(location)))];

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
                          <CircularProgress score={applicant.matchingScore} />
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
      </div>
    </div>
  );
} 