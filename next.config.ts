import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build optimizations
  swcMinify: true,
  compress: true,
  
  // Reduce bundle size
  experimental: {
    optimizePackageImports: ['lucide-react', 'aws-amplify'],
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize for production builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Reduce build output
  output: 'standalone',
  
  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,
};

export default nextConfig;
