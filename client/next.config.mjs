/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the base path to ensure proper routing
  distDir: '.next',
  // Disable duplicated directories in output path
  outputFileTracing: true,
  // Ensure environment variables are properly loaded
  env: {
    NEXT_PUBLIC_BACKEND_SERVER_URL: process.env.NEXT_PUBLIC_BACKEND_SERVER_URL,
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    
  }
};

export default nextConfig;
