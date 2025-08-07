// Default email templates for common HR scenarios
export const defaultEmailTemplates = [
  {
    name: 'Interview Invitation',
    subject: 'Interview Invitation for {{jobTitle}} Position at {{company}}',
    body: `Dear {{firstName}},

Thank you for your interest in the {{jobTitle}} position at {{company}}. We are pleased to invite you for an interview to discuss your application further.

**Interview Details:**
- Position: {{jobTitle}}
- Company: {{company}}
- Location: {{location}}

We will contact you shortly to schedule a convenient time for the interview. Please prepare to discuss your experience, skills, and how you can contribute to our team.

If you have any questions or need to reschedule, please don't hesitate to reach out.

Best regards,
HR Team
{{company}}`,
    variables: ['{{firstName}}', '{{lastName}}', '{{jobTitle}}', '{{company}}', '{{location}}']
  },
  {
    name: 'Application Received',
    subject: 'Application Received - {{jobTitle}} Position',
    body: `Dear {{firstName}},

Thank you for submitting your application for the {{jobTitle}} position at {{company}}. We have received your application and it is currently under review.

**Application Details:**
- Position: {{jobTitle}}
- Company: {{company}}
- Application Date: {{applicationDate}}

Our hiring team will carefully review your qualifications and experience. If your background aligns with our requirements, we will contact you within the next few days to discuss next steps.

We appreciate your interest in joining our team and will keep you updated on the status of your application.

Best regards,
HR Team
{{company}}`,
    variables: ['{{firstName}}', '{{lastName}}', '{{jobTitle}}', '{{company}}', '{{applicationDate}}']
  },
  {
    name: 'Application Status Update',
    subject: 'Update on Your Application for {{jobTitle}}',
    body: `Dear {{firstName}},

We wanted to provide you with an update regarding your application for the {{jobTitle}} position at {{company}}.

**Current Status:** {{status}}

**Your Application Score:** {{score}}%

Based on our review, {{statusMessage}}

{{nextSteps}}

If you have any questions about this update, please don't hesitate to contact us.

Best regards,
HR Team
{{company}}`,
    variables: ['{{firstName}}', '{{lastName}}', '{{jobTitle}}', '{{company}}', '{{status}}', '{{score}}', '{{statusMessage}}', '{{nextSteps}}']
  },
  {
    name: 'Talent Pool Invitation',
    subject: 'Welcome to Our Talent Pool - {{company}}',
    body: `Dear {{firstName}},

Thank you for your interest in the {{jobTitle}} position at {{company}}. While we have decided to move forward with other candidates for this specific role, we were impressed by your qualifications and would like to keep you in our talent pool for future opportunities.

**Your Profile:**
- Skills Match: {{skillsMatch}}%
- Experience Match: {{experienceMatch}}%
- Overall Score: {{score}}%

We believe your background and skills would be valuable for future positions that may become available. We will reach out if we have opportunities that match your profile.

In the meantime, we encourage you to:
- Keep your profile updated
- Apply for other positions that interest you
- Connect with us on LinkedIn

Thank you for your interest in {{company}}.

Best regards,
HR Team
{{company}}`,
    variables: ['{{firstName}}', '{{lastName}}', '{{jobTitle}}', '{{company}}', '{{skillsMatch}}', '{{experienceMatch}}', '{{score}}']
  },
  {
    name: 'Rejection Letter',
    subject: 'Application Status - {{jobTitle}} Position',
    body: `Dear {{firstName}},

Thank you for your interest in the {{jobTitle}} position at {{company}} and for taking the time to submit your application.

After careful consideration, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely align with our current needs for this position.

**Your Application Score:** {{score}}%

We appreciate your interest in joining our team and encourage you to:
- Apply for other positions that match your skills and experience
- Keep your profile updated for future opportunities
- Connect with us on LinkedIn for company updates

We wish you the best in your job search and future endeavors.

Best regards,
HR Team
{{company}}`,
    variables: ['{{firstName}}', '{{lastName}}', '{{jobTitle}}', '{{company}}', '{{score}}']
  },
  {
    name: 'Technical Assessment Invitation',
    subject: 'Technical Assessment - {{jobTitle}} Position',
    body: `Dear {{firstName}},

Congratulations! You have been selected to proceed to the next stage of our hiring process for the {{jobTitle}} position at {{company}}.

**Next Step: Technical Assessment**

We would like to invite you to complete a technical assessment to further evaluate your skills and capabilities. This assessment will help us better understand your technical proficiency and problem-solving abilities.

**Assessment Details:**
- Duration: Approximately 60-90 minutes
- Format: Online assessment
- Topics: {{assessmentTopics}}

You will receive a separate email with detailed instructions and access to the assessment platform within the next 24 hours.

Please complete the assessment within 48 hours of receiving the instructions.

If you have any questions or need accommodations, please contact us immediately.

Best regards,
HR Team
{{company}}`,
    variables: ['{{firstName}}', '{{lastName}}', '{{jobTitle}}', '{{company}}', '{{assessmentTopics}}']
  },
  {
    name: 'Reference Check Request',
    subject: 'Reference Check Request - {{jobTitle}} Position',
    body: `Dear {{firstName}},

We are pleased to inform you that you have advanced to the final stage of our hiring process for the {{jobTitle}} position at {{company}}.

**Next Step: Reference Check**

As part of our standard hiring process, we would like to conduct reference checks with your previous employers or professional references.

**What we need from you:**
- Contact information for 2-3 professional references
- Permission to contact these references
- Any specific instructions or preferences for contacting them

Please provide the following information for each reference:
- Full name
- Job title and company
- Email address
- Phone number
- Relationship to you (e.g., former supervisor, colleague)

We will contact your references within the next few days and will keep you informed of the progress.

If you have any questions about this process, please don't hesitate to reach out.

Best regards,
HR Team
{{company}}`,
    variables: ['{{firstName}}', '{{lastName}}', '{{jobTitle}}', '{{company}}']
  }
];

// Helper function to get template by name
export const getTemplateByName = (name: string) => {
  return defaultEmailTemplates.find(template => template.name === name);
};

// Helper function to get all template names
export const getTemplateNames = () => {
  return defaultEmailTemplates.map(template => template.name);
}; 