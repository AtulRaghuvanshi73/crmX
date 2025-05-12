/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the base path to ensure proper routing
  distDir: '.next',
  // Disable duplicated directories in output path
  outputFileTracing: true,
  // Ensure environment variables are properly loaded
  env: {
    NEXT_PUBLIC_BACKEND_SERVER_URL: process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || 'https://crmx-xstq.onrender.com',
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  },
  // Add async redirects to handle navigation more robustly
  async redirects() {
    return [
      // Handle old URL format to new format
      {
        source: '/:campaignName/:username',
        destination: '/:campaignName',
        permanent: false,
      }
    ];
  },
  // Add runtime configuration
  experimental: {
    // Enable SPA-like navigation
    appDir: true
  }
};

export default nextConfig;
