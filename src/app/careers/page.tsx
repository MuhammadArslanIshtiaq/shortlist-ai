'use client';

import { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Building2,
  Search,
  Filter,
  ExternalLink
} from 'lucide-react';

// Dummy jobs data
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    postedDate: "2024-01-15",
    type: "Full-time",
    experience: "5+ years",
    description: "We're looking for a Senior Frontend Developer to join our growing team. You'll be responsible for building and maintaining our web applications using React, TypeScript, and modern frontend technologies.",
    requirements: [
      "5+ years of experience with React and TypeScript",
      "Strong understanding of modern JavaScript (ES6+)",
      "Experience with state management (Redux, Zustand)",
      "Knowledge of CSS preprocessors (Sass, Less)",
      "Experience with testing frameworks (Jest, React Testing Library)"
    ],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "Flexible work hours and remote options",
      "Professional development budget",
      "401(k) matching"
    ]
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateLabs",
    location: "New York, NY",
    salary: "$130k - $160k",
    postedDate: "2024-01-14",
    type: "Full-time",
    experience: "3+ years",
    description: "Join our product team to help shape the future of our platform. You'll work closely with engineering, design, and business teams to deliver exceptional user experiences.",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Experience with agile methodologies",
      "Excellent communication and collaboration skills",
      "Background in SaaS or B2B products"
    ],
    benefits: [
      "Competitive salary and benefits",
      "Flexible work environment",
      "Professional growth opportunities",
      "Health and wellness programs",
      "Team events and activities"
    ]
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "AI Solutions",
    location: "Austin, TX",
    salary: "$110k - $140k",
    postedDate: "2024-01-13",
    type: "Full-time",
    experience: "2+ years",
    description: "Help us build the next generation of AI-powered solutions. You'll work on machine learning models, data analysis, and predictive analytics.",
    requirements: [
      "2+ years of experience in data science or ML",
      "Proficiency in Python, R, or similar",
      "Experience with ML frameworks (TensorFlow, PyTorch)",
      "Strong statistical analysis skills",
      "Experience with big data technologies"
    ],
    benefits: [
      "Competitive compensation",
      "Cutting-edge technology stack",
      "Research and development opportunities",
      "Conference and training budget",
      "Flexible work arrangements"
    ]
  },
  {
    id: 4,
    title: "UX Designer",
    company: "Design Studio",
    location: "Seattle, WA",
    salary: "$100k - $130k",
    postedDate: "2024-01-12",
    type: "Full-time",
    experience: "3+ years",
    description: "Create beautiful and intuitive user experiences for our products. You'll work on user research, wireframing, prototyping, and visual design.",
    requirements: [
      "3+ years of UX/UI design experience",
      "Proficiency in design tools (Figma, Sketch)",
      "Experience with user research and testing",
      "Strong portfolio demonstrating UX skills",
      "Knowledge of design systems and accessibility"
    ],
    benefits: [
      "Creative and collaborative environment",
      "Latest design tools and resources",
      "Professional development opportunities",
      "Health and wellness benefits",
      "Flexible work schedule"
    ]
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Remote",
    salary: "$115k - $145k",
    postedDate: "2024-01-11",
    type: "Full-time",
    experience: "4+ years",
    description: "Join our DevOps team to help build and maintain our cloud infrastructure. You'll work on CI/CD pipelines, monitoring, and automation.",
    requirements: [
      "4+ years of DevOps or SRE experience",
      "Experience with AWS, Azure, or GCP",
      "Knowledge of Docker and Kubernetes",
      "Experience with CI/CD tools (Jenkins, GitLab)",
      "Strong scripting skills (Python, Bash)"
    ],
    benefits: [
      "Remote-first culture",
      "Competitive salary and equity",
      "Health insurance and benefits",
      "Professional development budget",
      "Flexible work hours"
    ]
  }
];

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const uniqueLocations = [...new Set(jobs.map(job => job.location))];
  const uniqueTypes = [...new Set(jobs.map(job => job.type))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Shortlist AI Careers</h1>
            </div>
            <a 
              href="/login" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Admin Login
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Team</h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover exciting opportunities and be part of our mission to revolutionize hiring with AI
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white/20 rounded-lg px-6 py-3">
              <p className="text-sm text-blue-100">Open Positions</p>
              <p className="text-2xl font-bold">{jobs.length}</p>
            </div>
            <div className="bg-white/20 rounded-lg px-6 py-3">
              <p className="text-sm text-blue-100">Companies</p>
              <p className="text-2xl font-bold">{new Set(jobs.map(job => job.company)).size}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="lg:w-48">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="lg:w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h3>
            <p className="text-gray-600">
              {searchTerm || locationFilter || typeFilter ? 'Filtered results' : 'All available positions'}
            </p>
          </div>

          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                          <a href={`/careers/${job.id}`} className="hover:text-blue-600 transition-colors">
                            {job.title}
                          </a>
                        </h4>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Building2 className="w-4 h-4 mr-2" />
                          {job.company}
                        </div>
                      </div>
                      <a 
                        href={`/careers/${job.id}`}
                        className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium"
                      >
                        View Details
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {job.salary}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Posted {new Date(job.postedDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.type}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {job.experience}
                      </span>
                    </div>

                    <p className="text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <a
                    href={`/careers/${job.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters to find more opportunities.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Shortlist AI</span>
            </div>
            <p className="text-gray-400">
              © 2024 Shortlist AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 