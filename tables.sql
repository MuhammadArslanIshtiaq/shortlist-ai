-- Shortlist AI - Database Tables Structure
-- HR Dashboard with AI-Powered Auto-Ranking & Shortlisting

-- =====================================================
-- ENUMS
-- =====================================================

-- Job Status Enum
CREATE TYPE job_status AS ENUM ('active', 'inactive', 'closed', 'draft');

-- Employment Type Enum
CREATE TYPE employment_type AS ENUM ('full-time', 'part-time', 'contract', 'internship', 'freelance');

-- Experience Level Enum
CREATE TYPE experience_level AS ENUM ('entry-level', 'mid-level', 'senior', 'lead', 'executive');

-- Application Status Enum
CREATE TYPE application_status AS ENUM ('applied', 'shortlisted', 'talentpool', 'rejected', 'interviewed', 'hired');

-- Currency Enum
CREATE TYPE currency AS ENUM ('USD', 'EUR', 'GBP', 'CAD', 'AUD');

-- =====================================================
-- USERS TABLE
-- =====================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'hr_manager',
    company_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- JOBS TABLE
-- =====================================================

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency currency DEFAULT 'USD',
    employment_type employment_type DEFAULT 'full-time',
    experience_level experience_level DEFAULT 'mid-level',
    job_description TEXT NOT NULL,
    requirements TEXT,
    benefits TEXT,
    application_deadline DATE,
    posted_date DATE DEFAULT CURRENT_DATE,
    is_remote BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    status job_status DEFAULT 'active',
    applications_count INTEGER DEFAULT 0,
    shortlisted_ai_count INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CANDIDATES TABLE
-- =====================================================

CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    resume_url VARCHAR(500),
    cover_letter TEXT,
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    github_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- APPLICATIONS TABLE
-- =====================================================

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    status application_status DEFAULT 'applied',
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shortlist_ai_rank INTEGER,
    overall_score DECIMAL(5,2),
    skills_score DECIMAL(5,2),
    experience_score DECIMAL(5,2),
    education_score DECIMAL(5,2),
    other_score DECIMAL(5,2),
    ai_analysis_notes TEXT,
    hr_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, candidate_id)
);

-- =====================================================
-- APPLICATION_SCORES TABLE (Detailed scoring breakdown)
-- =====================================================

