# Shortlist AI - Database Tables Structure

## Overview
This document outlines the complete database table structure for the Shortlist AI HR dashboard application, which provides AI-powered auto-ranking and shortlisting capabilities for job applications.

## Database Tables

### 1. Users Table
**Purpose**: Store system users (HR managers, recruiters)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| first_name | VARCHAR(100) | NOT NULL | User's first name |
| last_name | VARCHAR(100) | NOT NULL | User's last name |
| role | VARCHAR(50) | DEFAULT 'hr_manager' | User role in system |
| company_name | VARCHAR(255) | | Company name |
| phone | VARCHAR(20) | | Phone number |
| avatar_url | VARCHAR(500) | | Profile picture URL |
| is_active | BOOLEAN | DEFAULT true | Account status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### 2. Jobs Table
**Purpose**: Store job postings created by users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Job title |
| company | VARCHAR(255) | NOT NULL | Company name |
| location | VARCHAR(255) | NOT NULL | Job location |
| salary_min | INTEGER | | Minimum salary |
| salary_max | INTEGER | | Maximum salary |
| salary_currency | ENUM | DEFAULT 'USD' | Currency (USD, EUR, GBP, CAD, AUD) |
| employment_type | ENUM | DEFAULT 'full-time' | Employment type |
| experience_level | ENUM | DEFAULT 'mid-level' | Experience level required |
| job_description | TEXT | NOT NULL | Detailed job description |
| requirements | TEXT | | Job requirements |
| benefits | TEXT | | Benefits and perks |
| application_deadline | DATE | | Application deadline |
| posted_date | DATE | DEFAULT CURRENT_DATE | When job was posted |
| is_remote | BOOLEAN | DEFAULT false | Remote work option |
| is_urgent | BOOLEAN | DEFAULT false | Urgent hiring flag |
| status | ENUM | DEFAULT 'active' | Job status (active, inactive, closed, draft) |
| applications_count | INTEGER | DEFAULT 0 | Number of applications |
| shortlisted_ai_count | INTEGER | DEFAULT 0 | Number of AI shortlisted candidates |
| created_by | INTEGER | FOREIGN KEY | User who created the job |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### 3. Candidates Table
**Purpose**: Store job applicants/candidates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Candidate's full name |
| email | VARCHAR(255) | NOT NULL | Email address |
| phone | VARCHAR(20) | | Phone number |
| location | VARCHAR(255) | | Current location |
| resume_url | VARCHAR(500) | | Resume file URL |
| cover_letter | TEXT | | Cover letter text |
| linkedin_url | VARCHAR(500) | | LinkedIn profile URL |
| portfolio_url | VARCHAR(500) | | Portfolio website URL |
| github_url | VARCHAR(500) | | GitHub profile URL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### 4. Applications Table
**Purpose**: Store job applications with AI scoring

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| job_id | INTEGER | FOREIGN KEY | Reference to jobs table |
| candidate_id | INTEGER | FOREIGN KEY | Reference to candidates table |
| status | ENUM | DEFAULT 'applied' | Application status |
| applied_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When application was submitted |
| shortlist_ai_rank | INTEGER | | AI ranking position |
| overall_score | DECIMAL(5,2) | | Overall AI score (0-100) |
| skills_score | DECIMAL(5,2) | | Skills assessment score |
| experience_score | DECIMAL(5,2) | | Experience assessment score |
| education_score | DECIMAL(5,2) | | Education assessment score |
| other_score | DECIMAL(5,2) | | Other factors score |
| ai_analysis_notes | TEXT | | AI analysis comments |
| hr_notes | TEXT | | HR team notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### 5. Application_Scores Table
**Purpose**: Store detailed scoring breakdown for applications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| application_id | INTEGER | FOREIGN KEY | Reference to applications table |
| category | VARCHAR(50) | NOT NULL | Score category (skills, experience, education, other) |
| score | DECIMAL(5,2) | NOT NULL | Score value |
| details | TEXT | | Detailed explanation |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### 6. Talent_Pool Table
**Purpose**: Store candidates added to talent pool for future opportunities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| candidate_id | INTEGER | FOREIGN KEY | Reference to candidates table |
| added_by | INTEGER | FOREIGN KEY | User who added to talent pool |
| added_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When added to talent pool |
| notes | TEXT | | Notes about the candidate |
| tags | TEXT[] | | Array of tags for categorization |
| is_active | BOOLEAN | DEFAULT true | Active status in talent pool |

