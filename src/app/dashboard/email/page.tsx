'use client';

import { 
  Mail, 
  Plus, 
  Search,
  Filter,
  Send,
  Edit,
  Trash2,
  Eye,
  X,
  Loader2,
  Save,
  Copy
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { 
  getJobs, 
  getApplicantsWithJobTitles, 
  getEmailTemplates, 
  createEmailTemplate, 
  updateEmailTemplate, 
  deleteEmailTemplate, 
  sendBulkEmails,
  Job, 
  Applicant, 
  EmailTemplate 
} from '@/lib/api';
import { defaultEmailTemplates } from '@/lib/emailTemplates';

// Email Template Modal Component
const EmailTemplateModal = ({ 
  isOpen, 
  onClose, 
  template, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  template?: EmailTemplate; 
  onSave: (template: Partial<EmailTemplate>) => void; 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    variables: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        body: template.body,
        variables: template.variables
      });
    } else {
      setFormData({
        name: '',
        subject: '',
        body: '',
        variables: []
      });
    }
  }, [template]);

  const handleSave = async () => {
    if (!formData.name || !formData.subject || !formData.body) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addVariable = () => {
    const variable = prompt('Enter variable name (e.g., {{firstName}}):');
    if (variable && !formData.variables.includes(variable)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, variable]
      }));
    }
  };

  const removeVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variable)
    }));
  };

  if (!isOpen) return null;

     return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
       <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
         {/* Modal Header */}
         <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
           <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
               <Mail className="w-4 h-4 text-white" />
             </div>
             <h2 className="text-xl font-semibold text-gray-900">
               {template ? 'Edit Email Template' : 'Create Email Template'}
             </h2>
           </div>
           <button
             onClick={onClose}
             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
           >
             <X className="w-5 h-5" />
           </button>
         </div>

         {/* Modal Content */}
         <div className="flex-1 overflow-y-auto">
           <div className="p-6 space-y-6">
            {/* Template Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Interview Invitation"
              />
            </div>

            {/* Email Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Interview Invitation for {{jobTitle}} Position"
              />
            </div>

            {/* Variables */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Available Variables
                </label>
                <button
                  onClick={addVariable}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Variable
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.variables.map((variable) => (
                  <span
                    key={variable}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg"
                  >
                    {variable}
                    <button
                      onClick={() => removeVariable(variable)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {formData.variables.length === 0 && (
                  <span className="text-gray-500 text-sm">No variables added</span>
                )}
              </div>
                             <div className="text-xs text-gray-600">
                 Common variables: {'{{firstName}}'}, {'{{lastName}}'}, {'{{jobTitle}}'}, {'{{company}}'}, {'{{location}}'}, {'{{score}}'}, {'{{skillsMatch}}'}, {'{{experienceMatch}}'}, {'{{educationMatch}}'}, {'{{overallScore}}'}, {'{{strengths}}'}, {'{{weaknesses}}'}, {'{{summary}}'}, {'{{status}}'}, {'{{applicationDate}}'}, {'{{currentDate}}'}
               </div>
            </div>

            {/* Email Body */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Body *
              </label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder={`Dear {{firstName}},

Thank you for your interest in the {{jobTitle}} position at {{company}}.

We are pleased to invite you for an interview to discuss your application further.

Best regards,
HR Team`}
              />
            </div>
          </div>
        </div>

                 {/* Modal Footer */}
         <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 flex-shrink-0">
           <button
             onClick={onClose}
             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
           >
             Cancel
           </button>
           <button
             onClick={handleSave}
             disabled={isLoading}
             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
           >
             {isLoading ? (
               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
             ) : (
               <Save className="w-4 h-4 mr-2" />
             )}
             {template ? 'Update Template' : 'Create Template'}
           </button>
         </div>
       </div>
     </div>
   );
};

// Send Email Modal Component
const SendEmailModal = ({ 
  isOpen, 
  onClose, 
  templates, 
  jobs, 
  applicants,
  onSend 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  templates: EmailTemplate[]; 
  jobs: Job[];
  applicants: Applicant[];
  onSend: (emailData: {
    jobId: string;
    templateId: string;
    applicants: Array<{
      applicantId: string;
      email: string;
      firstName: string;
      lastName: string;
      location: string;
      matchingScore?: number;
      applicationStatus: string;
      submittedAt: number;
      analysis?: {
        overallScore: number;
        scoreBreakdown: {
          educationMatch: number;
          experienceMatch: number;
          skillsMatch: number;
        };
        strengths: string[];
        weaknesses: string[];
        summary: string;
      };
    }>;
    subject: string;
    message: string;
  }) => void; 
}) => {
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [filters, setFilters] = useState({
    minScore: '',
    maxScore: '',
    status: '',
    location: ''
  });
  const [previewData, setPreviewData] = useState({
    subject: '',
    message: '',
    recipientCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get unique locations for filter
  const uniqueLocations = [...new Set(applicants.map(a => a.location).filter(Boolean))];

  // Calculate filtered applicants
  const filteredApplicants = applicants.filter(applicant => {
    if (selectedJob && applicant.jobId !== selectedJob) return false;
    
    const score = applicant.matchingScore || 0;
    if (filters.minScore && score < parseFloat(filters.minScore)) return false;
    if (filters.maxScore && score > parseFloat(filters.maxScore)) return false;
    if (filters.status && applicant.applicationStatus !== filters.status) return false;
    if (filters.location && applicant.location !== filters.location) return false;
    
    return true;
  });

  // Update preview when template or filters change
  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.templateId === selectedTemplate);
      if (template) {
        setPreviewData({
          subject: template.subject,
          message: template.body,
          recipientCount: filteredApplicants.length
        });
      }
    } else {
      setPreviewData({
        subject: '',
        message: '',
        recipientCount: 0
      });
    }
  }, [selectedTemplate, filteredApplicants.length, templates]);

  const handleSend = async () => {
    if (!selectedJob || !selectedTemplate) {
      alert('Please select a job and template');
      return;
    }

    if (filteredApplicants.length === 0) {
      alert('No applicants match your criteria');
      return;
    }

    setIsLoading(true);
    try {
             // Prepare applicant data for the API
       const applicantData = filteredApplicants.map(applicant => ({
         applicantId: applicant.applicantId,
         email: applicant.email,
         firstName: applicant.firstName || '',
         lastName: applicant.lastName || '',
         location: applicant.location || '',
         matchingScore: applicant.matchingScore,
         applicationStatus: applicant.applicationStatus,
         submittedAt: applicant.submittedAt,
         analysis: applicant.analysis
       }));

      const emailData = {
        jobId: selectedJob,
        templateId: selectedTemplate,
        applicants: applicantData,
        subject: previewData.subject,
        message: previewData.message
      };

      await onSend(emailData);
      onClose();
    } catch (error) {
      console.error('Failed to send emails:', error);
      alert('Failed to send emails. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

     return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
       <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
         {/* Modal Header */}
         <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
           <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
               <Send className="w-4 h-4 text-white" />
             </div>
             <h2 className="text-xl font-semibold text-gray-900">Send Bulk Emails</h2>
           </div>
           <button
             onClick={onClose}
             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
           >
             <X className="w-5 h-5" />
           </button>
         </div>

         {/* Modal Content */}
         <div className="flex-1 overflow-y-auto">
           <div className="p-6 space-y-6">
            {/* Job Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Job *
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a job</option>
                {jobs.map((job) => (
                  <option key={job.jobId} value={job.jobId}>{job.title}</option>
                ))}
              </select>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Email Template *
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a template</option>
                {templates.map((template) => (
                  <option key={template.templateId} value={template.templateId}>{template.name}</option>
                ))}
              </select>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                Filter Recipients
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Score Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min Score"
                      value={filters.minScore}
                      onChange={(e) => setFilters(prev => ({ ...prev, minScore: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max Score"
                      value={filters.maxScore}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxScore: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="APPLIED">Applied</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="TALENT_POOL">Talent Pool</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

                         {/* Preview */}
             <div className="bg-blue-50 rounded-xl p-6">
               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                 <Eye className="w-5 h-5 mr-2 text-blue-600" />
                 Email Preview
               </h3>
               <div className="space-y-4">
                 <div>
                   <span className="text-sm font-medium text-gray-700">Recipients:</span>
                   <span className="ml-2 text-sm text-gray-600">{previewData.recipientCount} applicants</span>
                 </div>
                 
                 {/* Recipients List */}
                 {filteredApplicants.length > 0 && (
                   <div>
                     <span className="text-sm font-medium text-gray-700">Recipient List:</span>
                     <div className="mt-2 max-h-32 overflow-y-auto bg-white rounded-lg border border-gray-200 p-3">
                       {filteredApplicants.slice(0, 10).map((applicant, index) => (
                         <div key={applicant.applicantId} className="text-sm text-gray-600 py-1">
                           {index + 1}. {applicant.firstName} {applicant.lastName} ({applicant.email})
                         </div>
                       ))}
                       {filteredApplicants.length > 10 && (
                         <div className="text-sm text-gray-500 py-1">
                           ... and {filteredApplicants.length - 10} more recipients
                         </div>
                       )}
                     </div>
                   </div>
                 )}
                 
                 <div>
                   <span className="text-sm font-medium text-gray-700">Subject:</span>
                   <div className="mt-1 p-3 bg-white rounded-lg border border-gray-200">
                     {previewData.subject || 'No subject'}
                   </div>
                 </div>
                 <div>
                   <span className="text-sm font-medium text-gray-700">Message:</span>
                   <div className="mt-1 p-3 bg-white rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
                     <pre className="text-sm text-gray-700 whitespace-pre-wrap">{previewData.message || 'No message'}</pre>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

                 {/* Modal Footer */}
         <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 flex-shrink-0">
           <button
             onClick={onClose}
             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
           >
             Cancel
           </button>
           <button
             onClick={handleSend}
             disabled={isLoading || filteredApplicants.length === 0}
             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
           >
             {isLoading ? (
               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
             ) : (
               <Send className="w-4 h-4 mr-2" />
             )}
             Send to {filteredApplicants.length} Recipients
           </button>
         </div>
       </div>
     </div>
   );
};

export default function EmailModule() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load jobs and applicants first (these should work)
        const [jobsData, applicantsData] = await Promise.all([
          getJobs(),
          getApplicantsWithJobTitles()
        ]);
        
        setJobs(jobsData);
        setApplicants(applicantsData);
        
        // Load email templates from the new API
        try {
          const templatesData = await getEmailTemplates();
          setTemplates(templatesData);
        } catch (templateError) {
          console.error('Failed to load email templates:', templateError);
          setError('Failed to load email templates. Please check your API configuration.');
        }
        
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter templates based on search
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle template operations
  const handleCreateTemplate = async (templateData: Partial<EmailTemplate>) => {
    try {
      if (!templateData.name || !templateData.subject || !templateData.body) {
        throw new Error('Missing required fields');
      }
      
      const newTemplate = await createEmailTemplate({
        name: templateData.name,
        subject: templateData.subject,
        body: templateData.body,
        variables: templateData.variables || []
      });
      
      setTemplates(prev => [...prev, newTemplate]);
      alert('Template created successfully!');
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateTemplate = async (templateData: Partial<EmailTemplate>) => {
    if (!editingTemplate) return;
    
    try {
      const updatedTemplate = await updateEmailTemplate(editingTemplate.templateId, templateData);
      setTemplates(prev => prev.map(t => t.templateId === editingTemplate.templateId ? updatedTemplate : t));
      alert('Template updated successfully!');
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      await deleteEmailTemplate(templateId);
      setTemplates(prev => prev.filter(t => t.templateId !== templateId));
      alert('Template deleted successfully!');
    } catch (error) {
      console.error('Failed to delete template:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  const handleSendEmails = async (emailData: {
    jobId: string;
    templateId: string;
    applicants: Array<{
      applicantId: string;
      email: string;
      firstName: string;
      lastName: string;
      location: string;
      matchingScore?: number;
      applicationStatus: string;
      submittedAt: number;
      analysis?: {
        overallScore: number;
        scoreBreakdown: {
          educationMatch: number;
          experienceMatch: number;
          skillsMatch: number;
        };
        strengths: string[];
        weaknesses: string[];
        summary: string;
      };
    }>;
    subject: string;
    message: string;
  }) => {
    try {
      const result = await sendBulkEmails(emailData);
      alert(`Successfully sent ${result.sent || 0} emails! ${result.failed || 0} failed.`);
    } catch (error) {
      throw error;
    }
  };

  const handleImportDefaultTemplates = async () => {
    if (!confirm('This will import default email templates. Continue?')) return;
    
    try {
      // Import default templates to the API
      const importPromises = defaultEmailTemplates.map(template => 
        createEmailTemplate(template)
      );
      
      const newTemplates = await Promise.all(importPromises);
      setTemplates(prev => [...prev, ...newTemplates]);
      alert(`Successfully imported ${newTemplates.length} default templates!`);
    } catch (error) {
      console.error('Failed to import default templates:', error);
      alert('Failed to import default templates. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading email module...</span>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Email Module</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setEditingTemplate(undefined);
                  setIsTemplateModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </button>
              <button
                onClick={handleImportDefaultTemplates}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Import Defaults
              </button>
              <button
                onClick={() => setIsSendModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Emails
              </button>
            </div>
          </div>
          <p className="text-gray-600">Manage email templates and send bulk emails to applicants</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-4">
                {templates.length === 0 ? 'Create your first email template to get started.' : 'No templates match your search criteria.'}
              </p>
              {templates.length === 0 && (
                <button
                  onClick={() => {
                    setEditingTemplate(undefined);
                    setIsTemplateModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Template
                </button>
              )}
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div key={template.templateId} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.subject}</p>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setEditingTemplate(template);
                          setIsTemplateModalOpen(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit template"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.templateId)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {template.body.substring(0, 150)}...
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{template.variables.length} variables</span>
                    <span>{new Date(template.updatedAt * 1000).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setEditingTemplate(template);
                      setIsSendModalOpen(true);
                    }}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Use Template
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modals */}
        <EmailTemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => {
            setIsTemplateModalOpen(false);
            setEditingTemplate(undefined);
          }}
          template={editingTemplate}
          onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
        />

        <SendEmailModal
          isOpen={isSendModalOpen}
          onClose={() => setIsSendModalOpen(false)}
          templates={templates}
          jobs={jobs}
          applicants={applicants}
          onSend={handleSendEmails}
        />
      </div>
    </div>
  );
} 