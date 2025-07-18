# Shortlist AI: A Serverless AI-Powered Recruitment Platform

Shortlist AI is a cloud-native, serverless recruitment platform designed to help HR teams automatically rank and shortlist job applicants using intelligent matching. Built on AWS Lambda and Amazon Bedrock, it combines semantic AI and a robust serverless backend to evaluate resumes against job descriptions with precision, speed, and scalability.

## 🚀 Live Demo

- **Admin Panel**: [https://main.d1kkn4bhxkcenv.amplifyapp.com/login](https://main.d1kkn4bhxkcenv.amplifyapp.com/login)
  - Email: `demo@awslamdahack.com`
  - Password: `Demo@aws123!`
  - Sample resumes are in project submission directory.
- **Careers Portal**: [https://main.d1kkn4bhxkcenv.amplifyapp.com/careers](https://main.d1kkn4bhxkcenv.amplifyapp.com/careers) 
- **Video Walkthrough**: [https://youtu.be/aGyTgncYr3k](https://youtu.be/aGyTgncYr3k)

## ✨ Key Features

### Admin Dashboard (For HR Professionals)

- **Real-Time Notifications**: Receive instant toast notifications when a new candidate applies or when an AI analysis is complete, powered by a WebSocket API
- **AI-Powered Applicant Ranking**: View a list of all applicants for a specific job, automatically sorted by their AI-generated match score
- **Detailed Candidate Analysis**: Click on any applicant to view a detailed modal showing an overall score, a breakdown by skills, experience, and education, and a qualitative summary with strengths and weaknesses generated by Amazon Bedrock
- **Secure Resume Access**: Download the original resume for any applicant via a secure, temporary link
- **Full Job Management**: Create, view, update, and delete job postings
- **Centralized Talent Pool**: View a master list of all applicants across all jobs to rediscover talent for new opportunities
- **Interactive Status Updates**: Change an applicant's status (e.g., "Reviewed", "Shortlisted", "Rejected") directly from the dashboard

### Applicant Portal (For Job Seekers)

- **Public Job Board**: A simple, clean interface for applicants to view all open positions
- **Easy Application Form**: A streamlined form to enter personal details and upload a resume (PDF, DOCX, etc.)

## 🏗️ Architecture and Tech Stack

### Frontend
- **Next.js, React, Tailwind CSS**

### Backend Logic
- **AWS Lambda (Python 3.11)**

### AI & Machine Learning
- **Amazon Bedrock**: For generative AI analysis (Anthropic Claude v2)
- **AWS Textract**: For Optical Character Recognition (OCR) to extract text from resumes

### API Layer
- **Amazon API Gateway (REST API)**: For standard CRUD operations and data fetching
- **Amazon API Gateway (WebSocket API)**: For real-time, push-based notifications

### Infrastructure
- **Database**: Amazon DynamoDB
- **Storage**: Amazon S3
- **Authentication**: Amazon Cognito
- **Messaging/Eventing**: Amazon SNS (Simple Notification Service)
- **Deployment**: AWS Amplify (Frontend), AWS Serverless (Backend)

## 🔧 Backend Setup Overview

The entire backend was built manually in the AWS Management Console to ensure a deep understanding of each service's configuration. All resources were deployed in the `us-west-2` region.

### IAM (Identity and Access Management)

- A central IAM Role (`ShortlistAILambdaRole`) was created for all Lambda functions to use
- A comprehensive IAM Policy (`ShortlistAILambdaPolicy`) was attached to this role, granting granular, least-privilege permissions for all required actions across DynamoDB, S3, Bedrock, Textract, SNS, and API Gateway
- A separate `TextractServiceRole` was created with a specific trust policy allowing the Textract service to assume it and publish notifications to SNS on our behalf

### DynamoDB

- Four NoSQL tables were created to manage the application's state: `Jobs`, `Applicants`, `WebSocketConnections`, and `TextractJobs`
- A Global Secondary Index (GSI) was added to the Applicants table to allow for efficient querying of all candidates for a specific job

### Amazon S3

- Two private S3 buckets were created: one for storing job description files and another for securely storing applicant resumes
- The resumes bucket was configured with a Cross-Origin Resource Sharing (CORS) policy to allow direct, secure file uploads from the frontend application

### Amazon Cognito

- A Cognito User Pool was set up to manage secure authentication for the HR admin dashboard
- It was configured to use email as the username and a public app client suitable for a web-based frontend

### API Gateway

- A REST API was built to handle all standard data requests from the frontend, with routes like `/jobs`, `/applicants`, and `/status` integrated with their corresponding Lambda functions
- A separate WebSocket API was created to manage real-time, persistent connections for the notification system, with routes like `$connect`, `$disconnect`, and `ping` linked to their own handler Lambdas

### SNS (Simple Notification Service)

- An SNS topic named `TextractCompletionTopic` was created to act as a messaging bus, decoupling the text extraction process from the AI analysis process
- Its access policy was configured to allow the Textract service to publish messages to it

### AWS Lambda Functions:

- A suite of single-purpose functions were created to handle all backend logic. Each is triggered by a specific event source (API Gateway, S3, or SNS).

- REST API Handlers: createJob, listJobs, getJobDetails, updateJob, deleteJob, submitApplication, listAllApplicants, getResumeDownloadUrl, updateApplicantStatus.

- Asynchronous Workflow: processResume (triggered by S3) and processAnalysis (triggered by SNS).

- WebSocket Handlers: handleSocketConnect, handleSocketDisconnect, and handlePing.

## 🧠 The Core Role of AWS Lambda

AWS Lambda is the central nervous system of the Shortlist AI application. It is the core service that powers every piece of business logic, data processing, and real-time communication. Our application leverages Lambda in multiple, distinct ways, each triggered by a different event source.

### The Asynchronous AI Analysis Workflow: A Journey of a Resume

The most critical process in our application is the AI analysis pipeline. This workflow is a perfect example of an event-driven architecture orchestrated by AWS Lambda.

#### Trigger 1: S3 Object Creation
When a candidate uploads their resume, it triggers our first Lambda function, `processResume`.

#### Lambda 1: processResume (The Orchestrator)
This function starts a complex, asynchronous process by initiating an AWS Textract job and creating a mapping record in DynamoDB.

#### Trigger 2: SNS Topic Notification
After Textract finishes, it publishes a message to an Amazon SNS topic, which in turn triggers our second Lambda, `processAnalysis`.

#### Lambda 2: processAnalysis (The Analyst)
This function is the AI brain. It gets the extracted text, constructs a detailed prompt, calls Amazon Bedrock for analysis, and updates the applicant's record in DynamoDB with the AI-generated score and feedback.

### The API Backbone: REST and WebSocket APIs

#### REST API Lambdas (via API Gateway)
A suite of single-purpose Lambda functions (`createJob`, `getJobDetails`, etc.) are triggered by API Gateway to handle all standard data operations for the dashboard.

#### WebSocket API Lambdas (via API Gateway)
- `handleSocketConnect` & `handleSocketDisconnect`: Manage the lifecycle of real-time connections
- Other Lambdas, like `submitApplication` and `processAnalysis`, push notifications through this WebSocket API to all connected clients

In summary, AWS Lambda is the fundamental compute service that enables the event-driven, scalable, and cost-effective architecture of Shortlist AI.

## 🚀 Getting Started (Local Setup)

### Prerequisites

- Node.js (v18 or later)
- An AWS Account
- AWS CLI configured locally
- All backend resources deployed as per the project guides

### Frontend Setup

1. Clone the repository
2. Navigate to the `shortlist-ai` directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env.local` file and fill in your AWS resource details:
   ```env
   NEXT_PUBLIC_COGNITO_USER_POOL_ID=...
   NEXT_PUBLIC_COGNITO_APP_CLIENT_ID=...
   NEXT_PUBLIC_API_GATEWAY_URL=... (Your REST API Invoke URL)
   NEXT_PUBLIC_WEBSOCKET_URL=... (Your WebSocket wss:// URL)
   NEXT_PUBLIC_AWS_REGION=us-west-2
   ```
5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🔮 Future Improvements

- **Enhanced AI Features**: Integrate Bedrock further to generate interview questions based on a candidate's resume and the job description
- **CI/CD for Backend**: Implement a CI/CD pipeline using AWS SAM or Serverless Framework to automate the deployment of Lambda functions
- **Improved Security**: Place backend resources within a VPC for enhanced network security
- **Robust Error Handling**: Implement Dead-Letter Queues (DLQs) for the asynchronous Lambdas to automatically handle and retry failed processing jobs
