'use client';

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
  Save
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

// Dummy data for job details
const jobDetails = {
  id: 1,
  title: "Senior Frontend Developer",
  company: "TechCorp Inc.",
  location: "San Francisco, CA",
  salary: "$120k - $150k",
  employmentType: "Full-time",
  experienceLevel: "Senior",
  postedDate: "2024-01-15",
  applicationDeadline: "2024-02-15",
  applications: 12,
  shortlistedAI: 3,
  status: "Active",
  isRemote: true,
  isUrgent: false,
  jobDescription: `We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building and maintaining high-quality web applications using modern technologies.

Key Responsibilities:
• Develop and maintain responsive web applications
• Collaborate with design and backend teams
• Write clean, maintainable, and efficient code
• Participate in code reviews and technical discussions
• Mentor junior developers
• Stay up-to-date with industry trends and best practices

What you'll be working on:
• React/Next.js applications
• TypeScript development
• Performance optimization
• Accessibility improvements
• Component library development`,
  requirements: `Required Skills:
• 5+ years of experience in frontend development
• Strong proficiency in JavaScript/TypeScript
• Experience with React, Next.js, or similar frameworks
• Knowledge of HTML5, CSS3, and modern CSS frameworks
• Understanding of responsive design principles
• Experience with version control (Git)
• Knowledge of web accessibility standards

Preferred Skills:
• Experience with testing frameworks (Jest, Cypress)
• Knowledge of build tools (Webpack, Vite)
• Experience with state management (Redux, Zustand)
• Understanding of SEO principles
• Experience with CI/CD pipelines`,
  benefits: `Benefits & Perks:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work hours and remote work options
• Professional development budget
• 401(k) matching
• Unlimited PTO
• Home office setup allowance
• Regular team events and activities
• Learning and development opportunities`,
  contactInfo: {
    email: "careers@techcorp.com",
    phone: "+1 (555) 123-4567",
    website: "https://techcorp.com"
  }
};

// Dummy data for shortlisted candidates
const shortlistedCandidates = [
  {
    id: 1,
    rank: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    location: "San Francisco, CA",
    overallScore: 92,
    skills: {
      score: 95,
      details: "React, TypeScript, Next.js, CSS3"
    },
    experience: {
      score: 88,
      details: "5+ years frontend development"
    },
    education: {
      score: 90,
      details: "BS Computer Science, Stanford"
    },
    other: {
      score: 85,
      details: "Open source contributions, tech blog"
    },
    resumeUrl: "https://example.com/resume1.pdf"
  },
  {
    id: 2,
    rank: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    location: "Seattle, WA",
    overallScore: 89,
    skills: {
      score: 92,
      details: "React, JavaScript, HTML5, CSS3"
    },
    experience: {
      score: 85,
      details: "4 years frontend development"
    },
    education: {
      score: 88,
      details: "MS Computer Science, UW"
    },
    other: {
      score: 82,
      details: "Conference speaker, mentor"
    },
    resumeUrl: "https://example.com/resume2.pdf"
  },
  {
    id: 3,
    rank: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    location: "Austin, TX",
    overallScore: 87,
    skills: {
      score: 88,
      details: "React, TypeScript, Redux, Jest"
    },
    experience: {
      score: 90,
      details: "6 years full-stack development"
    },
    education: {
      score: 85,
      details: "BS Software Engineering, UT"
    },
    other: {
      score: 80,
      details: "Team lead experience, agile certified"
    },
    resumeUrl: "https://example.com/resume3.pdf"
  }
];

// Dummy data for all candidates
const allCandidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    location: "San Francisco, CA",
    shortlistAIRank: 1,
    resumeUrl: "https://example.com/resume1.pdf",
    status: "Shortlisted"
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    location: "Seattle, WA",
    shortlistAIRank: 2,
    resumeUrl: "https://example.com/resume2.pdf",
    status: "Shortlisted"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    location: "Austin, TX",
    shortlistAIRank: 3,
    resumeUrl: "https://example.com/resume3.pdf",
    status: "Shortlisted"
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@email.com",
    location: "New York, NY",
    shortlistAIRank: 4,
    resumeUrl: "https://example.com/resume4.pdf",
    status: "Applied"
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa.wang@email.com",
    location: "Los Angeles, CA",
    shortlistAIRank: 5,
    resumeUrl: "https://example.com/resume5.pdf",
    status: "Applied"
  },
  {
    id: 6,
    name: "James Wilson",
    email: "james.wilson@email.com",
    location: "Chicago, IL",
    shortlistAIRank: 6,
    resumeUrl: "https://example.com/resume6.pdf",
    status: "Applied"
  },
  {
    id: 7,
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    location: "Miami, FL",
    shortlistAIRank: 7,
    resumeUrl: "https://example.com/resume7.pdf",
    status: "Applied"
  },
  {
    id: 8,
    name: "Alex Thompson",
    email: "alex.thompson@email.com",
    location: "Denver, CO",
    shortlistAIRank: 8,
    resumeUrl: "https://example.com/resume8.pdf",
    status: "Applied"
  },
  {
    id: 9,
    name: "Rachel Green",
    email: "rachel.green@email.com",
    location: "Portland, OR",
    shortlistAIRank: 9,
    resumeUrl: "https://example.com/resume9.pdf",
    status: "Applied"
  },
  {
    id: 10,
    name: "Tom Anderson",
    email: "tom.anderson@email.com",
    location: "Boston, MA",
    shortlistAIRank: 10,
    resumeUrl: "https://example.com/resume10.pdf",
    status: "Applied"
  },
  {
    id: 11,
    name: "Sophie Brown",
    email: "sophie.brown@email.com",
    location: "Phoenix, AZ",
    shortlistAIRank: 11,
    resumeUrl: "https://example.com/resume11.pdf",
    status: "Applied"
  },
  {
    id: 12,
    name: "Kevin Lee",
    email: "kevin.lee@email.com",
    location: "San Diego, CA",
    shortlistAIRank: 12,
    resumeUrl: "https://example.com/resume12.pdf",
    status: "Applied"
  }
];

