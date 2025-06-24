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
  Mail,
  Phone,
  Globe,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  X,
  MoreHorizontal,
  UserCheck,
  UserPlus,
  UserX,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getJobById, updateJob, deleteJob } from '@/lib/api';

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

// Action Dropdown Component
const ActionDropdown = ({ candidateId, candidateName }: { candidateId: number; candidateName: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: string) => {
    console.log(`${action} for candidate ${candidateName} (ID: ${candidateId})`);
    setIsOpen(false);
    // Here you would typically make an API call to perform the action
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        closePopup();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
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
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="py-1">
              <button
              onClick={() => handleAction('Schedule Interview')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Interview
              </button>
              <button
              onClick={() => handleAction('Add to Talent Pool')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
              <UserPlus className="w-4 h-4 mr-2" />
              Add to Talent Pool
              </button>
              <button
              onClick={() => handleAction('Reject')}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
              <UserX className="w-4 h-4 mr-2" />
              Reject
              </button>
            </div>
          </div>
        )}
      </div>
  );
};

// Shortlisted Candidates Modal Component
const ShortlistedCandidatesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  // For now, we'll use dummy data for candidates since we haven't implemented the candidates API yet
  const shortlistedCandidates = [
    {
      id: 1,
      rank: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      location: "San Francisco, CA",
      overallScore: 92,
      skills: { score: 95, details: "React, TypeScript, Next.js, CSS3" },
      experience: { score: 88, details: "5+ years frontend development" },
      education: { score: 90, details: "BS Computer Science, Stanford" },
      other: { score: 85, details: "Open source contributions, tech blog" },
      resumeUrl: "https://example.com/resume1.pdf"
    },
    {
      id: 2,
      rank: 2,
      name: "Michael Chen",
      email: "michael.chen@email.com",
      location: "Seattle, WA",
      overallScore: 89,
      skills: { score: 92, details: "React, JavaScript, HTML5, CSS3" },
      experience: { score: 85, details: "4 years frontend development" },
      education: { score: 88, details: "MS Computer Science, UW" },
      other: { score: 82, details: "Conference speaker, mentor" },
      resumeUrl: "https://example.com/resume2.pdf"
    },
    {
      id: 3,
      rank: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      location: "Austin, TX",
      overallScore: 87,
      skills: { score: 88, details: "React, TypeScript, Redux, Jest" },
      experience: { score: 90, details: "6 years full-stack development" },
      education: { score: 85, details: "BS Software Engineering, UT" },
      other: { score: 80, details: "Team lead experience, agile certified" },
      resumeUrl: "https://example.com/resume3.pdf"
    }
  ];

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
            <h2 className="text-xl font-semibold text-gray-900">AI Shortlisted Candidates</h2>
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
            <div className="grid gap-6">
                  {shortlistedCandidates.map((candidate) => (
                <div key={candidate.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        #{candidate.rank}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-gray-600">{candidate.email}</p>
                        <p className="text-sm text-gray-500">{candidate.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CircularProgress score={candidate.overallScore} />
                      <ActionDropdown candidateId={candidate.id} candidateName={candidate.name} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Skills</span>
                        <span className="text-sm font-semibold text-blue-600">{candidate.skills.score}</span>
                          </div>
                      <p className="text-xs text-gray-600">{candidate.skills.details}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Experience</span>
                        <span className="text-sm font-semibold text-green-600">{candidate.experience.score}</span>
                      </div>
                      <p className="text-xs text-gray-600">{candidate.experience.details}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Education</span>
                        <span className="text-sm font-semibold text-purple-600">{candidate.education.score}</span>
                      </div>
                      <p className="text-xs text-gray-600">{candidate.education.details}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Other</span>
                        <span className="text-sm font-semibold text-orange-600">{candidate.other.score}</span>
                      </div>
                      <p className="text-xs text-gray-600">{candidate.other.details}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                          <a
                            href={candidate.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View Resume
                          </a>
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center px-3 py-1.5 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium">
                        <UserCheck className="w-4 h-4 mr-1" />
                        Shortlist
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <Calendar className="w-4 h-4 mr-1" />
                        Schedule Interview
                      </button>
                                </div>
                              </div>
                                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// All Candidates Modal Component
const AllCandidatesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  // For now, we'll use dummy data for candidates since we haven't implemented the candidates API yet
  const allCandidates = [
    { id: 1, name: "Sarah Johnson", email: "sarah.johnson@email.com", location: "San Francisco, CA", shortlistAIRank: 1, resumeUrl: "https://example.com/resume1.pdf", status: "Shortlisted" },
    { id: 2, name: "Michael Chen", email: "michael.chen@email.com", location: "Seattle, WA", shortlistAIRank: 2, resumeUrl: "https://example.com/resume2.pdf", status: "Shortlisted" },
    { id: 3, name: "Emily Rodriguez", email: "emily.rodriguez@email.com", location: "Austin, TX", shortlistAIRank: 3, resumeUrl: "https://example.com/resume3.pdf", status: "Shortlisted" },
    { id: 4, name: "David Kim", email: "david.kim@email.com", location: "New York, NY", shortlistAIRank: 4, resumeUrl: "https://example.com/resume4.pdf", status: "Applied" },
    { id: 5, name: "Lisa Wang", email: "lisa.wang@email.com", location: "Los Angeles, CA", shortlistAIRank: 5, resumeUrl: "https://example.com/resume5.pdf", status: "Applied" },
    { id: 6, name: "James Wilson", email: "james.wilson@email.com", location: "Chicago, IL", shortlistAIRank: 6, resumeUrl: "https://example.com/resume6.pdf", status: "Applied" },
    { id: 7, name: "Maria Garcia", email: "maria.garcia@email.com", location: "Miami, FL", shortlistAIRank: 7, resumeUrl: "https://example.com/resume7.pdf", status: "Applied" },
    { id: 8, name: "Alex Thompson", email: "alex.thompson@email.com", location: "Denver, CO", shortlistAIRank: 8, resumeUrl: "https://example.com/resume8.pdf", status: "Applied" },
    { id: 9, name: "Rachel Green", email: "rachel.green@email.com", location: "Portland, OR", shortlistAIRank: 9, resumeUrl: "https://example.com/resume9.pdf", status: "Applied" },
    { id: 10, name: "Tom Anderson", email: "tom.anderson@email.com", location: "Boston, MA", shortlistAIRank: 10, resumeUrl: "https://example.com/resume10.pdf", status: "Applied" },
    { id: 11, name: "Sophie Brown", email: "sophie.brown@email.com", location: "Phoenix, AZ", shortlistAIRank: 11, resumeUrl: "https://example.com/resume11.pdf", status: "Applied" },
    { id: 12, name: "Kevin Lee", email: "kevin.lee@email.com", location: "San Diego, CA", shortlistAIRank: 12, resumeUrl: "https://example.com/resume12.pdf", status: "Applied" }
  ];

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
            <h2 className="text-xl font-semibold text-gray-900">All Candidates</h2>
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Candidate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {candidate.shortlistAIRank}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{candidate.name}</p>
                          <p className="text-sm text-gray-500">{candidate.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700">{candidate.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          candidate.status === 'Shortlisted' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                        <a
                          href={candidate.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                            className="inline-flex items-center px-2 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-xs"
                        >
                            <FileText className="w-3 h-3 mr-1" />
                            Resume
                        </a>
                        <ActionDropdown candidateId={candidate.id} candidateName={candidate.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
  const isOpening = newStatus === 'OPEN';

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
  const [isAllCandidatesModalOpen, setIsAllCandidatesModalOpen] = useState(false);
  const [jobStatusMenuOpen, setJobStatusMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusConfirmModalOpen, setIsStatusConfirmModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<string | null>(null);
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
    } catch (err) {
      console.error('Failed to fetch job:', err);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
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
                  onClick={() => setIsAllCandidatesModalOpen(true)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Users className="w-4 h-4 mr-2" />
                  View All Candidates
                </button>
                
                <button 
                  onClick={() => setIsShortlistedModalOpen(true)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center justify-center"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  View Shortlisted AI Candidates
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
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
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
                  <span className="font-medium text-gray-900">{job.applications_count || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">AI Shortlisted</span>
                  <span className="font-medium text-purple-600">{job.shortlisted_ai_count || 0}</span>
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
      />

      <AllCandidatesModal 
        isOpen={isAllCandidatesModalOpen} 
        onClose={() => setIsAllCandidatesModalOpen(false)} 
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