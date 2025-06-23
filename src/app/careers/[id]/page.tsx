'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Building2,
  ArrowLeft,
  Check,
  Upload,
  User,
  Mail,
  FileText
} from 'lucide-react';

// Dummy jobs data (same as careers page)
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
    description: "We're looking for a Senior Frontend Developer to join our growing team. You'll be responsible for building and maintaining our web applications using React, TypeScript, and modern frontend technologies. This role involves working closely with our design and backend teams to create seamless user experiences.",
    requirements: [
      "5+ years of experience with React and TypeScript",
      "Strong understanding of modern JavaScript (ES6+)",
      "Experience with state management (Redux, Zustand)",
      "Knowledge of CSS preprocessors (Sass, Less)",
      "Experience with testing frameworks (Jest, React Testing Library)",
      "Understanding of responsive design principles",
      "Experience with build tools (Webpack, Vite)",
      "Knowledge of performance optimization techniques"
    ],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "Flexible work hours and remote options",
      "Professional development budget",
      "401(k) matching",
      "Unlimited PTO",
      "Home office setup allowance",
      "Team events and activities"
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
    description: "Join our product team to help shape the future of our platform. You'll work closely with engineering, design, and business teams to deliver exceptional user experiences. This role involves product strategy, roadmap planning, and cross-functional collaboration.",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Experience with agile methodologies",
      "Excellent communication and collaboration skills",
      "Background in SaaS or B2B products",
      "Experience with user research and data analysis",
      "Knowledge of product analytics tools",
      "Ability to prioritize and manage multiple projects"
    ],
    benefits: [
      "Competitive salary and benefits",
      "Flexible work environment",
      "Professional growth opportunities",
      "Health and wellness programs",
      "Team events and activities",
      "Stock options",
      "Conference and training budget"
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
    description: "Help us build the next generation of AI-powered solutions. You'll work on machine learning models, data analysis, and predictive analytics. This role involves research, model development, and collaboration with engineering teams.",
    requirements: [
      "2+ years of experience in data science or ML",
      "Proficiency in Python, R, or similar",
      "Experience with ML frameworks (TensorFlow, PyTorch)",
      "Strong statistical analysis skills",
      "Experience with big data technologies",
      "Knowledge of SQL and database systems",
      "Experience with data visualization tools",
      "Understanding of MLOps practices"
    ],
    benefits: [
      "Competitive compensation",
      "Cutting-edge technology stack",
      "Research and development opportunities",
      "Conference and training budget",
      "Flexible work arrangements",
      "Health insurance",
      "401(k) matching"
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
    description: "Create beautiful and intuitive user experiences for our products. You'll work on user research, wireframing, prototyping, and visual design. This role involves collaboration with product and engineering teams.",
    requirements: [
      "3+ years of UX/UI design experience",
      "Proficiency in design tools (Figma, Sketch)",
      "Experience with user research and testing",
      "Strong portfolio demonstrating UX skills",
      "Knowledge of design systems and accessibility",
      "Experience with prototyping tools",
      "Understanding of user-centered design principles",
      "Ability to work in cross-functional teams"
    ],
    benefits: [
      "Creative and collaborative environment",
      "Latest design tools and resources",
      "Professional development opportunities",
      "Health and wellness benefits",
      "Flexible work schedule",
      "Design conference attendance",
      "Home office setup"
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
    description: "Join our DevOps team to help build and maintain our cloud infrastructure. You'll work on CI/CD pipelines, monitoring, and automation. This role involves infrastructure as code and cloud security.",
    requirements: [
      "4+ years of DevOps or SRE experience",
      "Experience with AWS, Azure, or GCP",
      "Knowledge of Docker and Kubernetes",
      "Experience with CI/CD tools (Jenkins, GitLab)",
      "Strong scripting skills (Python, Bash)",
      "Experience with infrastructure as code (Terraform)",
      "Knowledge of monitoring and logging tools",
      "Understanding of security best practices"
    ],
    benefits: [
      "Remote-first culture",
      "Competitive salary and equity",
      "Health insurance and benefits",
      "Professional development budget",
      "Flexible work hours",
      "Home office equipment",
      "Conference attendance"
    ]
  }
];

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = parseInt(params.id as string);
  const job = jobs.find(j => j.id === jobId);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist.</p>
          <a
            href="/careers"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </a>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in the {job.title} position at {job.company}. 
              We've received your application and will review it carefully.
            </p>
            <div className="space-y-4">
              <a
                href="/careers"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Careers
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <a
            href="/careers"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Building2 className="w-5 h-5 mr-2" />
                    {job.company}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{job.salary}</div>
                  <div className="text-sm text-gray-600">{job.type}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {job.experience}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {job.type}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {job.experience}
                </span>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Apply for this position</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Resume Upload */}
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                    Resume/CV *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="resume" className="cursor-pointer">
                      <p className="text-sm text-gray-600 mb-1">
                        {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, or DOCX (max 10MB)
                      </p>
                    </label>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows={4}
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us why you're interested in this position..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  By submitting this application, you agree to our privacy policy and consent to being contacted about this position.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 