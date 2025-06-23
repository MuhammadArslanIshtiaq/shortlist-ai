'use client';

import { 
  Briefcase, 
  Users, 
  UserCheck, 
  UserX, 
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  Sparkles
} from 'lucide-react';

// Dummy data
const dashboardStats = {
  totalJobs: 24,
  totalApplications: 156,
  shortlistedCandidates: 23,
  rejectedApplications: 89
};

const recentJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    postedDate: "2024-01-15",
    applications: 12,
    status: "Active"
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateLabs",
    location: "New York, NY",
    salary: "$130k - $160k",
    postedDate: "2024-01-14",
    applications: 8,
    status: "Active"
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "AI Solutions",
    location: "Austin, TX",
    salary: "$110k - $140k",
    postedDate: "2024-01-13",
    applications: 15,
    status: "Active"
  },
  {
    id: 4,
    title: "UX Designer",
    company: "Design Studio",
    location: "Seattle, WA",
    salary: "$100k - $130k",
    postedDate: "2024-01-12",
    applications: 6,
    status: "Active"
  }
];

export default function Dashboard() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          {/* Date */}
          <div className="text-blue-100 text-sm font-medium mb-4">
            {currentDate}
          </div>
          
          {/* Content */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">Welcome back, Admin! 👋</h1>
              <p className="text-blue-100 text-lg">
                Your AI-powered shortlisting system is running smoothly. Here's what's happening today.
              </p>
            </div>
            
            {/* Icon */}
            <div className="ml-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Row */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Jobs</p>
                  <p className="text-3xl font-bold">{dashboardStats.totalJobs}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Briefcase className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                  <p className="text-3xl font-bold">{dashboardStats.totalApplications}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Shortlisted Candidates</p>
                  <p className="text-3xl font-bold">{dashboardStats.shortlistedCandidates}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <UserCheck className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Rejected Applications</p>
                  <p className="text-3xl font-bold">{dashboardStats.rejectedApplications}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <UserX className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Jobs</h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Position</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Company</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Salary</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Posted</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Applications</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="font-medium text-gray-900">{job.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{job.company}</td>
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
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(job.postedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {job.applications} apps
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {job.status}
                        </span>
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
}
