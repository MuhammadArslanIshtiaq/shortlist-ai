# Email Module Documentation

## Overview

The Email Module is a comprehensive feature that allows HR users to manage email templates and send bulk emails to applicants based on various filtering criteria.

## Features

### 1. Email Template Management
- **Create Custom Templates**: Build personalized email templates with variable placeholders
- **Edit Existing Templates**: Modify template content, subject, and variables
- **Delete Templates**: Remove unwanted templates
- **Import Default Templates**: Quick setup with pre-built templates for common HR scenarios

### 2. Template Variables
The system supports dynamic variables that are automatically replaced with applicant data:

- `{{firstName}}` - Applicant's first name
- `{{lastName}}` - Applicant's last name
- `{{jobTitle}}` - Job position title
- `{{company}}` - Company name
- `{{location}}` - Job location
- `{{score}}` - Applicant's matching score
- `{{skillsMatch}}` - Skills match percentage
- `{{experienceMatch}}` - Experience match percentage
- `{{status}}` - Application status
- `{{applicationDate}}` - Date of application

### 3. Applicant Filtering
Send emails to specific groups of applicants using multiple filter criteria:

- **Job Selection**: Target applicants for specific job positions
- **Score Range**: Filter by minimum and maximum matching scores
- **Application Status**: Target applicants by status (Applied, Shortlisted, Talent Pool, Rejected)
- **Location**: Filter by applicant location

### 4. Default Templates
The system includes pre-built templates for common HR scenarios:

1. **Interview Invitation** - Invite candidates for interviews
2. **Application Received** - Confirm receipt of applications
3. **Application Status Update** - Provide status updates
4. **Talent Pool Invitation** - Welcome candidates to talent pool
5. **Rejection Letter** - Professional rejection notifications
6. **Technical Assessment Invitation** - Invite for technical evaluations
7. **Reference Check Request** - Request professional references

## Usage Guide

### Creating a New Template

1. Navigate to the Email Module in the dashboard
2. Click "New Template"
3. Fill in the template details:
   - **Name**: Descriptive name for the template
   - **Subject**: Email subject line (can include variables)
   - **Body**: Email content (can include variables)
   - **Variables**: Add custom variables as needed
4. Click "Create Template"

### Sending Bulk Emails

1. Click "Send Emails" in the Email Module
2. Select the target job position
3. Choose an email template
4. Apply filters to target specific applicants:
   - Set score ranges (e.g., applicants with score < 80)
   - Filter by application status
   - Filter by location
5. Review the email preview and recipient count
6. Click "Send to X Recipients"

### Importing Default Templates

1. Click "Import Defaults" to add pre-built templates
2. Confirm the import action
3. Default templates will be available for use

## API Endpoints

The email module uses the following API endpoints:

- `GET /emails/templates` - Retrieve all email templates
- `POST /emails/templates` - Create a new template
- `PUT /emails/templates/{id}` - Update an existing template
- `DELETE /emails/templates/{id}` - Delete a template
- `POST /emails/bulk` - Send bulk emails

## Security Considerations

- All email operations require authentication
- Email sending is rate-limited to prevent abuse
- Templates are validated before sending
- Recipient lists are filtered to prevent unauthorized access

## Best Practices

1. **Template Design**:
   - Use clear, professional language
   - Include relevant variables for personalization
   - Keep templates concise and focused

2. **Filtering Strategy**:
   - Use specific criteria to target the right audience
   - Test filters with small groups before bulk sending
   - Consider the impact of email frequency on recipients

3. **Content Guidelines**:
   - Ensure compliance with email regulations
   - Include clear call-to-action when appropriate
   - Provide contact information for follow-up questions

## Troubleshooting

### Common Issues

1. **No Recipients Found**: Check filter criteria and ensure they match existing applicant data
2. **Template Variables Not Replaced**: Verify variable syntax uses double curly braces `{{variableName}}`
3. **Email Send Failures**: Check network connectivity and API endpoint availability

### Support

For technical issues or questions about the Email Module, please contact the development team or refer to the API documentation. 