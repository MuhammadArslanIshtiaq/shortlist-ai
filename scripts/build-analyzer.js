#!/usr/bin/env node

/**
 * Build analyzer script to identify potential build bottlenecks
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing build configuration...\n');

// Check file sizes
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Check directory size recursively
function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        totalSize += getDirectorySize(itemPath);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return totalSize;
}

// Analyze project structure
console.log('📁 Project Structure Analysis:');

const directories = [
  'src',
  'src/app',
  'src/components',
  'src/contexts',
  'src/lib',
  'public',
  'node_modules'
];

for (const dir of directories) {
  if (fs.existsSync(dir)) {
    const size = getDirectorySize(dir);
    const sizeMB = (size / (1024 * 1024)).toFixed(2);
    console.log(`  ${dir}: ${sizeMB} MB`);
  }
}

// Check for large files
console.log('\n📄 Large Files (>100KB):');

function findLargeFiles(dir, maxDepth = 3, currentDepth = 0) {
  if (currentDepth > maxDepth) return;
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isFile() && stats.size > 100 * 1024) {
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  ${itemPath}: ${sizeKB} KB`);
      } else if (stats.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        findLargeFiles(itemPath, maxDepth, currentDepth + 1);
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
}

findLargeFiles('.');

// Check package.json dependencies
console.log('\n📦 Dependency Analysis:');

if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  console.log(`  Total dependencies: ${Object.keys(allDeps).length}`);
  
  // Check for large packages
  const largePackages = [
    'aws-amplify',
    'next',
    'react',
    'react-dom',
    'typescript'
  ];
  
  for (const pkg of largePackages) {
    if (allDeps[pkg]) {
      console.log(`  ${pkg}: ${allDeps[pkg]}`);
    }
  }
}

// Check for potential build issues
console.log('\n⚠️  Potential Build Issues:');

// Check for TypeScript strict mode
if (fs.existsSync('tsconfig.json')) {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  if (tsconfig.compilerOptions?.strict) {
    console.log('  ✅ TypeScript strict mode enabled (good for quality, may slow build)');
  }
}

// Check for source maps
if (fs.existsSync('next.config.ts')) {
  const nextConfigContent = fs.readFileSync('next.config.ts', 'utf8');
  if (nextConfigContent.includes('productionBrowserSourceMaps')) {
    console.log('  ✅ Source maps configuration found');
  }
}

// Check for large node_modules
const nodeModulesSize = getDirectorySize('node_modules');
const nodeModulesSizeMB = (nodeModulesSize / (1024 * 1024)).toFixed(2);
console.log(`  📦 node_modules size: ${nodeModulesSizeMB} MB`);

if (nodeModulesSize > 500 * 1024 * 1024) { // 500MB
  console.log('  ⚠️  Large node_modules detected (>500MB) - consider using .npmrc for faster installs');
}

console.log('\n💡 Build Optimization Tips:');
console.log('  1. Use npm ci instead of npm install for faster dependency installation');
console.log('  2. Enable caching in your CI/CD pipeline');
console.log('  3. Consider using pnpm or yarn for faster package management');
console.log('  4. Disable source maps in production builds');
console.log('  5. Use Next.js build optimizations (already configured)');
console.log('  6. Consider code splitting for large components');

console.log('\n🚀 Build analysis complete!'); 