CREATE TABLE application_scores (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'skills', 'experience', 'education', 'other'
    score DECIMAL(5,2) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TALENT_POOL TABLE
-- =====================================================

CREATE TABLE talent_pool (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    added_by INTEGER REFERENCES users(id),
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    tags TEXT[], -- Array of tags for categorization
    is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- INTERVIEWS TABLE
-- =====================================================

CREATE TABLE interviews (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    scheduled_date TIMESTAMP,
    duration_minutes INTEGER DEFAULT 60,
    interview_type VARCHAR(50), -- 'phone', 'video', 'onsite'
    interviewer_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no-show'
    notes TEXT,
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- JOB_CONTACT_INFO TABLE
-- =====================================================

CREATE TABLE job_contact_info (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_website VARCHAR(500),
    contact_person VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CANDIDATE_SKILLS TABLE
-- =====================================================

CREATE TABLE candidate_skills (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced', 'expert'
    years_experience INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CANDIDATE_EDUCATION TABLE
-- =====================================================

CREATE TABLE candidate_education (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255),
    field_of_study VARCHAR(255),
    graduation_year INTEGER,
    gpa DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CANDIDATE_EXPERIENCE TABLE
-- =====================================================

CREATE TABLE candidate_experience (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- 'application', 'interview', 'system', 'reminder'
    is_read BOOLEAN DEFAULT false,
    related_entity_type VARCHAR(50), -- 'job', 'application', 'candidate'
    related_entity_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AUDIT_LOGS TABLE
-- =====================================================

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SETTINGS TABLE
-- =====================================================

CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, setting_key)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Jobs indexes
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_posted_date ON jobs(posted_date);
CREATE INDEX idx_jobs_created_by ON jobs(created_by);

-- Applications indexes
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_date ON applications(applied_date);
CREATE INDEX idx_applications_score ON applications(overall_score);

-- Candidates indexes
CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_location ON candidates(location);

-- Interviews indexes
CREATE INDEX idx_interviews_application_id ON interviews(application_id);
CREATE INDEX idx_interviews_scheduled_date ON interviews(scheduled_date);
CREATE INDEX idx_interviews_status ON interviews(status);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS
-- =====================================================

-- Dashboard statistics view
CREATE VIEW dashboard_stats AS
SELECT 
    COUNT(DISTINCT j.id) as total_jobs,
    COUNT(DISTINCT a.id) as total_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'shortlisted' THEN a.id END) as shortlisted_candidates,
    COUNT(DISTINCT CASE WHEN a.status = 'rejected' THEN a.id END) as rejected_applications
FROM jobs j
LEFT JOIN applications a ON j.id = a.job_id;

-- Recent jobs view
CREATE VIEW recent_jobs AS
SELECT 
    j.id,
    j.title,
    j.company,
    j.location,
    j.salary_min,
    j.salary_max,
    j.salary_currency,
    j.posted_date,
    j.status,
    COUNT(a.id) as applications_count,
    COUNT(CASE WHEN a.status = 'shortlisted' THEN a.id END) as shortlisted_count
FROM jobs j
LEFT JOIN applications a ON j.id = a.job_id
GROUP BY j.id, j.title, j.company, j.location, j.salary_min, j.salary_max, j.salary_currency, j.posted_date, j.status
ORDER BY j.posted_date DESC;

-- Candidate summary view
CREATE VIEW candidate_summary AS
SELECT 
    c.id,
    c.name,
    c.email,
    c.location,
    COUNT(a.id) as total_applications,
    COUNT(CASE WHEN a.status = 'shortlisted' THEN a.id END) as shortlisted_count,
    COUNT(CASE WHEN a.status = 'rejected' THEN a.id END) as rejected_count,
    AVG(a.overall_score) as average_score,
    MAX(a.applied_date) as last_application_date
FROM candidates c
LEFT JOIN applications a ON c.id = a.candidate_id
GROUP BY c.id, c.name, c.email, c.location;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample user
INSERT INTO users (email, password_hash, first_name, last_name, company_name) 
VALUES ('admin@shortlistai.com', '$2b$10$example_hash', 'Admin', 'User', 'Shortlist AI');

-- Insert sample job
INSERT INTO jobs (title, company, location, salary_min, salary_max, job_description, requirements, benefits, created_by) 
VALUES (
    'Senior Frontend Developer',
    'TechCorp Inc.',
    'San Francisco, CA',
    120000,
    150000,
    'We are looking for a Senior Frontend Developer to join our dynamic team...',
    'Required Skills: 5+ years of experience in frontend development...',
    'Benefits & Perks: Competitive salary and equity package...',
    1
);

-- Insert sample candidate
INSERT INTO candidates (name, email, location, resume_url) 
VALUES (
    'Sarah Johnson',
    'sarah.johnson@email.com',
    'San Francisco, CA',
    'https://example.com/resume1.pdf'
);

-- Insert sample application
INSERT INTO applications (job_id, candidate_id, status, shortlist_ai_rank, overall_score, skills_score, experience_score, education_score, other_score) 
VALUES (
    1,
    1,
    'shortlisted',
    1,
    92.0,
    95.0,
    88.0,
    90.0,
    85.0
);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE users IS 'System users (HR managers, recruiters)';
COMMENT ON TABLE jobs IS 'Job postings created by users';
COMMENT ON TABLE candidates IS 'Job applicants/candidates';
COMMENT ON TABLE applications IS 'Job applications with AI scoring';
COMMENT ON TABLE application_scores IS 'Detailed scoring breakdown for applications';
COMMENT ON TABLE talent_pool IS 'Candidates added to talent pool for future opportunities';
COMMENT ON TABLE interviews IS 'Interview scheduling and feedback';
COMMENT ON TABLE job_contact_info IS 'Contact information for job postings';
COMMENT ON TABLE candidate_skills IS 'Skills possessed by candidates';
COMMENT ON TABLE candidate_education IS 'Educational background of candidates';
COMMENT ON TABLE candidate_experience IS 'Work experience of candidates';
COMMENT ON TABLE notifications IS 'System notifications for users';
COMMENT ON TABLE audit_logs IS 'Audit trail for system actions';
COMMENT ON TABLE settings IS 'User-specific settings and preferences'; 