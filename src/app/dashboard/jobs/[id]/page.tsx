'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Building2,
  MapPin, 
  DollarSign, 
  Calendar,
  Users,
  Brain,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  X,
  MoreHorizontal,
  UserCheck,
  UserPlus,
  UserX,
  Save,
  Loader2,
  AlertCircle,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getJobById, updateJob, deleteJob, getApplicants, getResumeDownloadUrl, updateApplicantStatus, Applicant } from '@/lib/api';

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
  applications_count?: number;
  shortlisted_ai_count?: number;
  is_urgent: boolean;
  jdBucket?: string;
  jdKey?: string;
}

// Circular Progress Component for AI Scores
const CircularProgress = ({ score, size = 60 }: { score: number; size?: number }) => {
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
        <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
    </div>
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
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full border ${getBgColor()}`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              type === 'success' ? 'bg-green-100' : type === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
            }`}>
              {getIcon()}
            </div>
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

// Shortlisted Candidates Modal Component
const ShortlistedCandidatesModal = ({ isOpen, onClose, jobId }: { isOpen: boolean; onClose: () => void; jobId: string }) => {
  const [shortlistedApplicants, setShortlistedApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const itemsPerPage = 5;

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

  // Function to handle status updates
  const handleStatusUpdate = (applicantId: string, newStatus: string) => {
    setShortlistedApplicants(prev => prev.map(applicant => 
      applicant.applicantId === applicantId 
        ? { ...applicant, applicationStatus: newStatus }
        : applicant
    ));
  };

  // Fetch all applicants for this specific job
  useEffect(() => {
    if (isOpen && jobId) {
      const fetchAllApplicants = async () => {
        try {
          setLoading(true);
          setError(null);
          setCurrentPage(1);
          const allApplicants = await getApplicants();
          // Filter applicants for this specific job (all statuses)
          const jobApplicants = allApplicants.filter((applicant: Applicant) => 
            applicant.jobId === jobId
          );
          
          // Sort by highest matching score (descending)
          const sortedApplicants = jobApplicants.sort((a: Applicant, b: Applicant) => {
            const scoreA = a.matchingScore || 0;
            const scoreB = b.matchingScore || 0;
            return scoreB - scoreA;
          });
          
          setShortlistedApplicants(sortedApplicants);
        } catch (err) {
          console.error('Failed to fetch applicants:', err);
          setError('Failed to load applicants. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchAllApplicants();
    }
  }, [isOpen, jobId]);

  // Get current page applicants
  const getCurrentPageApplicants = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return shortlistedApplicants.slice(startIndex, startIndex + itemsPerPage);
  };

  // Load more applicants
  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Check if there are more applicants to load
  const hasMoreApplicants = currentPage * itemsPerPage < shortlistedApplicants.length;

  // Function to get status display info
  const getStatusDisplay = (status: string) => {
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
      case 'REJECTED':
        return {
          label: 'Rejected',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: <UserX className="w-3 h-3" />
        };
      case 'APPLIED':
      case 'SUBMITTED':
        return {
          label: 'Applied',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: <FileText className="w-3 h-3" />
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">AI Shortlisted Applicants</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-gray-600">Loading applicants...</span>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6">
                  {getCurrentPageApplicants().length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No applicants found for this job.
                    </div>
                  ) : (
                    getCurrentPageApplicants().map((applicant, index) => {
                      const globalIndex = (currentPage - 1) * itemsPerPage + index;
                      const statusInfo = getStatusDisplay(applicant.applicationStatus);
                      return (
                        <div key={applicant.applicantId} className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                #{globalIndex + 1}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {applicant.firstName} {applicant.lastName}
                                </h3>
                                <p className="text-gray-600">{applicant.email}</p>
                                <p className="text-sm text-gray-500">{applicant.location}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {applicant.matchingScore && (
                                <CircularProgress score={applicant.matchingScore} />
                              )}
                              <ActionDropdown 
                                applicantId={applicant.applicantId} 
                                jobId={applicant.jobId} 
                                onStatusUpdate={(newStatus) => {
                                  handleStatusUpdate(applicant.applicantId, newStatus);
                                }} 
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Skills</span>
                                {applicant.analysis?.scoreBreakdown?.skillsMatch && (
                                  <CircularProgress score={Number(applicant.analysis.scoreBreakdown.skillsMatch)} size={40} />
                                )}
                              </div>
                              <p className="text-xs text-gray-600">Skills match score</p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Education</span>
                                {applicant.analysis?.scoreBreakdown?.educationMatch && (
                                  <CircularProgress score={Number(applicant.analysis.scoreBreakdown.educationMatch)} size={40} />
                                )}
                              </div>
                              <p className="text-xs text-gray-600">Education match score</p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Experience</span>
                                {applicant.analysis?.scoreBreakdown?.experienceMatch && (
                                  <CircularProgress score={Number(applicant.analysis.scoreBreakdown.experienceMatch)} size={40} />
                                )}
                              </div>
                              <p className="text-xs text-gray-600">Experience match score</p>
                            </div>
                          </div>

                          {/* Summary Section */}
                          <div className="bg-white rounded-lg p-4 mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">AI Summary</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {applicant.analysis?.summary || 
                                (applicant.matchingScore ? 
                                  `Applicant with ${applicant.matchingScore}% match score. Strong candidate for this position.` : 
                                  'Applicant has been shortlisted for this position.'
                                )
                              }
                            </p>
                          </div>

                          {/* Strengths & Weaknesses */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Key Strengths
                              </h4>
                              <ul className="space-y-1">
                                {applicant.analysis?.strengths && applicant.analysis.strengths.length > 0 ? (
                                  applicant.analysis.strengths.map((strength: string, index: number) => (
                                    <li key={index} className="text-sm text-gray-700 flex items-start">
                                      <span className="text-green-500 mr-2">•</span>
                                      {strength}
                                    </li>
                                  ))
                                ) : (
                                  <>
                                    <li className="text-sm text-gray-700 flex items-start">
                                      <span className="text-green-500 mr-2">•</span>
                                      High matching score for this position
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-start">
                                      <span className="text-green-500 mr-2">•</span>
                                      Relevant experience and skills
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-start">
                                      <span className="text-green-500 mr-2">•</span>
                                      Strong candidate profile
                                    </li>
                                  </>
                                )}
                              </ul>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                                Areas for Improvement
                              </h4>
                              <ul className="space-y-1">
                                {applicant.analysis?.weaknesses && applicant.analysis.weaknesses.length > 0 ? (
                                  applicant.analysis.weaknesses.map((weakness: string, index: number) => (
                                    <li key={index} className="text-sm text-gray-700 flex items-start">
                                      <span className="text-orange-500 mr-2">•</span>
                                      {weakness}
                                    </li>
                                  ))
                                ) : (
                                  <>
                                    <li className="text-sm text-gray-700 flex items-start">
                                      <span className="text-orange-500 mr-2">•</span>
                                      Schedule interview to assess fit
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-start">
                                      <span className="text-orange-500 mr-2">•</span>
                                      Review resume for additional details
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-start">
                                      <span className="text-orange-500 mr-2">•</span>
                                      Consider technical assessment
                                    </li>
                                  </>
                                )}
                              </ul>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            {applicant.resumeS3Uri ? (
                              <button
                                onClick={() => handleViewResume(applicant.applicantId)}
                                className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                View Resume
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">No resume available</span>
                            )}
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                                {statusInfo.icon}
                                <span className="ml-1">{statusInfo.label}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Pagination */}
                {hasMoreApplicants && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={loadMore}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center"
                    >
                      <Loader2 className="w-4 h-4 mr-2" />
                      Load More Applicants
                    </button>
                  </div>
                )}

                {/* Pagination Info */}
                {shortlistedApplicants.length > 0 && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Showing {Math.min(currentPage * itemsPerPage, shortlistedApplicants.length)} of {shortlistedApplicants.length} applicants
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// All Applicants Modal Component
const AllApplicantsModal = ({ isOpen, onClose, jobId }: { isOpen: boolean; onClose: () => void; jobId: string }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Function to handle status updates
  const handleStatusUpdate = (applicantId: string, newStatus: string) => {
    setApplicants(prev => prev.map(applicant => 
      applicant.applicantId === applicantId 
        ? { ...applicant, applicationStatus: newStatus }
        : applicant
    ));
  };

  // Fetch applicants for this specific job
  useEffect(() => {
    if (isOpen && jobId) {
      const fetchApplicantsForJob = async () => {
        try {
          setLoading(true);
          setError(null);
          const allApplicants = await getApplicants();
          // Filter applicants for this specific job
          const jobApplicants = allApplicants.filter((applicant: Applicant) => applicant.jobId === jobId);
          setApplicants(jobApplicants);
        } catch (err) {
          console.error('Failed to fetch applicants:', err);
          setError('Failed to load applicants. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchApplicantsForJob();
    }
  }, [isOpen, jobId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">All Applicants</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-gray-600">Loading applicants...</span>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {applicants.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No applicants found for this job.
                  </div>
                ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Score</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Resume</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                      {applicants.map((applicant) => (
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
                      <td className="px-6 py-4">
                            {applicant.matchingScore ? (
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {applicant.matchingScore}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              applicant.applicationStatus === 'SHORTLISTED' 
                                ? 'bg-purple-100 text-purple-800' 
                                : applicant.applicationStatus === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {applicant.applicationStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {applicant.resumeS3Uri ? (
                              <button
                                onClick={() => handleViewResume(applicant.applicantId)}
                                className="inline-flex items-center px-2 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-xs"
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                Resume
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
                  ))}
                </tbody>
              </table>
                )}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Job</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
            Are you sure you want to delete this job? This action cannot be undone and will remove all associated applications and data.
        </p>
        
          <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
              Delete
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Status Confirmation Modal Component
const StatusConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  currentStatus, 
  newStatus 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  currentStatus: string;
  newStatus: string;
}) => {
  if (!isOpen) return null;

  const isClosing = newStatus === 'CLOSED';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isClosing ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {isClosing ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : (
                <UserCheck className="w-5 h-5 text-green-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isClosing ? 'Close Job' : 'Open Job'}
            </h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            {isClosing 
              ? `Are you sure you want to close this job? This will prevent new applications from being submitted.`
              : `Are you sure you want to open this job? This will allow new applications to be submitted.`
            }
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                isClosing 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isClosing ? 'Close Job' : 'Open Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Job Modal Component
const EditJobModal = ({ isOpen, onClose, jobData }: { 
  isOpen: boolean; 
  onClose: () => void; 
  jobData: Job; 
}) => {
  const [formData, setFormData] = useState({
    jobTitle: jobData.title,
    company: jobData.company,
    location: jobData.location,
    salaryMin: jobData.salary_min?.toString() || '',
    salaryMax: jobData.salary_max?.toString() || '',
    salaryCurrency: jobData.salary_currency,
    employmentType: jobData.employment_type,
    experienceLevel: jobData.experience_level,
    workArrangement: jobData.work_arrangement,
    jobDescription: jobData.description,
    requirements: jobData.requirements || '',
    benefits: jobData.benefits || '',
    applicationDeadline: jobData.application_deadline || '',
    isUrgent: jobData.is_urgent
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const jobUpdateData = {
        title: formData.jobTitle,
        company: formData.company,
        location: formData.location,
        salary_min: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salary_max: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        salary_currency: formData.salaryCurrency,
        employment_type: formData.employmentType,
        experience_level: formData.experienceLevel,
        work_arrangement: formData.workArrangement,
        description: formData.jobDescription,
        requirements: formData.requirements,
        benefits: formData.benefits,
        application_deadline: formData.applicationDeadline || null,
        is_urgent: formData.isUrgent
      };

      await updateJob(jobData.jobId, jobUpdateData);
    onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to update job:', error);
      alert('Failed to update job. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Job</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
              <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
              <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type *</label>
              <select name="employmentType" value={formData.employmentType} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
                  </select>
                </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
              <select name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="entry-level">Entry-level</option>
                <option value="mid-level">Mid-level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="executive">Executive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Arrangement *</label>
              <select name="workArrangement" value={formData.workArrangement} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
              <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
              <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., 80000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary</label>
              <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., 120000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select name="salaryCurrency" value={formData.salaryCurrency} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
                  </select>
                </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <input type="checkbox" name="isUrgent" checked={formData.isUrgent} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label className="text-sm font-medium text-gray-700">Urgent hiring</label>
              </div>
            </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
            <textarea name="jobDescription" value={formData.jobDescription} onChange={handleInputChange} rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Describe the role, responsibilities, and what the candidate will be working on..." required />
            </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements & Skills</label>
            <textarea name="requirements" value={formData.requirements} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="List the required skills, experience, and qualifications..." />
            </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits & Perks</label>
            <textarea name="benefits" value={formData.benefits} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Describe the benefits, perks, and what makes this role attractive..." />
            </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default function JobDetail() {
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShortlistedModalOpen, setIsShortlistedModalOpen] = useState(false);
  const [isAllApplicantsModalOpen, setIsAllApplicantsModalOpen] = useState(false);
  const [jobStatusMenuOpen, setJobStatusMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusConfirmModalOpen, setIsStatusConfirmModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<string | null>(null);
  const [applicantStats, setApplicantStats] = useState({
    totalApplicants: 0,
    shortlistedApplicants: 0
  });
  const router = useRouter();

  useEffect(() => {
    console.log('JobDetail useEffect - jobId:', jobId, 'params:', params, 'typeof jobId:', typeof jobId);
    
    // Check if jobId is valid (not undefined, null, empty string, or the string "undefined")
    if (jobId && jobId !== 'undefined' && jobId !== 'null' && jobId.trim() !== '') {
      fetchJob();
    } else {
      console.error('Invalid jobId:', jobId);
      setError(`Invalid job ID: ${jobId}`);
      setLoading(false);
    }
  }, [jobId]);

  const fetchJob = async () => {
    // Additional validation
    if (!jobId || jobId === 'undefined' || jobId === 'null' || jobId.trim() === '') {
      console.error('fetchJob called with invalid jobId:', jobId);
      setError(`Invalid job ID: ${jobId}`);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching job with ID:', jobId);
      const jobData = await getJobById(jobId);
      setJob(jobData);
      
      // Fetch applicant statistics
      await fetchApplicantStats();
    } catch (err) {
      console.error('Failed to fetch job:', err);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicantStats = async () => {
    try {
      const allApplicants = await getApplicants();
      const jobApplicants = allApplicants.filter((applicant: Applicant) => applicant.jobId === jobId);
      const shortlistedApplicants = jobApplicants.filter((applicant: Applicant) => applicant.applicationStatus === 'SHORTLISTED');
      
      setApplicantStats({
        totalApplicants: jobApplicants.length,
        shortlistedApplicants: shortlistedApplicants.length
      });
    } catch (err) {
      console.error('Failed to fetch applicant stats:', err);
      // Don't set error here as it's not critical for the main job display
    }
  };

  const handleJobStatusChange = async (status: string) => {
    if (!job || !jobId || jobId === 'undefined' || jobId === 'null') return;
    
    // Show confirmation popup for status changes
    setPendingStatusChange(status);
    setIsStatusConfirmModalOpen(true);
    setJobStatusMenuOpen(false);
  };

  const confirmStatusChange = async () => {
    if (!job || !jobId || jobId === 'undefined' || jobId === 'null' || !pendingStatusChange) return;
    
    try {
      await updateJob(jobId, { status: pendingStatusChange });
      setJob(prev => prev ? { ...prev, status: pendingStatusChange } : null);
      setIsStatusConfirmModalOpen(false);
      setPendingStatusChange(null);
    } catch (err) {
      console.error('Failed to update job status:', err);
      alert('Failed to update job status. Please try again.');
      setIsStatusConfirmModalOpen(false);
      setPendingStatusChange(null);
    }
  };

  const handleDeleteJob = async () => {
    if (!jobId || jobId === 'undefined' || jobId === 'null') return;
    
    try {
      console.log('Attempting to delete job:', jobId);
      await deleteJob(jobId);
      console.log('Job deleted successfully');
    setIsDeleteModalOpen(false);
      router.push('/dashboard/jobs');
    } catch (err) {
      console.error('Failed to delete job:', err);
      let errorMessage = 'Failed to delete job. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
      setIsDeleteModalOpen(false);
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

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading job details...</span>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Job not found'}</p>
            <div className="mt-4 flex space-x-3">
              <button 
                onClick={fetchJob}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/dashboard/jobs"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/jobs"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium text-gray-900">{job.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">
                      {job.location} ({job.work_arrangement})
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium text-gray-900">{formatSalary(job)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Employment Type</p>
                    <p className="font-medium text-gray-900">{job.employment_type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Posted Date</p>
                    <p className="font-medium text-gray-900">{new Date(job.createdAt * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {job.application_deadline && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Application Deadline</p>
                      <p className="font-medium text-gray-900">{new Date(job.application_deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                )}
              </div>
            </div>

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
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setIsAllApplicantsModalOpen(true)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Users className="w-4 h-4 mr-2" />
                  View All Applicants
                </button>
                
                <button 
                  onClick={() => setIsShortlistedModalOpen(true)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center justify-center"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  View Shortlisted AI Applicants
                </button>
              </div>
            </div>

            {/* Status & Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 relative">
              <div className="absolute top-4 right-4">
                <div className="relative">
                  <button
                    onClick={() => setJobStatusMenuOpen(!jobStatusMenuOpen)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {jobStatusMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleJobStatusChange('OPEN')}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                            job.status === 'OPEN' 
                              ? 'text-green-700 bg-green-50' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            job.status === 'OPEN' ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          Open
                        </button>
                        <button
                          onClick={() => handleJobStatusChange('CLOSED')}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                            job.status === 'CLOSED' 
                              ? 'text-red-700 bg-red-50' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            job.status === 'CLOSED' ? 'bg-red-500' : 'bg-gray-300'
                          }`}></div>
                          Closed
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.status === 'OPEN' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status === 'OPEN' ? 'Open' : 'Closed'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Applications</span>
                  <span className="font-medium text-gray-900">{applicantStats.totalApplicants}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Shortlisted Applicants</span>
                  <span className="font-medium text-purple-600">{applicantStats.shortlistedApplicants}</span>
                </div>

                {job.is_urgent && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Urgent Hiring</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Yes
                    </span>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ShortlistedCandidatesModal 
        isOpen={isShortlistedModalOpen} 
        onClose={() => setIsShortlistedModalOpen(false)} 
        jobId={jobId} 
      />

      <AllApplicantsModal 
        isOpen={isAllApplicantsModalOpen} 
        onClose={() => setIsAllApplicantsModalOpen(false)} 
        jobId={jobId} 
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteJob} 
      />

      <StatusConfirmationModal 
        isOpen={isStatusConfirmModalOpen} 
        onClose={() => setIsStatusConfirmModalOpen(false)} 
        onConfirm={confirmStatusChange} 
        currentStatus={job.status} 
        newStatus={pendingStatusChange || ''} 
      />
      
      <EditJobModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        jobData={job} 
      />
    </div>
  );
} 