'use client';

import { 
  Users, 
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
  AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getApplicants, Applicant, getResumeDownloadUrl, updateApplicantStatus } from '@/lib/api';
import { getJobById } from '@/lib/api';

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
            <h3 className="text-lg font-semibold text-gray-900">Filter Applicants</h3>
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

// Status Indicator Component
const StatusIndicator = ({ status }: { status: string }) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'SHORTLISTED':
        return {
          label: 'Shortlisted',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          icon: <Check className="w-3 h-3" />
        };
      case 'TALENT_POOL':
        return {
          label: 'Talent Pool',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          icon: <UserPlus className="w-3 h-3" />
        };
      case 'APPLIED':
      case 'SUBMITTED':
        return {
          label: 'Applied',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: <FileText className="w-3 h-3" />
        };
      case 'REVIEWED':
        return {
          label: 'Reviewed',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: <FileText className="w-3 h-3" />
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: <UserX className="w-3 h-3" />
        };
      default:
        return {
          label: status,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: <FileText className="w-3 h-3" />
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
      {statusInfo.icon}
      <span className="ml-1">{statusInfo.label}</span>
    </span>
  );
};

// Popup Message Component
const PopupMessage = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  message: string; 
  type: 'success' | 'info' | 'warning' 
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border ${getBgColor()}`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            {getIcon()}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
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

      // Determine new status and popup configuration
    switch (action) {
      case 'shortlist':
          newStatus = 'SHORTLISTED';
          popupTitle = 'Applicant Shortlisted';
          popupMessage = 'The applicant has been shortlisted for interview.';
          popupType = 'success';
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
      
      // Update status in database
      await updateApplicantStatus(applicantId, jobId, newStatus);
      
      // Show success popup
      setPopupConfig({
        isOpen: true,
        title: popupTitle,
        message: popupMessage,
        type: popupType
      });
      
      // Call the callback to update the UI
      if (onStatusUpdate) {
        onStatusUpdate(newStatus);
      }
      
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
    const handleClickOutside = (_event: MouseEvent) => {
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
                onClick={() => handleAction('shortlist')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                Shortlist for interview
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

      <PopupMessage
        isOpen={popupConfig.isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        message={popupConfig.message}
        type={popupConfig.type}
      />
    </>
  );
};

export default function AllApplicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    job: '',
    location: '',
    minScore: '',
    maxScore: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchJobTitle = async (jobId: string): Promise<string> => {
    try {
      const job = await getJobById(jobId);
      return job.title || 'Unknown Job';
    } catch (err) {
      console.error(`Failed to fetch job title for jobId ${jobId}:`, err);
      return 'Unknown Job';
    }
  };

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getApplicants();
      
      // Fetch job titles for all applicants
      const applicantsWithJobTitles = await Promise.all(
        data.map(async (applicant: Applicant) => {
          const jobTitle = await fetchJobTitle(applicant.jobId);
          return { ...applicant, jobTitle };
        })
      );
      
      setApplicants(applicantsWithJobTitles);
    } catch (err) {
      console.error('Failed to fetch applicants:', err);
      setError('Failed to load applicants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique jobs and locations for filter options
  const uniqueJobs = [...new Set(applicants.map(a => a.jobTitle).filter((job): job is string => Boolean(job)))];
  const uniqueLocations = [...new Set(applicants.map(a => a.location).filter((location): location is string => Boolean(location)))];

  // Filter applicants based on search and filters
  const filteredApplicants = applicants.filter((applicant: Applicant) => {
    const fullName = `${applicant.firstName} ${applicant.lastName}`;
    
    // Search filter
    const matchesSearch = searchTerm === '' || 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (applicant.jobTitle && applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    // Job filter
    const matchesJob = filters.job === '' || applicant.jobTitle === filters.job;

    // Location filter
    const matchesLocation = filters.location === '' || applicant.location === filters.location;

    // Score filter
    const minScore = filters.minScore === '' ? 0 : parseInt(filters.minScore);
    const maxScore = filters.maxScore === '' ? 100 : parseInt(filters.maxScore);
    const matchesScore = applicant.matchingScore ? (applicant.matchingScore >= minScore && applicant.matchingScore <= maxScore) : true;

    return matchesSearch && matchesJob && matchesLocation && matchesScore;
  });

  // Function to handle status updates
  const handleStatusUpdate = (applicantId: string, newStatus: string) => {
    setApplicants(prev => prev.map(applicant => 
      applicant.applicantId === applicantId 
        ? { ...applicant, applicationStatus: newStatus }
        : applicant
    ));
  };

  // Function to handle resume viewing
  const handleViewResume = async (applicantId: string) => {
    try {
      const { downloadUrl } = await getResumeDownloadUrl(applicantId);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Failed to get resume download URL:', error);
      alert('Failed to open resume. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading applicants...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <div className="mt-4">
              <button 
                onClick={fetchApplicants}
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">All Applicants</h1>
          </div>
          <p className="text-gray-600">Manage and review all applicants across all job postings</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search applicants..."
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Resume</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      {applicants.length === 0 ? 'No applicants found' : 'No applicants match your search criteria'}
                    </td>
                  </tr>
                ) : (
                  filteredApplicants.map((applicant) => (
                    <tr key={applicant.applicantId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
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
                        <StatusIndicator status={applicant.applicationStatus} />
                    </td>
                    <td className="px-6 py-4">
                        {applicant.resumeS3Uri ? (
                          <button
                            onClick={() => applicant.resumeS3Uri && handleViewResume(applicant.applicantId)}
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
                          handleStatusUpdate(applicant.applicantId, newStatus);
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredApplicants.length}</span> of <span className="font-medium">{applicants.length}</span> results
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