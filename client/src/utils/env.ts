export const getEnvVariable = (key: string): string => {
  // For client-side code, we need to access the Next.js exposed variables
  const fullKey = key.startsWith('NEXT_PUBLIC_') ? key : `NEXT_PUBLIC_${key}`;
  const value = process.env[fullKey];
  
  if (!value) {
    // More detailed logging for debugging
    console.warn(`Environment variable ${fullKey} is not defined`);
    return '';
  }
  
  return value;
};

// Ensure BACKEND_SERVER_URL is always available
export const BACKEND_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || 'https://crmx-xstq.onrender.com';

// Log the backend URL in development for debugging
if (typeof window !== 'undefined') {
  console.log("Backend URL being used:", BACKEND_SERVER_URL);
  
  // Add listener for response errors that might be related to CORS
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('API error')) {
      console.error('API connection issue detected:', event.reason);
    }
  });
}