### 7. Interviews Table
**Purpose**: Store interview scheduling and feedback

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| application_id | INTEGER | FOREIGN KEY | Reference to applications table |
| scheduled_date | TIMESTAMP | | Interview date and time |
| duration_minutes | INTEGER | DEFAULT 60 | Interview duration |
| interview_type | VARCHAR(50) | | Type (phone, video, onsite) |
| interviewer_id | INTEGER | FOREIGN KEY | User conducting interview |
| status | VARCHAR(50) | DEFAULT 'scheduled' | Interview status |
| notes | TEXT | | Pre-interview notes |
| feedback | TEXT | | Post-interview feedback |
| rating | INTEGER | CHECK (1-5) | Interview rating |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### 8. Job_Contact_Info Table
**Purpose**: Store contact information for job postings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| job_id | INTEGER | FOREIGN KEY | Reference to jobs table |
| contact_email | VARCHAR(255) | | Contact email |
| contact_phone | VARCHAR(20) | | Contact phone |
| contact_website | VARCHAR(500) | | Company website |
| contact_person | VARCHAR(255) | | Contact person name |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### 9. Candidate_Skills Table
**Purpose**: Store skills possessed by candidates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| candidate_id | INTEGER | FOREIGN KEY | Reference to candidates table |
| skill_name | VARCHAR(100) | NOT NULL | Skill name |
| proficiency_level | VARCHAR(50) | | Proficiency level |
| years_experience | INTEGER | | Years of experience |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### 10. Candidate_Education Table
**Purpose**: Store educational background of candidates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| candidate_id | INTEGER | FOREIGN KEY | Reference to candidates table |
| institution | VARCHAR(255) | NOT NULL | Educational institution |
| degree | VARCHAR(255) | | Degree obtained |
| field_of_study | VARCHAR(255) | | Field of study |
| graduation_year | INTEGER | | Year of graduation |
| gpa | DECIMAL(3,2) | | Grade point average |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### 11. Candidate_Experience Table
**Purpose**: Store work experience of candidates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| candidate_id | INTEGER | FOREIGN KEY | Reference to candidates table |
| company_name | VARCHAR(255) | NOT NULL | Company name |
| job_title | VARCHAR(255) | NOT NULL | Job title |
| start_date | DATE | | Start date |
| end_date | DATE | | End date |
| is_current | BOOLEAN | DEFAULT false | Current position flag |
| description | TEXT | | Job description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### 12. Notifications Table
**Purpose**: Store system notifications for users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to users table |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| type | VARCHAR(50) | | Notification type |
| is_read | BOOLEAN | DEFAULT false | Read status |
| related_entity_type | VARCHAR(50) | | Related entity type |
| related_entity_id | INTEGER | | Related entity ID |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### 13. Audit_Logs Table
**Purpose**: Store audit trail for system actions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to users table |
| action | VARCHAR(100) | NOT NULL | Action performed |
| entity_type | VARCHAR(50) | NOT NULL | Entity type affected |
| entity_id | INTEGER | | Entity ID affected |
| old_values | JSONB | | Previous values |
| new_values | JSONB | | New values |
| ip_address | INET | | IP address |
| user_agent | TEXT | | User agent string |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### 14. Settings Table
**Purpose**: Store user-specific settings and preferences

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to users table |
| setting_key | VARCHAR(100) | NOT NULL | Setting key |
| setting_value | TEXT | | Setting value |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

## Enums

### Job Status
- `active` - Job is currently accepting applications
- `inactive` - Job is temporarily paused
- `closed` - Job is no longer accepting applications
- `draft` - Job is in draft mode

### Employment Type
- `full-time` - Full-time employment
- `part-time` - Part-time employment
- `contract` - Contract work
- `internship` - Internship position
- `freelance` - Freelance work

### Experience Level
- `entry-level` - Entry level position
- `mid-level` - Mid-level position
- `senior` - Senior level position
- `lead` - Lead/management position
- `executive` - Executive level position

### Application Status
- `applied` - Application submitted
- `shortlisted` - Shortlisted for interview
- `talentpool` - Added to talent pool
- `rejected` - Application rejected
- `interviewed` - Interview completed
- `hired` - Candidate hired

### Currency
- `USD` - US Dollar
- `EUR` - Euro
- `GBP` - British Pound
- `CAD` - Canadian Dollar
- `AUD` - Australian Dollar

## Key Relationships

1. **Jobs → Users**: Many jobs can be created by one user
2. **Applications → Jobs**: Many applications can be submitted for one job
3. **Applications → Candidates**: Many applications can be submitted by one candidate
4. **Interviews → Applications**: Many interviews can be scheduled for one application
5. **Talent_Pool → Candidates**: Many talent pool entries can reference one candidate
6. **Candidate_Skills → Candidates**: Many skills can belong to one candidate
7. **Candidate_Education → Candidates**: Many education records can belong to one candidate
8. **Candidate_Experience → Candidates**: Many experience records can belong to one candidate

## Indexes

The schema includes comprehensive indexing for optimal query performance:

- Primary keys on all tables
- Foreign key indexes
- Status-based indexes for filtering
- Date-based indexes for sorting
- Email indexes for user lookup
- Score indexes for ranking queries

## Views

### Dashboard_Stats
Provides aggregated statistics for the dashboard:
- Total jobs count
- Total applications count
- Shortlisted candidates count
- Rejected applications count

### Recent_Jobs
Provides recent job listings with application counts:
- Job details
- Application counts
- Shortlisted counts
- Ordered by posted date

### Candidate_Summary
Provides candidate overview with application statistics:
- Candidate details
- Application counts by status
- Average scores
- Last application date

## Triggers

- **Update Timestamp Trigger**: Automatically updates `updated_at` column when records are modified
- Applied to all tables with `updated_at` columns

## Security Considerations

1. **Password Hashing**: All passwords are stored as hashed values
2. **Audit Logging**: All system actions are logged for compliance
3. **Foreign Key Constraints**: Maintains referential integrity
4. **Input Validation**: Database constraints prevent invalid data
5. **Access Control**: User-based access control through user_id references

## Performance Considerations

1. **Indexing Strategy**: Comprehensive indexing for common query patterns
2. **Normalization**: Proper database normalization to reduce redundancy
3. **Partitioning**: Large tables can be partitioned by date for better performance
4. **Caching**: Application-level caching for frequently accessed data
5. **Query Optimization**: Views for complex aggregations

## Scalability Features

1. **Modular Design**: Separate tables for different concerns
2. **Extensible Schema**: Easy to add new fields and tables
3. **Audit Trail**: Complete history tracking for compliance
4. **Multi-tenant Ready**: User-based data isolation
5. **API-Friendly**: JSONB fields for flexible data storage 