'use client';

import { 
  Briefcase, 
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Brain,
  Eye,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import Link from 'next/link';

// Dummy data for jobs
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    postedDate: "2024-01-15",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    applications: 12,
    shortlistedAI: 3,
    status: "Active"
  },
  {
    id: 2,
    title: "Product Manager",
    postedDate: "2024-01-14",
    location: "New York, NY",
    salary: "$130k - $160k",
    applications: 8,
    shortlistedAI: 2,
    status: "Active"
  },
  {
    id: 3,
    title: "Data Scientist",
    postedDate: "2024-01-13",
    location: "Austin, TX",
    salary: "$110k - $140k",
    applications: 15,
    shortlistedAI: 4,
    status: "Active"
  },
  {
    id: 4,
    title: "UX Designer",
    postedDate: "2024-01-12",
    location: "Seattle, WA",
    salary: "$100k - $130k",
    applications: 6,
    shortlistedAI: 1,
    status: "Active"
  },
  {
    id: 5,
    title: "Backend Engineer",
    postedDate: "2024-01-11",
    location: "Remote",
    salary: "$115k - $145k",
    applications: 18,
    shortlistedAI: 5,
    status: "Active"
  },
  {
    id: 6,
    title: "DevOps Engineer",
    postedDate: "2024-01-10",
    location: "Boston, MA",
    salary: "$125k - $155k",
    applications: 9,
    shortlistedAI: 2,
    status: "Closed"
  },
  {
    id: 7,
    title: "Mobile Developer",
    postedDate: "2024-01-09",
    location: "Los Angeles, CA",
    salary: "$105k - $135k",
    applications: 11,
    shortlistedAI: 3,
    status: "Active"
  },
  {
    id: 8,
    title: "QA Engineer",
    postedDate: "2024-01-08",
    location: "Chicago, IL",
    salary: "$95k - $125k",
    applications: 7,
    shortlistedAI: 1,
    status: "Active"
  }
];

export default function Jobs() {
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
            </div>
            <Link
              href="/dashboard/create-job"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Job
            </Link>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Posted</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Salary</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Applications</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Shortlisted AI</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="font-medium text-gray-900">{job.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(job.postedDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="font-medium">{job.applications}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700">
                        <Brain className="w-4 h-4 mr-1 text-purple-600" />
                        <span className="font-medium text-purple-600">{job.shortlistedAI}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/jobs/${job.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Link>
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of <span className="font-medium">8</span> results
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
      </div>
    </div>
  );
} 