# Shortlist AI - Public Careers Page

## Overview

The Shortlist AI application now includes a public careers page where candidates can view available job opportunities and apply for positions. This is completely separate from the admin dashboard and doesn't require authentication.

## Features

### 🌐 Public Job Listings
- **Careers Page**: Public page at `/careers` showing all available jobs
- **Job Details**: Individual job pages with comprehensive information
- **Search & Filter**: Find jobs by keywords, location, and job type
- **Responsive Design**: Works perfectly on desktop and mobile devices

### 📝 Application System
- **Easy Application**: Simple form with name, email, phone, and cover letter
- **Resume Upload**: Support for PDF, DOC, and DOCX files
- **Form Validation**: Required fields and proper validation
- **Success Confirmation**: Clear feedback when application is submitted

### 🎨 Modern UI/UX
- **Professional Design**: Clean, modern interface matching the brand
- **Job Cards**: Attractive job listings with key information
- **Sticky Application Form**: Application form stays visible while scrolling
- **Loading States**: Visual feedback during form submission

## Pages

### 1. Careers Listing Page (`/careers`)
- **URL**: `http://localhost:3000/careers`
- **Features**:
  - Hero section with job statistics
  - Search functionality
  - Location and job type filters
  - Job cards with key information
  - Direct links to job details

### 2. Job Detail Page (`/careers/[id]`)
- **URL**: `http://localhost:3000/careers/1` (where 1 is the job ID)
- **Features**:
  - Comprehensive job information
  - Requirements and benefits lists
  - Application form with file upload
  - Success confirmation page

## Available Jobs

The system includes 5 sample jobs:

1. **Senior Frontend Developer** - TechCorp Inc. (San Francisco, CA)
2. **Product Manager** - InnovateLabs (New York, NY)
3. **Data Scientist** - AI Solutions (Austin, TX)
4. **UX Designer** - Design Studio (Seattle, WA)
5. **DevOps Engineer** - CloudTech (Remote)

## How to Use

### For Candidates:
1. **Browse Jobs**: Visit `/careers` to see all available positions
2. **Search & Filter**: Use the search bar and filters to find relevant jobs
3. **View Details**: Click "View Details" or "Apply Now" to see job information
4. **Apply**: Fill out the application form and upload your resume
5. **Submit**: Click "Submit Application" to complete the process

### For Admins:
1. **View Applications**: Log into the admin dashboard
2. **Manage Candidates**: Use the candidates section to review applications
3. **AI Ranking**: Applications will be automatically ranked by the AI system

## Technical Implementation

### File Structure
```
src/app/careers/
├── page.tsx              # Careers listing page
├── layout.tsx            # Careers-specific layout
└── [id]/
    └── page.tsx          # Individual job detail page
```

### Key Components
- **Job Cards**: Reusable job listing components
- **Search & Filters**: Real-time filtering functionality
- **Application Form**: Form with file upload capability
- **Success Page**: Confirmation after successful application

### Data Management
- **Static Data**: Currently using dummy data for demonstration
- **File Upload**: Client-side file handling (no backend storage yet)
- **Form Validation**: Client-side validation with required fields

## Customization

### Adding New Jobs
To add new jobs, modify the `jobs` array in both:
- `src/app/careers/page.tsx`
- `src/app/careers/[id]/page.tsx`

### Job Structure
```typescript
{
  id: number,
  title: string,
  company: string,
  location: string,
  salary: string,
  postedDate: string,
  type: string,
  experience: string,
  description: string,
  requirements: string[],
  benefits: string[]
}
```

### Styling
The careers pages use Tailwind CSS classes. You can customize:
- Colors in the gradient backgrounds
- Card layouts and spacing
- Form styling and validation states
- Button styles and hover effects

### Branding
Update the following elements to match your brand:
- Logo and company name
- Color scheme (blue/purple gradients)
- Typography and spacing
- Footer information

## Future Enhancements

### Backend Integration
- **Database**: Store jobs and applications in a database
- **File Storage**: Implement proper file upload to cloud storage
- **Email Notifications**: Send confirmation emails to applicants
- **Admin Notifications**: Notify admins of new applications

### Additional Features
- **Job Categories**: Organize jobs by department or category
- **Application Tracking**: Allow candidates to track their application status
- **Resume Parsing**: Automatically extract information from uploaded resumes
- **Interview Scheduling**: Integrate with calendar systems
- **Multi-language Support**: Support for multiple languages
- **Analytics**: Track page views and application rates

## Security Considerations

### Current Implementation
- **Client-side Only**: No backend validation yet
- **File Upload**: Basic file type validation
- **Form Validation**: Client-side validation only

### Recommended Improvements
- **Server-side Validation**: Validate all form inputs on the server
- **File Security**: Implement proper file upload security measures
- **Rate Limiting**: Prevent spam applications
- **CSRF Protection**: Add CSRF tokens to forms
- **Input Sanitization**: Sanitize all user inputs
- **HTTPS**: Ensure all communications are encrypted

## Testing

### Manual Testing
1. Visit `/careers` and verify all jobs are displayed
2. Test search functionality with different keywords
3. Test location and job type filters
4. Click on job details and verify information is correct
5. Test the application form with various inputs
6. Verify file upload functionality
7. Test form validation and error states
8. Verify success page after submission

### Browser Compatibility
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Responsive**: All screen sizes from 320px to 1920px+ 