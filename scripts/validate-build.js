#!/usr/bin/env node

/**
 * Build validation script for AWS Amplify deployment
 * Run this script before deploying to catch common issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating build configuration...\n');

let hasErrors = false;

// Check if amplify.yml exists
if (!fs.existsSync('amplify.yml')) {
  console.error('❌ amplify.yml not found. This file is required for AWS Amplify deployment.');
  hasErrors = true;
} else {
  console.log('✅ amplify.yml found');
}

// Check package.json
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found');
  hasErrors = true;
} else {
  console.log('✅ package.json found');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check for required scripts
  if (!packageJson.scripts.build) {
    console.error('❌ build script not found in package.json');
    hasErrors = true;
  } else {
    console.log('✅ build script found');
  }
  
  // Check for required dependencies
  const requiredDeps = ['next', 'react', 'react-dom'];
  for (const dep of requiredDeps) {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      console.error(`❌ ${dep} dependency not found`);
      hasErrors = true;
    }
  }
  console.log('✅ Required dependencies found');
}

// Check for TypeScript configuration
if (!fs.existsSync('tsconfig.json')) {
  console.error('❌ tsconfig.json not found');
  hasErrors = true;
} else {
  console.log('✅ tsconfig.json found');
}

// Check for Next.js configuration
if (!fs.existsSync('next.config.ts') && !fs.existsSync('next.config.js')) {
  console.error('❌ Next.js configuration file not found');
  hasErrors = true;
} else {
  console.log('✅ Next.js configuration found');
}

// Check for source directory
if (!fs.existsSync('src')) {
  console.error('❌ src directory not found');
  hasErrors = true;
} else {
  console.log('✅ src directory found');
}

// Check for app directory (Next.js 13+ App Router)
if (!fs.existsSync('src/app')) {
  console.error('❌ src/app directory not found (required for Next.js App Router)');
  hasErrors = true;
} else {
  console.log('✅ src/app directory found');
}

// Check for layout.tsx
if (!fs.existsSync('src/app/layout.tsx')) {
  console.error('❌ src/app/layout.tsx not found (required for Next.js App Router)');
  hasErrors = true;
} else {
  console.log('✅ src/app/layout.tsx found');
}

// Check for page.tsx
if (!fs.existsSync('src/app/page.tsx')) {
  console.error('❌ src/app/page.tsx not found (required for Next.js App Router)');
  hasErrors = true;
} else {
  console.log('✅ src/app/page.tsx found');
}

console.log('\n📋 Environment Variables Check:');
console.log('Make sure these environment variables are set in AWS Amplify:');
console.log('- NEXT_PUBLIC_COGNITO_USER_POOL_ID');
console.log('- NEXT_PUBLIC_COGNITO_APP_CLIENT_ID');
console.log('- NEXT_PUBLIC_API_GATEWAY_URL');
console.log('- NEXT_PUBLIC_WEBSOCKET_URL (optional)');

console.log('\n🚀 Build Validation Complete!');

if (hasErrors) {
  console.error('\n❌ Build validation failed. Please fix the issues above before deploying.');
  process.exit(1);
} else {
  console.log('\n✅ Build validation passed! Your project is ready for deployment.');
  process.exit(0);
} 