# Shortlist AI - HR Login System

## Overview

The Shortlist AI application now includes a secure HR login system that protects the dashboard functionality. Only authenticated HR users can access the admin dashboard.

## Features

### 🔐 Authentication System
- **HR Login Page**: Modern, responsive login interface at `/login`
- **Protected Dashboard**: All dashboard pages require HR authentication
- **Session Management**: Persistent login state using localStorage
- **Logout Functionality**: Secure logout with automatic redirect to login page
- **Authentication Check**: Automatic redirect for unauthenticated users

### 🎨 UI/UX Features
- **Modern Design**: Gradient backgrounds and smooth animations
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Visual feedback during authentication
- **Password Toggle**: Show/hide password functionality
- **Remember Me**: Checkbox for extended sessions
- **Responsive Design**: Works on desktop and mobile devices
- **Public Careers Link**: Easy access to public job listings

## Demo Credentials

For testing purposes, use these demo HR credentials:

- **Email**: `hr@shortlistai.com`
- **Password**: `hr123`

## How to Use

### For HR Users:
1. **Access Login**: Navigate to `/login` in your browser
2. **Enter Credentials**: Use the demo HR credentials above
3. **Dashboard Access**: After successful login, you'll be redirected to the main dashboard
4. **Logout**: Click the logout button (📤) in the header to sign out

### For Job Candidates:
1. **Public Access**: Visit `/careers` to view job listings
2. **Apply for Jobs**: Click on any job to view details and apply
3. **No Login Required**: Candidates don't need to log in to view or apply for jobs

## Technical Implementation

### Authentication Flow
1. User enters HR credentials on login page
2. Credentials are validated against demo values
3. On success, authentication state is stored in localStorage
4. User is redirected to dashboard
5. All dashboard requests check authentication status

### Protected Routes
- All routes under `/dashboard/*` require authentication
- Unauthenticated users are automatically redirected to `/login`
- Public routes (`/careers`, `/login`) are accessible without authentication

### Components
- `LoginPage`: Modern login interface with form handling
- `DashboardLayout`: Wraps dashboard content and handles authentication
- `Header`: Updated to show HR user info and logout button
- `RootPage`: Smart redirect based on authentication status

## File Structure

```
src/app/
├── login/
│   ├── page.tsx          # HR login page
│   └── layout.tsx        # Login-specific layout
├── dashboard/
│   ├── layout.tsx        # Dashboard layout with auth protection
│   ├── page.tsx          # Main dashboard page
│   ├── jobs/             # Jobs management pages
│   ├── create-job/       # Create job page
│   ├── candidates/       # Candidates management pages
│   └── settings/         # Settings page
├── careers/              # Public careers pages (no auth required)
└── page.tsx              # Root page with smart redirect
```

## Security Notes

⚠️ **Important**: This is a demo implementation using client-side authentication. In a production environment, you should:

- Implement server-side authentication with JWT tokens
- Use secure password hashing (bcrypt, Argon2)
- Implement proper session management
- Add rate limiting for login attempts
- Use HTTPS for all communications
- Implement proper CSRF protection
- Add two-factor authentication for enhanced security
- Store sensitive data in secure databases

## User Roles

### HR Manager
- **Access**: Full dashboard access
- **Permissions**: View jobs, manage candidates, create jobs, access settings
- **Login**: Required for all dashboard functionality

### Job Candidates
- **Access**: Public careers pages only
- **Permissions**: View jobs, submit applications
- **Login**: Not required

## Testing

### Manual Testing
1. Visit `/login` and verify the login form appears
2. Test with invalid credentials - should show error message
3. Test with valid HR credentials - should redirect to dashboard
4. Try accessing `/dashboard` without login - should redirect to login
5. Test logout functionality - should clear session and redirect to login
6. Verify public careers pages work without authentication

### Browser Compatibility
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Responsive**: All screen sizes from 320px to 1920px+

## Customization

### Adding New HR Users
To add new demo HR users, modify the login validation in `src/app/login/page.tsx`:

```typescript
// Add more users to the validation logic
if ((email === 'hr@shortlistai.com' && password === 'hr123') ||
    (email === 'hr2@company.com' && password === 'password123')) {
  // Authentication logic
}
```

### Styling
The login page uses Tailwind CSS classes. You can customize:
- Colors in the gradient backgrounds
- Form styling and validation states
- Button styles and hover effects
- Logo and branding elements

### Branding
Update the following elements to match your brand:
- Logo and company name
- Color scheme (blue/purple gradients)
- Typography and spacing
- Footer information 