// Circular Progress Bar Component
const CircularProgress = ({ score, size = 60 }: { score: number; size?: number }) => {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
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
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${getStrokeColor(score)} transition-all duration-300`}
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
    </div>
  );
};

// Action Dropdown Component
const ActionDropdown = ({ candidateId, candidateName }: { candidateId: number; candidateName: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupConfig, setPopupConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const handleAction = (action: string) => {
    let title = '';
    let message = '';
    let type: 'success' | 'info' | 'warning' = 'info';

    switch (action) {
      case 'shortlist':
        title = 'Candidate Shortlisted';
        message = `${candidateName} has been successfully shortlisted for interview. You will be notified when the interview is scheduled.`;
        type = 'success';
        break;
      case 'talentpool':
        title = 'Added to Talent Pool';
        message = `${candidateName} has been added to your talent pool. You can reach out to them for future opportunities.`;
        type = 'info';
        break;
      case 'reject':
        title = 'Candidate Status Updated';
        message = `${candidateName} has been marked as "Not Moving Forward". They will be notified of this decision.`;
        type = 'warning';
        break;
    }

    setPopupConfig({
      isOpen: true,
      title,
      message,
      type
    });
    setIsOpen(false);
  };

  const closePopup = () => {
    setPopupConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                Add to Talentpool
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
          <div className={`bg-white rounded-lg shadow-xl border max-w-md w-full mx-4 ${
            popupConfig.type === 'success' ? 'border-green-200' :
            popupConfig.type === 'info' ? 'border-blue-200' :
            'border-red-200'
          }`}>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                {popupConfig.type === 'success' && <UserCheck className="w-6 h-6 text-green-600" />}
                {popupConfig.type === 'info' && <UserPlus className="w-6 h-6 text-blue-600" />}
                {popupConfig.type === 'warning' && <UserX className="w-6 h-6 text-red-600" />}
                <h3 className="text-lg font-semibold text-gray-900">{popupConfig.title}</h3>
              </div>
              <p className="text-gray-700 mb-6">{popupConfig.message}</p>
              <div className="flex justify-end">
                <button
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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

// Shortlisted Candidates Modal Component
const ShortlistedCandidatesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [expandedCandidate, setExpandedCandidate] = useState<number | null>(null);

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
            <h2 className="text-xl font-semibold text-gray-900">Shortlisted AI Candidates</h2>
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Resume</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shortlistedCandidates.map((candidate) => (
                    <>
                      <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold">
                            {candidate.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">{candidate.name}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{candidate.email}</td>
                        <td className="px-6 py-4 text-gray-700">{candidate.location}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <CircularProgress score={candidate.overallScore} size={40} />
                          
                            <button
                              onClick={() => setExpandedCandidate(expandedCandidate === candidate.id ? null : candidate.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            >
                              {expandedCandidate === candidate.id ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={candidate.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View Resume
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <ActionDropdown candidateId={candidate.id} candidateName={candidate.name} />
                        </td>
                      </tr>
                      {expandedCandidate === candidate.id && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                              <div className="flex flex-col items-center">
                                <div className="mb-3">
                                  <CircularProgress score={candidate.skills.score} />
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1">Skills</h4>
                                <p className="text-sm text-gray-600 text-center">{candidate.skills.details}</p>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="mb-3">
                                  <CircularProgress score={candidate.experience.score} />
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1">Experience</h4>
                                <p className="text-sm text-gray-600 text-center">{candidate.experience.details}</p>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="mb-3">
                                  <CircularProgress score={candidate.education.score} />
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1">Education</h4>
                                <p className="text-sm text-gray-600 text-center">{candidate.education.details}</p>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="mb-3">
                                  <CircularProgress score={candidate.other.score} />
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1">Other</h4>
                                <p className="text-sm text-gray-600 text-center">{candidate.other.details}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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

// All Candidates Modal Component
const AllCandidatesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
            <span className="text-sm text-gray-500">({allCandidates.length} applications)</span>
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Shortlist AI Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Resume</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{candidate.name}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{candidate.email}</td>
                      <td className="px-6 py-4 text-gray-700">{candidate.location}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-purple-600">#{candidate.shortlistAIRank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={candidate.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View Resume
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <ActionDropdown candidateId={candidate.id} candidateName={candidate.name} />
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
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Delete Job</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this job posting? This action cannot be undone and will remove all associated candidate data.
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Job
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Job Modal Component
const EditJobModal = ({ isOpen, onClose, jobData }: { 
  isOpen: boolean; 
  onClose: () => void; 
  jobData: any; 
}) => {
  const [formData, setFormData] = useState({
    jobTitle: jobData.title,
    company: jobData.company,
    location: jobData.location,
    salaryMin: jobData.salary.split(' - ')[0].replace('$', '').replace('k', '000'),
    salaryMax: jobData.salary.split(' - ')[1].replace('$', '').replace('k', '000'),
    salaryCurrency: 'USD',
    employmentType: jobData.employmentType,
    experienceLevel: jobData.experienceLevel,
    jobDescription: jobData.jobDescription,
    requirements: jobData.requirements,
    benefits: jobData.benefits,
    applicationDeadline: jobData.applicationDeadline,
    isRemote: jobData.isRemote,
    isUrgent: jobData.isUrgent
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated Job Data:', formData);
    onClose();
    // Here you would typically make an API call to update the job
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Edit className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Job</h2>
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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
                  <input
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary</label>
                  <input
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    name="salaryCurrency"
                    value={formData.salaryCurrency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Requirements */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements & Skills</h3>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Benefits */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits & Perks</h3>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function JobDetail() {
  const params = useParams();
  const jobId = params.id;
  const [isShortlistedModalOpen, setIsShortlistedModalOpen] = useState(false);
  const [isAllCandidatesModalOpen, setIsAllCandidatesModalOpen] = useState(false);
  const [jobStatusMenuOpen, setJobStatusMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  const handleJobStatusChange = (status: string) => {
    console.log(`Changing job status to ${status}`);
    setJobStatusMenuOpen(false);
    // Here you would typically make an API call to update the job
  };

  const handleDeleteJob = () => {
    console.log('Deleting job:', jobId);
    setIsDeleteModalOpen(false);
    // Here you would typically make an API call to delete the job
    router.push('/jobs');
  };

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
                <h1 className="text-3xl font-bold text-gray-900">{jobDetails.title}</h1>
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
                    <p className="font-medium text-gray-900">{jobDetails.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{jobDetails.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium text-gray-900">{jobDetails.salary}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Employment Type</p>
                    <p className="font-medium text-gray-900">{jobDetails.employmentType}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Posted Date</p>
                    <p className="font-medium text-gray-900">{new Date(jobDetails.postedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Application Deadline</p>
                    <p className="font-medium text-gray-900">{new Date(jobDetails.applicationDeadline).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{jobDetails.jobDescription}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Requirements & Skills</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{jobDetails.requirements}</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Benefits & Perks</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{jobDetails.benefits}</p>
              </div>
            </div>
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
                          onClick={() => handleJobStatusChange('Active')}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                            jobDetails.status === 'Active' 
                              ? 'text-green-700 bg-green-50' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            jobDetails.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          Active
                        </button>
                        <button
                          onClick={() => handleJobStatusChange('Inactive')}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                            jobDetails.status === 'Inactive' 
                              ? 'text-gray-700 bg-gray-50' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            jobDetails.status === 'Inactive' ? 'bg-gray-500' : 'bg-gray-300'
                          }`}></div>
                          Inactive
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    jobDetails.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {jobDetails.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Applications</span>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="font-medium">{jobDetails.applications}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI Shortlisted</span>
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-1 text-purple-600" />
                    <span className="font-medium text-purple-600">{jobDetails.shortlistedAI}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{jobDetails.contactInfo.email}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{jobDetails.contactInfo.phone}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a 
                    href={jobDetails.contactInfo.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {jobDetails.contactInfo.website}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shortlisted Candidates Modal */}
      <ShortlistedCandidatesModal 
        isOpen={isShortlistedModalOpen} 
        onClose={() => setIsShortlistedModalOpen(false)} 
      />

      {/* All Candidates Modal */}
      <AllCandidatesModal 
        isOpen={isAllCandidatesModalOpen} 
        onClose={() => setIsAllCandidatesModalOpen(false)} 
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteJob} 
      />

      {/* Edit Job Modal */}
      <EditJobModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        jobData={jobDetails} 
      />
    </div>
  );
} 