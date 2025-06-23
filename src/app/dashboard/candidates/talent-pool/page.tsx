'use client';

import { 
  Users, 
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  FileText,
  MapPin,
  X as CloseIcon
} from 'lucide-react';
import { useState } from 'react';

// Dummy data for talent pool candidates
const talentPoolCandidates = [
  {
    id: 1,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    location: "Austin, TX",
    jobTitle: "Data Scientist",
    score: 92,
    resumeUrl: "https://example.com/resume3.pdf"
  },
  {
    id: 2,
    name: "Rachel Green",
    email: "rachel.green@email.com",
    location: "Portland, OR",
    jobTitle: "Frontend Developer",
    score: 89,
    resumeUrl: "https://example.com/resume9.pdf"
  },
  {
    id: 3,
    name: "Tom Anderson",
    email: "tom.anderson@email.com",
    location: "Boston, MA",
    jobTitle: "Full Stack Developer",
    score: 87,
    resumeUrl: "https://example.com/resume10.pdf"
  },
  {
    id: 4,
    name: "Jessica Lee",
    email: "jessica.lee@email.com",
    location: "San Diego, CA",
    jobTitle: "Product Designer",
    score: 91,
    resumeUrl: "https://example.com/resume11.pdf"
  },
  {
    id: 5,
    name: "Robert Martinez",
    email: "robert.martinez@email.com",
    location: "Phoenix, AZ",
    jobTitle: "Backend Engineer",
    score: 88,
    resumeUrl: "https://example.com/resume12.pdf"
  },
  {
    id: 6,
    name: "Amanda Taylor",
    email: "amanda.taylor@email.com",
    location: "Nashville, TN",
    jobTitle: "UX Researcher",
    score: 90,
    resumeUrl: "https://example.com/resume13.pdf"
  },
  {
    id: 7,
    name: "Kevin Brown",
    email: "kevin.brown@email.com",
    location: "Charlotte, NC",
    jobTitle: "DevOps Engineer",
    score: 86,
    resumeUrl: "https://example.com/resume14.pdf"
  },
  {
    id: 8,
    name: "Sophia Davis",
    email: "sophia.davis@email.com",
    location: "Minneapolis, MN",
    jobTitle: "Mobile Developer",
    score: 85,
    resumeUrl: "https://example.com/resume15.pdf"
  },
  {
    id: 9,
    name: "Daniel Wilson",
    email: "daniel.wilson@email.com",
    location: "Salt Lake City, UT",
    jobTitle: "QA Engineer",
    score: 84,
    resumeUrl: "https://example.com/resume16.pdf"
  },
  {
    id: 10,
    name: "Olivia Johnson",
    email: "olivia.johnson@email.com",
    location: "Columbus, OH",
    jobTitle: "Data Engineer",
    score: 93,
    resumeUrl: "https://example.com/resume17.pdf"
  }
];

// Get unique jobs and locations for filter options
const uniqueJobs = [...new Set(talentPoolCandidates.map(c => c.jobTitle))];
const uniqueLocations = [...new Set(talentPoolCandidates.map(c => c.location))];

// Filter Modal Component
const FilterModal = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  onApplyFilters 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  filters: {
    job: string;
    location: string;
    minScore: string;
    maxScore: string;
  };
  onFiltersChange: (filters: any) => void;
  onApplyFilters: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filter Candidates</h3>
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
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  max="100"
                  value={filters.minScore}
                  onChange={(e) => onFiltersChange({ ...filters, minScore: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="flex items-center text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  max="100"
                  value={filters.maxScore}
                  onChange={(e) => onFiltersChange({ ...filters, maxScore: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => {
                onFiltersChange({
                  job: '',
                  location: '',
                  minScore: '',
                  maxScore: ''
                });
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                onApplyFilters();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Circular Progress Bar Component
const CircularProgress = ({ score }: { score: number }) => {
  const radius = 20;
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
    <div className="flex items-center space-x-3">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
          {/* Background circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="24"
            cy="24"
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
    </div>
  );
};

// Popup Message Component
const PopupMessage = ({ 
  isOpen, 
  onClose, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  message: string; 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl border border-blue-200 max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Phone className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
const ActionDropdown = ({ candidateId, candidateName }: { candidateId: number; candidateName: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCallForInterview = () => {
    setIsPopupOpen(true);
    setIsOpen(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
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
                onClick={handleCallForInterview}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                Call for interview
              </button>
            </div>
          </div>
        )}
      </div>

      <PopupMessage
        isOpen={isPopupOpen}
        onClose={closePopup}
        title="Interview Scheduled"
        message={`A call for interview has been scheduled for ${candidateName}. You will be notified when the interview is confirmed.`}
      />
    </>
  );
};

export default function TalentPool() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    job: '',
    location: '',
    minScore: '',
    maxScore: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter candidates based on search and filters
  const filteredCandidates = talentPoolCandidates.filter(candidate => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    // Job filter
    const matchesJob = filters.job === '' || candidate.jobTitle === filters.job;

    // Location filter
    const matchesLocation = filters.location === '' || candidate.location === filters.location;

    // Score filter
    const minScore = filters.minScore === '' ? 0 : parseInt(filters.minScore);
    const maxScore = filters.maxScore === '' ? 100 : parseInt(filters.maxScore);
    const matchesScore = candidate.score >= minScore && candidate.score <= maxScore;

    return matchesSearch && matchesJob && matchesLocation && matchesScore;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Talent Pool</h1>
          </div>
          <p className="text-gray-600">Access your curated talent pool for future opportunities</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search talent pool candidates..."
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

        {/* Candidates Table */}
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
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{candidate.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{candidate.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-4 h-4 mr-1" />
                        {candidate.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{candidate.jobTitle}</td>
                    <td className="px-6 py-4">
                      <CircularProgress score={candidate.score} />
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

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCandidates.length}</span> of <span className="font-medium">{filteredCandidates.length}</span> results
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
        />
      </div>
    </div>
  );
} 